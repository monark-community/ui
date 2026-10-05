"use client"

import { CalculatorIcon } from "lucide-react"
import { Disclosure } from "@/components/ui/disclosure"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function DisclosurePreview() {
  const { values, entries } = useControls({
    variant: { type: "select", options: ["card", "pill"], default: "card" },
    summary: { type: "text", default: "How this score is calculated" },
    icon: { type: "boolean", default: true },
    defaultOpen: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      <Disclosure
        // Remount so defaultOpen takes effect when toggled.
        key={String(values.defaultOpen)}
        variant={values.variant as "card"}
        summary={values.summary || "Show details"}
        icon={values.icon ? <CalculatorIcon /> : undefined}
        defaultOpen={values.defaultOpen}
        className="w-[min(28rem,calc(100vw-4rem))]"
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          <dt className="text-muted-foreground">Reviews</dt>
          <dd className="text-right tabular-nums">12</dd>
          <dt className="text-muted-foreground">Weighted sum</dt>
          <dd className="text-right tabular-nums">41.6</dd>
          <dt className="text-muted-foreground">Score</dt>
          <dd className="text-right font-semibold tabular-nums">4.3 / 5</dd>
        </dl>
      </Disclosure>
    </PreviewLayout>
  )
}
