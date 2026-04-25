

import Icon from './icon'
import type { CardItem } from '../types'

export type { CardItem }

interface Props {
    items: CardItem[]
    selectedId: string | null
    onSelect: (id: string) => void
    /** Set of checked item IDs for multi-select mode */
    checkedIds?: Set<string>
    /** Callback when an item's checkbox is toggled */
    onCheck?: (id: string, checked: boolean) => void
}

const Card = ({ item, isSelected, onClick, checkbox }: { item: CardItem; isSelected: boolean; onClick: () => void; checkbox?: { checked: boolean; onChange: (checked: boolean) => void } }) => (
    <button
        onClick={checkbox ? () => checkbox.onChange(!checkbox.checked) : onClick}
        className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${isSelected
            ? 'bg-surface-2/50 text-ink-primary'
            : 'bg-surface-2/15 text-ink-secondary hover:bg-surface-2/35'
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
                ? <div className={`text-sm font-medium truncate ${isSelected ? 'text-ink-primary' : 'text-ink-secondary group-hover:text-ink-primary'}`}>{item.title}</div>
                : item.title
            }
            {item.subtitle && (
                typeof item.subtitle === 'string'
                    ? <div className='text-xs text-ink-tertiary truncate mt-0.5'>{item.subtitle}</div>
                    : item.subtitle
            )}
        </div>
        {item.right && <div className='flex-shrink-0'>{item.right}</div>}
        {isSelected && !item.right && <div className='flex-shrink-0 h-1.5 w-1.5 rounded-full bg-brand' />}
    </button>
)

export default function CardList({ items, selectedId, onSelect, checkedIds, onCheck }: Props) {
    if (!Array.isArray(items) || items.length === 0) return null

    const getCheckbox = (id: string) =>
        checkedIds && onCheck
            ? { checked: checkedIds.has(id), onChange: (checked: boolean) => onCheck(id, checked) }
            : undefined

    return (
        <div className='flex flex-col gap-1 px-3 py-2'>
            {items.map((item, i) => (
                <div
                    key={item.id}
                    className='animate-fade-in'
                    style={i < 8 ? { animationDelay: `${i * 40}ms` } : undefined}
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
