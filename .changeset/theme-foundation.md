---
"@monark/ui": minor
---

The `theme` item now carries the foundation every Monark site was adding by hand. The radius scale (`rounded-sm` to `rounded-4xl` as multiples of `--radius`, so `rounded-3xl` is 32px at the default 1rem). `--font-heading`. An `--overlay` token for dialog and sheet backdrops. A base layer: 1.6 body line height, balanced 1.15 headings, a 2px `--ring` outline on `:focus-visible`, and anchor offset for sticky headers. A `prefers-reduced-motion` reset. And four utilities: `eyebrow`, `tracking-display`, `tnum` and `no-scrollbar`. The docs site's heading rule moved into `@layer base`, so utilities like `font-extrabold` on a heading are no longer overridden. Focus rings stay `--primary-ink` in light mode (3:1 on cream); sites that set `--ring: var(--primary)` keep their own value.

Two install fixes for the `theme` item. Every colour token is now mapped to its Tailwind colour explicitly: the shadcn CLI skipped tokens whose value is `var(--…)`, so a fresh install had no `bg-popover`, `bg-muted`, `bg-accent`, `ring-ring`, `text-card-foreground` or `text-primary-foreground`. And the base layer's `@apply` rules are written correctly; they came out as `@apply: …`, which Tailwind rejects.
