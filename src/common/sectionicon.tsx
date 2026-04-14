/**
 * SectionIcon - Icon with colored background container
 *
 * Design: Mono-color icon with solid lighter background
 * Creates a clean, professional look consistent across the app
 *
 * Colors must be provided explicitly — no domain-specific lookups.
 * In Jogi, callers typically pass colors from getSectionColors().
 */

import Icon from './icon'

export interface SectionIconColors {
  iconBg: string  // e.g. 'bg-status-info/20'
  text: string    // e.g. 'text-status-info'
}

interface Props {
  /** Color scheme for icon container and icon */
  colors?: SectionIconColors
  /** Icon name from Lucide */
  icon: string
  /** Icon size in pixels (default: 18) */
  size?: number
  /** Container size: 'sm' (24px), 'md' (32px), 'lg' (40px) */
  containerSize?: 'sm' | 'md' | 'lg'
  /** Additional class names for the container */
  className?: string
}

const containerSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
}

const DEFAULT_COLORS: SectionIconColors = { iconBg: 'bg-gray-100', text: 'text-gray-700' }

const SectionIcon = ({
  colors = DEFAULT_COLORS,
  icon,
  size = 18,
  containerSize = 'md',
  className = '',
}: Props) => {
  return (
    <div
      className={`
        shrink-0 flex items-center justify-center rounded-xl
        ${containerSizes[containerSize]}
        ${colors.iconBg}
        ${className}
      `}
    >
      <Icon name={icon as any} size={size} className={colors.text} />
    </div>
  )
}

export default SectionIcon
