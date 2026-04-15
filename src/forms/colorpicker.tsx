import { useState, useEffect, useRef } from 'react'
import FieldWrapper from './fieldwrapper'
import { useClickOutside } from '../hooks/useclickoutside'

interface Props {
  label?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  visible?: boolean
}

const ColorPicker = ({ label, value = '#000000', onChange, className = '', visible = true }: Props) => {
  const [localValue, setLocalValue] = useState(value)
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useClickOutside(pickerRef, () => setShowPicker(false))

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const isValidHex = (hex: string) => /^#[0-9A-Fa-f]{6}$/.test(hex)

  const handleTextChange = (text: string) => {
    // Add # if not present
    const formatted = text.startsWith('#') ? text : `#${text}`
    setLocalValue(formatted)
    if (isValidHex(formatted)) {
      onChange?.(formatted)
    }
  }

  return (
    <FieldWrapper label={label} className={className} visible={visible}>
      <div className='relative' ref={pickerRef}>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setShowPicker(!showPicker)}
            className='w-12 h-12 rounded-xl border-2 border-edge-subtle/30 cursor-pointer transition-all hover:border-edge-subtle/60 shadow-md'
            style={{ backgroundColor: isValidHex(localValue) ? localValue : '#ffffff' }}
            aria-label='Seleccionar color'
          />
          <input
            type='text'
            value={localValue}
            onChange={e => handleTextChange(e.target.value)}
            maxLength={7}
            className='border border-edge-subtle/20 rounded-xl w-28 text-ink-primary bg-surface-0 text-base px-4 py-3 font-mono uppercase focus:ring-2 focus:ring-brand/30 focus:border-brand/60 outline-none'
            placeholder='#000000'
          />
        </div>
        {showPicker && (
          <div className='absolute top-full left-0 mt-2 p-3 bg-surface-1 rounded-xl shadow-lg border border-edge-subtle/20 z-50'>
            <input
              type='color'
              value={isValidHex(localValue) ? localValue : '#000000'}
              onChange={e => handleChange(e.target.value)}
              className='w-48 h-32 cursor-pointer border-0'
            />
          </div>
        )}
      </div>
    </FieldWrapper>
  )
}

export default ColorPicker
