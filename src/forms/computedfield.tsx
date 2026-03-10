interface ComputedFieldProps {
  label: string
  value: string
  suffix?: string
  className?: string
}

const ComputedField = ({ label, value, suffix, className = '' }: ComputedFieldProps) => {
  return (
    <div className={className}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <div className="border border-dashed border-theme-300 rounded-xl w-full text-sm px-3 py-2 tabular-nums bg-theme-50 text-theme-700 font-medium cursor-default select-none">
          {value}
        </div>
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-theme-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export default ComputedField
