"use client"

import { useState } from "react"
import { LocaleSwitch } from "@/components/ui/locale-switch"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const locales = ["en", "fr"] as const
type Locale = (typeof locales)[number]

export function LocaleSwitchPreview() {
  // The preview stays on one page: clicking a segment only moves the
  // active state. In an app, hrefFor returns the same page in that locale.
  const [current, setCurrent] = useState<Locale>("en")

  return (
    <PreviewLayout>
      <LocaleSwitch
        locales={locales}
        current={current}
        hrefFor={(locale) => `#/${locale}/how-it-works`}
        labels={{ label: "Language", names: { en: "English", fr: "Français" } }}
        onClick={(event) => {
          const link = (event.target as Element).closest("a")
          if (!link) return
          event.preventDefault()
          setCurrent(link.getAttribute("hreflang") as Locale)
        }}
      />
    </PreviewLayout>
  )
}
