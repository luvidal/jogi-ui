import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

export interface SortOption {
  value: string
  label: string
}

export interface UseRecordsOptions {
  endpoint: string
  sortList: SortOption[]
  /** Function to fetch data — receives endpoint + payload, returns data array */
  fetchFn: (endpoint: string, payload: Record<string, any>) => Promise<any>
  /** Error handler for failed fetches */
  onError?: (error: unknown, context: { module: string; action: string }) => void
  /** Function to extract ID from a record (default: item.id) */
  getId?: (item: any) => string
  staticParams?: Record<string, any>
  filterId?: string
  limit?: number
  initialState?: {
    page?: number
    search?: string
    sortBy?: string
    sortDir?: 'asc' | 'desc'
  }
}

export interface RefreshActions<T> {
  fetch: () => void
  patch: (id: string, changes: Partial<T>) => void
  remove: (id: string) => void
}

export interface UseRecordsReturn<T> {
  data: T[]
  loading: boolean
  hasNext: boolean
  refresh: RefreshActions<T>
  // Pagination
  page: number
  setPage: (p: number) => void
  // Search
  search: string
  setSearch: (s: string) => void
  // Sorting
  sortBy: string
  setSortBy: (s: string) => void
  thenBy: string
  setThenBy: (s: string) => void
  sortDir: 'asc' | 'desc'
  setSortDir: (d: 'asc' | 'desc') => void
  thenDir: 'asc' | 'desc'
  setThenDir: (d: 'asc' | 'desc') => void
  sortList: SortOption[]
}

const defaultGetId = (item: any): string => item?.id ?? ''

export function useRecords<T = any>({
  endpoint,
  sortList,
  fetchFn,
  onError,
  getId = defaultGetId,
  staticParams,
  filterId,
  limit = 10,
  initialState,
}: UseRecordsOptions): UseRecordsReturn<T> {
  const [raw, setRaw] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(initialState?.page ?? 0)
  const [search, setSearch] = useState(initialState?.search ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(initialState?.search ?? '')
  const [sortBy, setSortBy] = useState(initialState?.sortBy || (sortList[0]?.value ?? ''))
  const [thenBy, setThenBy] = useState(sortList[1]?.value ?? '')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(initialState?.sortDir ?? 'desc')
  const [thenDir, setThenDir] = useState<'asc' | 'desc'>('desc')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const staticParamsKey = useMemo(() => JSON.stringify(staticParams ?? {}), [staticParams])

  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setLoading(true)
    try {
      const params = JSON.parse(staticParamsKey)
      const payload = filterId
        ? { filterId, ...params }
        : { search: debouncedSearch, offset: page * limit, limit: limit + 1, sortBy, thenBy, sortDir, thenDir, ...params }
      const data = await fetchFn(endpoint, payload)
      setRaw(Array.isArray(data) ? data : [])
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      onError?.(err, { module: 'userecords', action: 'fetch' })
      setRaw([])
    } finally {
      setLoading(false)
    }
  }, [endpoint, filterId, debouncedSearch, page, sortBy, thenBy, sortDir, thenDir, limit, staticParamsKey, fetchFn, onError])

  useEffect(() => {
    fetchData()
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData])

  const matchId = useCallback(
    (h: any, id: string) => getId(h) === id,
    [getId]
  )

  const patchRaw = useCallback((id: string, changes: Partial<T>) => {
    setRaw(prev => {
      if (!Array.isArray(prev)) return prev
      const isGrouped = Array.isArray(prev[0])

      if (isGrouped) {
        return (prev as any[]).map((group: any[]) =>
          group.map(h => matchId(h, id) ? { ...h, ...changes } : h)
        ) as T[]
      }
      return prev.map(h => matchId(h, id) ? { ...h, ...changes } : h)
    })
  }, [matchId])

  const removeRaw = useCallback((id: string) => {
    setRaw(prev =>
      Array.isArray(prev[0])
        ? (prev as any[])
            .filter((group: any[]) => !matchId(group[0], id))
            .map((group: any[]) => group.filter(h => !matchId(h, id)))
            .filter(g => g.length > 0) as T[]
        : prev.filter(h => !matchId(h, id))
    )
  }, [matchId])

  const refresh: RefreshActions<T> = useMemo(() => ({
    fetch: fetchData,
    patch: patchRaw,
    remove: removeRaw,
  }), [fetchData, patchRaw, removeRaw])

  const data = useMemo(() => Array.isArray(raw) ? raw.slice(0, limit) : [], [raw, limit])
  const hasNext = raw.length > limit

  return {
    data,
    loading,
    hasNext,
    refresh,
    page,
    setPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    thenBy,
    setThenBy,
    sortDir,
    setSortDir,
    thenDir,
    setThenDir,
    sortList,
  }
}
