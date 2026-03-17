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

interface TabsProps {
    tabs: Tab[]
    activeTab?: string
    onChange?: (tabId: string) => void
    onRefresh?: (tabId: string) => void
    storageKey?: string
    children?: ReactNode
    className?: string
    /** 'default' = underline tabs with content, 'pill' = compact dark pill tabs (no content rendering) */
    variant?: 'default' | 'pill'
    /** Optional suffix per tab (e.g. "(3/5)"), shown after the label */
    suffix?: (tabId: string) => string
}

const Tabs = ({
    tabs,
    activeTab: controlledActive,
    onChange,
    onRefresh,
    storageKey,
    children,
    className = '',
    variant = 'default',
    suffix
}: TabsProps) => {
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

    if (variant === 'pill') {
        return (
            <div className={`flex items-center gap-0.5 ${className}`}>
                {tabs.map(tab => {
                    const isActive = activeId === tab.id
                    const sfx = suffix?.(tab.id)
                    return (
                        <div
                            key={tab.id}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer text-xs font-medium transition-all duration-200 select-none ${
                                isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/50 hover:text-white/80 hover:bg-white/10'
                            }`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            {tab.icon && <Icon name={tab.icon} size={12} />}
                            <span>{tab.label}{sfx || ''}</span>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className={className}>
            <div className="flex flex-shrink-0">
                {tabs.map(tab => {
                    const isActive = activeId === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={(e) => { e.stopPropagation(); handleTabClick(tab.id) }}
                            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold py-3 sm:py-4 px-2 sm:px-4 md:px-5 truncate whitespace-nowrap overflow-hidden transition-all duration-200 md:first:rounded-tl-btn md:last:rounded-tr-btn ${isActive
                                ? 'text-theme-700 bg-white'
                                : 'text-gray-300 bg-gray-50 hover:text-gray-400 hover:bg-gray-100'
                                }`}
                        >
                            {tab.icon && <Icon name={tab.icon} size={16} className={`flex-shrink-0 ${isActive ? 'text-theme-500' : 'text-gray-300'}`} />}
                            <span className='truncate'>{tab.shortLabel ? (<><span className="sm:hidden">{tab.shortLabel}</span><span className="hidden sm:inline">{tab.label}</span></>) : tab.label}</span>
                        </button>
                    )
                })}
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
                {children ?? activeContent}
            </div>
        </div>
    )
}

export default Tabs
