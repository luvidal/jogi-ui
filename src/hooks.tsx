import { useState, useContext, useCallback, useMemo, createContext } from 'react'
import type React from 'react'

// ── Device hooks (canonical source: hooks/device.ts) ──
export { useIsMobile, useIsDesktop } from './hooks/device'

// ── Toast ──

import type { ToastData } from './common/toast'
export type { ToastData }

interface ToastContextType {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  showSuccess: (message: string, options?: Partial<ToastData>) => string
  showError: (message: string, options?: Partial<ToastData>) => string
  showWarning: (message: string, options?: Partial<ToastData>) => string
  showInfo: (message: string, options?: Partial<ToastData>) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts(prev => [...prev, { id, duration: 5000, ...toast }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearToasts = useCallback(() => setToasts([]), [])

  const showSuccess = useCallback((message: string, options?: Partial<ToastData>) =>
    addToast({ type: 'success', message, ...options }), [addToast])
  const showError = useCallback((message: string, options?: Partial<ToastData>) =>
    addToast({ type: 'error', message, duration: 7000, ...options }), [addToast])
  const showWarning = useCallback((message: string, options?: Partial<ToastData>) =>
    addToast({ type: 'warning', message, ...options }), [addToast])
  const showInfo = useCallback((message: string, options?: Partial<ToastData>) =>
    addToast({ type: 'info', message, ...options }), [addToast])

  const value = useMemo(() => ({
    toasts, addToast, removeToast, clearToasts, showSuccess, showError, showWarning, showInfo
  }), [toasts, addToast, removeToast, clearToasts, showSuccess, showError, showWarning, showInfo])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
