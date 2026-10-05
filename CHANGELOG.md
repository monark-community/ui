# @monark/ui

## 2.0.0

### Major Changes

- [#26](https://github.com/monark-community/ui/pull/26) [`90b188b`](https://github.com/monark-community/ui/commit/90b188be36dab6b085b1a8c8981df251cfd8e55b) Thanks [@monark-agent](https://github.com/monark-agent)! - The Monark items now match the demo sites and use the same stack as the primitives: `cn` from the `cn` package and Radix from `radix-ui`. No item depends on `@radix-ui/react-*` any more.
  
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

- [#25](https://github.com/monark-community/ui/pull/25) [`b08b161`](https://github.com/monark-community/ui/commit/b08b161aeba4f2b92882588abf43c7077a44ef01) Thanks [@monark-agent](https://github.com/monark-agent)! - The 45 shadcn primitives now use shadcn's current `radix-nova` generation with the Monark look the branded demo sites already run, so `npx shadcn add @monark/<item>` gives the same component a demo ships instead of one it has to restyle.
  
  **Code shape.** Function components with a `data-slot` on every part (no `forwardRef`; React 19 passes `ref` as a prop). Radix comes from the single `radix-ui` package, and `cn` comes from shadcn's `cn` package; both are installed with each item. Classes are Tailwind 4, including the `data-open:` / `data-checked:` / `data-horizontal:` variants from `shadcn/tailwind.css`, which the `theme` item now imports.
  
  **The Monark look.**
  - Buttons, badges, tabs and select triggers are pills: 40px controls, bold labels, no shadows, a `ring-3 ring-ring/50` focus ring.
  - Inputs, textareas and input groups sit on `bg-card` with 12px corners.
  - Cards and dialogs have 32px corners.
  - Overlays use the new `--overlay` token.
  
  Per component:
  - **Button:**
    - New `xs`, `icon-xs`, `icon-sm` and `icon-lg` sizes.
    - `destructive` is an outline.
    - `link` uses `--primary-ink`.
  - **Badge:** new `ghost`, `link`, `success` and `warning` variants, and `asChild`.
  - **Dialog:**
    - `closeLabel` and `showCloseButton` props on the content, and `closeLabel` on the footer.
    - The title is `text-xl font-extrabold`.
    - Width is `sm:max-w-md`.
    - It scrolls inside `100dvh` on phones.
  - **Sheet:**
    - `closeLabel` and `showCloseButton` props.
    - Padding moves from the content to `SheetHeader` and `SheetFooter`.
    - Side sheets are full width up to `max-w-sm`.
  - **Tabs:** a pill list with a `line` variant, and `tabsListVariants` is exported.
  - **Select:** a `size` prop (`sm` or `default`) on the trigger; the content is `rounded-2xl`.
  - **Slider:** `thumbLabel` and `valueText` props for the thumbs' accessible name and spoken value, and a 44px touch target.
  - **Accordion:** `variant="plus"`, the monark.io FAQ style, where the + turns into ×.
  - **Alert dialog:** matches the dialog.
  - **Checkbox:** 20px.
  - **Label:** bold.
  - **Calendar:** react-day-picker 10.
  - **Chart:** recharts 3.
  - **Resizable:** react-resizable-panels 4, so `direction` is now `orientation` and numeric sizes are pixels. Pass `"50%"` for percentages.
  - **Form:** function components.
  - **New `input-group` item:** an input or textarea with addons inside the field. `command` uses it for its search field.
  
  **Migrating.** Re-add the items you use with `npx shadcn add @monark/<item> --overwrite`.
  - Code that read `Button.displayName` or typed refs with `React.ElementRef<typeof X>` should use `React.ComponentProps<typeof X>["ref"]`.
  - The previous primitives stay installable from `https://ui.monark.io/r/v1.0.0/<item>.json`.

### Minor Changes

- [#30](https://github.com/monark-community/ui/pull/30) [`e4ee816`](https://github.com/monark-community/ui/commit/e4ee81663f5838ad59f7ea3da31144622fc5e639) Thanks [@monark-agent](https://github.com/monark-agent)! - The two blocks get the 2026 look, and the orange controls meet the 3:1 non-text contrast minimum.
  
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

- [#31](https://github.com/monark-community/ui/pull/31) [`66874de`](https://github.com/monark-community/ui/commit/66874de994c53016fcd6c37e69e0d692d80c3a9b) Thanks [@monark-agent](https://github.com/monark-agent)! - Fixes and improvements from the 2.0 review.
  
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

- [#27](https://github.com/monark-community/ui/pull/27) [`eecb4a8`](https://github.com/monark-community/ui/commit/eecb4a8ad749af997140522220c015a2111c49a9) Thanks [@monark-agent](https://github.com/monark-agent)! - Sixteen new items and three new variants, built from the patterns the 15 demo sites hand-roll. Each one takes plain props: strings have English defaults, and nothing imports an i18n library, a store or `next/link`.
  
  - **Patterns:**
    - `info-tip`: an "i" button with a popover.
    - `stat`: a label over a tabular figure, with hint and delta.
    - `empty`: a dashed empty state.
    - `section-heading`: eyebrow, display title, lead and action.
    - `section-divider`: monark.io's branded separator.
  - **Controls:**
    - `native-select`: a native `<select>` as a pill.
    - `disclosure`: a "show details" row.
    - `field-error`: an inline error with an icon and `role="alert"`.
    - `toggle-group` gets `variant="pill"` (a segmented control) and `variant="chip"`.
    - `radio-group` gets `variant="card"`, with `RadioGroupItemTitle` and `RadioGroupItemDescription`.
  - **Site chrome:**
    - `site-footer`: the three-band footer.
    - `header-action`: Launch demo outside the app, ConnectWallet inside it.
    - `disclaimer`: a line or a banner.
  - **Demo app:**
    - `app-tabs` and `app-loading`.
    - `wallet-prompt`: a simulated wallet confirmation with a signing state.
    - `tx-feedback`: signing, pending, confirmed and failed feedback around TxStatus.
    - `demo-controls`: slow network, fail next, extra toggles and a two-step reset.
  
  `connect-wallet` now forwards `data-*`, `aria-*` and `id` to its trigger in the connected state too.

- [#24](https://github.com/monark-community/ui/pull/24) [`5712140`](https://github.com/monark-community/ui/commit/571214034f4028e942111009ff99a6952bd0ca6d) Thanks [@monark-agent](https://github.com/monark-agent)! - The `theme` item now carries the foundation every Monark site was adding by hand. The radius scale (`rounded-sm` to `rounded-4xl` as multiples of `--radius`, so `rounded-3xl` is 32px at the default 1rem). `--font-heading`. An `--overlay` token for dialog and sheet backdrops. A base layer: 1.6 body line height, balanced 1.15 headings, a 2px `--ring` outline on `:focus-visible`, and anchor offset for sticky headers. A `prefers-reduced-motion` reset. And four utilities: `eyebrow`, `tracking-display`, `tnum` and `no-scrollbar`. The docs site's heading rule moved into `@layer base`, so utilities like `font-extrabold` on a heading are no longer overridden. Focus rings stay `--primary-ink` in light mode (3:1 on cream); sites that set `--ring: var(--primary)` keep their own value.
  
  Two install fixes for the `theme` item. Every colour token is now mapped to its Tailwind colour explicitly: the shadcn CLI skipped tokens whose value is `var(--…)`, so a fresh install had no `bg-popover`, `bg-muted`, `bg-accent`, `ring-ring`, `text-card-foreground` or `text-primary-foreground`. And the base layer's `@apply` rules are written correctly; they came out as `@apply: …`, which Tailwind rejects.
  
  The theme item also imports `tw-animate-css` and `shadcn/tailwind.css` (and installs both), which provide the `animate-in` classes, the accordion keyframes and the `data-open`, `data-checked` and `data-horizontal` variants that shadcn's current components use. The shadcn CLI skips the imports when your globals already have them.

## 1.0.0

### Major Changes

- [#20](https://github.com/monark-community/ui/pull/20) [`653f0b3`](https://github.com/monark-community/ui/commit/653f0b371beb33046c0e8f0460bdc3d19a663c94) Thanks [@monark-agent](https://github.com/monark-agent)! - The `theme` item is now the Monark 2026 brand: a warm cream light mode and an espresso dark mode, flat orange `#f88d10` with dark text on it, a 1rem radius (was 0.5rem), and Nunito Sans. Every surface, border, and text token is derived from `--primary` with CSS relative color, scaled by the new `--surface-tint` (`1` standard, `0` neutral), so changing the primary re-tints the whole UI; browsers without relative color get the same colors as fixed values. New tokens: `--surface-tint`, `--primary-ink` (orange-family text, 4.9:1 on cream), `--destructive-foreground`, `--success`, `--warning`. `--ring` is `--primary-ink` in light mode so focus rings reach 3:1. The previous zinc theme stays installable from `https://ui.monark.io/r/v0.1.0/theme.json`. The docs site now has a version switcher, a Releases page, a Changes tab on every component, and a theme panel to try a primary color and tint and copy the CSS.

### Minor Changes

- [#17](https://github.com/monark-community/ui/pull/17) [`6d0ab53`](https://github.com/monark-community/ui/commit/6d0ab53a38fc9f99e5f3e1858c9bb82eabedc893) Thanks [@monark-agent](https://github.com/monark-agent)! - Add the Monark site shell: `site-header`, `site-brand`, `demo-chip`, `locale-switch` and `theme-toggle`, the standard header of Monark-branded product sites. Install `@monark/site-header` to get all five; they take `href`/`LinkComponent`/`pathname` props instead of importing a router or i18n library. `demo-chip` adds the `--primary-ink` token.

### Patch Changes

- [#18](https://github.com/monark-community/ui/pull/18) [`0f24443`](https://github.com/monark-community/ui/commit/0f244432dda31ce6d88e20d14e08141d54164e07) Thanks [@monark-agent](https://github.com/monark-agent)! - Fix `npx shadcn add @monark/<item>` in fresh apps. Every `registryDependencies` entry is now namespaced (`@monark/wallet` instead of `wallet`, which the CLI looked up in the default shadcn registry), and items declare the npm packages they import (`class-variance-authority` for `button`, `badge`, `label` and others; `lucide-react` for `dialog`, `select`, `dropdown-menu` and others). `swap-form` and `nft-card` import through `@/components/ui/*` instead of relative paths, `calendar` pins `react-day-picker@^9.14.0` (v10 breaks it), and `token-amount` no longer renders `-0`, uses the locale's decimal separator, and compiles with the default ES2017 target. `pnpm registry:check` (run before `registry:build` and in the unit suite) fails when an item imports an undeclared package or references an unknown or un-namespaced item.

## 0.1.0

Initial release of the Monark UI registry, installable with the shadcn CLI from `https://ui.monark.io/r/<name>.json`.

- **Theme**: the `theme` item (zinc base, orange primary, 0.5rem radius, Nunito Sans + JetBrains Mono).
- **Primitives**: the 46 shadcn `new-york` primitives (accordion through tooltip, including calendar, chart, carousel, form and sidebar).
- **Web3 components**: `wallet`, `connect-wallet`, `token-amount`, `network-badge`, `tx-status`.
- **App components**: `role-chip`, `trusted-device-card`, `password-strength-meter`, `image-crop-dialog`.
- **Blocks**: `swap-form`, `nft-card`.
- **Hooks**: `use-mobile`.
- **Docs site** ([ui.monark.io](https://ui.monark.io)): live previews, source, props, accessibility notes and test results for every component.
