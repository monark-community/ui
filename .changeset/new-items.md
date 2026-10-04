---
"@monark/ui": minor
---

Sixteen new items and three new variants, built from the patterns the 15 demo sites hand-roll. Each one takes plain props: strings have English defaults, and nothing imports an i18n library, a store or `next/link`.

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
