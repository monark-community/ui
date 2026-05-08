import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Role / tag pill with a tinted background derived from a hex colour.
 * When `color` is provided the chip uses a 15 % alpha fill and a
 * matching dot; when absent it falls back to a neutral muted style.
 *
 * Optional `onRemove` renders a small ✕ button inside the pill.
 */
function RoleChip({
  name,
  color,
  className,
  onRemove,
  removeAriaLabel,
  removeDisabled,
  ...props
}: Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Visible label. */
  name: string
  /** Hex colour (`#RGB` or `#RRGGBB`) for the tinted background. */
  color?: string | null
  /** Callback when the remove button is clicked. Renders the ✕ when provided. */
  onRemove?: () => void
  /** Accessible label for the remove button. */
  removeAriaLabel?: string
  /** Disables the remove button without hiding it. */
  removeDisabled?: boolean
}) {
  const tint = color
    ? {
        "--role-chip-color": color,
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
      }
    : undefined

  return (
    <span
      data-slot="role-chip"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        color
          ? "border-transparent text-foreground"
          : "border-border bg-muted text-muted-foreground",
        className,
      )}
      style={tint as React.CSSProperties}
      {...props}
    >
      {color && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={removeDisabled}
          aria-label={removeAriaLabel ?? `Remove ${name}`}
          className="ml-0.5 inline-flex size-3.5 shrink-0 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-30"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  )
}

export { RoleChip }
