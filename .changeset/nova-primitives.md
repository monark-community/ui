---
"@monark/ui": major
---

The 45 shadcn primitives now use shadcn's current `radix-nova` generation with the Monark look the branded demo sites already run, so `npx shadcn add @monark/<item>` gives the same component a demo ships instead of one it has to restyle.

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
