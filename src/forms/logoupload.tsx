import { useState, useRef, useEffect } from 'react'
import FieldWrapper from './fieldwrapper'

interface Props {
  label?: string
  value?: string | null
  onChange?: (url: string | null) => void
  onUpload?: (file: File) => Promise<string>
  className?: string
  visible?: boolean
  maxFileSizeMB?: number
  compressedSizeMB?: number
  compressedMaxDim?: number
}

const DEFAULT_COMPRESS_OPTS = { maxSizeMB: 0.5, maxWidthOrHeight: 400 }

const LogoUpload = ({
  label,
  value,
  onChange,
  onUpload,
  className = '',
  visible = true,
  maxFileSizeMB = 5,
  compressedSizeMB = DEFAULT_COMPRESS_OPTS.maxSizeMB,
  compressedMaxDim = DEFAULT_COMPRESS_OPTS.maxWidthOrHeight,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setImgError(false)
  }, [value])

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
  }

  const compress = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) return file
    try {
      const mod = await import('browser-image-compression')
      const compress = mod.default || (mod as unknown as typeof import('browser-image-compression').default)
      const compressed = await compress(file, {
        maxSizeMB: compressedSizeMB,
        maxWidthOrHeight: compressedMaxDim,
        useWebWorker: true,
      })
      return new File([compressed], file.name, { type: compressed.type })
    } catch {
      // browser-image-compression is an optional peer dep; fall back to the raw file.
      return file
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes')
      return
    }

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`El archivo es muy grande (máx. ${maxFileSizeMB}MB)`)
      return
    }

    setError(null)
    setLoading(true)

    try {
      const compressed = await compress(file)

      if (onUpload) {
        const url = await onUpload(compressed)
        onChange?.(url)
      } else {
        const reader = new FileReader()
        reader.onload = () => {
          onChange?.(reader.result as string)
        }
        reader.readAsDataURL(compressed)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al procesar imagen'
      setError(message)
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <FieldWrapper label={label} className={className} visible={visible}>
      <div
        onClick={handleClick}
        className='relative w-48 h-32 rounded-xl border-2 border-dashed border-edge-subtle/30 bg-surface-1 cursor-pointer transition-all hover:border-edge-subtle/40 hover:bg-surface-2 flex items-center justify-center overflow-hidden'
      >
        {loading ? (
          <svg
            className='w-8 h-8 text-ink-tertiary animate-spin'
            fill='none'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
            />
          </svg>
        ) : value && !imgError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt='Logo'
              className='max-w-full max-h-full object-contain p-2'
              onError={() => setImgError(true)}
            />
            <button
              type='button'
              onClick={handleRemove}
              className='absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors'
              aria-label='Eliminar logo'
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='w-4 h-4'>
                <path d='M18 6 6 18' /><path d='m6 6 12 12' />
              </svg>
            </button>
          </>
        ) : (
          <div className='flex flex-col items-center gap-2 text-ink-tertiary'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='w-8 h-8'>
              <rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
              <line x1='12' x2='12' y1='8' y2='16' />
              <line x1='8' x2='16' y1='12' y2='12' />
              <circle cx='9' cy='9' r='2' />
            </svg>
            <span className='text-sm'>Subir logo</span>
          </div>
        )}
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
        />
      </div>
      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
    </FieldWrapper>
  )
}

export default LogoUpload
