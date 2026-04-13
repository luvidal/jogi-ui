import { useState, useCallback, useRef } from 'react'
import { captureDataTransfer, resolveFiles } from '../common/folderutils'
import type { CapturedTransfer } from '../common/folderutils'

export type FileStatus = 'queued' | 'compressing' | 'uploading' | 'analyzing' | 'detected' | 'linking' | 'done' | 'error'

export interface FileUploadItem {
  id: string
  file: File
  filename: string
  status: FileStatus
  progress: number
  detectedTypes: string[]
  detectedCount: number
  error?: string
  /** true for items created from multi-doc PDF expansion */
  isExpanded?: boolean
}

export interface UploadFlowLabels {
  /** Fallback label for expanded multi-doc cards (receives 1-based index) */
  documentN?: (index: number) => string
  unclassifiedType?: string
  unclassifiedTitle?: string
  /** Receives short filename */
  unclassifiedMessage?: (name: string) => string
  unknownError?: string
  /** Receives short filename */
  uploadErrorMessage?: (name: string) => string
  /** Receives detected count */
  documentsUploaded?: (count: number) => string
  partialUploadTitle?: string
  completeUploadTitle?: string
  /** Receives error count */
  filesWithError?: (count: number) => string
  successSuffix?: string
}

export interface UploadToast {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

export interface UploadFlowOptions {
  /** Upload function — receives file + params, returns response object */
  uploadFn: (file: File, params: Record<string, string>) => Promise<any>
  /** Toast callback for notifications */
  onToast?: (toast: UploadToast) => void
  /** Request ID to attach uploads to */
  requestId?: string
  requestLabel?: string
  role?: 'client' | 'analyst'
  /** Called after all uploads settle and display delay */
  onComplete?: () => void
  /** Concurrency limit (default: 3) */
  concurrency?: number
  /** UI labels — defaults to English */
  labels?: UploadFlowLabels
}

export interface UploadSummary {
  total: number
  done: number
  errors: number
}

const DEFAULT_LABELS: Required<UploadFlowLabels> = {
  documentN: (i) => `Document ${i}`,
  unclassifiedType: 'Unclassified',
  unclassifiedTitle: 'Unclassified document',
  unclassifiedMessage: (name) => `${name}: saved as additional document.`,
  unknownError: 'Unknown error',
  uploadErrorMessage: (name) => `Error uploading ${name}`,
  documentsUploaded: (count) => count === 1 ? '1 document uploaded' : `${count} documents uploaded`,
  partialUploadTitle: 'Partial upload',
  completeUploadTitle: 'Upload complete',
  filesWithError: (count) => `${count} file(s) with errors.`,
  successSuffix: 'successfully',
}

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

const shortName = (name: string, max = 30) =>
  name.length > max ? name.slice(0, max - 3) + '...' : name

function safeJsonParse<T>(str: string): T | null {
  try { return JSON.parse(str) } catch { return null }
}

export function useUploadFlow(options: UploadFlowOptions) {
  const { uploadFn, onToast, concurrency = 3 } = options
  const labels = { ...DEFAULT_LABELS, ...options.labels }

  const [active, setActive] = useState(false)
  const [items, setItems] = useState<FileUploadItem[]>([])

  const optionsRef = useRef(options)
  optionsRef.current = options

  const labelsRef = useRef(labels)
  labelsRef.current = labels

  const updateItem = useCallback((id: string, patch: Partial<FileUploadItem>) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it))
  }, [])

  const compressIfImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) return file
    const { default: imageCompression } = await import('browser-image-compression')
    const c = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true })
    return new File([c], file.name, { type: c.type })
  }

  const processSingleFile = useCallback(async (item: FileUploadItem, uploadOpts?: { docTypeId?: string; requestId?: string }): Promise<{ done: boolean; detectedCount: number }> => {
    const name = shortName(item.file.name)
    const l = labelsRef.current
    let progressTimer: ReturnType<typeof setInterval> | null = null

    try {
      // Phase 1: compress
      updateItem(item.id, { status: 'compressing', progress: 5 })
      const compressed = await compressIfImage(item.file)

      // Phase 2: uploading → analyzing (start slow-fill timer)
      updateItem(item.id, { status: 'uploading', progress: 15 })

      let currentProgress = 15
      progressTimer = setInterval(() => {
        currentProgress += (80 - currentProgress) * 0.08
        updateItem(item.id, { status: 'analyzing', progress: Math.min(Math.round(currentProgress), 78) })
      }, 300)

      // Transition to analyzing label immediately
      await wait(200)
      updateItem(item.id, { status: 'analyzing' })

      const params: Record<string, string> = {}
      if (uploadOpts?.requestId) params.requestId = uploadOpts.requestId
      else if (optionsRef.current.requestId) params.requestId = optionsRef.current.requestId
      if (uploadOpts?.docTypeId) params.docTypeId = uploadOpts.docTypeId

      // Retry with backoff on 429 (rate limit)
      let res: any
      const maxRetries = 4
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          res = await uploadFn(compressed, params)
          break
        } catch (retryErr: any) {
          const is429 = retryErr?.status === 429 || /429|rate.?limit|too many/i.test(retryErr?.message || '')
          if (is429 && attempt < maxRetries) {
            await wait(2000 * (attempt + 1))
            continue
          }
          throw retryErr
        }
      }

      if (progressTimer) clearInterval(progressTimer)
      progressTimer = null

      // Phase 3: handle response

      // No clasificado — stored as unclassified document
      if (res?.noclasificado) {
        updateItem(item.id, { status: 'done', progress: 100, detectedTypes: [l.unclassifiedType], detectedCount: 1 })
        onToast?.({ type: 'info', title: l.unclassifiedTitle, message: l.unclassifiedMessage(name) })
        return { done: true, detectedCount: 1 }
      }

      const docs = res?.detectedDocuments || []
      const docLabels = docs.map((d: any) => d.label).filter(Boolean)
      const count = docs.length || res?.count || 1

      if (count > 1) {
        // Show detected phase briefly on original card
        updateItem(item.id, {
          status: 'detected',
          progress: 85,
          detectedTypes: docLabels,
          detectedCount: count,
        })
        await wait(900)

        // Expand: replace single card with individual document cards
        const docItems: FileUploadItem[] = docs.map((d: any, i: number) => ({
          id: `${item.id}-doc-${i}`,
          file: item.file,
          filename: d.label || l.documentN(i + 1),
          status: 'linking' as const,
          progress: 90,
          detectedTypes: [],
          detectedCount: 1,
          isExpanded: true,
        }))

        setItems(prev => {
          const idx = prev.findIndex(it => it.id === item.id)
          if (idx === -1) return [...prev, ...docItems]
          return [...prev.slice(0, idx), ...docItems, ...prev.slice(idx + 1)]
        })

        // Stagger each expanded card to done
        for (let i = 0; i < docItems.length; i++) {
          await wait(150)
          updateItem(docItems[i].id, { status: 'done', progress: 100 })
        }
        return { done: true, detectedCount: docItems.length }
      }

      // Single doc — no expansion
      updateItem(item.id, {
        status: 'detected',
        progress: 85,
        detectedTypes: docLabels,
        detectedCount: count,
      })
      await wait(800)

      // Phase 4: linking
      updateItem(item.id, { status: 'linking', progress: 95 })
      await wait(400)

      // Phase 5: done
      updateItem(item.id, { status: 'done', progress: 100 })
      return { done: true, detectedCount: 1 }

    } catch (err: any) {
      let msg = err?.message || l.unknownError
      const parsed = safeJsonParse<any>(msg)
      if (parsed?.msg) msg = parsed.msg
      updateItem(item.id, {
        status: 'error',
        error: msg,
      })
      onToast?.({ type: 'error', title: 'Error', message: l.uploadErrorMessage(name) })
      return { done: false, detectedCount: 0 }
    } finally {
      if (progressTimer) clearInterval(progressTimer)
    }
  }, [updateItem, uploadFn, onToast])

  const processFiles = useCallback(async (fileList: FileList | File[], uploadOpts?: { docTypeId?: string; requestId?: string }) => {
    if (!fileList.length) return
    // Guard against double-upload
    if (active) return

    const files = Array.from(fileList)
    const newItems: FileUploadItem[] = files.map(f => ({
      id: crypto.randomUUID(),
      file: f,
      filename: f.name,
      status: 'queued' as const,
      progress: 0,
      detectedTypes: [],
      detectedCount: 0,
    }))

    setItems(newItems)
    setActive(true)

    // Concurrent processing with slot filling
    let nextIndex = 0
    let processing = 0
    const itemsCopy = [...newItems]
    let totalDone = 0
    let totalErrors = 0
    let totalDetected = 0

    await new Promise<void>(resolveAll => {
      const tryNext = () => {
        while (processing < concurrency && nextIndex < itemsCopy.length) {
          const item = itemsCopy[nextIndex++]
          processing++
          processSingleFile(item, uploadOpts)
            .then(outcome => {
              if (outcome.done) { totalDone++; totalDetected += outcome.detectedCount }
              else totalErrors++
            })
            .finally(() => {
              processing--
              if (nextIndex >= itemsCopy.length && processing === 0) {
                resolveAll()
              } else {
                tryNext()
              }
            })
        }
        // Edge case: empty list
        if (itemsCopy.length === 0) resolveAll()
      }
      tryNext()
    })

    // Summary toast for multi-file uploads
    const l = labelsRef.current
    if (newItems.length > 1 && totalDone > 0) {
      const docWord = l.documentsUploaded(totalDetected)
      onToast?.({
        type: totalErrors > 0 ? 'warning' : 'success',
        title: totalErrors > 0 ? l.partialUploadTitle : l.completeUploadTitle,
        message: totalErrors > 0
          ? `${docWord}. ${l.filesWithError(totalErrors)}`
          : `${docWord} ${l.successSuffix}`,
      })
    }

    // Wait for user to see the final states
    await wait(2000)

    setActive(false)
    setItems([])
    optionsRef.current.onComplete?.()
  }, [active, processSingleFile, onToast, concurrency])

  const summary: UploadSummary = {
    total: items.length,
    done: items.filter(it => it.status === 'done').length,
    errors: items.filter(it => it.status === 'error').length,
  }

  /**
   * Process a drop event's DataTransfer — handles folders recursively.
   * Call captureDataTransfer() synchronously in the event handler,
   * then pass the result here for async resolution + upload.
   */
  const processDataTransfer = useCallback(async (captured: CapturedTransfer, uploadOpts?: { docTypeId?: string; requestId?: string }) => {
    const files = await resolveFiles(captured)
    if (files.length) await processFiles(files, uploadOpts)
  }, [processFiles])

  return { active, items, summary, processFiles, processDataTransfer }
}
