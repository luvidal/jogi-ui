

import { ReactNode } from 'react'
import Icon from './icon'
import type { CardItem } from '../types'

export type { CardItem }

interface Props {
    items: CardItem[]
    selectedId: string | null
    onSelect: (id: string) => void
    compact?: boolean
    /** Set of checked item IDs for multi-select mode */
    checkedIds?: Set<string>
    /** Callback when an item's checkbox is toggled */
    onCheck?: (id: string, checked: boolean) => void
}

/** Regular card for list/grid display */
const Card = ({ item, isSelected, onClick, checkbox }: { item: CardItem; isSelected: boolean; onClick: () => void; checkbox?: { checked: boolean; onChange: (checked: boolean) => void } }) => (
    <div
        onClick={checkbox ? () => checkbox.onChange(!checkbox.checked) : onClick}
        className={`
            group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer
            transition-all duration-200 ease-out bg-white
            shadow-md hover:shadow-lg active:scale-[0.99]
            ${isSelected ? 'ring-2 ring-theme-500' : ''}
        `}
    >
        {checkbox ? (
            <div className='flex-shrink-0 flex items-center' onClick={e => { e.stopPropagation(); checkbox.onChange(!checkbox.checked) }}>
                <Icon
                    name={checkbox.checked ? 'SquareCheckBig' : 'Square'}
                    size={18}
                    className={`cursor-pointer transition-colors ${checkbox.checked ? 'text-theme-500' : 'text-gray-300'}`}
                />
            </div>
        ) : item.icon ? (
            <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-theme-100 flex-shrink-0'>
                {typeof item.icon === 'string'
                    ? <Icon name={item.icon} size={24} className='text-theme-600' />
                    : item.icon
                }
            </div>
        ) : null}
        <div className='flex-1 min-w-0 flex flex-col items-start'>
            {typeof item.title === 'string'
                ? <span className='text-sm font-semibold text-gray-800 truncate max-w-full'>{item.title}</span>
                : item.title
            }
            {item.subtitle && (
                typeof item.subtitle === 'string'
                    ? <span className='mt-0.5 text-xs text-theme-500 truncate max-w-full'>{item.subtitle}</span>
                    : item.subtitle
            )}
        </div>
        {item.right && <div className='flex-shrink-0'>{item.right}</div>}
    </div>
)

/** Compact card for sidebar display on dark background */
const CardCompact = ({ item, isSelected, onClick, checkbox }: { item: CardItem; isSelected: boolean; onClick: () => void; checkbox?: { checked: boolean; onChange: (checked: boolean) => void } }) => (
    <button
        onClick={checkbox ? () => checkbox.onChange(!checkbox.checked) : onClick}
        className={`w-full relative flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${isSelected
            ? 'bg-surface-2/60'
            : 'hover:bg-surface-2/30'
        }`}
    >
        {checkbox ? (
            <div className='flex-shrink-0 flex items-center' onClick={e => { e.stopPropagation(); checkbox.onChange(!checkbox.checked) }}>
                <Icon
                    name={checkbox.checked ? 'SquareCheckBig' : 'Square'}
                    size={18}
                    className={`cursor-pointer transition-colors ${checkbox.checked ? 'text-brand' : 'text-ink-tertiary'}`}
                />
            </div>
        ) : item.icon ? (
            typeof item.icon === 'string'
                ? <div className='flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-surface-2'>
                    <Icon name={item.icon} size={18} className={isSelected ? 'text-brand' : 'text-ink-tertiary'} />
                </div>
                : <div className='flex-shrink-0'>{item.icon}</div>
        ) : null}
        <div className='flex-1 min-w-0'>
            {typeof item.title === 'string'
                ? <div className={`text-sm font-medium truncate ${isSelected ? 'text-ink-primary' : 'text-ink-secondary'}`}>{item.title}</div>
                : item.title
            }
            {item.subtitle && (
                typeof item.subtitle === 'string'
                    ? <div className='text-xs text-ink-tertiary truncate'>{item.subtitle}</div>
                    : item.subtitle
            )}
        </div>
        {item.right && <div className='flex-shrink-0'>{item.right}</div>}
        {isSelected && !checkbox && <div className='absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand rounded-l-full' />}
    </button>
)

export default function CardList({ items, selectedId, onSelect, compact, checkedIds, onCheck }: Props) {
    if (!Array.isArray(items) || items.length === 0) return null

    const getCheckbox = (id: string) =>
        checkedIds && onCheck
            ? { checked: checkedIds.has(id), onChange: (checked: boolean) => onCheck(id, checked) }
            : undefined

    if (compact) {
        return (
            <div className='flex flex-col py-1'>
                {items.map((item, i) => (
                    <div
                        key={item.id}
                        className='animate-fade-in'
                        style={i < 8 ? { animationDelay: `${i * 40}ms` } : undefined}
                    >
                        <CardCompact
                            item={item}
                            isSelected={selectedId === item.id}
                            onClick={() => onSelect(item.id)}
                            checkbox={getCheckbox(item.id)}
                        />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='grid p-1.5 sm:p-2.5'>
            {items.map((item, i) => (
                <div
                    key={item.id}
                    className='p-1.5 animate-fade-in-up'
                    style={i < 8 ? { animationDelay: `${i * 50}ms` } : undefined}
                >
                    <Card
                        item={item}
                        isSelected={selectedId === item.id}
                        onClick={() => onSelect(item.id)}
                        checkbox={getCheckbox(item.id)}
                    />
                </div>
            ))}
        </div>
    )
}
