

import { ReactNode } from 'react'
import Icon from './icon'

interface Props {
    title?: string
    description?: string
    className?: string
    variant?: 'light' | 'dark'
    /** Lucide icon name or custom ReactNode to display instead of the default box illustration */
    icon?: string | ReactNode
    /** Optional action button */
    action?: {
        label: string
        onClick: () => void
        /** Lucide icon name shown before the label */
        icon?: string
        /** Shows a spinner and disables the button */
        loading?: boolean
    }
}

const EmptyState = ({ title = 'Sin elementos', description, className = '', variant = 'light', icon, action }: Props) => {
    const isDark = variant === 'dark'

    const renderIcon = () => {
        if (!icon) {
            return (
                /* Minimalist empty box illustration */
                <svg
                    width='120'
                    height='100'
                    viewBox='0 0 120 100'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='mb-4 opacity-40'
                >
                    {/* Box base */}
                    <path
                        d='M20 35 L60 15 L100 35 L60 55 Z'
                        className={isDark ? 'fill-white/20 stroke-white/40' : 'fill-theme-200 stroke-theme-400'}
                        strokeWidth='1.5'
                    />
                    {/* Box left side */}
                    <path
                        d='M20 35 L20 65 L60 85 L60 55 Z'
                        className={isDark ? 'fill-white/15 stroke-white/40' : 'fill-theme-100 stroke-theme-400'}
                        strokeWidth='1.5'
                    />
                    {/* Box right side */}
                    <path
                        d='M100 35 L100 65 L60 85 L60 55 Z'
                        className={isDark ? 'fill-white/10 stroke-white/40' : 'fill-theme-50 stroke-theme-400'}
                        strokeWidth='1.5'
                    />
                    {/* Dashed opening indicator */}
                    <path
                        d='M40 45 L60 35 L80 45'
                        className={isDark ? 'stroke-white/30' : 'stroke-theme-300'}
                        strokeWidth='1.5'
                        strokeDasharray='4 3'
                        strokeLinecap='round'
                        fill='none'
                    />
                </svg>
            )
        }
        if (typeof icon === 'string') {
            return (
                <div className={`mb-4 opacity-40 ${isDark ? 'text-white/50' : 'text-theme-400'}`}>
                    <Icon name={icon} size={48} />
                </div>
            )
        }
        return <div className='mb-4'>{icon}</div>
    }

    return (
        <div className={`flex flex-col items-center justify-center w-full h-full min-h-48 p-8 ${className}`}>
            {renderIcon()}

            <p className={`font-medium text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{title}</p>
            {description && (
                <p className={`text-xs mt-1 text-center max-w-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{description}</p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    disabled={action.loading}
                    className={`mt-4 flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-btn transition-all duration-200 disabled:opacity-50 ${isDark
                        ? 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                        : 'bg-theme-50 text-theme-600 hover:bg-theme-100'
                    }`}
                >
                    {action.icon && <Icon name={action.loading ? 'Loader' : action.icon} size={14} className={action.loading ? 'animate-spin' : ''} />}
                    {action.label}
                </button>
            )}
        </div>
    )
}

export default EmptyState
