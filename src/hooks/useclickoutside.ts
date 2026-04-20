import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

/** Close when clicking outside one or more refs */
export const useClickOutside = (
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  onClose: () => void
) => {
  const callbackRef = useRef(onClose)
  callbackRef.current = onClose

  useEffect(() => {
    const refList = Array.isArray(refs) ? refs : [refs]
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (refList.some(r => r.current?.contains(target))) return
      callbackRef.current()
    }
    // capture:true fires before any DOM handler can call stopPropagation
    document.addEventListener('mousedown', onDown, true)
    return () => document.removeEventListener('mousedown', onDown, true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
