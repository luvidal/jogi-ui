import { ReactNode } from 'react'
import Icon from './icon'
import EditableTitle from '../header/editabletitle'
import EmailLink from '../header/emaillink'
import ToolBack from '../header/toolback'

interface DetailBarProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
  /** Static label shown before the subtitle (e.g. "Cliente:", "Analista:") */
  subtitlePrefix?: string
  email?: string
  icon?: string
  toolbar?: ReactNode
  /** Extra content rendered inline after the subtitle (e.g. credit badge) */
  extra?: ReactNode
  /** 'light' = detail header with own bg-surface-1 + icon chip + decorative bg icon.
   *  'dark'  = chrome header for AppShell list panels (no own bg, parent supplies).
   *  With onBack (mobile drill-in), dark variant switches to a flat bg-surface-2 with two-row layout. */
  variant?: 'light' | 'dark'
  /** When provided, title becomes editable inline */
  onRename?: (value: string) => void
  /** When provided, subtitle becomes a clickable email link */
  onEmail?: () => void
  /** When provided, renders a ToolBack button and switches dark variant to the two-row mobile layout */
  onBack?: () => void
}

export default function DetailBar({ title, subtitle, email, icon, toolbar, extra, subtitlePrefix, variant = 'light', onRename, onEmail, onBack }: DetailBarProps) {
  const isDark = variant === 'dark'

  /** Render title — editable when onRename is provided and title is a string */
  const renderTitle = (className: string) => {
    if (typeof title === 'string' && onRename) {
      return <EditableTitle value={title} onChange={onRename} className={className} />
    }
    if (typeof title === 'string') {
      return <span className={`${className} truncate`}>{title}</span>
    }
    return title
  }

  /** Render subtitle — clickable email link when onEmail is provided */
  const renderSubtitle = (className: string) => {
    if (!subtitle) return null
    if (typeof subtitle === 'string' && onEmail) {
      return <EmailLink label={subtitle} email={email} onClick={onEmail} className={className} />
    }
    if (typeof subtitle === 'string') {
      return <span className={`${className} truncate`}>{subtitle}</span>
    }
    return subtitle
  }

  if (isDark) {
    if (onBack) {
      // Mobile drill-in: flat surface-2, two-row layout (back + icon + title on top, toolbar below)
      return (
        <div className='group/header bg-surface-2 border-b border-edge-subtle/20'>
          <div className='flex items-center gap-4 px-4 pt-3 pb-1'>
            {icon && <ToolBack icon={icon} onClick={onBack} variant='dark' />}
            <div className='flex-1 min-w-0 flex flex-col items-start'>
              {renderTitle('text-base font-medium text-ink-primary')}
              <div className='flex items-center gap-1.5 min-w-0 mt-0.5'>
                {subtitlePrefix && <span className='text-sm text-ink-tertiary flex-shrink-0 hidden xl:inline'>{subtitlePrefix}</span>}
                {renderSubtitle('text-sm text-ink-secondary')}
                {extra && subtitle && <span className='text-ink-tertiary'>·</span>}
                {extra}
              </div>
            </div>
          </div>
          {toolbar && <div className='flex justify-end px-4 pb-2'>{toolbar}</div>}
        </div>
      )
    }
    // AppShell list/sidebar header: chrome mode — no own bg, parent supplies.
    return (
      <div className='flex items-center gap-4 px-4 py-3'>
        {icon && <Icon name={icon} size={22} className='text-ink-secondary' />}
        <div className='flex-1 min-w-0 flex flex-col items-start'>
          {renderTitle('text-token-h3 font-semibold text-ink-primary')}
          <div className='flex items-center gap-1.5 min-w-0 mt-0.5'>
            {subtitlePrefix && <span className='text-sm text-ink-tertiary hidden xl:inline'>{subtitlePrefix}</span>}
            {renderSubtitle('text-sm text-ink-secondary')}
            {extra && subtitle && <span className='text-ink-tertiary'>·</span>}
            {extra}
          </div>
        </div>
        {toolbar && <div className='flex-shrink-0'>{toolbar}</div>}
      </div>
    )
  }

  // 'light' variant — detail panel header with own dark-surface bg, icon chip, and decorative bg icon.
  return (
    <div className='relative border-b border-edge-subtle/15 bg-surface-1'>
      {/* Decorative background icon — brand-tinted, subtle */}
      {icon && (
        <div className='absolute -right-3 -bottom-6 opacity-[0.04] pointer-events-none'>
          <Icon name={icon} size={120} className='text-brand' />
        </div>
      )}
      <div className='relative z-10 flex items-center justify-between px-6 py-4 gap-4'>
        <div className='flex items-center gap-3 min-w-0'>
          {icon && (
            <div className='w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0'>
              <Icon name={icon} size={18} className='text-brand' />
            </div>
          )}
          <div className='group flex flex-col min-w-0'>
            {renderTitle('text-base font-semibold text-ink-primary')}
            <div className='flex items-center gap-1.5 min-w-0'>
              {subtitlePrefix && <span className='text-xs text-ink-tertiary hidden xl:inline'>{subtitlePrefix}</span>}
              {renderSubtitle('text-xs text-ink-secondary')}
              {extra && subtitle && <span className='text-ink-tertiary'>·</span>}
              {extra}
            </div>
          </div>
        </div>
        {toolbar && <div className='flex-shrink-0'>{toolbar}</div>}
      </div>
    </div>
  )
}
