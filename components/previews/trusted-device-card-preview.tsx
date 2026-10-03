"use client"

import { TrustedDeviceCard } from "@/components/ui/trusted-device-card"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

// Fixed locale and time zone so the server and client render the same date.
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

const devices: Record<string, { vendor: string; model: string; userAgent: string }> = {
  desktop: {
    vendor: "Apple",
    model: "MacBook Pro",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/129.0",
  },
  mobile: {
    vendor: "Google",
    model: "Pixel 8",
    userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 8) Chrome/129.0 Mobile",
  },
  tablet: {
    vendor: "Apple",
    model: "iPad Air",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) Safari/605.1",
  },
  smarttv: {
    vendor: "Samsung",
    model: "Smart TV",
    userAgent: "Mozilla/5.0 (SMART-TV; Linux; Tizen 8.0) SamsungBrowser/7.0",
  },
  wearable: {
    vendor: "Apple",
    model: "Watch",
    userAgent: "watchOS/11.0",
  },
}

export function TrustedDeviceCardPreview() {
  const { values, entries } = useControls({
    label: { type: "text", default: "Chrome on macOS" },
    deviceType: {
      type: "select",
      options: ["desktop", "mobile", "tablet", "smarttv", "wearable"],
      default: "desktop",
    },
    size: { type: "select", options: ["default", "compact"], default: "default" },
    isCurrent: { type: "boolean", default: false },
    revocable: { type: "boolean", default: true },
    revokePending: { type: "boolean", default: false },
    ip: { type: "text", default: "192.0.2.14" },
    country: { type: "text", default: "Canada" },
  })

  const device = devices[values.deviceType]

  return (
    <PreviewLayout controls={entries}>
      <TrustedDeviceCard
        className="w-[380px] max-w-full"
        label={values.label}
        deviceType={values.deviceType === "desktop" ? null : values.deviceType}
        deviceVendor={device.vendor}
        deviceModel={device.model}
        userAgent={device.userAgent}
        lastSeenAt="2026-09-30T14:20:00Z"
        firstSeenAt="2026-03-12T09:05:00Z"
        lastSeenIp={values.ip || null}
        country={values.country || null}
        isCurrent={values.isCurrent}
        onRevoke={values.revocable ? () => {} : undefined}
        revokePending={values.revokePending}
        size={values.size as "default"}
        formatDate={formatDate}
      />
    </PreviewLayout>
  )
}
