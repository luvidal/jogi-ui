import Icon from '../common/icon'

interface Props {
  label: string
  checked: boolean
  className?: string
  onChange: (checked: boolean) => void
}

const Checkbox = ({ label, checked, className = '', onChange }: Props) => {
  return (
    <button
      type='button'
      role='checkbox'
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`group flex items-center gap-3 cursor-pointer select-none ${className}`}
    >
      <span className={`flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200 ${
        checked
          ? 'bg-brand border-brand'
          : 'bg-surface-0 border-edge-subtle/30 group-hover:border-brand/60'
      }`}>
        {checked && <Icon name='Check' size={14} className='text-brand-contrast' strokeWidth={3} />}
      </span>
      <span className='text-sm text-ink-secondary group-hover:text-ink-primary transition-colors'>{label}</span>
    </button>
  )
}

export default Checkbox
