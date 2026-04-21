'use client'

import Icon from './icon'
import ButtonGroup from '../header/buttongroup'
import ToolbarButton from '../header/toolbarbutton'
import type { MultiSelectState } from '../hooks/usemultiselect'

interface MultiselectToolbarProps {
  state: MultiSelectState
  /** 'secondary' = desktop sidebar controls bar · 'mobile' = mobile header toolbar */
  variant: 'secondary' | 'mobile'
}

/**
 * Renders the multi-select toolbar UI.
 * Pair with `useMultiSelect` to get state + handlers.
 */
export function MultiselectToolbar({ state, variant }: MultiselectToolbarProps) {
  const {
    selectMode,
    checkedIds,
    allChecked,
    showButton,
    hasBulkRead,
    toggleSelectMode,
    handleSelectAll,
    handleBulkDelete,
    handleBulkRead,
  } = state

  if (variant === 'mobile') {
    if (selectMode) {
      return (
        <ButtonGroup>
          {hasBulkRead && <ToolbarButton icon='MailCheck' label='Leído' onClick={handleBulkRead} disabled={checkedIds.size === 0} />}
          <ToolbarButton icon='Trash2' label={`Eliminar (${checkedIds.size})`} onClick={handleBulkDelete} disabled={checkedIds.size === 0} />
          <ToolbarButton icon='X' label='Cancelar' onClick={toggleSelectMode} />
        </ButtonGroup>
      )
    }
    if (showButton) {
      return (
        <ButtonGroup>
          <ToolbarButton icon='SquareCheck' label='Seleccionar' onClick={toggleSelectMode} />
        </ButtonGroup>
      )
    }
    return null
  }

  // variant === 'secondary'
  if (selectMode) {
    return (
      <div className='flex items-center gap-3'>
        <span
          onClick={toggleSelectMode}
          className='flex items-center gap-1.5 text-[11px] text-white/80 uppercase tracking-wider cursor-pointer hover:text-white transition-colors'
        >
          <Icon name='X' size={12} />
          {checkedIds.size > 0 ? `${checkedIds.size} sel.` : 'Cancelar'}
        </span>
        <span
          onClick={handleSelectAll}
          className='flex items-center text-white/50 cursor-pointer hover:text-white/80 transition-colors'
          title={allChecked ? 'Deseleccionar todo' : 'Seleccionar todo'}
        >
          <Icon name={allChecked ? 'SquareCheckBig' : 'Square'} size={14} />
        </span>
        {hasBulkRead && (
          <span
            onClick={checkedIds.size > 0 ? handleBulkRead : undefined}
            className={`flex items-center transition-colors ${checkedIds.size > 0 ? 'text-blue-400 cursor-pointer hover:text-blue-300' : 'text-white/20 cursor-not-allowed'}`}
            title='Marcar como leído'
          >
            <Icon name='MailCheck' size={14} />
          </span>
        )}
        <span
          onClick={checkedIds.size > 0 ? handleBulkDelete : undefined}
          className={`flex items-center transition-colors ${checkedIds.size > 0 ? 'text-red-400 cursor-pointer hover:text-red-300' : 'text-white/20 cursor-not-allowed'}`}
          title='Eliminar seleccionados'
        >
          <Icon name='Trash2' size={14} />
        </span>
      </div>
    )
  }
  if (showButton) {
    return (
      <span
        onClick={toggleSelectMode}
        className='flex items-center gap-1.5 text-[11px] text-white/50 uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors'
      >
        <Icon name='SquareCheck' size={12} />
        Seleccionar
      </span>
    )
  }
  return null
}

export default MultiselectToolbar
