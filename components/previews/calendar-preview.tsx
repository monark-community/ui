"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function CalendarPreview() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = new Date()
    const to = new Date()
    to.setDate(from.getDate() + 4)
    return { from, to }
  })

  const { values, entries } = useControls({
    mode: { type: "select", options: ["single", "range"], default: "single" },
    captionLayout: {
      type: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
      default: "label",
    },
    numberOfMonths: { type: "number", default: 1, min: 1, max: 3 },
    showOutsideDays: { type: "boolean", default: true },
    buttonVariant: {
      type: "select",
      options: ["ghost", "outline", "secondary", "default"],
      default: "ghost",
    },
  })

  const common = {
    captionLayout: values.captionLayout as "label",
    numberOfMonths: Math.min(Math.max(Math.round(values.numberOfMonths), 1), 3),
    showOutsideDays: values.showOutsideDays,
    buttonVariant: values.buttonVariant as "ghost",
    className: "rounded-md border w-fit",
  }

  return (
    <PreviewLayout controls={entries}>
      {values.mode === "range" ? (
        <Calendar mode="range" selected={range} onSelect={setRange} {...common} />
      ) : (
        <Calendar mode="single" selected={date} onSelect={setDate} {...common} />
      )}
    </PreviewLayout>
  )
}
