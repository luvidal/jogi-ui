import { useEffect } from 'react'
import type { RefObject } from 'react'

/** Close when clicking outside one or more refs */
export const useClickOutside = (
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  onClose: () => void
) => {
  useEffect(() => {
    const refList = Array.isArray(refs) ? refs : [refs]
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (refList.some(r => r.current?.contains(target))) return
      onClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [refs, onClose])
}
