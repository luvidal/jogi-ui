# @jogi/ui

UI component library extracted from [jogi](../jogi). Provides themed, reusable components: buttons, inputs, selects, modals, accordions, tooltips, skeletons, cards, and more.

## Quick Reference

```bash
npm run build        # Build with tsup → dist/ (ESM + CJS + .d.ts)
npm run dev          # Build in watch mode
npm run preview      # Visual test page at http://localhost:5173
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
```

## Tech Stack

- **TypeScript** + **React** (peer dep)
- **tsup** for bundling
- **Vite** for visual dev/test page
- **Vitest** + **happy-dom** for unit tests
- **Tailwind CSS** classes (consumer must include `dist/` in their tailwind content config)
- **lucide-react** for icons (peer dep)

## Project Structure

```
src/
├── index.tsx              # Re-export hub (no component code)
├── common/                # Shared hooks, utils
└── (component dirs)       # One dir per component group

dev/
├── index.html             # Visual test page entry point
├── main.tsx               # Renders test scenarios
├── tailwind.css           # Tailwind base styles
└── vite.config.ts         # Vite config for dev page

tests/
└── *.test.ts              # Unit tests

docs/
└── *.md                   # Design docs, migration notes
```

## Compact Instructions

When compacting, preserve: file paths changed, errors found, decisions made, API changes. Drop: full file contents already read, tool output bodies.

## Communication Style

- **No emotional validation** — never say "I understand your frustration". Results matter, not words.
- **No excessive apologies** — don't apologize repeatedly. Fix the problem.
- **Be direct** — state facts, propose solutions, execute. Skip the fluff.
- **Ask for input** — when stuck or facing multiple approaches, ask rather than guessing.

## Spanish Copy Standard

All user-facing text uses informal **tú**, never **usted**:
- Imperatives: `ingresa`, `selecciona`, `agrega` (NOT `ingrese`, `seleccione`, `agregue`)
- Possessives: `tu`, `tus` (NOT `su`, `sus`)
- Pronouns: `te`, `ti`, `tú` (NOT `le`, `usted`)

## Code Rules

1. **One component per file**
2. **File naming** → lowercase, no hyphens/underscores (e.g., `editablecell.tsx`, not `editable-cell.tsx`)
3. **No `@/` imports** — all imports are relative within `src/`
4. **Icons** — use direct lucide-react imports (`import { icons } from 'lucide-react'`), not a wrapper component
5. **Tailwind classes** — the package ships class strings but does NOT bundle CSS. Consumers add the dist path to their `tailwind.config.ts` content array
6. **API stability** — exported props interfaces must stay backward-compatible with jogi's call sites. Breaking changes require updating jogi's re-export shims
7. **No domain logic** — components must not import domain-specific data (doctypes, section colors, user roles). All customization via props
8. **Theming** — use CSS custom properties (`--theme-50` through `--theme-950`) for role-based colors. Semantic colors (danger=rose, warning=amber, success=emerald, info=violet) are hardcoded Tailwind values
9. **After modifying a feature**, update this CLAUDE.md if any key behavior changed
10. **README.md maintenance** — every modification to a component folder must update its `README.md` to reflect changes
11. **Test coverage** — after implementing a feature, check if tests exist for the affected code (`tests/`). Update or write tests. Never leave a feature without test coverage.
12. **Planning** — for non-trivial changes, write a plan to `docs/plans/` before implementing

## Theming

Components use Tailwind classes that reference CSS custom properties:

```css
/* Consumer defines these (typically via data-role attribute) */
--theme-50, --theme-100, ..., --theme-950
```

Tailwind config maps `theme-*` classes to these variables. Semantic colors (danger, warning, success, info) use hardcoded Tailwind colors — they don't change per role.

## Exports

```ts
// Re-exports all components, hooks, and utilities from src/
```

## Consumer Setup (jogi)

```ts
// jogi/tailwind.config.ts — content array
'./node_modules/@jogi/ui/dist/**/*.{js,mjs}'
```

```json
// jogi/package.json — dependencies
"@jogi/ui": "github:luvidal/jogi-ui"
```

## Key Behaviors

- Components are themeable via CSS variables, not props (except semantic colors)
- No component imports domain data — all customization via props
- `lucide-react` is a peer dependency — consumers provide it

## TextField Icon Support

`TextField` supports optional right-side icon via two props:

```tsx
icon?: string            // lucide icon name (e.g., "Eye", "Pencil", "MapPin")
onIconClick?: () => void // if provided → interactive; if absent → decorative
```

- **Interactive** (`onIconClick` present): renders `<button>`, icon is `text-gray-500 hover:text-gray-700`, hover bg
- **Decorative** (no `onIconClick`): renders `<span>`, icon is `text-gray-300`, `pointer-events-none`
- When icon is present, input gets `pr-8` automatically to avoid text overlap
- Input wrapped in `<div className="relative">` when icon is set (same pattern as NumberField's suffix)
- Backward compatible — callers that don't pass `icon` see no change
