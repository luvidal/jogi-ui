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
    default:  { bg: 'bg-surface-2/40',       text: 'text-ink-primary',    iconBg: 'bg-surface-3',         iconColor: 'text-brand' },
    success:  { bg: 'bg-status-ok/10',       text: 'text-status-ok',      iconBg: 'bg-status-ok/20',      iconColor: 'text-status-ok' },
    warning:  { bg: 'bg-status-warn/10',     text: 'text-status-warn',    iconBg: 'bg-status-warn/20',    iconColor: 'text-status-warn' },
    danger:   { bg: 'bg-status-pending/10',  text: 'text-status-pending', iconBg: 'bg-status-pending/20', iconColor: 'text-status-pending' },
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
                {subtitle && <div className='text-xs text-ink-tertiary truncate mt-0.5'>{subtitle}</div>}
            </div>
        </div>
    )
}

export default StatCard
