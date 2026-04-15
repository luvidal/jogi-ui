import { useState, useEffect, useRef, useLayoutEffect, ReactNode } from 'react'
import Icon from '../common/icon'

export interface Tab {
    id: string
    label: string
    /** Shorter label shown on mobile (sm breakpoint and below) */
    shortLabel?: string
    icon?: string
    content?: ReactNode
}

export type { Tab as TabType }

export type ColorSet = 'default' | 'violet'
export type TabSize = 'xs' | 'sm' | 'md' | 'lg'

const COLOR_SETS: Record<ColorSet, { activeBg: string; activeText: string; activeIcon: string }> = {
    default: { activeBg: 'bg-white', activeText: 'text-theme-700', activeIcon: 'text-theme-500' },
    violet:  { activeBg: 'bg-status-info/20', activeText: 'text-status-info', activeIcon: 'text-status-info' },
}

const SIZE_CONFIG: Record<TabSize, { button: string; icon: number; track: string }> = {
    xs: { button: 'px-2 py-1.5 text-xs gap-1',       icon: 14, track: 'p-0.5' },
    sm: { button: 'px-3 py-2 sm:py-2.5 text-xs sm:text-sm gap-1.5', icon: 16, track: 'p-1' },
    md: { button: 'px-4 py-2.5 text-sm gap-1.5',     icon: 18, track: 'p-1' },
    lg: { button: 'px-5 py-3 text-base gap-2',        icon: 20, track: 'p-1.5' },
}

function buildTabsKey(tabs: Tab[], storageKey?: string): string | undefined {
    if (storageKey) return storageKey
    const ids = tabs.map(t => t.id).join(',')
    return `jogi_tabs_${ids}`
}

interface TabsProps {
    tabs: Tab[]
    activeTab?: string
    onChange?: (tabId: string) => void
    onRefresh?: (tabId: string) => void
    storageKey?: string
    /** Persist active tab in localStorage. Default true. */
    rememberTab?: boolean
    children?: ReactNode
    className?: string
    /** Optional suffix per tab (e.g. "(3/5)"), shown after the label */
    suffix?: (tabId: string) => string
    /** Dark mode for use on dark backgrounds (e.g. modal headers) */
    dark?: boolean
    /** Color palette for active tab styling */
    colorSet?: ColorSet
    /** Tab density: font size, icon size, padding */
    size?: TabSize
}

const Tabs = ({
    tabs,
    activeTab: controlledActive,
    onChange,
    onRefresh,
    storageKey: explicitStorageKey,
    rememberTab = true,
    children,
    className = '',
    suffix,
    dark = false,
    colorSet = 'default',
    size = 'sm'
}: TabsProps) => {
    const storageKey = rememberTab ? buildTabsKey(tabs, explicitStorageKey) : undefined

    const [internalActive, setInternalActive] = useState<string>(() => {
        if (storageKey && controlledActive === undefined) {
            try {
                const stored = localStorage.getItem(storageKey)
                if (stored && tabs.some(t => t.id === stored)) return stored
            } catch {}
        }
        return tabs[0]?.id || ''
    })
    const activeId = controlledActive ?? internalActive
    const restoredRef = useRef(false)

    // Controlled mode: on mount (once), restore stored tab via onChange (before paint)
    useLayoutEffect(() => {
        if (!storageKey || controlledActive === undefined || restoredRef.current) return
        restoredRef.current = true
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored && tabs.some(t => t.id === stored) && stored !== controlledActive) {
                onChange?.(stored)
            }
        } catch {}
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Controlled mode: sync active tab to localStorage on change
    useEffect(() => {
        if (!storageKey || controlledActive === undefined) return
        try { localStorage.setItem(storageKey, controlledActive) } catch {}
    }, [controlledActive, storageKey])

    useEffect(() => {
        if (tabs.length > 0 && !tabs.some(t => t.id === activeId)) {
            const newActive = tabs[0].id
            setInternalActive(newActive)
            onChange?.(newActive)
            if (storageKey) {
                try { localStorage.setItem(storageKey, newActive) } catch {}
            }
        }
    }, [tabs, activeId])

    const handleTabClick = (tabId: string) => {
        if (tabId === activeId) {
            onRefresh?.(tabId)
        } else {
            if (controlledActive === undefined) {
                setInternalActive(tabId)
                if (storageKey) {
                    try { localStorage.setItem(storageKey, tabId) } catch {}
                }
            }
            onChange?.(tabId)
        }
    }

    const activeContent = tabs.find(t => t.id === activeId)?.content

    if (tabs.length === 0) return null

    const hasContent = children !== undefined || activeContent !== undefined
    const colors = COLOR_SETS[colorSet]
    const sizeConfig = SIZE_CONFIG[size]

    return (
        <div className={className}>
            <div className={`flex ${sizeConfig.track} rounded-xl flex-shrink-0 ${dark ? 'bg-surface-0/60' : 'bg-gray-100'}`}>
                {tabs.map(tab => {
                    const isActive = activeId === tab.id
                    const sfx = suffix?.(tab.id)
                    return (
                        <button
                            key={tab.id}
                            onClick={(e) => { e.stopPropagation(); handleTabClick(tab.id) }}
                            className={`flex-1 flex items-center justify-center ${sizeConfig.button} rounded-lg font-semibold transition-all duration-200 cursor-pointer select-none truncate whitespace-nowrap overflow-hidden ${
                                dark
                                    ? (isActive ? 'bg-brand text-brand-contrast shadow-sm' : 'text-ink-tertiary hover:text-ink-primary hover:bg-surface-0/40')
                                    : (isActive ? `${colors.activeBg} ${colors.activeText} shadow-sm` : 'text-gray-500 hover:text-gray-700 hover:bg-white/50')
                            }`}
                        >
                            {tab.icon && <Icon name={tab.icon} size={sizeConfig.icon} className={`flex-shrink-0 ${
                                dark
                                    ? (isActive ? 'text-brand-contrast' : 'text-ink-tertiary')
                                    : (isActive ? colors.activeIcon : 'text-gray-400')
                            }`} />}
                            <span className='truncate' title={tab.label}>{tab.shortLabel ? (<><span className="sm:hidden">{tab.shortLabel}</span><span className="hidden sm:inline">{tab.label}</span></>) : tab.label}{sfx || ''}</span>
                        </button>
                    )
                })}
            </div>
            {hasContent && (
                <div className="flex-1 min-h-0 flex flex-col">
                    {children ?? activeContent}
                </div>
            )}
        </div>
    )
}

export default Tabs
