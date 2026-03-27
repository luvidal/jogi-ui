import { colClass } from './colclass'

interface Props {
    className?: string
}

/** Shimmer placeholder block for loading states. Uses theme-colored sweep animation. */
const Skeleton = ({ className = '' }: Props) => (
    <div className={`animate-shimmer rounded ${className}`} />
)

/** Skeleton matching CardListItem layout (icon + title + subtitle) */
Skeleton.Card = function SkeletonCard({ variant = 'light', compact = false }: { variant?: 'light' | 'dark'; compact?: boolean }) {
    const isLight = variant === 'light'
    const shimmer = isLight ? 'animate-shimmer' : 'animate-shimmer-dark'

    if (compact) {
        // Matches CardCompact: px-4 py-3.5, 28px ring, title + subtitle
        return (
            <div className="flex items-center gap-3 px-4 py-3.5">
                <div className={`${shimmer} rounded-full w-7 h-7 flex-shrink-0`} />
                <div className='flex-1 min-w-0 space-y-1.5'>
                    <div className={`${shimmer} rounded h-3.5 w-3/4`} />
                    <div className={`${shimmer} rounded h-2.5 w-1/2`} />
                </div>
            </div>
        )
    }

    const wrapper = isLight ? 'p-3 rounded-2xl bg-white shadow-sm' : 'px-3 py-2.5'
    return (
        <div className={`flex gap-3 ${wrapper}`}>
            <div className={`${shimmer} rounded-full w-10 h-10 flex-shrink-0`} />
            <div className='flex-1 min-w-0 space-y-2 py-0.5'>
                <div className={`${shimmer} rounded h-4 w-3/4`} />
                <div className={`${shimmer} rounded h-3 w-1/2`} />
            </div>
        </div>
    )
}

