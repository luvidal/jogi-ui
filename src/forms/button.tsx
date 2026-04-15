import Icon from '../common/icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string
    text?: string
    /** Shows inline spinner and disables interaction */
    loading?: boolean
}

const Button = ({ icon, text, loading = false, className = '', ...props }: ButtonProps) => {
    const isDisabled = props.disabled || loading

    // DIRECTIVE: The color of a button NEVER changes when disabled — no bg
    // swap, no ring swap, no shadow swap, no opacity on the <button> itself.
    // Only the text + icon get dimmed via `opacity-40`. Never add `blur-*`,
    // `grayscale`, or any filter here — "dimmed" means opacity only.
    // See src/forms/button.README.md for rationale. Do not change this
    // without explicit user approval.
    const disabledText = isDisabled ? 'opacity-40' : ''

    return (
        <button
            className={`flex items-center justify-center h-10 px-5 text-sm gap-2 bg-theme-700 hover:bg-theme-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm rounded-btn active:scale-[0.98] ${isDisabled ? 'cursor-not-allowed' : ''} ${className}`}
            {...props}
            disabled={isDisabled}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : (
                icon && <Icon name={icon} size={16} className={`text-shadow-sm ${disabledText}`} />
            )}
            {text && <span className={`text-shadow-sm truncate font-semibold uppercase tracking-wide ${disabledText}`}>{text}</span>}
        </button>
    )
}

export default Button
