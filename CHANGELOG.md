# @monark/ui

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
