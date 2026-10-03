"use client"

import {
  PasswordStrengthMeter,
  type PasswordStrengthScore,
} from "@/components/ui/password-strength-meter"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function PasswordStrengthMeterPreview() {
  const { values, entries } = useControls({
    score: { type: "number", default: 2, min: 0, max: 4 },
  })

  const score = Math.min(4, Math.max(0, Math.round(values.score))) as PasswordStrengthScore

  return (
    <PreviewLayout controls={entries}>
      <PasswordStrengthMeter score={score} className="w-[320px] max-w-full" />
    </PreviewLayout>
  )
}
