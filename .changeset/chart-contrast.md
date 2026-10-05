---
"@monark/ui": patch
---

Light-mode chart colours now meet the 3:1 contrast that chart marks need against the background and cards (WCAG 1.4.11).

- `--chart-1` was the flat brand orange (2.3:1 on cream). It is now the primary capped at oklch lightness 0.62: `#cd6600` for the default orange (3.7:1). It still follows a remapped `--primary`, and browsers without relative colours get the `#cd6600` fallback.
- `--chart-4` goes from tan `#c8a27a` (2.3:1) to khaki `#9c8a52` (3.3:1), chosen to stay distinct from `--chart-3`'s brown.
- Dark mode is unchanged: `--chart-1` stays the bright orange there.

The theming and charts docs give the new values, and the theming example palette now passes 3:1 too. A unit test fails if any fixed chart colour drops below 3:1 on the background or cards.
