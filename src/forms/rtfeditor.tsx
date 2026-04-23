import { useRef, useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import Icon from '../common/icon'
import Label from '../common/label'

interface RTFEditorProps {
  label?: string
  value: string
  onChange: (content: string) => void
  tooltip?: string
  className?: string
  editorClassName?: string
  style?: React.CSSProperties
  stretch?: boolean
  /** Resolver for the "insert link" toolbar button. Return the URL, or null/undefined to cancel. Defaults to window.prompt. */
  onInsertLink?: () => Promise<string | null | undefined> | string | null | undefined
}

const sanitizeLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=['"])(?!https?:)/gi, '$1https://')

const enhanceLinks = (html: string) =>
  html.replace(/<a\s+([^>]*)>/gi, (_match, attrs) => {
    if (!/target=/i.test(attrs)) attrs += ` target="_blank"`
    if (!/rel=/i.test(attrs)) attrs += ` rel="noopener noreferrer"`
    return `<a ${attrs}>`
  })

const defaultInsertLink = () => (typeof window !== 'undefined' ? window.prompt('URL:') : null)

const RTFEditor = ({
  value,
  label,
  onChange,
  className = '',
  tooltip = '',
  editorClassName = '',
  style,
  stretch = true,
  onInsertLink = defaultInsertLink,
}: RTFEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showToolbar, setShowToolbar] = useState(false)

  useEffect(() => {
    if (editorRef.current) {
      const current = editorRef.current.innerHTML
      if (current !== value) editorRef.current.innerHTML = DOMPurify.sanitize(value || '')
    }
  }, [value])

  const handleInput = () => {
    if (!editorRef.current) return
    const content = enhanceLinks(
      sanitizeLinks(
        editorRef.current.innerHTML
          .replace(/<div><br><\/div>/g, '<br>')
          .replace(/<div>/g, '<br>')
          .replace(/<\/div>/g, '')
          .replace(/^<br>/, '')
      )
    )
    onChange(content)
  }

  const execCommand = (cmd: string, val?: string) => {
    if (document.queryCommandSupported?.(cmd)) {
      document.execCommand(cmd, false, val)
      editorRef.current?.focus()
    }
  }

  const insertLink = async () => {
    const url = await onInsertLink()
    if (!url) return
    const safe = url.match(/^https?:\/\//i) ? url : `https://${url}`
    execCommand('createLink', safe)
  }

  const commands = [
    { name: 'bold', label: 'B', style: { fontWeight: 'bold' } },
    { name: 'italic', label: 'I', style: { fontStyle: 'italic' } },
    { name: 'underline', label: 'U', style: { textDecoration: 'underline' } },
    { name: 'link', label: <Icon name='Link' size={16} className='text-ink-tertiary group-hover:text-ink-primary' /> }
  ]

  return (
    <div className={`mb-2 flex flex-col min-h-0 ${stretch ? 'flex-1' : ''} ${className}`}>
      {label && <Label text={label} tooltip={tooltip} className='shrink-0' />}

      <div className={`border border-edge-subtle/20 bg-surface-0 rounded-xl overflow-hidden relative flex-1 min-h-0 flex flex-col`}>
        <button
          type='button'
          onClick={() => setShowToolbar(!showToolbar)}
          className='absolute top-2 right-3 p-1.5 rounded-xl bg-surface-2/70 hover:bg-surface-2 text-ink-tertiary hover:text-ink-secondary transition'
        >
          <Icon
            name='Paintbrush'
            size={18}
            className={`transition-all duration-500 ease-out ${showToolbar ? 'rotate-[-45deg] scale-110' : 'rotate-0 scale-100'}`}
          />
        </button>

        {showToolbar && (
          <div className='flex gap-2 p-2 bg-surface-2 border-b border-edge-subtle/20'>
            {commands.map(cmd => (
              <button
                key={cmd.name}
                type='button'
                onMouseDown={e => e.preventDefault()}
                onClick={() => (cmd.name === 'link' ? insertLink() : execCommand(cmd.name))}
                className='group px-3 py-1 text-sm text-ink-primary hover:bg-surface-3 rounded flex items-center justify-center'
                style={typeof cmd.label === 'string' ? cmd.style : undefined}
              >
                {cmd.label}
              </button>
            ))}
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className={`p-4 outline-none overflow-y-auto text-ink-primary [&_a]:text-brand [&_a]:underline ${stretch ? 'flex-1 min-h-0' : ''} ${editorClassName || ''}`}
          style={{ fontSize: '1rem', lineHeight: '1.5rem', ...style }}
          suppressContentEditableWarning
        />
      </div>
    </div>
  )
}

export default RTFEditor
