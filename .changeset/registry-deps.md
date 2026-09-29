---
"@monark/ui": patch
---

Fix `npx shadcn add @monark/<item>` in fresh apps. Every `registryDependencies` entry is now namespaced (`@monark/wallet` instead of `wallet`, which the CLI looked up in the default shadcn registry), and items declare the npm packages they import (`class-variance-authority` for `button`, `badge`, `label` and others; `lucide-react` for `dialog`, `select`, `dropdown-menu` and others). `swap-form` and `nft-card` import through `@/components/ui/*` instead of relative paths, `calendar` pins `react-day-picker@^9.14.0` (v10 breaks it), and `token-amount` no longer renders `-0`, uses the locale's decimal separator, and compiles with the default ES2017 target. `pnpm registry:check` (run before `registry:build` and in the unit suite) fails when an item imports an undeclared package or references an unknown or un-namespaced item.
