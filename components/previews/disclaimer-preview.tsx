"use client"

import { Disclaimer } from "@/components/ui/disclaimer"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function DisclaimerPreview() {
  const { values, entries } = useControls({
    variant: { type: "select", options: ["inline", "banner"], default: "inline" },
    text: { type: "text", default: "Testnet demo · not financial advice · no real funds" },
    icon: { type: "boolean", default: true },
  })

  const variant = values.variant as "inline" | "banner"

  return (
    <PreviewLayout controls={entries}>
      {variant === "banner" ? (
        <div className="w-[calc(100vw-2rem)] max-w-4xl overflow-hidden rounded-xl border">
          <Disclaimer variant="banner" text={values.text || undefined} icon={values.icon ? undefined : false} />
          <div className="h-24 bg-background px-6 py-5 text-sm text-muted-foreground">Page content</div>
        </div>
      ) : (
        <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border bg-card p-5">
          <p className="text-base font-bold">Confirm in your wallet</p>
          <p className="text-sm text-muted-foreground">Supply 250 USDC to the lending pool.</p>
          <Disclaimer text={values.text || undefined} icon={values.icon ? undefined : false} />
        </div>
      )}
    </PreviewLayout>
  )
}
