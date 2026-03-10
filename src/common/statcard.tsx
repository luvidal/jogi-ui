import Icon from './icon'

type Color = 'default' | 'success' | 'warning' | 'danger'

interface Props {
    label: string
    value: string | number
    icon?: string
    subtitle?: string
    color?: Color
}

const colorConfig: Record<Color, { bg: string; text: string; iconBg: string; iconColor: string }> = {
    default:  { bg: 'bg-theme-50',   text: 'text-theme-700',   iconBg: 'bg-theme-100',   iconColor: 'text-theme-500' },
    success:  { bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500' },
    warning:  { bg: 'bg-amber-50',   text: 'text-amber-700',   iconBg: 'bg-amber-100',   iconColor: 'text-amber-500' },
    danger:   { bg: 'bg-rose-50',    text: 'text-rose-700',    iconBg: 'bg-rose-100',    iconColor: 'text-rose-500' },
}

const StatCard = ({ label, value, icon, subtitle, color = 'default' }: Props) => {
    const cfg = colorConfig[color]
    return (
        <div className={`rounded-xl p-4 flex items-start gap-3 ${cfg.bg}`}>
            {icon && (
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${cfg.iconBg}`}>
                    <Icon name={icon} size={20} className={cfg.iconColor} />
                </div>
            )}
            <div className='min-w-0'>
                <div className={`text-xs font-medium truncate ${cfg.text} opacity-70`}>{label}</div>
                <div className={`text-2xl font-bold ${cfg.text}`}>{value}</div>
                {subtitle && <div className='text-xs text-gray-400 truncate mt-0.5'>{subtitle}</div>}
            </div>
        </div>
    )
}

export default StatCard
