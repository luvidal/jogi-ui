import Icon from './common/icon'

interface PillTagProps {
    children: React.ReactNode
    grip?: boolean
}

const PillTag = ({ children, grip }: PillTagProps) => (
    <div className='inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-white border border-gray-200 text-gray-700'>
        {grip && <Icon name='GripVertical' size={12} className='text-gray-400' />}
        <span className='truncate'>{children}</span>
    </div>
)

export default PillTag
