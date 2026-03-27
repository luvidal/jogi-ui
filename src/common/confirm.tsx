import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './icon'
import { variantConfig } from './dialogvariants'
import { useDialogAnim } from '../hooks/usedialoganim'
import { useTabTrap } from '../hooks/usetabtrap'

export interface ConfirmOptions {
  title?: string
  message: string
  variant?: 'danger' | 'warning' | 'info'
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void
}

const ConfirmDialog = ({ state, onDone }: { state: ConfirmState, onDone: () => void }) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { visible, leaving, close } = useDialogAnim<boolean>(state.resolve, onDone)

  useTabTrap(dialogRef, () => close(false), 'button')

  useEffect(() => {
    const onEnter = (e: KeyboardEvent) => { if (e.key === 'Enter') close(true) }
    window.addEventListener('keydown', onEnter)
    return () => window.removeEventListener('keydown', onEnter)
  }, [close])

  useEffect(() => {
    if (visible && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [visible])

  const cfg = variantConfig[state.variant || 'danger']

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
