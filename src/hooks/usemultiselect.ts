'use client'

import { useCallback, useEffect, useState } from 'react'

interface UseMultiSelectOptions {
  /** Array of all visible item IDs */
  itemIds: string[]
  /** Called with array of checked IDs when user confirms bulk delete */
  onBulkDelete: (ids: string[]) => void | Promise<void>
  /** Called with array of checked IDs when user clicks bulk mark-as-read (optional, notifications only) */
  onBulkRead?: (ids: string[]) => void | Promise<void>
}

export interface MultiSelectState {
  /** Whether multi-select mode is active */
  selectMode: boolean
  /** Set of currently checked IDs — pass to CardList as checkedIds when selectMode is true */
  checkedIds: Set<string>
  /** Whether all visible items are currently checked */
  allChecked: boolean
  /** Whether the Seleccionar button should be visible (items exist) */
  showButton: boolean
  /** Whether bulk read action is available (onBulkRead was provided) */
  hasBulkRead: boolean
  /** Callback for CardList onCheck */
  handleCheck: (id: string, checked: boolean) => void
  /** Toggle select mode on/off */
  toggleSelectMode: () => void
  /** Toggle "select all" / "deselect all" over visible items */
  handleSelectAll: () => void
  /** Fire bulk delete with currently checked IDs */
  handleBulkDelete: () => void
  /** Fire bulk read with currently checked IDs (no-op when onBulkRead not provided) */
  handleBulkRead: () => void
}

export function useMultiSelect({ itemIds, onBulkDelete, onBulkRead }: UseMultiSelectOptions): MultiSelectState {
  const [selectMode, setSelectMode] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

  const showButton = itemIds.length > 0

  const toggleSelectMode = useCallback(() => {
    setSelectMode(prev => {
      if (prev) setCheckedIds(new Set())
      return !prev
    })
  }, [])

  const handleCheck = useCallback((id: string, checked: boolean) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    const allChecked = itemIds.every(id => checkedIds.has(id))
    setCheckedIds(allChecked ? new Set() : new Set(itemIds))
  }, [itemIds, checkedIds])

  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(checkedIds)
    if (!ids.length) return
    onBulkDelete(ids)
  }, [checkedIds, onBulkDelete])

  const handleBulkRead = useCallback(() => {
    if (!onBulkRead) return
    const ids = Array.from(checkedIds)
    if (!ids.length) return
    onBulkRead(ids)
  }, [checkedIds, onBulkRead])

  // Auto-exit select mode when all checked items have been removed from the list
  useEffect(() => {
    if (!selectMode || checkedIds.size === 0) return
    const remaining = Array.from(checkedIds).some(id => itemIds.includes(id))
    if (!remaining) {
      setCheckedIds(new Set())
      setSelectMode(false)
    }
  }, [selectMode, checkedIds, itemIds])

  const allChecked = itemIds.length > 0 && itemIds.every(id => checkedIds.has(id))

  return {
    selectMode,
    checkedIds,
    allChecked,
    showButton,
    hasBulkRead: !!onBulkRead,
    handleCheck,
    toggleSelectMode,
    handleSelectAll,
    handleBulkDelete,
    handleBulkRead,
  }
}
