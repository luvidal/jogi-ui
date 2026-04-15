import { useState, useEffect } from 'react'
import FieldWrapper from './fieldwrapper'

interface Props {
  label?: string
  readOnly?: boolean
  onChange?: (value: string) => void
  value?: string
  className?: string
  visible?: boolean
}

type InputProps = Props & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'readOnly'>

const sanitizeValue = (s: any) => String(s || '')
  .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
  .replace(/[\u00A0\u1680\u180E\u2000-\u200D\u2028-\u202F\u205F\u2060\u3000\uFEFF]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const Input = ({ label, className = '', readOnly, onChange, value = '', visible = true, ...rest }: InputProps) => {
  const [localValue, setLocalValue] = useState(value)
  const [cleanValue, setCleanValue] = useState(() => sanitizeValue(value))

  useEffect(() => {
    const cleaned = sanitizeValue(value)
    setLocalValue(value)
    setCleanValue(cleaned)
  }, [value])

  const commit = () => {
    const sanitized = sanitizeValue(localValue)
    setLocalValue(sanitized)
    if (sanitized !== cleanValue) onChange?.(sanitized)
  }

  return (
    <FieldWrapper label={label} className={className} visible={visible}>
      <input
        {...rest}
        readOnly={readOnly}
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={e => e.key === 'Enter' && commit()}
        className={`border border-edge-subtle/30 rounded-xl w-full ${readOnly ? 'text-ink-tertiary cursor-not-allowed bg-surface-2' : 'text-ink-primary bg-surface-1 focus:ring-2 focus:ring-brand/30 focus:border-brand/60 outline-none'} text-base px-4 py-3 transition-all duration-300`}
      />
    </FieldWrapper>
  )
}

export default Input
