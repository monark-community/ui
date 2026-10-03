---
"@monark/ui": major
---

The `theme` item is now the Monark 2026 brand: a warm cream light mode and an espresso dark mode, flat orange `#f88d10` with dark text on it, a 1rem radius (was 0.5rem), and Nunito Sans. Every surface, border, and text token is derived from `--primary` with CSS relative color, scaled by the new `--surface-tint` (`1` standard, `0` neutral), so changing the primary re-tints the whole UI; browsers without relative color get the same colors as fixed values. New tokens: `--surface-tint`, `--primary-ink` (orange-family text, 4.9:1 on cream), `--destructive-foreground`, `--success`, `--warning`. `--ring` is `--primary-ink` in light mode so focus rings reach 3:1. The previous zinc theme stays installable from `https://ui.monark.io/r/v0.1.0/theme.json`. The docs site now has a version switcher, a Releases page, a Changes tab on every component, and a theme panel to try a primary color and tint and copy the CSS.
