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
| `children` | `ReactNode` | — | Content below the tab bar |
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

### Safety fallback

If the active tab ID is no longer in the `tabs` array (e.g. dynamic tabs changed), the component resets to the first tab and calls `onChange`.

## Usage patterns

```tsx
// Uncontrolled — component handles everything
<Tabs tabs={tabs} onChange={onTabChange} />

// Controlled — parent manages state, Tabs restores from storage on mount via onChange
const [activeTab, setActiveTab] = useState('tab1')
<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

// Explicit storage key (recommended when multiple Tabs share the same tab IDs)
<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} storageKey="my_feature_tab" />
```
