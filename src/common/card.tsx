import { colClass } from './colclass'

interface PropsCard {
    title: string
    subtitle?: string
    children?: React.ReactNode
    colSpan?: number
    /**
     * Visual variant.
     * - `'light'` (default, legacy): paper-white surface with theme-colored title/subtitle.
     * - `'dark'`: token-driven surface for dark-mode dashboards. `bg-surface-1` with
     *   an `edge-subtle` border; title/subtitle read from `ink-*` tokens.
     *
     * `light` preserved for any legacy consumer that has not yet migrated.
     */
    variant?: 'light' | 'dark'
}

const Card = ({ title, subtitle, children, colSpan = 6, variant = 'light' }: PropsCard) => {
    const isDark = variant === 'dark'
    const root = isDark
        ? 'bg-surface-1 border border-edge-subtle/15 transition-colors duration-300'
        : 'bg-white shadow-lg hover:shadow-xl transition-all duration-300'
    const titleCls = isDark ? 'text-ink-primary' : 'text-theme-700'
    const subtitleCls = isDark ? 'text-ink-tertiary' : 'text-theme-500'
    return (
        <div className={`flex flex-col h-96 rounded-2xl p-6 ${root} ${colClass(colSpan)}`}>
            <div className={`flex-shrink-0 text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-bold mb-4 whitespace-nowrap overflow-hidden text-ellipsis ${titleCls}`}>
                {title}
                {subtitle && (
                    <div className={`text-base sm:text-md md:text-md lg:text-base xl:text-lg font-semibold mt-1 whitespace-nowrap overflow-hidden text-ellipsis ${subtitleCls}`}>
                        {subtitle}
                    </div>
                )}
            </div>
            <div className='flex-1 min-h-0 overflow-y-auto'>
                {children}
            </div>
        </div>
    )
}

export default Card