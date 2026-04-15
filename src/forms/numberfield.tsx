import Label from '../common/label'
import { inputBase, inputEditable, inputReadOnly } from './inputstyles'

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
      <Label text={label} className='mb-1' />
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
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-tertiary pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export default NumberField
