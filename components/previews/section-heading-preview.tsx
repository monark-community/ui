"use client"

import { ArrowRightIcon } from "lucide-react"

import { SectionHeading } from "@/components/ui/section-heading"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SectionHeadingPreview() {
  const { values, entries } = useControls({
    eyebrow: { type: "text", default: "How it works" },
    title: { type: "text", default: "Three steps, all on-chain" },
    lead: {
      type: "text",
      default: "Fund the escrow, agree on milestones, release payment when the work is in.",
    },
    action: { type: "text", default: "See the details" },
    as: { type: "select", options: ["h1", "h2", "h3"], default: "h2" },
    size: { type: "select", options: ["sm", "default", "lg"], default: "default" },
    align: { type: "select", options: ["start", "center"], default: "start" },
    eyebrowTone: { type: "select", options: ["muted", "primary"], default: "muted" },
  })

  return (
    <PreviewLayout controls={entries}>
      <SectionHeading
        className="w-full max-w-4xl"
        as={values.as as "h2"}
        size={values.size as "default"}
        align={values.align as "start"}
        eyebrow={values.eyebrow || undefined}
        eyebrowTone={values.eyebrowTone as "muted"}
        title={values.title || "Section title"}
        lead={values.lead || undefined}
        action={
          values.action ? (
            <a
              href="#"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full font-semibold text-primary-ink underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:min-h-0"
            >
              {values.action}
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </a>
          ) : undefined
        }
      />
    </PreviewLayout>
  )
}
