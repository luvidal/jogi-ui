import { LucideProps, icons, CircleHelp } from 'lucide-react'

interface Props extends LucideProps {
  name?: string
}

const reported = new Set<string>()

const Icon = ({ name, ...props }: Props) => {
  const LucideIcon = name ? icons[name as keyof typeof icons] : undefined

  if (name && !LucideIcon && !reported.has(name)) {
    reported.add(name)
    const err = new Error(`[Icon] "${name}" not found in lucide-react`)
    console.error(err.message)
    if (typeof reportError === 'function') reportError(err)
  }

  const Component = LucideIcon || CircleHelp
  return <Component {...props} />
}

export default Icon
