---
"@monark/ui": minor
---

Fixes and improvements from the 2.0 review.

- **Switch:**
  - Larger default, 24×44 instead of 18×32.
  - The old size is now `sm`, and there's a new `lg` at 28×52.
- **Select:** the list now opens below the trigger by default (`position="popper"`). It is at least as wide as the trigger, with a 9rem minimum, and lines up with its left edge. `position="item-aligned"` still works.
- **Calendar:**
  - In single mode a selected Saturday or Sunday is a full circle instead of half a range.
  - Today's background no longer shows behind the selected day.
  - Each day's `data-day` attribute is now `yyyy-mm-dd`, so the server and browser no longer disagree during hydration.
- **Alert dialog:** new `variant="destructive"`. It tints the icon red and makes the confirm button solid red. Button gains a `destructive-solid` variant for the same look elsewhere.
- **Password strength meter:** the scale now runs red → amber → green, and the label colours meet AA.
- **Animations:**
  - New `animate-expand` theme utility for expanding panels.
  - Accordion, Collapsible and Disclosure now open and close with the same height animation; Collapsible and Disclosure didn't animate before.
- **Accordion:** `variant="plus"` now matches the monark.io FAQ exactly.
- **Theme:** controls get a pointer cursor, and disabled ones show not-allowed.
- **Site footer:** the default logo is the official Monark logo with its wordmark. `site-brand` exports it as `MonarkLogo`.
- **Sonner:**
  - Toasts use the theme font and the success, warning and error colours.
  - Your own `style` and `classNames` now add to the defaults instead of replacing them.
- **Chart:** a visible focus ring when the chart is focused from the keyboard. A new Charts guide covers bar, line, area, pie, donut, radar and radial charts.
- **Docs site:**
  - Components are grouped into Actions, Forms, Overlays, Navigation, Layout, Data display, Feedback, Web3, Site shell and Demo app.
  - Richer previews for popover, sidebar, sonner, slider and chart.
