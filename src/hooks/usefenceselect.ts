/**
 * useFenceSelect — generic drag-rectangle ("marching ants") selection.
 *
 * Caller provides:
 * - a ref map of item elements (keyed by item id)
 * - a current-selection callback (we call it with the new Set)
 *
 * On mouseDown (typically via returned `beginFence`), we start tracking.
 * As the mouse moves, we recompute which elements intersect the fence
 * rectangle and push that set back through `setSelected`.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

export interface FenceRect {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Build a FenceRect from the drag start point and the current mouse position.
 */
function buildFenceRect(start: { x: number; y: number }, clientX: number, clientY: number): FenceRect {
  return {
    left: Math.min(start.x, clientX),
    top: Math.min(start.y, clientY),
    width: Math.abs(clientX - start.x),
    height: Math.abs(clientY - start.y),
  }
}

/**
 * Returns true when `fence` overlaps `item` enough to count as a hit.
 * Hit = overlap area >= 30 % of item area **or** the item's center falls inside the fence.
 */
function hitTest(fence: FenceRect, item: DOMRect): boolean {
  const overlapsX = fence.left < item.right && fence.left + fence.width > item.left
  const overlapsY = fence.top < item.bottom && fence.top + fence.height > item.top
  if (!overlapsX || !overlapsY) return false

  const overlapLeft = Math.max(fence.left, item.left)
  const overlapRight = Math.min(fence.left + fence.width, item.right)
  const overlapTop = Math.max(fence.top, item.top)
  const overlapBottom = Math.min(fence.top + fence.height, item.bottom)
  const overlapArea = (overlapRight - overlapLeft) * (overlapBottom - overlapTop)
  const itemArea = item.width * item.height

  const itemCenterX = item.left + item.width / 2
  const itemCenterY = item.top + item.height / 2
  const centerInFence =
    itemCenterX >= fence.left && itemCenterX <= fence.left + fence.width &&
    itemCenterY >= fence.top && itemCenterY <= fence.top + fence.height

  return (overlapArea / itemArea) >= 0.3 || centerInFence
}

export interface UseFenceSelectOptions<T> {
  /** Ref map of item id → element. Caller populates via `onEl` on each tile. */
  elements: React.MutableRefObject<Record<string, HTMLElement | null>>
  /** Current list of items (used to iterate ids on mousemove). */
  items: T[]
  /** Extract an id from an item. */
  getId: (item: T) => string
  /** Currently selected ids — read-only snapshot for ctrl/meta additive drags. */
  selectedIds: Set<string>
  /** Push a new selection set (called on every mousemove during fence). */
  setSelected: (next: Set<string>) => void
}

export interface UseFenceSelectResult {
  fencing: boolean
  fenceRect: FenceRect | null
  /** True for ~100ms after the fence ended if it actually moved (>5px). Lets
   *  callers suppress the background click that would otherwise clear selection. */
  justFencedRef: React.MutableRefObject<boolean>
  /** Call from onMouseDown on the background. Handles modifier keys + initial rect. */
  beginFence: (e: React.MouseEvent) => void
}

export function useFenceSelect<T>({ elements, items, getId, selectedIds, setSelected }: UseFenceSelectOptions<T>): UseFenceSelectResult {
  const [fencing, setFencing] = useState(false)
  const [fenceRect, setFenceRect] = useState<FenceRect | null>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const baseRef = useRef<Set<string>>(new Set())
  const justFencedRef = useRef(false)
  const itemsRef = useRef(items)
  itemsRef.current = items

  const beginFence = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      startRef.current = { x: e.clientX, y: e.clientY }
      baseRef.current = e.metaKey || e.ctrlKey ? new Set(selectedIds) : new Set()
      setFencing(true)
      setFenceRect({ left: e.clientX, top: e.clientY, width: 0, height: 0 })
      if (!(e.metaKey || e.ctrlKey)) setSelected(new Set())
    },
    [selectedIds, setSelected],
  )

  useEffect(() => {
    if (!fencing) return

    const onMove = (e: MouseEvent) => {
      const start = startRef.current
      if (!start) return
      const nextRect = buildFenceRect(start, e.clientX, e.clientY)
      setFenceRect(nextRect)

      const next = new Set(baseRef.current)
      for (const item of itemsRef.current) {
        const id = getId(item)
        const el = elements.current[id]
        if (!el) continue
        if (hitTest(nextRect, el.getBoundingClientRect())) next.add(id)
      }
      setSelected(next)
    }

    const onUp = (e: MouseEvent) => {
      const start = startRef.current
      if (start) {
        const dx = Math.abs(e.clientX - start.x)
        const dy = Math.abs(e.clientY - start.y)
        if (dx > 5 || dy > 5) {
          justFencedRef.current = true
          setTimeout(() => { justFencedRef.current = false }, 100)
        }
      }
      setFencing(false)
      setFenceRect(null)
      startRef.current = null
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [fencing, elements, getId, setSelected])

  return { fencing, fenceRect, justFencedRef, beginFence }
}
