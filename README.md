# @monark/ui

Web3-native components for React, copy-paste installable via the [shadcn CLI](https://ui.shadcn.com/docs/cli).

[**ui.monark.io →**](https://ui.monark.io) &nbsp; Browse, preview, and install components.

## What it is

`@monark/ui` is a shadcn-compatible component registry. Every piece is a plain React file you copy into your codebase and own; there is no runtime dependency on Monark, no black-box wrapper, no lock-in.

It ships 77 components and two blocks, grouped the same way as the [docs sidebar](https://ui.monark.io):

| Group | Components |
|---|---|
| Actions | `button`, `toggle`, `toggle-group` (`pill` and `chip` variants) |
| Forms | `input`, `input-group`, `input-otp`, `textarea`, `label`, `checkbox`, `radio-group` (`card` variant), `switch`, `slider`, `select`, `native-select`, `calendar`, `form`, `field-error`, `password-strength-meter` |
| Overlays | `dialog`, `alert-dialog`, `sheet`, `drawer`, `popover`, `hover-card`, `tooltip`, `info-tip`, `dropdown-menu`, `context-menu`, `command`, `image-crop-dialog` |
| Navigation | `tabs`, `breadcrumb`, `pagination`, `menubar`, `navigation-menu`, `sidebar` |
| Layout | `card`, `separator`, `aspect-ratio`, `resizable`, `scroll-area`, `accordion` (`plus` variant), `collapsible`, `disclosure`, `carousel`, `section-heading`, `section-divider` |
| Data display | `table`, `chart`, `stat`, `badge`, `avatar`, `role-chip`, `trusted-device-card` |
| Feedback | `alert`, `sonner`, `progress`, `skeleton`, `empty` |
| Web3 | `wallet`, `connect-wallet`, `token-amount`, `network-badge`, `tx-status`, `tx-feedback`, `wallet-prompt` |
| Site shell | `site-header`, `site-brand`, `site-footer`, `header-action`, `demo-chip`, `locale-switch`, `theme-toggle`, `disclaimer` ([Site Shell guide](https://ui.monark.io/docs/site-shell)) |
| Demo app | `app-tabs`, `app-loading`, `demo-controls` |

**Blocks:** `swap-form` (two-sided token swap with reverse, slippage and a status-driven submit) and `nft-card` (image, collection tag, traits, price and an action slot).

All web3 components are presentational. They accept props, emit callbacks, and never fetch, sign, or broadcast; you wire them to wagmi, viem, RainbowKit, or whatever connector stack you already run.

## Install

```bash
# 1. Initialize shadcn in your project (once)
npx shadcn@latest init

# 2. Apply the Monark theme (cream and espresso, orange primary, Nunito Sans)
npx shadcn@latest add https://ui.monark.io/r/theme.json
```

Then register Monark as a named source in your `components.json`:

```json
{
  "registries": {
    "@monark": "https://ui.monark.io/r/{name}.json"
  }
}
```

And install components with the short form:

```bash
npx shadcn@latest add @monark/button
npx shadcn@latest add @monark/wallet @monark/connect-wallet @monark/tx-status
```

Each component lands in `components/ui/` (or `registry/new-york/blocks/<name>/` for blocks) and brings its dependencies with it. Nothing else is installed, nothing else phones home.

## Use

```tsx
import { Wallet } from "@/components/ui/wallet"

export default function Page() {
  return (
    <Wallet
      address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
      name="vitalik.eth"
    />
  )
}
```

For the web3 components, see the [Web3 Integration guide](https://ui.monark.io/docs/web3) for wagmi + viem wiring patterns.

## What you get per component

Every component page on [ui.monark.io](https://ui.monark.io) includes:

- **Interactive preview** with live props controls
- **Source**: the exact file the CLI writes
- **Props**: auto-extracted from TypeScript via `react-docgen-typescript`
- **Accessibility**: keyboard map, focus behavior, screen reader notes, contrast claims, consumer responsibilities; real docs, not placeholders
- **Tests**: unit-test coverage and a11y / visual / mount-time e2e results
- **Install**: the one-line CLI command for this specific component

## Theming

Tokens live in [`styles/theme.css`](styles/theme.css) and ship to consumers as the `theme` registry item: the Monark 2026 brand, with a warm cream light mode and an espresso dark mode. Surfaces, borders, and text are derived from `--primary` with CSS relative color, so changing the primary re-tints them; `--surface-tint` sets how much (`0` gives neutral surfaces). Browsers without relative color get the same colors as fixed values. Remap a color, radius, or font by overriding the CSS variable; no component edits needed.

```css
:root {
  --primary: #14b8a6; /* teal instead of orange; surfaces follow */
  --radius: 0.5rem;
}
```

The docs site has a theme panel (the sun/moon button) to try a primary color and tint live and copy the resulting CSS. The pre-1.0 zinc theme stays installable from `https://ui.monark.io/r/v0.1.0/theme.json`.

See the [Theming guide](https://ui.monark.io/docs/theming) for the full token list.

## Local development

```bash
pnpm install
pnpm shell            # runs the registry-shell viewer at localhost:3000
pnpm shell:build      # static build under ./out
pnpm test             # vitest unit suite
pnpm registry:check   # every item declares the npm packages and @monark/* items it imports
pnpm registry:build   # registry:check, then shadcn build into public/r/
pnpm test:e2e         # playwright a11y + visual + mount-time suites
pnpm generate:all     # regenerates props + a11y + test docs from source
```

## Structure

```
components/
  ui/             component sources (shadcn's radix-nova style with the Monark look)
  previews/       preview wrappers rendered on each component page
registry/
  new-york/
    blocks/       composed patterns (swap-form, nft-card)
content/
  docs/           MDX docs (getting started, theming, web3, anatomy)
  a11y/           per-component accessibility YAML
styles/
  theme.css       design tokens, fonts, shell-side CSS overlays
registry.json     shadcn manifest consumed by the CLI
public/
  r/              built per-component manifests served at /r/<name>.json
```

## Stack

- **Shell**: [`@sntlr/registry-shell`](https://www.npmjs.com/package/@sntlr/registry-shell), a static-exported Next.js app that renders the docs + preview site.
- **Style**: shadcn `radix-nova` (function components, the `radix-ui` package, `cn`), Tailwind CSS v4, Monark 2026 theme (cream and espresso, orange primary), 1rem radius.
- **Fonts**: Nunito Sans for body and headings; JetBrains Mono for code.
- **Icons**: [Lucide](https://lucide.dev).
- **Jazzicons**: [`react-jazzicon`](https://github.com/marcusmolchany/react-jazzicon) for wallet avatars (MetaMask's deterministic palette).

## Contributing

Bug reports, component requests, and a11y corrections are welcome. Open an issue or PR at [github.com/monark-community/ui](https://github.com/monark-community/ui). When adding a component:

1. Place the source under `components/ui/<name>.tsx`.
2. Add a preview at `components/previews/<name>-preview.tsx`.
3. Register it in `registry.json`.
4. Write a real a11y YAML at `content/a11y/<name>.yaml`; no TODO stubs.
5. Run `pnpm generate:all` and include the updated JSON in your PR.
6. Add unit tests under `tests/unit/components/` for anything beyond plain styling.
7. Add a changeset with `pnpm changeset` (major = visual or API breaking, minor = new component or prop, patch = fix). See [Releases](CONTRIBUTING.md#3-releases).

## Releases

Releases are managed with [Changesets](https://changesets.dev); see [`CHANGELOG.md`](CHANGELOG.md) for what changed in each version. Every PR that changes the registry adds a changeset, merged changesets collect in a **Version packages** PR, and merging it tags `v<version>` and creates the GitHub release. The registry is not published to npm.

## License

See [LICENSE](./LICENSE).
