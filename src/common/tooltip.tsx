import { createPortal } from 'react-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import Icon from './icon'
import { useClickOutside } from '../hooks/useclickoutside'

type TooltipProps = {
    text: string
}

const Tooltip = ({ text }: TooltipProps) => {
    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState({ top: 0, left: 0 })
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const updatePosition = useCallback(() => {
        if (!btnRef.current) return
        const r = btnRef.current.getBoundingClientRect()
        let top = r.top
        let left = r.right + 8

        const tooltipWidth = 256
        if (left + tooltipWidth > window.innerWidth - 16) {
            left = r.left - tooltipWidth - 8
        }
        if (top + 100 > window.innerHeight - 16) {
            top = window.innerHeight - 116
        }
        top = Math.max(8, top)
        left = Math.max(8, left)
        setPos({ top, left })
    }, [])

    useEffect(() => {
        if (open) {
            updatePosition()
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [open, updatePosition])

    useClickOutside([ref, tooltipRef], () => setOpen(false))

    return (
        <span ref={ref} className='relative inline-block left-1'>
            <button
                ref={btnRef}
                onClick={e => {
                    e.stopPropagation()
                    setOpen(v => !v)
                }}
            >
                <Icon name='CircleQuestionMark' className='size-4 opacity-60 hover:opacity-100 transition-opacity text-gray-700' />
            </button>
            {open && typeof document !== 'undefined' && createPortal(
                <div
                    ref={tooltipRef}
                    className={`
                        fixed z-[9999] p-3 rounded-xl shade-md text-sm max-w-xs break-words
                        bg-theme-800 text-white/90 border border-white/10 backdrop-blur-md
                        transition-all duration-200
                        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}
                    `}
                    style={{ top: pos.top, left: pos.left }}
                >
                    {text}
                </div>,
                document.body
            )}
        </span>
    )
}

export default Tooltip
