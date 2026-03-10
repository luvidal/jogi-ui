const inputBase = 'border rounded-xl w-full text-sm px-3 py-2 text-gray-950'
const inputEditable = 'bg-white focus:ring-2 focus:ring-theme-200 focus:border-theme-400 transition-all duration-200'
const inputReadOnly = 'bg-gray-50 border-gray-200 cursor-default'

interface NumberFieldProps {
  label: string
  value: number | undefined
  onChange?: (v: number | undefined) => void
  suffix?: string
  step?: string
  readOnly?: boolean
}

const NumberField = ({ label, value, onChange, suffix, step = 'any', readOnly }: NumberFieldProps) => {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          step={step}
          value={value ?? ''}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          onChange={readOnly ? undefined : e => {
            const raw = e.target.value
            onChange?.(raw === '' ? undefined : Number(raw))
          }}
          className={`${inputBase} tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            readOnly ? inputReadOnly : inputEditable
          }`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export default NumberField
