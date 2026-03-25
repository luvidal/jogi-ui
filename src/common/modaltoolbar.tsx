interface ToolbarProps {
  position?: 'left' | 'right'
  offset?: string
  variant?: 'transparent' | 'dark'
  className?: string
  children: React.ReactNode
}

const base = 'absolute z-20 flex items-center gap-0.5 px-1 py-1 rounded-xl transition-all'

const ModalToolbar = ({ position = 'left', offset, variant = 'transparent', className = '', children }: ToolbarProps) => {
  const pos = position === 'left' ? 'left-3' : 'right-3'
  const top = offset || 'top-3'
  const bg = variant === 'dark' ? 'bg-[#3d3d3d]' : 'bg-black/50 backdrop-blur-sm'
  return (
    <div className={`${base} ${pos} ${top} ${bg} ${className}`}>
      {children}
    </div>
  )
}

const Group = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center gap-0.5 ${className}`}>{children}</div>
)

const Divider = () => <div className="w-px h-4 bg-white/20 mx-0.5" />

ModalToolbar.Group = Group
ModalToolbar.Divider = Divider

export default ModalToolbar
