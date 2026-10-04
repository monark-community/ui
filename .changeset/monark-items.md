---
"@monark/ui": major
---

The Monark items now match the demo sites and use the same stack as the primitives: `cn` from the `cn` package and Radix from `radix-ui`. No item depends on `@radix-ui/react-*` any more.

- **Wallet:** a pill that never overflows its container (`max-w-full`), and bold names. New `copyLabel` and `copiedLabel` props translate the copy button's accessible name. The "copied" check no longer leaks a timer after unmount.
- **ConnectWallet:** a 40px pill in every state, and the ring-3 focus ring. Icons no longer get a double gap (`mr-2` inside a button that already has `gap-2`).
- **TxStatus:** confirmed uses the `success` token instead of emerald. It is a pill that sizes to its content (`w-fit`) and wraps on narrow screens. The explorer link has a focus ring.
- **NetworkBadge:** new `status` prop (`live`, `degraded` or `down`), which draws a coloured dot when there is no chain icon.
- **TokenAmount:**
  - **Breaking:** the mono font is now opt-in via `mono`; digits stay tabular either way.
  - New `minFractionDigits` prop, so `1.5` can show as `1.50` (`formatBaseUnits` takes it as a fifth argument).
- **DemoChip:** new `description` prop that sets a tooltip and an sr-only explanation.
- **SiteHeader:**
  - New `primaryAction` slot. It sits last in the desktop actions and fills the width at 48px at the bottom of the mobile sheet. The sheet's actions row keeps the Demo chip left and the rest right, so you rarely need `mobileActions` now.
  - The sheet uses the `--overlay` token, and the header falls back to a solid background where `backdrop-filter` isn't supported.
- **Docs:**
  - The site-shell guide's `hrefFor` keeps the query string when switching locale.
  - The anatomy page describes the `cn` package.
