import { useState, useRef } from 'react'
import type { ButtonHTMLAttributes, MouseEventHandler } from 'react'
import Icon from '../common/icon'
import HoverTooltip from './hovertooltip'
import { disabledEffect as disabledCls } from '../forms/inputstyles'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    icon: string
    label: string
    onClick?: MouseEventHandler<HTMLButtonElement>
    active?: boolean
    variant?: 'dark' | 'light'
    /** Color accent for icon-only floating toolbar buttons (e.g. destructive actions) */
    color?: 'default' | 'amber' | 'red'
}

const colorStyles = {
    default: '',
    amber: 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/30',
    red: 'text-red-300 hover:text-red-200 hover:bg-red-500/30',
}

const ToolbarButton = ({
    icon,
    label,
    onClick,
    active = false,
    variant = 'dark',
    color,
    disabled,
    ...rest
}: ButtonProps) => {
    const [hovered, setHovered] = useState(false)
    const btnRef = useRef<HTMLButtonElement>(null)

    const disabledStyle = disabled ? disabledCls : ''
    const isIconOnly = color !== undefined

    const variantStyles = color && color !== 'default'
        ? colorStyles[color]
        : variant === 'light'
            ? 'bg-white hover:bg-gray-50 text-theme-700 hover:text-theme-800'
            : isIconOnly
                ? 'text-white/80 hover:text-white hover:bg-white/20'
                : 'bg-white/10 hover:bg-white/15 text-white/80 hover:text-white'

    const activeStyles = variant === 'light'
        ? 'bg-gray-100 text-theme-600'
        : 'bg-white/30 text-white'

    return (
        <button
            {...rest}
            ref={btnRef}
            disabled={disabled}
            onClick={e => {
                e.stopPropagation()
                onClick?.(e)
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={label}
            className={`
                flex items-center justify-center ${isIconOnly ? 'p-2 rounded-btn-sm' : 'h-9 px-3 first:rounded-l-btn last:rounded-r-btn'}
                ${variantStyles}
                ${isIconOnly ? '' : 'backdrop-blur-sm'} transition-all duration-200
                ${active ? activeStyles : ''}
                ${disabled ? 'cursor-not-allowed' : ''}
            `}
        >
            <Icon name={icon} size={isIconOnly ? 15 : 16} className={`${variant === 'dark' && !isIconOnly ? 'icon-shadow-sm' : ''} ${disabledStyle}`} />
            {hovered && <HoverTooltip label={label} btnRef={btnRef} />}
        </button>
    )
}

export default ToolbarButton
