import { useState, useEffect, ReactNode, Fragment } from 'react'
import Icon from '../common/icon'

export interface Tab {
    id: string
    label: string
    /** Shorter label shown on mobile (sm breakpoint and below) */
    shortLabel?: string
    icon?: string
    content?: ReactNode
    /** Custom background color when this tab is selected */
    selectedBackground?: string
    /** Custom foreground (text) color when this tab is selected */
    selectedForeground?: string
    /** Group name for visual clustering. Tabs with different groups get a flex spacer between them. */
    group?: string
}

export type { Tab as TabType }

interface TabsProps {
    tabs: Tab[]
    activeTab?: string
    onChange?: (tabId: string) => void
    onRefresh?: (tabId: string) => void
    children?: ReactNode
    className?: string
    /** Render style: 'underline' (default) or 'pill' */
    variant?: 'underline' | 'pill'
    /** Custom background color for selected tab */
    selectedBackground?: string
    /** Custom foreground (text) color for selected tab */
    selectedForeground?: string
    /** Custom background color for inactive tabs */
    inactiveBackground?: string
    /** Custom foreground (text) color for inactive tabs */
    inactiveForeground?: string
    /** Whether to show rounded corners on first/last tabs (default: true) */
    rounded?: boolean
}

/**
 * Shared Tabs component for switching between views.
 *
 * Usage with content prop:
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: 'renta', label: 'Informe de Renta', content: <RentaReport /> },
 *     { id: 'reporte', label: 'Reporte', content: <ReporteView /> }
 *   ]}
 * />
 * ```
 *
 * Usage with children (controlled):
 * ```tsx
 * <Tabs
 *   tabs={[{ id: 'tab1', label: 'Tab 1' }, { id: 'tab2', label: 'Tab 2' }]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * >
 *   {activeTab === 'tab1' && <Content1 />}
 *   {activeTab === 'tab2' && <Content2 />}
 * </Tabs>
 * ```
 */
const Tabs = ({
    tabs,
    activeTab: controlledActive,
    onChange,
    onRefresh,
    children,
    className = '',
    variant = 'underline',
    selectedBackground,
    selectedForeground,
    inactiveBackground,
    inactiveForeground,
    rounded = true
}: TabsProps) => {
    const [internalActive, setInternalActive] = useState(tabs[0]?.id || '')

    // Support controlled and uncontrolled modes
    const activeId = controlledActive ?? internalActive

    useEffect(() => {
        // Reset to first tab if current active isn't in tabs list
        if (tabs.length > 0 && !tabs.some(t => t.id === activeId)) {
            const newActive = tabs[0].id
            setInternalActive(newActive)
            onChange?.(newActive)
        }
    }, [tabs, activeId])

    const handleTabClick = (tabId: string) => {
        if (tabId === activeId) {
            onRefresh?.(tabId)
        } else {
            if (controlledActive === undefined) {
                setInternalActive(tabId)
            }
            onChange?.(tabId)
        }
    }

    const activeContent = tabs.find(t => t.id === activeId)?.content

    if (tabs.length === 0) return null

    const hasGroups = tabs.some(t => t.group !== undefined)
    const firstGroup = hasGroups ? tabs[0]?.group : undefined

    // Underline variant (default) - matches detail header tab style
    if (variant === 'underline') {
        return (
            <div className={className}>
                <div className="flex flex-shrink-0">
                    {tabs.map((tab, i) => {
                        const isActive = activeId === tab.id
                        // Per-tab colors take precedence over component-level colors
                        const bg = tab.selectedBackground ?? selectedBackground
                        const fg = tab.selectedForeground ?? selectedForeground
                        const hasCustomColors = bg || fg
                        const hasInactiveColors = inactiveBackground || inactiveForeground
                        const customStyle = isActive
                            ? (hasCustomColors ? { backgroundColor: bg, color: fg } : undefined)
                            : (hasInactiveColors ? { backgroundColor: inactiveBackground, color: inactiveForeground } : undefined)
                        const isNewGroup = hasGroups && i > 0 && tab.group !== tabs[i - 1].group
                        const groupStyle = hasGroups
                            ? { ...customStyle, flex: '0 1 300px' }
                            : customStyle
                        return (
                            <Fragment key={tab.id}>
                                {isNewGroup && <div className="flex-1 min-w-4" />}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleTabClick(tab.id) }}
                                    style={groupStyle}
                                    className={`${hasGroups ? '' : 'flex-1'} flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold py-3 sm:py-4 px-2 sm:px-4 md:px-5 truncate whitespace-nowrap overflow-hidden transition-all duration-200 ${rounded ? 'md:first:rounded-tl-btn md:last:rounded-tr-btn' : ''} ${isActive
                                        ? hasCustomColors ? '' : 'text-theme-700 bg-white'
                                        : hasInactiveColors ? 'hover:brightness-110' : 'text-gray-300 bg-gray-50 hover:text-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.icon && <Icon name={tab.icon} size={16} className={`flex-shrink-0 ${isActive ? (hasCustomColors ? '' : 'text-theme-500') : (hasInactiveColors ? '' : 'text-gray-300')}`} style={isActive ? (fg ? { color: fg } : undefined) : (inactiveForeground ? { color: inactiveForeground } : undefined)} />}
                                    <span className='truncate'>{tab.shortLabel ? (<><span className="sm:hidden">{tab.shortLabel}</span><span className="hidden sm:inline">{tab.label}</span></>) : tab.label}</span>
                                </button>
                            </Fragment>
                        )
                    })}
                </div>
                <div className="flex-1 min-h-0 flex flex-col">
                    {children ?? activeContent}
                </div>
            </div>
        )
    }

    // Pill variant - alternative style with rounded pills
    const hasCustomColors = selectedBackground || selectedForeground
    return (
        <div className={className}>
            <div className="flex gap-2 p-2 bg-gray-100 rounded-xl">
                {tabs.map((tab, i) => {
                    const isActive = activeId === tab.id
                    const customStyle = isActive && hasCustomColors ? {
                        backgroundColor: selectedBackground,
                        color: selectedForeground
                    } : undefined
                    const isNewGroup = hasGroups && i > 0 && tab.group !== tabs[i - 1].group
                    const groupStyle = hasGroups
                        ? { ...customStyle, flex: '0 1 300px' }
                        : customStyle
                    return (
                        <Fragment key={tab.id}>
                            {isNewGroup && <div className="flex-1 min-w-4" />}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleTabClick(tab.id) }}
                                style={groupStyle}
                                className={`${hasGroups ? '' : 'flex-1'} flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-medium py-2.5 sm:py-3 px-2 sm:px-4 md:px-5 rounded-btn transition-all duration-200 ${isActive
                                    ? hasCustomColors ? 'shadow-sm' : 'bg-white text-theme-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.icon && <Icon name={tab.icon} size={16} className={`flex-shrink-0 ${isActive ? (hasCustomColors ? '' : 'text-theme-500') : ''}`} style={isActive && selectedForeground ? { color: selectedForeground } : undefined} />}
                                <span className='truncate'>{tab.shortLabel ? (<><span className="sm:hidden">{tab.shortLabel}</span><span className="hidden sm:inline">{tab.label}</span></>) : tab.label}</span>
                            </button>
                        </Fragment>
                    )
                })}
            </div>
            <div>
                {children ?? activeContent}
            </div>
        </div>
    )
}

export default Tabs
