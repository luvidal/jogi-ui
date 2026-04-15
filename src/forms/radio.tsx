interface Props<T extends string = string> {
    label: string
    value: T
    selected: T
    onChange?: (value: T) => void
    className?: string
}

const Radio = <T extends string = string>({ label, value, selected, onChange, className = '' }: Props<T>) => {
    return (
        <label className={`flex items-center cursor-pointer ${className}`}>
            <input
                type='radio'
                value={value}
                checked={selected === value}
                onChange={() => onChange?.(value)}
                className='mr-2 w-4 h-4 accent-brand'
            />
            <span className='text-ink-secondary'>{label}</span>
        </label>
    )
}

export default Radio