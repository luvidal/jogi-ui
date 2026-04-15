import { ReactNode } from 'react'
import Icon from '../common/icon'

interface PanelProps {
  open: boolean
  onToggle: (open: boolean) => void
  width?: number
  /** Lucide icon name, or ReactNode for custom icon content */
  icon?: string | ReactNode
  title?: string
  subtitle?: string
  children: ReactNode
}

/**
 * Panel - Collapsible sidebar panel
 *
 * Owns the chrome: bg, border, 3-dot toggle handle, width/opacity animation,
 * icon container, title, and subtitle. Content is passed as children.
 */
const Panel = ({ open, onToggle, width = 280, icon, title, subtitle, children }: PanelProps) => {
  return (
    <div
      className='relative h-full bg-surface-1 border-l border-edge-subtle/15 flex flex-shrink-0'
      style={{
        width: open ? width : 20,
        transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Toggle handle */}
      <button
        type='button'
        data-sidebar-toggle
        onClick={e => {
          e.stopPropagation()
          onToggle(!open)
        }}
        className='group w-5 h-full flex-shrink-0 flex items-center justify-center cursor-pointer hover:bg-surface-2/40 transition-colors'
        title={open ? 'Ocultar panel' : 'Mostrar panel'}
      >
        <div className='flex flex-col gap-1 opacity-40 group-hover:opacity-70 transition-opacity'>
          <div className='w-1 h-1 rounded-full bg-ink-tertiary' />
          <div className='w-1 h-1 rounded-full bg-ink-tertiary' />
          <div className='w-1 h-1 rounded-full bg-ink-tertiary' />
        </div>
      </button>

      {/* Content */}
      <div
        className='h-full flex flex-col overflow-hidden'
        style={{
          width: width - 20,
          minWidth: width - 20,
          opacity: open ? 1 : 0,
          transition: 'opacity 400ms ease-in-out',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div className='p-4 h-full overflow-y-auto'>
          {/* Icon */}
          {icon && (
            <div className='flex justify-center mb-4'>
              <div className='w-24 h-24 rounded-xl bg-surface-2/60 border border-edge-subtle/10 flex items-center justify-center overflow-hidden'>
                {typeof icon === 'string' ? (
                  <Icon name={icon} size={48} className='text-brand' />
                ) : (
                  icon
                )}
              </div>
            </div>
          )}

          {/* Title */}
          {title && (
            <h3 className='text-sm font-semibold text-ink-primary text-center mb-1 break-words'>
              {title}
            </h3>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className='text-xs text-ink-tertiary text-center mb-4 break-words'>
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}

export default Panel
