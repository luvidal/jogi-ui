import { useState, useEffect, useRef, useLayoutEffect, ReactNode } from 'react'
import Icon from '../common/icon'

export interface Tab {
    id: string
    label: string
    icon?: string
}

export type { Tab as TabType }
export type TabSize = 'xs' | 'sm' | 'md'

const SIZE_CONFIG: Record<TabSize, { button: string; icon: number }> = {
    xs: { button: 'px-2 py-1.5 text-xs gap-1',   icon: 14 },
    sm: { button: 'px-3 py-2 text-xs gap-1.5',    icon: 16 },
    md: { button: 'px-4 py-2.5 text-sm gap-1.5',  icon: 18 },
}

function buildTabsKey(tabs: Tab[], storageKey?: string): string | undefined {
    if (storageKey) return storageKey
    return `jogi_tabs_${tabs.map(t => t.id).join(',')}`
}

interface TabsProps {
    tabs: Tab[]
    activeTab?: string
    onChange?: (tabId: string) => void
    onRefresh?: (tabId: string) => void
    storageKey?: string
    children?: ReactNode
    className?: string
    suffix?: (tabId: string) => string | undefined
    dark?: boolean
    size?: TabSize
}

const Tabs = ({
    tabs,
    activeTab: controlledActive,
    onChange,
    onRefresh,
    storageKey: explicitStorageKey,
    children,
    className = '',
    suffix,
    dark = true,
    size = 'sm'
}: TabsProps) => {
    const storageKey = buildTabsKey(tabs, explicitStorageKey)

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

    if (tabs.length === 0) return null

    const hasContent = children !== undefined
    const sizeConfig = SIZE_CONFIG[size]

    return (
        <div className={className}>
            {/* Track — left-aligned, transparent, no stretch */}
            <div className="flex w-fit gap-1.5 flex-shrink-0 mx-6 my-2.5">
                {tabs.map(tab => {
                    const isActive = activeId === tab.id
                    const sfx = suffix?.(tab.id)
                    return (
                        <button
                            key={tab.id}
                            onClick={(e) => { e.stopPropagation(); handleTabClick(tab.id) }}
                            className={[
                                'flex items-center justify-center min-w-[7.5rem] rounded-lg',
                                'font-semibold transition-all duration-200 cursor-pointer select-none',
                                'truncate whitespace-nowrap overflow-hidden',
                                sizeConfig.button,
                                dark
                                    ? (isActive
                                        ? 'bg-brand text-brand-contrast shadow-sm border border-transparent'
                                        : 'text-ink-tertiary hover:text-ink-primary border border-edge-subtle/15')
                                    : (isActive
                                        ? 'bg-white text-theme-700 shadow-sm border border-transparent'
                                        : 'text-gray-500 hover:text-gray-700 border border-gray-200'),
                            ].join(' ')}
                        >
                            {tab.icon && (
                                <Icon name={tab.icon} size={sizeConfig.icon} className={`flex-shrink-0 ${
                                    dark
                                        ? (isActive ? 'text-brand-contrast' : 'text-ink-tertiary')
                                        : (isActive ? 'text-theme-500' : 'text-gray-400')
                                }`} />
                            )}
                            <span className='truncate' title={tab.label}>
                                {tab.label}{sfx || ''}
                            </span>
                        </button>
                    )
                })}
            </div>
            {hasContent && (
                <div className="flex-1 min-h-0 flex flex-col">
                    {children}
                </div>
            )}
        </div>
    )
}

export default Tabs
