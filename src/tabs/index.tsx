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
    /** Optional suffix per tab (e.g. "(3/5)"), shown after the label */
    suffix?: (tabId: string) => string
    /** Dark mode for use on dark backgrounds (e.g. modal headers) */
    dark?: boolean
}

const Tabs = ({
    tabs,
    activeTab: controlledActive,
    onChange,
    onRefresh,
    storageKey,
    children,
    className = '',
    suffix,
    dark = false
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

    const hasContent = children !== undefined || activeContent !== undefined

    return (
        <div className={className}>
            <div className={`flex p-1 rounded-xl flex-shrink-0 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
                {tabs.map(tab => {
                    const isActive = activeId === tab.id
                    const sfx = suffix?.(tab.id)
                    return (
                        <button
                            key={tab.id}
                            onClick={(e) => { e.stopPropagation(); handleTabClick(tab.id) }}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none truncate whitespace-nowrap overflow-hidden ${
                                dark
                                    ? (isActive ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/10')
                                    : (isActive ? 'bg-white text-theme-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50')
                            }`}
                        >
                            {tab.icon && <Icon name={tab.icon} size={16} className={`flex-shrink-0 ${
                                dark
                                    ? (isActive ? 'text-white' : 'text-white/50')
                                    : (isActive ? 'text-theme-500' : 'text-gray-400')
                            }`} />}
                            <span className='truncate'>{tab.shortLabel ? (<><span className="sm:hidden">{tab.shortLabel}</span><span className="hidden sm:inline">{tab.label}</span></>) : tab.label}{sfx || ''}</span>
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
