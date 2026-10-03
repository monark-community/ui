"use client"

import { useState } from "react"
import { LocaleSwitch } from "@/components/ui/locale-switch"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const NAMES: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
}

const SETS: Record<string, readonly string[]> = {
  "en, fr": ["en", "fr"],
  "en, fr, es": ["en", "fr", "es"],
  "en, fr, es, de": ["en", "fr", "es", "de"],
}

export function LocaleSwitchPreview() {
  const { values, entries } = useControls({
    locales: { type: "select", options: Object.keys(SETS), default: "en, fr" },
    label: { type: "text", default: "Language" },
  })
  const locales = SETS[values.locales]

  // The preview stays on one page: clicking a segment only moves the
  // active state. In an app, hrefFor returns the same page in that locale.
  const [current, setCurrent] = useState("en")

  return (
    <PreviewLayout controls={entries}>
      <LocaleSwitch
        locales={locales}
        current={locales.includes(current) ? current : locales[0]}
        hrefFor={(locale) => `#/${locale}/how-it-works`}
        labels={{ label: values.label, names: NAMES }}
        onClick={(event) => {
          const link = (event.target as Element).closest("a")
          if (!link) return
          event.preventDefault()
          setCurrent(link.getAttribute("hreflang") ?? "en")
        }}
      />
    </PreviewLayout>
  )
}
