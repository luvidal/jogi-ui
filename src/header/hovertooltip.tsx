import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { RefObject } from 'react'

const HoverTooltip = ({ label, btnRef }: { label: string; btnRef: RefObject<HTMLButtonElement | null> }) => {
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

    useEffect(() => {
        const el = btnRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        setPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 })
    }, [btnRef])

    if (!pos) return null

    return createPortal(
        <span
            className='fixed pointer-events-none z-50 px-2 py-0.5 rounded text-[11px] whitespace-nowrap bg-gray-900 text-white shadow-lg -translate-x-1/2'
            style={{ top: pos.top, left: pos.left }}
        >
            {label}
        </span>,
        document.body
    )
}

export default HoverTooltip
