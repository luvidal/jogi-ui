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
  variant?: 'light' | 'dark'
  /** When provided, title becomes editable inline */
  onRename?: (value: string) => void
  /** When provided, subtitle becomes a clickable email link */
  onEmail?: () => void
  /** When provided, renders a ToolBack button and wraps dark variant in gradient background */
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
    const content = (
      <div className='flex items-center gap-4 px-4 py-3'>
        {onBack && icon && <ToolBack icon={icon} onClick={onBack} variant='dark' />}
        {!onBack && icon && <Icon name={icon} size={22} className='text-white/80' />}
        <div className='flex-1 min-w-0 flex flex-col items-start'>
          {renderTitle(onBack ? 'text-base font-medium text-white text-shadow-sm' : 'text-lg font-bold uppercase tracking-wide text-white text-shadow-md')}
          <div className='flex items-center gap-1.5 min-w-0 mt-0.5'>
            {subtitlePrefix && <span className='text-sm text-white/50'>{subtitlePrefix}</span>}
            {renderSubtitle(onBack ? 'text-sm text-white/70' : 'text-sm text-white/70')}
            {extra && subtitle && <span className='text-white/30'>·</span>}
            {extra}
          </div>
        </div>
        {toolbar && <div className='flex-shrink-0'>{toolbar}</div>}
      </div>
    )
    if (onBack) {
      return <div className='group/header bg-gradient-to-r from-theme-700 to-theme-600'>{content}</div>
    }
    return content
  }

  return (
    <div className='relative border-b border-theme-100 bg-theme-50'>
      {/* Decorative background icon */}
      {icon && (
        <div className='absolute -right-3 -bottom-6 opacity-[0.05] pointer-events-none'>
          <Icon name={icon} size={120} className='text-theme-600' />
        </div>
      )}
      <div className='relative z-10 flex items-center justify-between px-6 py-4'>
        <div className='flex items-center gap-3 min-w-0'>
          {icon && (
            <div className='w-9 h-9 rounded-xl bg-theme-100 flex items-center justify-center flex-shrink-0'>
              <Icon name={icon} size={18} className='text-theme-600' />
            </div>
          )}
          <div className='group flex flex-col min-w-0'>
            {renderTitle('text-base font-semibold text-theme-700')}
            <div className='flex items-center gap-1.5 min-w-0'>
              {subtitlePrefix && <span className='text-xs text-theme-400'>{subtitlePrefix}</span>}
              {renderSubtitle('text-xs text-theme-600')}
              {extra && subtitle && <span className='text-theme-300'>·</span>}
              {extra}
            </div>
          </div>
        </div>
        {toolbar && <div className='flex-shrink-0'>{toolbar}</div>}
      </div>
    </div>
  )
}
