# Accordion

Collapsible sections with colored headers. Only one section open at a time (mutual exclusivity).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `Section[]` | required | Sections to render (id, title, icon, content, colors, etc.) |
| `forceExpanded` | `boolean` | `false` | Force all sections open (PDF generation) |
| `rememberOpen` | `boolean` | `true` | Persist open section in localStorage |
| `storageKey` | `string` | auto | Explicit localStorage key. Auto-generated from section IDs if omitted. |
| `onChange` | `(sectionId: string \| null) => void` | — | Called when open section changes AND on mount with the restored value |

## UI Behaviors

### DIRECTIVE: Internal state memory

**Accordion MUST remember the open section across unmounts via localStorage (when `rememberOpen` is true, the default).**

- On mount, restores the previously open section from localStorage.
- If `onChange` is provided, it is called on mount with the restored section ID (before first paint).
- When a section is toggled, the new state is persisted immediately.
- The special value `'__closed__'` is stored when all sections are collapsed.

**Do NOT remove or weaken this behavior.**

### Storage key

- If `storageKey` is provided, it is used as-is.
- Otherwise, auto-generated as `jogi_accordion_<id1>,<id2>,...` from section IDs.
- Same-ID sections across different views share the same storage slot (use `storageKey` to isolate).

### Mutual exclusivity

Only one section can be open at a time. Clicking an open section closes it (all sections closed = `null`). Clicking a closed section opens it and closes the previously open one.

### Force expanded

When `forceExpanded` is true, all sections are open and clicking has no effect. Used for PDF generation where all content must be visible.

## Section colors

Colors are provided per section via `section.colors`:

```ts
{ bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100' }
```

Falls back to neutral gray when not provided.

## Usage

```tsx
// Basic — internally manages and remembers open section
<Accordion sections={sections} />

// With parent notification
<Accordion sections={sections} onChange={setOpenSection} />

// Explicit storage key (isolate from other accordions with same section IDs)
<Accordion sections={sections} storageKey="perfil_accordion" />

// Disable persistence
<Accordion sections={sections} rememberOpen={false} />
```
