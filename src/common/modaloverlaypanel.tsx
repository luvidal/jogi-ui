interface Props {
  open: boolean
  width?: string
  className?: string
  children: React.ReactNode
}

const ModalOverlayPanel = ({ open, width = 'w-72', className = '', children }: Props) => {
  if (!open) return null
  return (
    <div className={`absolute right-0 top-0 bottom-0 ${width} bg-white border-l border-gray-200 shadow-lg overflow-y-auto z-20 px-3 pt-14 pb-3 ${className}`}>
      {children}
    </div>
  )
}

export default ModalOverlayPanel
