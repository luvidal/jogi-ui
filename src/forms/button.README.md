# Button

Primary action button. Consumed via `import { Button } from '@jogi/ui'`.

```tsx
<Button icon="Play" text="Enviar" onClick={submit} disabled={!canSubmit} />
```

Props (beyond standard `<button>` HTML attributes):

- `icon?: string` — lucide-react icon name rendered before the text
- `text?: string` — label (automatically rendered UPPERCASE via `uppercase tracking-wide`)
- `loading?: boolean` — replaces the icon with an inline spinner AND sets `disabled` internally

## DIRECTIVE — Disabled state rules

**The color of a Button NEVER changes when disabled.** Only the text + icon get dimmed.

- The button's background, border, shadow, ring, and any other chromatic property must remain **identical** in disabled and enabled states.
- The label (`<span>`) and icon (`<Icon>`) receive `opacity-40` — and nothing else. No `blur-*`, no `grayscale`, no filter chains. "Dimmed" means opacity only.
- The only allowed disabled-specific addition to the outer `<button>` element is `cursor-not-allowed`.
- `loading` is treated as `disabled` for visual purposes (same dimming applied to the spinner-less icon/text region).

### Why this rule exists

Past iterations tried to signal "disabled" by desaturating, graying out, or blurring the entire button. Those patterns break visual hierarchy — a disabled primary action becomes indistinguishable from a secondary or a background card — and make the UI look broken when multiple buttons sit next to each other. Keeping the chrome stable and only dimming the label preserves the button's identity as "the primary action here, currently unavailable."

### How to enforce

- `DIRECTIVE` comment lives next to the `disabledText` const in `button.tsx`. Per the global DIRECTIVE rule (see user CLAUDE.md), that comment is a behavioral contract — never modify, remove, or skip it.
- Any PR that adds `opacity-*`, `grayscale`, `blur`, `filter`, or changes `bg-*` / `border-*` / `ring-*` / `shadow-*` on the `<button>` element when `isDisabled` is set should be rejected on sight.
- `ToolbarButton` (`src/header/toolbarbutton.tsx`) shares this contract and should be kept in sync if its disabled styling is ever touched.

## Variants

Currently one variant. Custom per-instance styling is passed through `className` and merged after the defaults — callers CAN override color/shadow intentionally, but must preserve the disabled-state invariant.
