---
"@monark/ui": minor
---

The two blocks get the 2026 look, and the orange controls meet the 3:1 non-text contrast minimum.

- **SwapForm:**
  - Restyled: a 32px-corner card with 16px-corner token panels, a reverse button that overlaps both panels, pill token pickers, large tabular amounts and a full-width submit.
  - Each panel shows the focus ring while its amount has focus.
  - New `labels` prop translates every string. Field ids come from `useId`, so two forms on one page no longer clash.
  - The submit button shows a spinner and `aria-busy` while quoting or confirming. Errors use `FieldError`.
  - The settings button only appears when you pass `onOpenSettings`.
- **NftCard:**
  - Restyled: a small card with the image flush to the edges, tiles for traits and a bold price.
  - New `rarityLabel` and `moreTraitsLabel` props translate its strings.
- **Contrast:** flat orange is about 2.3:1 on the light surfaces, so the part that shows the state now uses `primary-ink` (4.4–5.0:1). Dark mode is unchanged.
  - Switch: the checked track gets a `primary-ink` edge.
  - Slider: the thumb ring uses `primary-ink`.
  - Progress: the fill uses `primary-ink`.
