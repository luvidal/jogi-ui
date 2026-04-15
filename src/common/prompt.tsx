import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './icon'
import { variantConfig } from './dialogvariants'
import { useDialogAnim } from '../hooks/usedialoganim'
import { useTabTrap } from '../hooks/usetabtrap'

export interface PromptOptions {
  title?: string
  message: string
  icon?: string
  variant?: 'danger' | 'warning' | 'info'
  defaultValue?: string
}

export interface PromptState extends PromptOptions {
  resolve: (value: string | null) => void
}

const PromptDialog = ({ state, onDone }: { state: PromptState, onDone: () => void }) => {
  const [value, setValue] = useState(state.defaultValue ?? '')
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { visible, leaving, close } = useDialogAnim<string | null>(state.resolve, onDone)

  useTabTrap(dialogRef, () => close(null))

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [visible])

  const v = state.variant || 'info'
  const cfg = variantConfig[v]
  const defaultIcon = v === 'info' ? 'Pencil' : cfg.icon

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) close(value.trim())
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-200 ${visible && !leaving ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'}`}
      onClick={() => close(null)}
      role='dialog'
      aria-modal='true'
      aria-labelledby='prompt-title'
      aria-describedby='prompt-message'
    >
      <div
        ref={dialogRef}
        className={`
          relative w-[400px] max-w-[90vw] overflow-hidden rounded-xl
          bg-surface-1 border border-edge-subtle/20
          shadow-2xl
          transition-all duration-200
          ${visible && !leaving ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
        `}
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col items-center text-center px-6 pt-7 pb-4'>
            <div className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 ${visible && !leaving ? 'scale-100' : 'scale-75'}`}>
              <Icon name={state.icon || defaultIcon} size={24} className={cfg.iconColor} />
            </div>
            <h3 id='prompt-title' className='text-[15px] font-semibold text-ink-primary mb-1'>{state.title || 'Ingresa un valor'}</h3>
            <p id='prompt-message' className='text-sm text-ink-tertiary leading-relaxed whitespace-pre-line'>{state.message}</p>
          </div>

          <div className='px-5 pb-4'>
            <input
              ref={inputRef}
              type='text'
              value={value}
              onChange={e => setValue(e.target.value)}
              className='w-full h-10 px-3 rounded-lg border border-edge-subtle/30 text-sm text-ink-primary bg-surface-0 placeholder:text-ink-tertiary/25 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/30 transition-all'
            />
          </div>

          <div className='flex gap-2.5 px-5 pb-5'>
            <button
              type='submit'
              disabled={!value.trim()}
              className={`flex-1 h-10 rounded-btn text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] outline-none disabled:opacity-40 disabled:cursor-not-allowed ${cfg.confirmBg}`}
            >
              Aceptar
            </button>
            <button
              type='button'
              onClick={() => close(null)}
              className='flex-1 h-10 rounded-btn text-sm font-semibold text-ink-secondary bg-surface-2 hover:bg-surface-3 transition-all duration-200 active:scale-[0.98] outline-none'
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default PromptDialog
