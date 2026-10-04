"use client"

import * as React from "react"

import { DemoControls, DemoControlsToggle } from "@/components/ui/demo-controls"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function DemoControlsPreview() {
  const { values, entries } = useControls({
    networkName: { type: "text", default: "Sepolia" },
    extraToggle: { type: "boolean", default: true },
  })
  const [slow, setSlow] = React.useState(false)
  const [failNext, setFailNext] = React.useState(false)
  const [ambassador, setAmbassador] = React.useState(false)
  const [resets, setResets] = React.useState(0)

  return (
    <PreviewLayout controls={entries}>
      <div className="flex flex-col items-center gap-3">
        <DemoControls
          networkName={values.networkName || undefined}
          slow={slow}
          onSlowChange={setSlow}
          failNext={failNext}
          onFailNextChange={setFailNext}
          onReset={() => {
            setSlow(false)
            setFailNext(false)
            setAmbassador(false)
            setResets((n) => n + 1)
          }}
        >
          {values.extraToggle ? (
            <DemoControlsToggle
              label="Give me the ambassador role"
              hint="Unlocks ambassador-only bounties."
              checked={ambassador}
              onCheckedChange={setAmbassador}
            />
          ) : null}
        </DemoControls>
        <p className="text-sm text-muted-foreground">Resets: {resets}</p>
      </div>
    </PreviewLayout>
  )
}
