"use client"

import * as React from "react"
import { useState } from "react"
import { HeaderAction } from "@/components/ui/header-action"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

type WalletStatus = "disconnected" | "connecting" | "connected"

export function HeaderActionPreview() {
  const { values, entries } = useControls({
    page: { type: "select", options: ["/en", "/en/how-it-works", "/en/app", "/en/app/report"], default: "/en" },
    loading: { type: "boolean", default: false },
    launchLabel: { type: "text", default: "Launch demo" },
  })

  const [pathname, setPathname] = useState(values.page)
  React.useEffect(() => setPathname(values.page), [values.page])
  const [status, setStatus] = useState<WalletStatus>("disconnected")

  const PreviewLink = React.useCallback(function PreviewLink({
    href,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a
        href={href}
        onClick={(event) => {
          onClick?.(event)
          event.preventDefault()
          setPathname(href)
        }}
        {...props}
      />
    )
  }, [])

  return (
    <PreviewLayout controls={entries}>
      <div className="flex flex-col items-center gap-3">
        <HeaderAction
          appHref="/en/app"
          pathname={pathname}
          launchLabel={values.launchLabel || undefined}
          LinkComponent={PreviewLink}
          loading={values.loading}
          wallet={{
            status,
            address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
            name: "Alex",
            onConnect: () => {
              setStatus("connecting")
              setTimeout(() => setStatus("connected"), 900)
            },
            onDisconnect: () => setStatus("disconnected"),
          }}
        />
        <p className="text-xs text-muted-foreground">
          Current page: <code className="font-mono">{pathname}</code>
        </p>
      </div>
    </PreviewLayout>
  )
}
