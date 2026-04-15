import { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks'

const DragHere = () => {
  const isMobile = useIsMobile()
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 3500)
    const hideTimer = setTimeout(() => setVisible(false), 5000)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  const text = isMobile
    ? 'Toca para subir documentos'
    : 'Arrastre aquí los documentos'

  return (
    <div
      className={`
        fixed bottom-4 left-0 right-0 z-20 flex justify-center
        pointer-events-none select-none
        transition-opacity duration-[1500ms] ease-out
        ${fading ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div className='
        px-4 py-2 rounded-full whitespace-nowrap w-fit
        bg-surface-2 border border-edge-subtle/20
        text-ink-secondary text-sm font-medium
      '>
        {text}
      </div>
    </div>
  )
}

export default DragHere
