import { useId } from 'react'
import Icon from '../common/icon'
import type { FileUploadItem } from './useuploadflow'

export interface UploadCardsLabels {
  queued?: string
  compressing?: string
  uploading?: string
  analyzing?: string
  done?: string
  /** Receives request label or undefined */
  linkingLabel?: (requestLabel?: string, role?: string) => string
  /** Receives types + count */
  detectedLabel?: (types: string[], count: number) => string
  /** Receives items + summary */
  headerLabel?: (items: FileUploadItem[], summary: { total: number; done: number; errors: number }) => string
}

interface UploadCardsProps {
  items: FileUploadItem[]
  summary: { total: number; done: number; errors: number }
  requestLabel?: string
  role?: 'client' | 'analyst'
  labels?: UploadCardsLabels
}

const DEFAULT_STATUS_LABELS = {
  queued: 'Queued',
  compressing: 'Compressing...',
  uploading: 'Uploading...',
  analyzing: 'Analyzing...',
  done: 'Done',
}

const statusConfig: Record<string, { icon: string; color: string; spin?: boolean }> = {
  queued:      { icon: 'Clock',      color: 'text-gray-400' },
  compressing: { icon: 'FileDown',   color: 'text-theme-500',   spin: true },
  uploading:   { icon: 'Upload',     color: 'text-theme-500',   spin: true },
  analyzing:   { icon: 'Sparkles',   color: 'text-theme-500',   spin: true },
  detected:    { icon: 'Sparkles',   color: 'text-theme-600' },
  linking:     { icon: 'Link',       color: 'text-theme-500' },
  done:        { icon: 'Check',      color: 'text-status-ok' },
  error:       { icon: 'X',          color: 'text-status-pending' },
}

const fileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'FileText'
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'].includes(ext || '')) return 'Image'
  return 'File'
}

const truncate = (s: string, max = 32) =>
  s.length > max ? s.slice(0, max - 3) + '...' : s

function defaultLinkingLabel(requestLabel?: string, role?: string) {
  if (requestLabel) {
    const short = requestLabel.length > 20 ? requestLabel.slice(0, 18) + '...' : requestLabel
    return `Linking to ${short}`
  }
  if (role === 'analyst') return 'Linking to request'
  if (role === 'client') return 'Linking to your requests'
  return 'Saving to library'
}

function defaultDetectedLabel(types: string[], count: number) {
  if (types.length === 0) return count > 1 ? `${count} documents found` : 'Document found'
  if (types.length === 1) return `${types[0]}`
  return types.slice(0, 2).join(', ') + (types.length > 2 ? ` +${types.length - 2}` : '')
}

function defaultHeaderLabel(items: FileUploadItem[], summary: { total: number; done: number; errors: number }) {
  const allDone = items.length > 0 && items.every(it => it.status === 'done' || it.status === 'error')
  if (allDone) {
    const totalDetected = items.reduce((sum, it) => sum + (it.detectedCount || 0), 0)
    if (totalDetected > 0) {
      return `${totalDetected} document${totalDetected !== 1 ? 's' : ''} uploaded`
    }
    return summary.errors === summary.total ? 'Upload error' : 'Done'
  }
  if (items.length === 1) return items[0]?.filename || 'Uploading...'
  const stillUploading = items.some(it => ['queued', 'compressing', 'uploading', 'analyzing'].includes(it.status))
  if (!stillUploading) {
    const detected = items.reduce((sum, it) => sum + (it.detectedCount || 0), 0)
    return `${detected} document${detected !== 1 ? 's' : ''} found`
  }
  return 'Uploading files...'
}

function StatusLabel({ item, requestLabel, role, labels }: { item: FileUploadItem; requestLabel?: string; role?: string; labels: Required<Pick<UploadCardsLabels, 'queued' | 'compressing' | 'uploading' | 'analyzing' | 'done'>> & UploadCardsLabels }) {
  const getLinkingLabel = labels.linkingLabel ?? defaultLinkingLabel
  const getDetectedLabel = labels.detectedLabel ?? defaultDetectedLabel

  if (item.status === 'error') return <span className='text-xs text-status-pending'>{item.error || 'Error'}</span>
  if (item.status === 'detected') return <span className='text-xs text-theme-600 font-medium'>{getDetectedLabel(item.detectedTypes, item.detectedCount)}</span>
  if (item.status === 'linking') return <span className='text-xs text-theme-500'>{getLinkingLabel(requestLabel, role)}</span>
  // For non-expanded done items with detected types, show what was found instead of generic "Done"
  if (item.status === 'done' && item.detectedTypes.length > 0) return <span className='text-xs text-status-ok'>{getDetectedLabel(item.detectedTypes, item.detectedCount)}</span>
  const statusLabel = labels[item.status as keyof typeof DEFAULT_STATUS_LABELS] ?? ''
  return <span className='text-xs text-gray-500'>{statusLabel}</span>
}

