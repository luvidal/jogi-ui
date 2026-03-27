# LOC Reduction Plan — Deduplication & Reuse

Codebase: ~4,574 LOC across 58 files.

## Priority 1 — Direct duplicates (copy-paste, zero risk)

### 1A. Extract shared input class constants
**Files:** `forms/textfield.tsx`, `forms/numberfield.tsx`, `forms/selectfield.tsx`
**Problem:** `inputBase`, `inputEditable`, `inputReadOnly` are identical strings defined 3 times.
**Fix:** Move to `forms/inputstyles.ts`, import from each file.
**Estimated savings:** ~10 LOC

### 1B. Deduplicate `useIsMobile` / `useIsDesktop`
**Files:** `hooks.tsx` (lines 6-28), `hooks/device.ts` (lines 3-29), `common/modal.tsx` (lines 4-14)
**Problem:** 3 copies of `useIsMobile`, 2 copies of `useIsDesktop`.
**Fix:** Keep canonical version in `hooks/device.ts`. Re-export from `hooks.tsx`. Remove local copy in `modal.tsx` → import from `../hooks/device`.
**Estimated savings:** ~25 LOC

### 1C. Deduplicate inline Tooltip in ToolbarButton/ToolBack
**Files:** `header/toolbarbutton.tsx` (lines 16-37), `header/toolback.tsx` (lines 12-33)
**Problem:** Identical portal-based Tooltip component (22 lines) copy-pasted.
**Fix:** Extract to `header/hovertooltip.tsx`, import from both. The existing `common/tooltip.tsx` is a different component (click-toggle info tooltip), so this is a new small component.
**Estimated savings:** ~20 LOC

### 1D. Deduplicate `colClass` mapping
**Files:** `common/card.tsx` (lines 9-15), `common/skeleton.tsx` (lines 145-150)
**Problem:** Identical responsive col-span mapping object.
**Fix:** Extract to `common/colclass.ts` (single const + export).
**Estimated savings:** ~8 LOC

---

## Priority 2 — Extract shared hooks/utilities (moderate impact)

### 2A. Extract `useClickOutside` hook
**Files:** `common/tooltip.tsx` (lines 44-53), `common/contextmenu.tsx` (lines 48-73), `forms/colorpicker.tsx` (lines 21-29)
**Problem:** Same mousedown-outside-close pattern repeated 3 times.
**Fix:** New `hooks/useclickoutside.ts`. Each consumer calls `useClickOutside(ref, onClose)`.
**Estimated savings:** ~15 LOC
**Risk:** Low. Behavioral equivalence is straightforward. ContextMenu also has Escape/scroll listeners — those stay inline.

### 2B. Extract dialog animation state (visible/leaving/close)
**Files:** `common/confirm.tsx` (lines 37-51), `common/prompt.tsx` (lines 39-55)
**Problem:** Identical `visible`/`leaving`/`close` state + `requestAnimationFrame` init + `setTimeout` teardown.
**Fix:** New `hooks/usedialoganim.ts` returning `{ visible, leaving, close }`.
**Estimated savings:** ~20 LOC
**Risk:** Low. Both dialogs have identical lifecycle.

### 2C. Extract tab-trap keyboard handler
**Files:** `common/confirm.tsx` (lines 53-79), `common/prompt.tsx` (lines 57-82)
**Problem:** Near-identical focus-trapping logic (~25 lines each). Only difference: confirm queries `'button'`, prompt queries `'input, button'`.
**Fix:** New `hooks/usetabtrap.ts(dialogRef, close, selector?)`. Selector defaults to `'input, button'`.
**Estimated savings:** ~20 LOC

---

## Priority 3 — Merge similar config objects (design alignment)

### 3A. Shared `variantConfig` for Confirm/Prompt
**Files:** `common/confirm.tsx` (lines 15-34), `common/prompt.tsx` (lines 17-36)
**Problem:** Nearly identical variant config objects. Only difference: `info.icon` is `'Info'` vs `'Pencil'`.
**Fix:** Extract shared config to `common/dialogvariants.ts`. Prompt overrides `info.icon` locally.
**Estimated savings:** ~12 LOC
**Uncertain:** The icon difference is intentional. Confirm uses `Info`, Prompt uses `Pencil`. Could keep separate if the intent diverges further.

### 3B. Shared disabled effect constant
**Files:** `forms/button.tsx` (line 12), `header/toolbarbutton.tsx` (line 58)
**Problem:** `'opacity-40 blur-[0.5px]'` duplicated.
**Fix:** Add to `forms/inputstyles.ts` as `disabledEffect`.
**Estimated savings:** ~2 LOC (marginal, but prevents drift)

---

## Priority 4 — Larger refactors (higher risk, assess ROI)

### 4A. Unify overlay backdrop pattern
**Files:** `common/modal.tsx` (line 50), `common/confirm.tsx` (line 92), `common/prompt.tsx` (line 101)
**Problem:** Similar fixed-inset overlay with backdrop-blur. But z-index and opacity values differ (`z-[9999]` vs `z-[10000]`, `bg-black/80` vs `bg-black/50`).
**Decision:** **Skip** — differences are intentional (modal is darker/lower z, dialogs are lighter/higher z). Extracting would add a parameter for every difference, net zero savings.

### 4B. Consolidate `hooks.tsx` into `hooks/` directory
**Files:** `src/hooks.tsx` (86 lines) vs `src/hooks/device.ts` + `src/hooks/dialog.ts`
**Problem:** `hooks.tsx` re-declares device hooks and also contains Toast context. Confusing dual source.
**Fix:** Move Toast context to `hooks/toast.ts`. Make `hooks.tsx` a pure re-export barrel (or remove it and update `index.tsx` imports).
**Estimated savings:** ~5 LOC net, but cleaner architecture.
**Risk:** Medium. Requires updating all internal imports of `useIsMobile`/`useToast` from `../hooks` → `../hooks/device` or `../hooks/toast`.

---

## Summary

| # | Change | LOC saved | Risk | Files touched |
|---|--------|-----------|------|---------------|
| 1A | Shared input classes | ~10 | None | 4 (1 new + 3 edit) |
| 1B | Dedupe useIsMobile | ~25 | None | 4 |
| 1C | Shared HoverTooltip | ~20 | None | 3 (1 new + 2 edit) |
| 1D | Shared colClass | ~8 | None | 3 (1 new + 2 edit) |
| 2A | useClickOutside hook | ~15 | Low | 4 (1 new + 3 edit) |
| 2B | useDialogAnim hook | ~20 | Low | 3 (1 new + 2 edit) |
| 2C | useTabTrap hook | ~20 | Low | 3 (1 new + 2 edit) |
| 3A | Shared variantConfig | ~12 | Low | 3 (1 new + 2 edit) |
| 3B | Shared disabledEffect | ~2 | None | 2 |
| 4B | Consolidate hooks.tsx | ~5 | Medium | 6+ |
| **Total** | | **~137** | | |

## Questions before proceeding

1. **1C (HoverTooltip):** Place in `header/hovertooltip.tsx` or `common/hovertooltip.tsx`? It's only used by header components currently.
2. **3A (variantConfig):** Keep separate given the icon difference, or merge with override?
3. **4B (hooks.tsx consolidation):** Worth the churn of updating imports across consumers?
4. **Scope:** Should I implement all Priority 1+2, or just Priority 1 first?
