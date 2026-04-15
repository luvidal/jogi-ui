import { useMemo } from 'react'
import Icon from './icon'
import { useIsMobile } from '../hooks/device'

type ModalSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'

interface Props {
  title?: string
  icon?: string
  children?: React.ReactNode
  onClose: () => void
  size?: ModalSize
  headerActions?: React.ReactNode
}

const SIZE_CONFIG: Record<ModalSize, { w: number, h: number, maxW: number, maxH: number }> = {
  xl: { w: 1200, h: 900, maxW: 95, maxH: 90 },
  lg: { w: 960, h: 800, maxW: 92, maxH: 88 },
  md: { w: 720, h: 720, maxW: 90, maxH: 85 },
  sm: { w: 560, h: 600, maxW: 88, maxH: 82 },
  xs: { w: 400, h: 500, maxW: 85, maxH: 80 }
}

const Modal = ({ title, icon, children, onClose, size: sizeProp = 'md', headerActions }: Props) => {
  const mobile = useIsMobile()
  const sizeConfig = SIZE_CONFIG[sizeProp]

  const effectiveSize = useMemo(() => {
    if (mobile || typeof window === 'undefined') return null
    const maxW = Math.floor(window.innerWidth * sizeConfig.maxW / 100)
    const maxH = Math.floor(window.innerHeight * sizeConfig.maxH / 100)
    return {
      w: Math.min(sizeConfig.w, maxW),
      h: Math.min(sizeConfig.h, maxH)
    }
  }, [mobile, sizeConfig])

  return (
    <div className='fixed z-[9999] inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300'>
      <div
        className={`relative flex flex-col overflow-hidden shadow-2xl bg-theme-700 border border-theme-600 ${mobile ? 'w-full h-full rounded-none' : 'rounded-xl'}`}
        style={mobile ? {} : {
          width: `${effectiveSize!.w}px`,
          height: `${effectiveSize!.h}px`,
        }}
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className='flex items-center justify-between text-white text-sm px-3 py-2 select-none'>
          <div className='flex items-center'>
            <Icon name={icon ?? 'AppWindow'} size={16} className='me-2 opacity-80' />
            <span className='opacity-90'>{title ?? ' '}</span>
          </div>
          <div className='flex items-center gap-1 select-none'>
            {headerActions}
            <div className='cursor-pointer hover:bg-white/20 p-1.5 rounded' onClick={onClose} title='Cerrar Ventana'>
              <Icon name='X' size={16} className='text-white' />
            </div>
          </div>
        </div>
        <div className='flex-1 overflow-hidden bg-surface-4'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
