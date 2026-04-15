import React from 'react'
import { useIsMobile } from '../hooks'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface DragHereProps {
  size?: Size
}

const sizeConfig = {
  xs: { svg: 60, text: 'text-xs' },
  sm: { svg: 80, text: 'text-sm' },
  md: { svg: 100, text: 'text-base' },
  lg: { svg: 120, text: 'text-lg' },
  xl: { svg: 140, text: 'text-xl' },
}

export default function DragHere({ size = 'lg' }: DragHereProps) {
  const isMobile = useIsMobile()
  const cfg = sizeConfig[size]

  return (
    <>
      <style>{`
        @keyframes drag-arrow-bounce {
          0%, 100% { transform: translateY(-8px); }
          50% { transform: translateY(6px); }
        }
        .drag-arrow-bounce {
          animation: drag-arrow-bounce 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className='absolute inset-0 bg-surface-0/60 backdrop-blur-sm pointer-events-none grid place-items-center z-50'>
        <div className='flex flex-col items-center justify-center gap-3'>
          <svg
            width={cfg.svg}
            height={Math.round(cfg.svg * 0.83)}
            viewBox='0 0 120 100'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='opacity-60'
          >
            {/* Static box */}
            <path d='M20 35 L60 15 L100 35 L60 55 Z' className='fill-surface-3 stroke-ink-tertiary' strokeWidth='1.5' />
            <path d='M20 35 L20 65 L60 85 L60 55 Z' className='fill-surface-2 stroke-ink-tertiary' strokeWidth='1.5' />
            <path d='M100 35 L100 65 L60 85 L60 55 Z' className='fill-surface-2 stroke-ink-tertiary' strokeWidth='1.5' />
            {/* Animated arrow bouncing into box */}
            <g className='drag-arrow-bounce'>
              <path
                d='M60 0 L60 22 M52 14 L60 22 L68 14'
                className='stroke-brand'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </g>
          </svg>

          <p className={`${cfg.text} font-medium text-ink-secondary`}>
            {isMobile ? 'Toca para subir documentos' : 'Arrastre aquí'}
          </p>
        </div>
      </div>
    </>
  )
}
