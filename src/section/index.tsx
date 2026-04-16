import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Icon from '../common/icon'
import SectionIcon from '../common/sectionicon'
import type { Section } from '../types'

export type { Section }

const DEFAULT_COLORS = { bg: 'bg-gray-50', text: 'text-gray-700', iconBg: 'bg-gray-100' }

function buildAccordionKey(sections: Section[], storageKey?: string): string {
    if (storageKey) return storageKey
    const ids = sections.map(s => s.id).join(',')
    return `jogi_accordion_${ids}`
}

interface AccordionProps {
    /** Array of sections to render */
    sections: Section[]
    /** Force all sections expanded (useful for PDF generation) */
    forceExpanded?: boolean
    /** Persist open section in localStorage. Default true. */
    rememberOpen?: boolean
    /** Explicit localStorage key. Auto-generated from section IDs if omitted. */
    storageKey?: string
    /** Called when the open section changes (including on mount restore) */
    onChange?: (sectionId: string | null) => void
}

/**
 * DIRECTIVE: Internal state memory — Accordion MUST remember the open section
 * across unmounts via localStorage (when rememberOpen is true, default).
 * On mount, the stored section is restored internally. If onChange is provided,
 * it is notified of the restored value before first paint.
 * This behavior is a contract — do NOT remove or weaken it.
 *
 * Colors are provided per section via `section.colors`. Falls back to neutral gray.
 * Only one section can be open at a time (mutual exclusivity).
 */
const Accordion = ({ sections, forceExpanded = false, rememberOpen = true, storageKey, onChange }: AccordionProps) => {
    const key = rememberOpen ? buildAccordionKey(sections, storageKey) : null
    const storedOnMountRef = useRef<string | null | undefined>(undefined)

    const [openId, setOpenId] = useState<string | null>(() => {
        if (key) {
            try {
                const stored = localStorage.getItem(key)
                if (stored === '__closed__') { storedOnMountRef.current = null; return null }
                if (stored && sections.some(s => s.id === stored)) { storedOnMountRef.current = stored; return stored }
            } catch {}
        }
        const first = sections[0]?.id ?? null
        storedOnMountRef.current = first
        return first
    })

    // Notify parent of initial open section before first paint
    useLayoutEffect(() => {
        if (storedOnMountRef.current !== undefined && onChange) {
            onChange(storedOnMountRef.current)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!key) return
        try { localStorage.setItem(key, openId ?? '__closed__') } catch {}
    }, [openId, key])

    const handleToggle = (sectionId: string) => {
        if (forceExpanded) return
        setOpenId(prev => {
            const next = prev === sectionId ? null : sectionId
            onChange?.(next)
            return next
        })
    }

    return (
        <div className='rounded-xl overflow-hidden border border-slate-700 flex-1 flex flex-col min-h-0'>
            {sections.map(section => {
                const colors = section.colors ?? DEFAULT_COLORS
                const isExpanded = forceExpanded || openId === section.id
                const contentId = `section-content-${section.id}`

                return (
                    <div key={section.id} className={`border-b border-slate-700 last:border-b-0 flex flex-col ${isExpanded ? 'flex-1 min-h-0' : ''}`}>
                        <button
                            onClick={() => handleToggle(section.id)}
                            aria-expanded={isExpanded}
                            aria-controls={contentId}
                            className={`w-full flex items-center gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-4 sm:py-2.5 flex-shrink-0 ${colors.bg} hover:brightness-95 transition-all ${forceExpanded ? 'cursor-default' : ''}`}
                        >
                            <SectionIcon colors={colors} icon={section.icon} size={14} containerSize='sm' />
                            <div className='flex-1 min-w-0 text-left flex items-baseline gap-1.5'>
                                <div className={`font-semibold text-sm truncate ${colors.text}`}>
                                    {section.number ? `${section.number}. ${section.title}` : section.title}
                                </div>
                                {section.subtitle && (
                                    <div className='text-[10px] text-gray-400 shrink-0'>{section.subtitle}</div>
                                )}
                            </div>
                            {!forceExpanded && (
                                <Icon
                                    name='ChevronDown'
                                    size={16}
                                    className={`${colors.text} transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                />
                            )}
                        </button>
                        <div
                            id={contentId}
                            role='region'
                            className={`${section.contentClassName ?? 'p-2.5 sm:p-4 bg-gray-50/30'} ${isExpanded ? 'flex-1 min-h-0 overflow-y-auto' : 'hidden print:block'}`}
                        >
                            {section.content}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Accordion