/** Multiple skeleton cards for list loading states */
Skeleton.List = function SkeletonList({
    count = 5,
    variant = 'light',
    compact = false,
    className = ''
}: {
    count?: number
    variant?: 'light' | 'dark'
    compact?: boolean
    className?: string
}) {
    const gap = compact ? 'gap-0' : variant === 'light' ? 'gap-2 p-2' : 'gap-0.5'

    return (
        <div className={`flex flex-col ${gap} ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} style={{ animationDelay: `${i * 80}ms` }} className="animate-fade-in">
                    <Skeleton.Card variant={variant} compact={compact} />
                </div>
            ))}
        </div>
    )
}

/** Skeleton for file grid items */
Skeleton.FileGrid = function SkeletonFileGrid({ count = 8 }: { count?: number }) {
    return (
        <div className="flex flex-wrap gap-4 p-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="w-28 space-y-2">
                        <div className="animate-shimmer rounded-xl w-28 h-28" />
                        <div className="animate-shimmer rounded h-3 w-20 mx-auto" />
                    </div>
                </div>
            ))}
        </div>
    )
}

/** Skeleton matching CardDoc layout (200x180 card with icon, title, slots) */
Skeleton.DocGrid = function SkeletonDocGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="flex flex-wrap gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                    <div
                        style={{ width: 200, height: 180 }}
                        className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-md p-3"
                    >
                        {/* Icon + status badge row */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="animate-shimmer rounded-xl w-10 h-10" />
                            <div className="animate-shimmer rounded-full w-14 h-4" />
                        </div>
                        {/* Title */}
                        <div className="animate-shimmer rounded h-3.5 w-4/5 mb-1.5" />
                        {/* Subtitle */}
                        <div className="animate-shimmer rounded h-2.5 w-3/5" />
                        {/* Slot pills */}
                        <div className="mt-auto pt-2 flex gap-1 justify-center">
                            <div className="animate-shimmer rounded w-10 h-4" />
                            <div className="animate-shimmer rounded w-10 h-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

/** Skeleton matching StatCard layout (label + big number + subtitle + icon bg) */
Skeleton.StatCard = function SkeletonStatCard() {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="animate-shimmer rounded h-3.5 w-24" />
                    <div className="animate-shimmer rounded h-8 w-16" />
                    <div className="animate-shimmer rounded h-2.5 w-20" />
                </div>
                <div className="animate-shimmer rounded-xl w-12 h-12" />
            </div>
        </div>
    )
}

/** Row of StatCard skeletons matching Metrics grid (2×2 on mobile, 4 on desktop) */
Skeleton.StatRow = function SkeletonStatRow({ className = '' }: { className?: string }) {
    return (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <Skeleton.StatCard />
                </div>
            ))}
        </div>
    )
}

/** Skeleton matching Card dashboard tiles (h-96 with title + subtitle + content) */
Skeleton.DashCard = function SkeletonDashCard({ colSpan = 6 }: { colSpan?: number }) {
    return (
        <div className={`flex flex-col h-96 bg-white shadow-lg rounded-2xl p-6 ${colClass(colSpan)}`}>
            <div className="flex-shrink-0 mb-4 space-y-2">
                <div className="animate-shimmer rounded h-5 w-40" />
                <div className="animate-shimmer rounded h-4 w-28" />
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="animate-shimmer rounded-xl w-3/4 h-3/4" />
            </div>
        </div>
    )
}

/** Skeleton matching modal form layouts (label + input rows) */
Skeleton.Form = function SkeletonForm({ rows = 4 }: { rows?: number }) {
    return (
        <div className="flex flex-col gap-4 flex-1">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="animate-fade-in space-y-1.5" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="animate-shimmer rounded h-3.5 w-20" />
                    <div className="animate-shimmer rounded-xl h-12 w-full" />
                </div>
            ))}
        </div>
    )
}

/** Skeleton matching Activity modal layout (login card + stats + list) */
Skeleton.Activity = function SkeletonActivity() {
    return (
        <div className="flex flex-col gap-6 flex-1 animate-fade-in">
            {/* Login card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="animate-shimmer rounded-full w-10 h-10 flex-shrink-0" />
                    <div className="space-y-1.5 flex-1">
                        <div className="animate-shimmer rounded h-3.5 w-24" />
                        <div className="animate-shimmer rounded h-2.5 w-16" />
                    </div>
                </div>
                <div className="animate-shimmer rounded h-3.5 w-48" />
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
                {[0, 1].map(i => (
                    <div key={i} className="animate-fade-in rounded-xl p-4 bg-gray-50 text-center space-y-2" style={{ animationDelay: `${(i + 1) * 80}ms` }}>
                        <div className="animate-shimmer rounded h-8 w-12 mx-auto" />
                        <div className="animate-shimmer rounded h-2.5 w-20 mx-auto" />
                    </div>
                ))}
            </div>
            {/* Uploads list */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="animate-shimmer rounded h-3.5 w-32 mb-3" />
                <div className="space-y-3">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="animate-fade-in flex items-start gap-3" style={{ animationDelay: `${(i + 3) * 80}ms` }}>
                            <div className="animate-shimmer rounded w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="animate-shimmer rounded h-3.5 w-3/4" />
                                <div className="animate-shimmer rounded h-2.5 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/** Skeleton matching a file preview area (large centered rectangle) */
Skeleton.Preview = function SkeletonPreview() {
    return (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
            <div className="animate-shimmer rounded-xl w-3/4 h-3/4" />
        </div>
    )
}

/** Skeleton matching a key-value table layout */
Skeleton.Table = function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="w-full rounded-xl border border-gray-200 overflow-hidden">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="animate-fade-in flex border-b border-gray-100 last:border-0" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="w-1/3 px-3 py-3">
                        <div className="animate-shimmer rounded h-3 w-16" />
                    </div>
                    <div className="w-2/3 px-3 py-3">
                        <div className="animate-shimmer rounded h-3 w-32" />
                    </div>
                </div>
            ))}
        </div>
    )
}

/** Skeleton matching Welcome banner (gradient bar with greeting) */
Skeleton.Welcome = function SkeletonWelcome({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-theme-grad rounded-2xl p-6 min-h-[80px] flex items-center ${className}`}>
            <div className="animate-shimmer-dark rounded h-6 w-48" />
        </div>
    )
}

export default Skeleton
