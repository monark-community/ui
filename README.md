# @monark/ui

Web3-native components for React, copy-paste installable via the [shadcn CLI](https://ui.shadcn.com/docs/cli).

[**ui.monark.io →**](https://ui.monark.io) &nbsp; Browse, preview, and install components.

## What it is

`@monark/ui` is a shadcn-compatible component registry. Every piece is a plain React file you copy into your codebase and own; there is no runtime dependency on Monark, no black-box wrapper, no lock-in.

It ships the full set of shadcn primitives (buttons, inputs, dialogs, data tables, 46 in total) alongside five web3-first components and three composed blocks built for on-chain product surfaces:

**Primitives (web3)**

- `Wallet`: MetaMask-style jazzicon avatar, optional name, truncated address, copy button
- `ConnectWallet`: three-state connection control (disconnected / connecting / connected)
- `TokenAmount`: formats a `bigint` of base units with optional symbol + fiat line
- `NetworkBadge`: chain pill with icon slot and three variants
- `TxStatus`: pending / confirmed / failed row with explorer link

**Blocks**

- `WalletDrawer`: the full account surface; identity, chain, balance, recent transactions, disconnect
- `SwapForm`: two-sided token swap UI with reverse, slippage, and a status-driven submit
- `NftCard`: NFT tile with image, collection tag, trait grid, price, and action slot

All web3 components are presentational. They accept props, emit callbacks, and never fetch, sign, or broadcast; you wire them to wagmi, viem, RainbowKit, or whatever connector stack you already run.

## Install

```bash
# 1. Initialize shadcn in your project (once)
npx shadcn@latest init

# 2. Apply the Monark theme (zinc base, orange primary, Nunito Sans)
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

Tokens live in [`styles/theme.css`](styles/theme.css) and ship to consumers as the `theme` registry item. Remap a color, radius, or font by overriding the CSS variable; no component edits needed.

```css
:root {
  --primary: oklch(0.75 0.15 180); /* teal instead of orange */
  --radius: 0.75rem;
}
```

See the [Theming guide](https://ui.monark.io/docs/theming) for the full token list.

## Local development

```bash
pnpm install
pnpm shell            # runs the registry-shell viewer at localhost:3000
pnpm shell:build      # static build under ./out
pnpm test             # vitest unit suite
pnpm test:e2e         # playwright a11y + visual + mount-time suites
pnpm generate:all     # regenerates props + a11y + test docs from source
```

## Structure

```
components/
  ui/             component sources (mirrored from shadcn's new-york style)
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
- **Style**: shadcn `new-york`, Tailwind CSS v4, zinc base + orange theme, 0.5rem radius.
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

## License

See [LICENSE](./LICENSE).
