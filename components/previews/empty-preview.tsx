"use client"

import { InboxIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function EmptyPreview() {
  const { values, entries } = useControls({
    title: { type: "text", default: "No bounties yet" },
    description: {
      type: "text",
      default: "Post the first one and contributors will see it here.",
    },
    action: { type: "text", default: "Post a bounty" },
    showIcon: { type: "boolean", default: true },
    align: { type: "select", options: ["center", "start"], default: "center" },
    size: { type: "select", options: ["sm", "default", "lg"], default: "default" },
  })

  return (
    <PreviewLayout controls={entries}>
      <Empty
        align={values.align as "center"}
        size={values.size as "default"}
        className="max-w-xl"
      >
        {values.showIcon ? (
          <EmptyMedia>
            <InboxIcon />
          </EmptyMedia>
        ) : null}
        <EmptyHeader>
          {values.title ? <EmptyTitle>{values.title}</EmptyTitle> : null}
          {values.description ? (
            <EmptyDescription>{values.description}</EmptyDescription>
          ) : null}
        </EmptyHeader>
        {values.action ? (
          <EmptyContent>
            <Button>
              <PlusIcon aria-hidden="true" />
              {values.action}
            </Button>
          </EmptyContent>
        ) : null}
      </Empty>
    </PreviewLayout>
  )
}
