import React, { useState } from 'react'
import Icon from '../common/icon'

type CollapsiblePanelProps = {
  title: string
  icon: string
  iconColor?: string
  defaultOpen?: boolean
  maxHeight?: number
  children: React.ReactNode
}

const CollapsiblePanel = ({
  title,
  icon,
  iconColor = 'text-ink-tertiary',
  defaultOpen = true,
  maxHeight,
  children,
}: CollapsiblePanelProps) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-surface-2/40 border border-edge-subtle/10 rounded-xl overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-surface-2/60 hover:bg-surface-2 transition-colors cursor-pointer"
      >
        <h4 className="text-xs font-semibold text-ink-secondary flex items-center gap-1.5">
          <Icon name={icon} size={12} className={iconColor} />
          {title}
        </h4>
        <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-ink-tertiary" />
      </button>
      {open && (
        <div className="p-3 overflow-y-auto" style={maxHeight ? { maxHeight } : undefined}>
          {children}
        </div>
      )}
    </div>
  )
}

type DataRowProps = {
  label: string
  value: React.ReactNode
}

const DataRow = ({ label, value }: DataRowProps) => {
  const displayValue = value ?? '—'
  const titleValue = typeof value === 'string' ? value : undefined

  return (
    <div className="py-1.5 border-b border-edge-subtle/10 last:border-0">
      <div className="text-[10px] text-ink-tertiary capitalize">{label.replace(/_/g, ' ')}</div>
      <div className="text-xs text-ink-primary truncate" title={titleValue}>
        {displayValue || <span className="text-ink-tertiary">—</span>}
      </div>
    </div>
  )
}

type TablePanelProps = {
  title: string
  icon: string
  iconColor?: string
  defaultOpen?: boolean
  maxHeight?: number
  data: Array<{ label: string; value: string | React.ReactNode }>
  emptyContent?: React.ReactNode
}

export const TablePanel = ({
  title,
  icon,
  iconColor = 'text-ink-tertiary',
  defaultOpen = false,
  maxHeight = 200,
  data,
  emptyContent,
}: TablePanelProps) => (
  <CollapsiblePanel
    title={title}
    icon={icon}
    iconColor={iconColor}
    defaultOpen={defaultOpen}
    maxHeight={maxHeight}
  >
    {data.length > 0
      ? data.map((row, i) => <DataRow key={i} label={row.label} value={row.value} />)
      : emptyContent || <p className="text-xs text-ink-tertiary">Sin datos</p>}
  </CollapsiblePanel>
)

export default TablePanel
