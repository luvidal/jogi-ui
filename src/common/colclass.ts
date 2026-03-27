const colSpanMap: Record<number, string> = {
    12: 'sm:col-span-12 md:col-span-12 lg:col-span-12',
    8: 'sm:col-span-12 md:col-span-8 lg:col-span-8',
    6: 'sm:col-span-12 md:col-span-6 lg:col-span-6',
    4: 'sm:col-span-6 md:col-span-6 lg:col-span-4',
    3: 'sm:col-span-6 md:col-span-4 lg:col-span-3',
}

const defaultCol = 'sm:col-span-12 md:col-span-6 lg:col-span-6'

export const colClass = (span: number) => colSpanMap[span] || defaultCol
