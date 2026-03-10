import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './icon'

export interface ConfirmOptions {
  title?: string
  message: string
  variant?: 'danger' | 'warning' | 'info'
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void
}

const variantConfig = {
  danger: {
    icon: 'Trash2',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    confirmBg: 'bg-rose-600 hover:bg-rose-700',
  },
  warning: {
    icon: 'TriangleAlert',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    confirmBg: 'bg-amber-600 hover:bg-amber-700',
  },
  info: {
    icon: 'Info',
    iconBg: 'bg-theme-50',
    iconColor: 'text-theme-600',
    confirmBg: 'bg-theme-700 hover:bg-theme-600',
  },
}

const ConfirmDialog = ({ state, onDone }: { state: ConfirmState, onDone: () => void }) => {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const close = useCallback((result: boolean) => {
    setLeaving(true)
    setTimeout(() => {
      state.resolve(result)
      onDone()
    }, 200)
  }, [state, onDone])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false)
      if (e.key === 'Enter') close(true)

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button')
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  useEffect(() => {
    if (visible && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [visible])

  const v = state.variant || 'danger'
  const cfg = variantConfig[v]

  return createPortal(
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-200 ${visible && !leaving ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'}`}
      onClick={() => close(false)}
      role='dialog'
      aria-modal='true'
      aria-labelledby='confirm-title'
      aria-describedby='confirm-message'
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`
          relative w-[360px] max-w-[90vw] overflow-hidden rounded-xl
          bg-white border border-gray-200
          shadow-2xl outline-none
          transition-all duration-200
          ${visible && !leaving ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
        `}
        onClick={e => e.stopPropagation()}
      >
        <div className='flex flex-col items-center text-center px-6 pt-7 pb-5'>
          <div className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 ${visible && !leaving ? 'scale-100' : 'scale-75'}`}>
            <Icon name={cfg.icon} size={24} className={cfg.iconColor} />
          </div>
          <h3 id='confirm-title' className='text-[15px] font-semibold text-gray-900 mb-1'>{state.title || '¿Estás seguro?'}</h3>
          <p id='confirm-message' className='text-sm text-gray-500 leading-relaxed whitespace-pre-line'>{state.message}</p>
        </div>

        <div className='flex gap-2.5 px-5 pb-5'>
          <button
            onClick={() => close(true)}
            className={`flex-1 h-10 rounded-btn text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] outline-none ${cfg.confirmBg}`}
          >
            Confirmar
          </button>
          <button
            onClick={() => close(false)}
            className='flex-1 h-10 rounded-btn text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200 active:scale-[0.98] outline-none'
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ConfirmDialog
export type { ConfirmState }
