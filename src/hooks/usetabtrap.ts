import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Traps Tab focus within a dialog and closes on Escape.
 * @param selector - CSS selector for focusable elements (default: 'input, button')
 */
export const useTabTrap = (
  dialogRef: RefObject<HTMLElement | null>,
  onEscape: () => void,
  selector = 'input, button'
) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape()

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(selector)
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
  }, [dialogRef, onEscape, selector])
}
