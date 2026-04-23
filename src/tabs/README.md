# Tabs

Pill-style tab selector with localStorage memory.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | required | Tab definitions (id, label, icon?) |
| `activeTab` | `string` | — | Controlled mode: active tab ID from parent |
| `onChange` | `(tabId: string) => void` | — | Called on tab click AND on mount when restoring from storage |
| `onRefresh` | `(tabId: string) => void` | — | Called when clicking the already-active tab |
| `storageKey` | `string` | auto | Explicit localStorage key. Auto-generated from tab IDs if omitted. |
| `children` | `ReactNode \| (activeId: string) => ReactNode` | — | Content below the tab bar. Pass a function to receive the live active id (see render-prop usage below) |
| `suffix` | `(tabId: string) => string \| undefined` | — | Badge text after label (e.g. "(3/5)") |
| `dark` | `boolean` | `true` | Dark-mode styling (brand pill on dark surface) |
| `size` | `'xs' \| 'sm' \| 'md'` | `'sm'` | Density preset |

## UI Behaviors

### DIRECTIVE: Internal state memory

**Tabs MUST remember the selected tab across unmounts via localStorage.**

Both controlled (`activeTab` prop) and uncontrolled modes persist:

- **Uncontrolled** (no `activeTab` prop): component manages its own state. On mount, restores from localStorage. Calls `onChange` on mount if the restored value differs from the first tab.
- **Controlled** (`activeTab` provided): parent manages state. On mount, reads stored value and calls `onChange(storedId)` before first paint so the parent can update its state.

**Do NOT remove or weaken this behavior.**

### Storage key

- If `storageKey` is provided, it is used as-is.
- Otherwise, auto-generated as `jogi_tabs_<id1>,<id2>,...` from tab IDs.
- Changing tab IDs produces a different key (new storage slot).

### Tab click

- Clicking an inactive tab: calls `onChange(tabId)`, persists to localStorage.
- Clicking the active tab: calls `onRefresh(tabId)` — useful for re-fetching data.

### Stale `activeTab` handling

If `activeTab` is not present in `tabs` (stale parent state, a tab was removed, etc.), the first tab is highlighted for DISPLAY only. The component does **not** call `onChange` to "heal" the parent state — that pattern caused a React #185 "Maximum update depth" ping-pong in controlled usage (see Sentry JOGI-1B / commit history). The parent is responsible for keeping `activeTab` in sync with the tab set, or tolerating a render where the first tab appears active.

This matches Radix / MUI / Ant Design / Headless UI behavior: none of them emit `onChange` from an effect when the controlled value goes stale.

## Usage patterns

```tsx
// Uncontrolled — component handles everything
<Tabs tabs={tabs} onChange={onTabChange} />

// Controlled — parent manages state, Tabs restores from storage on mount via onChange
const [activeTab, setActiveTab] = useState('tab1')
<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

// Explicit storage key (recommended when multiple Tabs share the same tab IDs)
<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} storageKey="my_feature_tab" />

// Render-prop children — Tabs owns the active id, panels stay in sync with the
// tab highlight even on the very first render (localStorage-restored value).
// Consumers should prefer this when they render per-tab panels, to avoid
// maintaining a duplicate activeTabId for panel visibility.
<Tabs tabs={tabs} storageKey="my_feature_tab" onChange={onTabChange}>
  {(activeId) => (
    <>
      {activeId === 'tab1' && <Panel1 />}
      {activeId === 'tab2' && <Panel2 />}
    </>
  )}
</Tabs>
```
