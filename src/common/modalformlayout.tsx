interface Props {
  footer: React.ReactNode
  className?: string
  children: React.ReactNode
}

const ModalFormLayout = ({ footer, className = '', children }: Props) => (
  <div className={`flex flex-col h-full ${className}`}>
    <div className="flex-1 min-h-0 overflow-y-auto">
      {children}
    </div>
    <div className="shrink-0">
      {footer}
    </div>
  </div>
)

export default ModalFormLayout
