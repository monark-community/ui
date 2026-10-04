"use client"

import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemDescription,
  RadioGroupItemTitle,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const PLANS = [
  { value: "starter", title: "Starter", description: "Up to 3 members · community support" },
  { value: "team", title: "Team", description: "Up to 25 members · email support" },
  { value: "business", title: "Business", description: "Unlimited members · priority support" },
]

export function RadioGroupPreview() {
  const { values, entries } = useControls({
    variant: { type: "select", options: ["default", "card"], default: "default" },
    disabled: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      {values.variant === "card" ? (
        <RadioGroup
          variant="card"
          defaultValue="team"
          disabled={values.disabled}
          aria-label="Plan"
          className="max-w-2xl sm:grid-cols-3"
        >
          {PLANS.map((p) => (
            <RadioGroupItem key={p.value} value={p.value}>
              <RadioGroupItemTitle>{p.title}</RadioGroupItemTitle>
              <RadioGroupItemDescription>{p.description}</RadioGroupItemDescription>
            </RadioGroupItem>
          ))}
        </RadioGroup>
      ) : (
        <RadioGroup defaultValue="comfortable" disabled={values.disabled} aria-label="Density">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Default</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label htmlFor="r2">Comfortable</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="compact" id="r3" />
            <Label htmlFor="r3">Compact</Label>
          </div>
        </RadioGroup>
      )}
    </PreviewLayout>
  )
}
