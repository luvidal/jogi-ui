import Label from '../common/label'

interface ComputedFieldProps {
  label: string
  value: string
  suffix?: string
  className?: string
}

const ComputedField = ({ label, value, suffix, className = '' }: ComputedFieldProps) => {
  return (
    <div className={className}>
      {label && <Label text={label} className='mb-1' />}
      <div className="relative">
        <div className="border border-dashed border-edge-subtle/30 rounded-xl w-full text-sm px-3 py-2 tabular-nums bg-surface-0 text-ink-primary font-medium cursor-default select-none">
          {value}
        </div>
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-tertiary pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export default ComputedField
