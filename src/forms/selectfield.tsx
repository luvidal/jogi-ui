import { inputBase, inputEditable, inputReadOnly } from './inputstyles'

interface SelectFieldProps {
  label: string
  value: string | undefined
  options: { label: string; value: string }[]
  onChange?: (v: string | undefined) => void
  readOnly?: boolean
}

const SelectField = ({ label, value, options, onChange, readOnly }: SelectFieldProps) => {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <select
        value={value ?? ''}
        disabled={readOnly}
        onChange={readOnly ? undefined : e => onChange?.(e.target.value || undefined)}
        className={`${inputBase} ${readOnly ? inputReadOnly : inputEditable}`}
      >
        <option value="">—</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export default SelectField
