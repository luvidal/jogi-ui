const IGNORED = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini'])

function isHiddenOrIgnored(name: string): boolean {
  return name.startsWith('.') || name.startsWith('__MACOSX') || IGNORED.has(name)
}

function readEntries(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => reader.readEntries(resolve, reject))
}

function fileFromEntry(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => entry.file(resolve, reject))
}

async function collectFiles(entry: FileSystemEntry): Promise<File[]> {
  if (isHiddenOrIgnored(entry.name)) return []

  if (entry.isFile) {
    const file = await fileFromEntry(entry as FileSystemFileEntry)
    return [file]
  }

  if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader()
    const files: File[] = []
    // readEntries returns batches of up to 100 — must loop until empty
    let batch: FileSystemEntry[]
    do {
      batch = await readEntries(reader)
      for (const child of batch) {
        const childFiles = await collectFiles(child)
        files.push(...childFiles)
      }
    } while (batch.length > 0)
    return files
  }

  return []
}

/** Captured state from a DataTransfer — safe to use after the event handler returns */
export type CapturedTransfer = { entries: FileSystemEntry[] } | { files: File[] }

/**
 * Synchronously capture entries/files from a DataTransfer.
 * MUST be called synchronously within the drop event handler,
 * because browsers clear DataTransfer after the handler returns.
 */
export function captureDataTransfer(dt: DataTransfer): CapturedTransfer {
  if (dt.items && dt.items.length > 0) {
    const entries: FileSystemEntry[] = []
    for (let i = 0; i < dt.items.length; i++) {
      const entry = dt.items[i].webkitGetAsEntry?.()
      if (entry) entries.push(entry)
    }
    if (entries.length > 0) return { entries }
  }
  return { files: Array.from(dt.files) }
}

/**
 * Resolve a captured transfer into a flat list of files.
 * Recursively reads folders. Safe to call asynchronously.
 */
export async function resolveFiles(captured: CapturedTransfer): Promise<File[]> {
  if ('files' in captured) return captured.files

  const allFiles: File[] = []
  for (const entry of captured.entries) {
    const files = await collectFiles(entry)
    allFiles.push(...files)
  }
  return allFiles
}
