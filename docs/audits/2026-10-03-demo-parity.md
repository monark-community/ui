# Demo and website parity audit (2026-10-03)

How far `@monark/ui` (origin/main at 1.0.0) is from the Monark-branded demo sites and monark.io, which are the reference for the 2026 brand. Demos and the website are not changed by this work; ui moves to match them.

**Sources compared**
- ui: `registry.json`, `components/ui/*`, `styles/theme.css`.
- The 15 demos marked `monark-branded` in `lovable-migration/repos-and-websites.md`, on origin/develop (referral-system on main): accounting-blockchain-data-extraction, address-review-system, bounty-system, contact-list, dao-voting-platform, defi-borrow, defi-lending, defi-loans, defi-swaps, fee-distribution-system, milestone-based-smart-contracts-and-escrow, referral-system, systems-for-co-ops, time-locked-contracts, transaction-gas.
- monark.io: `website` on main.

## Summary

- **ui's tokens are right; its components are a generation behind.** 1.0.0 shipped the 2026 colours and the site shell, but the 39 primitives are still shadcn `new-york`: `forwardRef`, `@radix-ui/react-*`, Tailwind 3 idioms. The style is `rounded-md`, `shadow`, `ring-1`, `h-9` and `font-medium`.
- **13 of the 15 demos run one shared newer version, "nova".** It is shadcn `radix-nova` on Tailwind 4: the `radix-ui` package, function components and `data-slot`, with the Monark restyle on top.
  - Nine sites are byte-identical; four more differ only in line endings.
  - defi-swaps and referral-system kept ui's code and applied the same restyle by hand.
- **The website** is on Tailwind 3 and not connected to the registry. It hand-patched its own new-york copies toward the same look.
- **Every demo installs from `@monark` and then edits almost every file.** Only network-badge (5 sites), skeleton and separator still match ui.
- **The site shell ui added in 1.0.0 is used by no site.** That covers site-header, site-brand, demo-chip, locale-switch and theme-toggle. All 15 sites carry their own copies in `src/components/site/`.

## Install bugs in the 1.0.0 theme item

Found while installing `theme.json` into a fresh Tailwind 4 app:

1. **Missing colour utilities.** The shadcn CLI writes `--color-<name>` only for values it recognises as colours. Tokens whose value is `var(--…)` got a self-referencing `--<name>: var(--<name>)` instead. In a fresh install, `bg-popover`, `bg-muted`, `bg-accent`, `ring-ring`, `text-card-foreground`, `text-primary-foreground` and most `sidebar-*` utilities therefore did not exist. The demos never hit this because they pasted their own `@theme inline` block.
2. **Broken base layer.** `{"@apply": "…"}` is written out as `@apply: …;`, which Tailwind rejects, so the base layer failed to compile.

## Theme gaps

| Gap | Demos | ui 1.0.0 |
|---|---|---|
| Radius scale | `--radius-sm…4xl` = radius × 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5; 614 uses of `rounded-2xl` or `3xl` | Only `--radius` |
| `--font-heading` | Defined; used by dialog and sheet titles | Missing |
| Base layer | 1.6 body line height, antialiasing, balanced 1.15 headings, a 2px `:focus-visible` outline, `scroll-padding-top` | Border and body colours only |
| Utilities | `eyebrow` and `tracking-display` in all 15 sites; `tnum`, `no-scrollbar` and `hatch` in some | None |
| Reduced motion | Global reset in all 15 sites | None |
| Overlay | `black/45` everywhere | `black/80` in dialog and sheet |
| `--ring` (light) | `--primary`, 2.3:1 on cream | `--primary-ink`, 3:1. **Kept**: it meets WCAG |
| Docs heading rule | — | An unlayered `h1–h6 {font-weight:700}` beat utility classes |

## Component gaps

The Monark conventions that every demo applies:
- Actions and selectors are pills (`rounded-full`).
- Fields are 12px (`rounded-md`) on `bg-card`.
- Menus and popovers are `rounded-lg` or `rounded-2xl`; dialogs and cards are `rounded-3xl`.
- Focus is `ring-3 ring-ring/50`.
- Controls have no shadows and use `font-bold`.
- Controls are 40px tall, with 44px touch targets.
- Hover is `bg-muted`.
- Statuses are tinted pills (`X/10` background, `X/40` border).