function ProgressBar({ item }: { item: FileUploadItem }) {
  const isActive = ['compressing', 'uploading', 'analyzing'].includes(item.status)
  const isDone = item.status === 'done'
  const isError = item.status === 'error'

  const barColor = isError
    ? 'bg-status-pending'
    : isDone
    ? 'bg-status-ok'
    : 'bg-theme-400'

  const trackColor = isError ? 'bg-status-pending/20' : isDone ? 'bg-status-ok/20' : 'bg-theme-100'

  return (
    <div className={`h-1 rounded-full overflow-hidden ${trackColor}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${barColor} ${isActive ? 'upload-progress-shimmer' : ''}`}
        style={{ width: `${item.progress}%` }}
      />
    </div>
  )
}

function StatusIcon({ item }: { item: FileUploadItem }) {
  const id = useId().replace(/:/g, '')
  const cfg = statusConfig[item.status]

  if (cfg.spin) {
    return (
      <>
        <style>{`
          @keyframes upload-spin-${id} { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .upload-spin-${id} { animation: upload-spin-${id} 2s linear infinite; }
        `}</style>
        <div className={`upload-spin-${id} ${cfg.color}`}>
          <Icon name={cfg.icon} size={16} />
        </div>
      </>
    )
  }

  if (item.status === 'done') {
    return (
      <div className={`animate-upload-check ${cfg.color}`}>
        <Icon name={cfg.icon} size={16} />
      </div>
    )
  }

  return (
    <div className={cfg.color}>
      <Icon name={cfg.icon} size={16} />
    </div>
  )
}

function DetectedPills({ types }: { types: string[] }) {
  if (types.length === 0) return null
  return (
    <div className='flex flex-wrap gap-1 mt-1'>
      {types.slice(0, 4).map((label, i) => (
        <span
          key={`${i}-${label}`}
          className='px-1.5 py-0.5 text-[10px] rounded-full bg-theme-100 text-theme-600 font-medium animate-fade-in-up'
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {label}
        </span>
      ))}
      {types.length > 4 && (
        <span className='px-1.5 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-500 font-medium animate-fade-in-up'
          style={{ animationDelay: `${4 * 100}ms` }}
        >
          +{types.length - 4}
        </span>
      )}
    </div>
  )
}

function UploadCard({ item, index, requestLabel, role, labels }: { item: FileUploadItem; index: number; requestLabel?: string; role?: string; labels: Required<Pick<UploadCardsLabels, 'queued' | 'compressing' | 'uploading' | 'analyzing' | 'done'>> & UploadCardsLabels }) {
  const isDone = item.status === 'done'

  return (
    <div
      className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-opacity duration-700 animate-upload-slide-in ${isDone ? 'opacity-50' : 'opacity-100'}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* File type icon */}
      <div className={`flex-shrink-0 mt-0.5 ${isDone ? 'text-status-ok' : 'text-theme-400'}`}>
        <Icon name={isDone ? 'Check' : (item.isExpanded ? 'FileText' : fileIcon(item.filename))} size={18} />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between gap-2'>
          <span className={`text-sm font-medium truncate ${isDone ? 'text-gray-400' : 'text-gray-700'}`}>
            {item.isExpanded ? item.filename : truncate(item.filename)}
          </span>
          <StatusIcon item={item} />
        </div>
        {!item.isExpanded && <StatusLabel item={item} requestLabel={requestLabel} role={role} labels={labels} />}
        {!item.isExpanded && (
          <div className='mt-1.5'>
            <ProgressBar item={item} />
          </div>
        )}
        {item.status === 'detected' && <DetectedPills types={item.detectedTypes} />}
      </div>
    </div>
  )
}

export default function UploadCards({ items, summary, requestLabel, role, labels: userLabels }: UploadCardsProps) {
  const labels = { ...DEFAULT_STATUS_LABELS, ...userLabels }
  const getHeaderLabel = labels.headerLabel ?? defaultHeaderLabel

  const allDone = items.length > 0 && items.every(it => it.status === 'done' || it.status === 'error')
  const overallProgress = items.length > 0
    ? Math.round(items.reduce((sum, it) => sum + it.progress, 0) / items.length)
    : 0
  const isSingle = items.length === 1

  return (
    <div className='absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='flex items-center justify-between mb-3 px-1'>
          <div className='flex items-center gap-2'>
            <div className={`text-theme-500 ${!allDone ? 'animate-pulse' : ''}`}>
              <Icon name={allDone ? 'CircleCheck' : 'Upload'} size={18} />
            </div>
            <span className='text-sm font-medium text-gray-600 truncate'>
              {getHeaderLabel(items, summary)}
            </span>
          </div>
          {!isSingle && (
            <span className='text-xs text-gray-400 tabular-nums'>
              {overallProgress}%
            </span>
          )}
        </div>

        {/* Overall progress — only when multiple files */}
        {!isSingle && (
          <div className='h-1 rounded-full bg-theme-100 mb-3 overflow-hidden'>
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${allDone ? 'bg-status-ok' : 'bg-theme-400'}`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        )}

        {/* File cards */}
        <div className='bg-white/80 rounded-2xl shade-md border border-gray-100 divide-y divide-gray-100 max-h-[60vh] overflow-y-auto'>
          {items.map((item, i) => (
            <UploadCard
              key={item.id}
              item={item}
              index={i}
              requestLabel={requestLabel}
              role={role}
              labels={labels}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
