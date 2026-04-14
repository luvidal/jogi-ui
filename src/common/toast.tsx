import { useState, useEffect } from 'react'
import Icon from './icon'
import { useToast } from '../hooks'

type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps {
  toast: ToastData
  onClose: (id: string) => void
}

const Toast = ({ toast, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(toast.id)
    }, 300)
  }

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return { bg: 'bg-status-ok/10', iconBg: 'bg-status-ok/20', text: 'text-status-ok', icon: 'CircleCheck' }
      case 'error':
        return { bg: 'bg-status-pending/10', iconBg: 'bg-status-pending/20', text: 'text-status-pending', icon: 'CircleX' }
      case 'warning':
        return { bg: 'bg-status-warn/10', iconBg: 'bg-status-warn/20', text: 'text-status-warn', icon: 'TriangleAlert' }
      default:
        return { bg: 'bg-status-info/10', iconBg: 'bg-status-info/20', text: 'text-status-info', icon: 'Info' }
    }
  }

  const styles = getToastStyles()

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${styles.bg} rounded-xl shade-md
        p-4 min-w-[300px] max-w-[400px] relative overflow-hidden
      `}
    >
      <div className='flex items-start gap-3'>
        <div className={`shrink-0 flex items-center justify-center rounded-xl w-8 h-8 ${styles.iconBg}`}>
          <Icon name={styles.icon} size={18} className={styles.text} />
        </div>

        <div className='flex-1 min-w-0'>
          {toast.title && (
            <div className={`font-medium text-sm mb-0.5 uppercase ${styles.text}`}>
              {toast.title}
            </div>
          )}
          <div className='text-sm text-gray-600'>
            {toast.message}
          </div>

          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={`mt-2 text-xs font-medium underline hover:no-underline ${styles.text}`}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleClose}
          className='flex-shrink-0 p-1 rounded-xl hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600'
        >
          <Icon name='X' size={16} />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100'>
          <div
            className={`h-full ${styles.iconBg}`}
            style={{
              animation: `toast-shrink ${toast.duration}ms linear forwards`,
              animationDelay: '10ms'
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Toast

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className='fixed bottom-4 right-4 z-[10000] flex flex-col-reverse space-y-reverse space-y-2'>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}