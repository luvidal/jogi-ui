const inputBase = 'border rounded-xl w-full text-sm px-3 py-2 text-gray-950'
const inputEditable = 'bg-white focus:ring-2 focus:ring-theme-200 focus:border-theme-400 transition-all duration-200'
const inputReadOnly = 'bg-gray-50 border-gray-200 cursor-default'

interface TextFieldProps {
  label: string
  value: string | undefined
  onChange?: (v: string | undefined) => void
  readOnly?: boolean
  placeholder?: string
  fullWidth?: boolean
}

const TextField = ({ label, value, onChange, readOnly, placeholder, fullWidth }: TextFieldProps) => {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value ?? ''}
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        placeholder={readOnly ? undefined : placeholder}
        onChange={readOnly ? undefined : e => onChange?.(e.target.value || undefined)}
        className={`${inputBase} ${readOnly ? inputReadOnly : inputEditable}`}
      />
    </div>
  )
}

export default TextField
