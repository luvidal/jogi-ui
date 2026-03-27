import { useState, useEffect, useCallback } from 'react'

/**
 * Manages visible/leaving state for animated dialogs.
 * Calls `onResolve` after the exit animation delay.
 */
export const useDialogAnim = <T>(onResolve: (value: T) => void, onDone: () => void) => {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const close = useCallback((result: T) => {
    setLeaving(true)
    setTimeout(() => {
      onResolve(result)
      onDone()
    }, 200)
  }, [onResolve, onDone])

  return { visible, leaving, close }
}
