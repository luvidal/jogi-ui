import { ReactNode } from 'react'
import Label from '../common/label'

interface FieldWrapperProps {
    label?: string
    /** Optional tooltip — renders a "?" icon next to the label */
    tooltip?: string
    className?: string
    visible?: boolean
    children: ReactNode
}

export default function FieldWrapper({ label, tooltip, className = '', visible = true, children }: FieldWrapperProps) {
    if (!visible) return null

    return (
        <div className={`mb-2 ${className}`}>
            {label && <Label text={label} tooltip={tooltip} />}
            {children}
        </div>
    )
}
