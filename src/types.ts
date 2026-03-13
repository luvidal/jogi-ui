import type { ReactNode } from 'react'

/** Section definition for the Accordion component */
export interface Section {
  /** Unique section ID */
  id: string
  /** Section title */
  title: string
  /** Icon name from lucide-react */
  icon: string
  /** Optional subtitle (e.g., "3 documentos") */
  subtitle?: string
  /** Optional number prefix (e.g., "I", "II") */
  number?: string
  /** Content to render when expanded */
  content: ReactNode
  /** Color scheme for header. Falls back to neutral gray if not provided. */
  colors?: { bg: string; text: string; iconBg: string }
  /** Override the default content wrapper classes (replaces default padding + bg) */
  contentClassName?: string
}

export interface CardItem {
  id: string
  title: string | ReactNode
  subtitle?: string | ReactNode
  /** Icon name or ReactNode for custom rendering (e.g. ProgressRing) */
  icon?: string | ReactNode
  /** Right-side element (e.g. ProgressRing, ChevronRight) */
  right?: ReactNode
}
