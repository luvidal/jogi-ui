import { ReactNode } from 'react'

interface FieldWrapperProps {
    label?: string
    className?: string
    visible?: boolean
    children: ReactNode
}

export default function FieldWrapper({ label, className = '', visible = true, children }: FieldWrapperProps) {
    if (!visible) return null

    return (
        <div className={`mb-2 ${className}`}>
            {label && (
                <div className='flex items-center'>
                    <span className='text-gray-500 text-sm'>{label}</span>
                </div>
            )}
            {children}
        </div>
    )
}
