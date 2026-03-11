import Icon from '../common/icon'

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
  icon?: string
  onIconClick?: () => void
}

const TextField = ({ label, value, onChange, readOnly, placeholder, fullWidth, icon, onIconClick }: TextFieldProps) => {
  const hasIcon = !!icon
  const isInteractive = hasIcon && !!onIconClick

  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value ?? ''}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          placeholder={readOnly ? undefined : placeholder}
          onChange={readOnly ? undefined : e => onChange?.(e.target.value || undefined)}
          className={`${inputBase} ${hasIcon ? 'pr-8' : ''} ${readOnly ? inputReadOnly : inputEditable}`}
        />
        {hasIcon && isInteractive && (
          <button
            onClick={onIconClick}
            tabIndex={-1}
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100 transition-colors"
          >
            <Icon name={icon!} size={14} className="text-gray-500 hover:text-gray-700" />
          </button>
        )}
        {hasIcon && !isInteractive && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name={icon!} size={14} className="text-gray-300" />
          </span>
        )}
      </div>
    </div>
  )
}

export default TextField
