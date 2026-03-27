import { useRef, useState } from 'react'
import Icon from '../common/icon'
import HoverTooltip from './hovertooltip'

interface ToolBackProps {
    icon: string
    label?: string
    onClick: () => void
    variant?: 'dark' | 'light'
}

const ToolBack = ({ icon, label = 'Volver', onClick, variant = 'light' }: ToolBackProps) => {
    const [hovered, setHovered] = useState(false)
    const btnRef = useRef<HTMLButtonElement>(null)

    const variantStyles = variant === 'light'
        ? 'bg-theme-100 hover:bg-theme-200 text-theme-700 hover:text-theme-800'
        : 'bg-white/10 hover:bg-white/15 text-white/80 hover:text-white'

    return (
        <button
            ref={btnRef}
            onClick={e => {
                e.stopPropagation()
                onClick()
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={label}
            className={`
                flex items-center justify-center gap-0.5 h-9 px-2
                ${variantStyles}
                backdrop-blur-sm transition-all duration-200
                rounded-btn
            `}
        >
            <Icon name='ChevronLeft' size={16} className={variant === 'dark' ? 'icon-shadow-sm' : ''} />
            <Icon name={icon} size={16} className={variant === 'dark' ? 'icon-shadow-sm' : ''} />
            {hovered && <HoverTooltip label={label} btnRef={btnRef} />}
        </button>
    )
}

export default ToolBack
