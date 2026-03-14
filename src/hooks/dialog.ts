import React, { createContext, useContext, useState, useCallback, useMemo, createElement } from 'react'

/**
 * Factory that creates a dialog context (Provider + hook) from a dialog component.
 *
 * All dialog contexts follow the same pattern:
 * - Provider holds state (options + resolve promise)
 * - Trigger function opens the dialog and returns a promise
 * - Dialog component receives { state, onDone }
 *
 * @param Dialog - Component that renders the dialog UI
 * @param name - Hook name for error messages (e.g. "useConfirm")
 * @param normalizeInput - Optional function to normalize shorthand input (e.g. string → options object)
 */
export function createDialogContext<TOptions extends object, TResult>(
  Dialog: React.ComponentType<{ state: TOptions & { resolve: (value: TResult) => void }; onDone: () => void }>,
  name: string,
  normalizeInput?: (input: any) => TOptions,
) {
  type State = TOptions & { resolve: (value: TResult) => void }

  const Context = createContext<{ trigger: (options: TOptions | string) => Promise<TResult> } | undefined>(undefined)

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<State | null>(null)

    const trigger = useCallback((input: TOptions | string): Promise<TResult> => {
      const opts = (normalizeInput && typeof input === 'string' ? normalizeInput(input) : input) as TOptions
      return new Promise<TResult>(resolve => {
        setState({ ...opts, resolve })
      })
    }, [])

    const handleDone = useCallback(() => setState(null), [])

    const value = useMemo(() => ({ trigger }), [trigger])

    return createElement(
      Context.Provider,
      { value },
      children,
      state && createElement(Dialog, { state, onDone: handleDone }),
    )
  }

  const useHook = () => {
    const context = useContext(Context)
    if (!context) throw new Error(`${name} must be used within its Provider`)
    return context.trigger
  }

  return [Provider, useHook] as const
}
