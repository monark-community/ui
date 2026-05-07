import * as React from "react"
import { Laptop, Smartphone, Tablet, Tv, Watch, Monitor } from "lucide-react"

import { cn } from "@/lib/utils"

type DeviceKind = "desktop" | "mobile" | "tablet" | "tv" | "wearable" | "unknown"

const DEVICE_ICONS: Record<DeviceKind, React.ElementType> = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Tablet,
  tv: Tv,
  wearable: Watch,
  unknown: Monitor,
}

function resolveKind(deviceType?: string | null): DeviceKind {
  if (!deviceType) return "desktop"
  const map: Record<string, DeviceKind> = {
    mobile: "mobile",
    tablet: "tablet",
    console: "tv",
    smarttv: "tv",
    wearable: "wearable",
    embedded: "unknown",
    xr: "unknown",
  }
  return map[deviceType] ?? "unknown"
}

export interface TrustedDeviceCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary device label, e.g. "Chrome on macOS". */
  label: string
  /** Raw User-Agent string (displayed as secondary text in default size). */
  userAgent?: string | null
  /**
   * ua-parser-js `device.type` value ("mobile" | "tablet" | "console" |
   * "smarttv" | "wearable" | "embedded" | "xr" | undefined).
   * Empty / undefined falls back to desktop.
   */
  deviceType?: string | null
  /** Manufacturer / OEM, e.g. "Apple", "Samsung". */
  deviceVendor?: string | null
  /** Model name, e.g. "Pixel 7", "iPhone". */
  deviceModel?: string | null
  /** Last-seen timestamp; accepts Date or ISO string. */
  lastSeenAt: Date | string
  /** IP address of the last session. */
  lastSeenIp?: string | null
  /** Country code or name for geo display. */
  country?: string | null
  /** First-seen timestamp; accepts Date or ISO string. */
  firstSeenAt?: Date | string | null
  /** Marks this as the current session device. */
  isCurrent?: boolean
  /** Callback to revoke the device. Renders a revoke button when provided. */
  onRevoke?: () => void
  /** Label for the revoke button. */
  revokeLabel?: string
  /** Disables the revoke button during pending operations. */
  revokePending?: boolean
  /** "default" for the full card; "compact" for tighter surfaces. */
  size?: "default" | "compact"
  /** Localized "Last seen" label. */
  lastSeenLabel?: string
  /** Localized "First seen" label. */
  firstSeenLabel?: string
  /** Localized "Current device" label. */
  currentLabel?: string
  /**
   * Formatter for dates. Receives a Date and returns a display string.
   * Defaults to `toLocaleDateString()`.
   */
  formatDate?: (date: Date) => string
}

function toDate(v: Date | string): Date {
  return typeof v === "string" ? new Date(v) : v
}

/**
 * Trusted device card showing device type icon, label, metadata, and
 * an optional revoke action. Schema-agnostic; the caller passes
 * already-formatted primitives so this is portable across projects.
 */
function TrustedDeviceCard({
  label,
  userAgent,
  deviceType,
  deviceVendor,
  deviceModel,
  lastSeenAt,
  lastSeenIp,
  country,
  firstSeenAt,
  isCurrent,
  onRevoke,
  revokeLabel = "Revoke",
  revokePending,
  size = "default",
  lastSeenLabel = "Last seen",
  firstSeenLabel = "First seen",
  currentLabel = "Current device",
  formatDate,
  className,
  ...props
}: TrustedDeviceCardProps) {
  const kind = resolveKind(deviceType)
  const Icon = DEVICE_ICONS[kind]
  const fmt = formatDate ?? ((d: Date) => d.toLocaleDateString())
  const compact = size === "compact"

  const deviceLine = [deviceVendor, deviceModel].filter(Boolean).join(" ")

  return (
    <div
      data-slot="trusted-device-card"
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground",
        compact && "p-2 gap-2",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-muted",
          compact ? "size-8" : "size-10",
        )}
      >
        <Icon className={cn(compact ? "size-4" : "size-5", "text-muted-foreground")} />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-2">
          <p className={cn("truncate font-medium", compact ? "text-xs" : "text-sm")}>
            {label}
          </p>
          {isCurrent && (
            <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              {currentLabel}
            </span>
          )}
        </div>

        {deviceLine && !compact && (
          <p className="truncate text-xs text-muted-foreground">{deviceLine}</p>
        )}

        {!compact && userAgent && (
          <p className="truncate text-xs text-muted-foreground">{userAgent}</p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span>
            {lastSeenLabel}: {fmt(toDate(lastSeenAt))}
          </span>
          {lastSeenIp && <span>{lastSeenIp}</span>}
          {country && <span>{country}</span>}
          {firstSeenAt && !compact && (
            <span>
              {firstSeenLabel}: {fmt(toDate(firstSeenAt))}
            </span>
          )}
        </div>
      </div>

      {onRevoke && !isCurrent && (
        <button
          type="button"
          onClick={onRevoke}
          disabled={revokePending}
          className={cn(
            "shrink-0 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {revokeLabel}
        </button>
      )}
    </div>
  )
}

export { TrustedDeviceCard, type DeviceKind }
