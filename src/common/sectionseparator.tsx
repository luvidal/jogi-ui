import React from 'react'

type Props = { label: string; first?: boolean; className?: string }

export default function SectionSeparator({ label, first, className = '' }: Props) {
  return (
    <div className={`basis-full flex items-center gap-3 ${first ? '' : 'mt-4'} ${className}`}>
      <span className='text-xs font-medium text-ink-tertiary uppercase tracking-wide'>{label}</span>
      <span className='flex-1 border-b border-edge-subtle/15' />
    </div>
  )
}
