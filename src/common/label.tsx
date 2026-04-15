import Tooltip from './tooltip'

interface LabelProps {
    /** The text of the label */
    text: string
    /** Optional tooltip — renders a "?" icon that opens a tooltip on click */
    tooltip?: string
    /** Extra classes appended after the defaults */
    className?: string
}

// DIRECTIVE: Label is the unified way to render ANY field label in the app.
// Never render a form/field label as a raw <span> or <div> with its own
// text color — always use this component so labels stay coherent. The "?"
// tooltip icon must inherit the label's color via `currentColor`, so a
// future theme change to the label color also reflects on the icon.
const Label = ({ text, tooltip, className = '' }: LabelProps) => (
    <div className={`flex items-center text-ink-tertiary text-sm ${className}`}>
        <span>{text}</span>
        {tooltip && <Tooltip text={tooltip} />}
    </div>
)

export default Label
