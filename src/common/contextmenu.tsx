import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from './icon'
import { useClickOutside } from '../hooks/useclickoutside'

type MenuItem = {
  icon?: string
  label?: string
  action?: () => void
  type?: 'separator'
  disabled?: boolean
  variant?: 'default' | 'amber' | 'red'
}

type Props = {
  open: boolean
  position: { x: number, y: number }
  items: MenuItem[]
  onClose: () => void
}

const ContextMenu = ({ open, position, items, onClose }: Props) => {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [adjustedPos, setAdjustedPos] = useState<{ x: number, y: number } | null>(null)

  // Reset adjusted position when menu closes or position changes
  useEffect(() => {
    if (!open) {
      setAdjustedPos(null)
    }
  }, [open])

  // Calculate adjusted position after render
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return

    const r = menuRef.current.getBoundingClientRect()
    const pad = 8

    let x = position.x
    let y = position.y

    if (x + r.width > window.innerWidth - pad) x = Math.max(pad, window.innerWidth - r.width - pad)
    if (y + r.height > window.innerHeight - pad) y = Math.max(pad, window.innerHeight - r.height - pad)

    setAdjustedPos({ x, y })
  }, [open, position.x, position.y])

  useClickOutside(menuRef, () => { if (open) onClose() })

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const onScroll = () => onClose()

    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)

    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  // Use adjusted position if available, otherwise use original (but hidden)
  const displayPos = adjustedPos || position
  const isVisible = adjustedPos !== null

  return createPortal(
    <div
      ref={menuRef}
      className='fixed z-50 w-52 rounded-xl overflow-hidden shadow-2xl bg-gray-50 border border-gray-200'
      style={{
        left: displayPos.x,
        top: displayPos.y,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      <div className='flex flex-col gap-px p-1'>
        {items.map((item, i) => (
          item.type === 'separator' ? (
            <div key={i} className='h-px bg-gray-200 my-1 mx-2' />
          ) : (
            <button
              key={i}
              type='button'
              disabled={item.disabled}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left ${
                item.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : item.variant === 'red'
                    ? 'text-status-pending hover:bg-status-pending/10'
                    : item.variant === 'amber'
                      ? 'text-status-warn hover:bg-status-warn/10'
                      : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={e => {
                e.stopPropagation()
                if (item.disabled) return
                onClose()
                item.action?.()
              }}
            >
              {item.icon && <Icon name={item.icon} size={16} className={
                item.disabled ? '' : item.variant === 'red' ? 'text-status-pending' : item.variant === 'amber' ? 'text-status-warn' : 'text-gray-700'
              } />}
              <span className='text-sm'>{item.label}</span>
            </button>
          )
        ))}
      </div>
    </div>,
    document.body
  )
}

export default ContextMenu