| Component | ui 1.0.0 | Demos | Priority |
|---|---|---|---|
| button | `rounded-md h-9 font-medium shadow ring-1`; filled destructive | Pill, `h-10`, `font-bold`, flat, color-mix hover; destructive as an outline; link in `primary-ink`; `xs` and `icon-xs/sm/lg` sizes | must |
| badge | `rounded-md`, a `div`, shadow | Pill `span` with `h-6 font-bold`; tinted destructive; `ghost`, `link`, `success` and `warning`; `asChild` | must |
| input, textarea | `h-9`, transparent, `shadow-sm`, `ring-1` | `h-10 bg-card ring-3`; `aria-invalid`; textarea matches and grows with content. Demos also override with `h-12` and `font-mono tabular-nums`, so a `size="lg"` and a numeric variant are needed | must |
| select | `h-9 rounded-md`; Tailwind 3 `[--radix-…]` values that break under Tailwind 4 | Pill trigger `h-10 font-semibold`, `size` prop, `rounded-2xl` content, `rounded-xl` items | must |
| checkbox, switch | `size-4 border-primary shadow`; switch has a shadow | `size-5 border-input` with a larger hit area; switch has `size` | must |
| slider | `bg-primary/20` track, shadowed thumb | `bg-muted h-1.5` track, `border-2` thumb, 44px root, `thumbLabel` and `valueText` (4 sites) | must |
| tabs | `h-9 rounded-lg`, shadowed active tab | Pill list `h-11 bg-muted`, active tab `bg-card`, a `line` variant | must |
| dialog | `bg-black/80`, `max-w-lg`, 16px close icon | `rounded-3xl`, `sm:max-w-md`, `max-h-[100dvh-2rem]` scroll (mobile fix), 36px round close, `closeLabel` and `showCloseButton`. Every one of the 44 uses sets `text-xl font-extrabold` on the title | must |
| sheet | `p-6`, full-width slide over 300–500ms | No padding; padding moves to header and footer; `w-full max-w-sm` (set in all 15 sites); short 200ms slide; `closeLabel` | must |
| label | `font-medium` | `font-bold` (54 overrides), flex gap, group-disabled | must |
| card | `rounded-xl shadow` | No site installs it; 237 hand-rolled `rounded-3xl border bg-card` cards and 126 `rounded-2xl` sub-panels | must |
| dropdown-menu, tooltip, accordion, sonner | Stock new-york | Nova versions. Tooltip `bg-foreground`. The website accordion uses a `+` that turns into `×` | nice |
| wallet, connect-wallet | Square-ish with shadow; hard-coded English aria labels; double icon spacing | Pills; `copyLabel` and `copiedLabel`; `h-10` (set in all 15 sites) | must |
| tx-status | `text-emerald-*`, `rounded-md` | `text-success`, pill, `w-fit`, wraps on mobile | must |
| network-badge | — | 19 uses pass the same green status dot | nice |
| token-amount | Newer formatter (no `-0`, localized digits) | Sites run the older one; keep ui's. `mono` should be opt-in; add `minFractionDigits` | nice |

## Patterns the demos hand-roll

| Pattern | Spread | Becomes |
|---|---|---|
| `InfoTip`, a round info button with a popover | 14 sites, 51 uses, 4 drifting copies | `info-tip` |
| Stat tiles (label plus value) | 126 `rounded-2xl` panels; `Stat` / `Tile` / `Fact` in 5 sites | `stat` |
| Filter chips and segmented controls | About 70: `aria-pressed`, `role="radiogroup"`, `bg-foreground text-background` active state | `toggle-group` pill and `chip` variants |
| Raw `<select>` | 13 in 6 sites, plus `native-select.tsx` | `native-select` |
| `<details>` disclosures and FAQs | 31 in 14 sites | `disclosure`; accordion with a `plus` variant |
| Empty states | About 15, in 5 local components | `empty` |
| Field errors (`<p role="alert">`) | About 25 | `field-error` |
| Eyebrow plus display heading | About 80 | `section-heading` |
| Section divider | 15/15 sites, identical | `section-divider` |
| Footer, header action | 15/15 sites, varying only by links | `site-footer`, `header-action` |
| Disclaimer, tx-feedback, wallet-prompt, demo-controls | 15/15 sites each | Presentational demo-chrome items |
| App sub-bar tabs and loading skeleton | 14–15 sites | `app-tabs`, `app-loading` |

## Website notes (not changed here)

- `components/ui/amount-currency-input.tsx` and `currency-amount-input.tsx` are imported nowhere.
- `components/ui/dropdown-menu.tsx`: the submenu content lost its `max-h` / `overflow-y-auto` guard.
- The website is not connected to the registry (`components.json` has no `registries` entry; it uses Tailwind 3).
- The demos import `cn` from the npm package `cn`. ui keeps `@/lib/utils` (clsx plus tailwind-merge).

## Catch-up plan

1. **Theme foundation** (minor): the radius scale, `--font-heading`, `--overlay`, the base layer, the utilities and the motion reset, plus the two install fixes above.
2. **Primitives rebased on nova** (2.0.0): Tailwind 4, `radix-ui`, function components and `data-slot`, with the conventions and per-component changes above.
3. **Monark items**: wallet, connect-wallet, tx-status, network-badge, token-amount, demo-chip and site-header.
4. **New items**: the patterns table above.
5. **Docs, previews, tests and release.**

Verification for each phase: install the built registry into a scratch copy of a demo, then diff it against that demo's own `components/ui`. The remaining differences should only be the `cn` import path and intended changes.
