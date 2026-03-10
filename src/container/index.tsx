import React from 'react'
import Icon from '../common/icon'

export { default as Scroll } from './scroll'

interface ContainerProps {
  title?: string
  icon?: string
  children: React.ReactNode
}

const Container = ({ title, icon, children }: ContainerProps) => {
  const horizontalr = 'gap-2 sm:gap-4 px-4 sm:px-5 md:px-6'
  const verticalr = 'py-2 short:py-3 mid:py-3 tall:py-4 xtall:py-5'

  return (
    <div className='flex flex-col h-full shadow-2xl lg:rounded-xl overflow-hidden'>
      <header className={`flex flex-col text-lg sm:text-xl ${horizontalr} ${verticalr} flex-shrink-0 bg-gradient-to-r from-theme-700 to-theme-600`}>
        <div className='group/header flex items-center gap-4 sm:gap-8'>
          <span className='flex items-center gap-3 whitespace-nowrap text-theme-100'>
            {icon && (
              <Icon name={icon} className='hidden sm:inline-block size-[20px] md:size-[22px] lg:size-[24px] text-theme-100 icon-shadow-md' />
            )}
            <span className='text-xl md:text-2xl font-bold uppercase tracking-wide text-theme-100 text-shadow-md'>
              {title}
            </span>
          </span>
        </div>
      </header>
      <div className='flex-1 min-h-0 flex flex-col bg-white'>
        {children}
      </div>
    </div>
  )
}

export default Container
