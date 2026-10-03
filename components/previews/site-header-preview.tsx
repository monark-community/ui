"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DemoChip } from "@/components/ui/demo-chip"
import { LocaleSwitch } from "@/components/ui/locale-switch"
import { SiteBrand } from "@/components/ui/site-brand"
import { SiteHeader, type SiteNavLink } from "@/components/ui/site-header"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const locales = ["en", "fr"] as const
type Locale = (typeof locales)[number]

const copy = {
  en: {
    links: [
      { href: "/en", label: "Overview", exact: true },
      { href: "/en/how-it-works", label: "How it works" },
      { href: "/en/use-cases", label: "Use cases" },
      { href: "/en/faq", label: "FAQ" },
    ],
    action: "Open the app",
    home: "home",
  },
  fr: {
    links: [
      { href: "/fr", label: "Aperçu", exact: true },
      { href: "/fr/how-it-works", label: "Fonctionnement" },
      { href: "/fr/use-cases", label: "Cas d’usage" },
      { href: "/fr/faq", label: "FAQ" },
    ],
    action: "Ouvrir l’app",
    home: "accueil",
  },
} satisfies Record<Locale, { links: SiteNavLink[]; action: string; home: string }>

export function SiteHeaderPreview() {
  const { values, entries } = useControls({
    product: { type: "text", default: "Splitflow" },
    links: { type: "number", default: 4, min: 0, max: 4 },
    page: {
      type: "select",
      options: ["/en", "/en/how-it-works", "/en/use-cases", "/en/faq", "/fr/how-it-works"],
      default: "/en/how-it-works",
    },
    demo: { type: "boolean", default: true },
    localeSwitch: { type: "boolean", default: true },
    themeToggle: { type: "boolean", default: true },
    action: { type: "boolean", default: true },
  })

  // A tiny in-memory router so the preview's links, locale switch and
  // active state work without leaving the page. The "page" control moves it.
  const [pathname, setPathname] = useState(values.page)
  useEffect(() => setPathname(values.page), [values.page])
  const locale: Locale = pathname.startsWith("/fr") ? "fr" : "en"
  const t = copy[locale]
  const product = values.product || "Splitflow"

  const PreviewLink = React.useCallback(
    function PreviewLink({
      href,
      onClick,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
      return (
        <a
          href={href}
          onClick={(event) => {
            onClick?.(event)
            event.preventDefault()
            setPathname(href)
          }}
          {...props}
        />
      )
    },
    []
  )

  const localeSwitch = values.localeSwitch ? (
    <LocaleSwitch
      locales={locales}
      current={locale}
      hrefFor={(next) => pathname.replace(/^\/(en|fr)/, `/${next}`)}
      labels={{
        label: locale === "fr" ? "Langue" : "Language",
        names: { en: "English", fr: "Français" },
      }}
      LinkComponent={PreviewLink}
    />
  ) : null
  const demoChip = values.demo ? (
    <DemoChip label="Demo" title={locale === "fr" ? "Démo · données simulées" : "Demo · simulated data"} />
  ) : null
  const themeLabel = locale === "fr" ? "Changer de thème" : "Toggle theme"
  const action = (className?: string) => (
    <Button asChild className={className ?? "rounded-full px-4 font-bold"}>
      <PreviewLink href={`/${locale}/app`}>{t.action}</PreviewLink>
    </Button>
  )

  return (
    <PreviewLayout controls={entries}>
      <div className="w-[calc(100vw-2rem)] max-w-6xl overflow-hidden rounded-xl border">
        <SiteHeader
          className="static"
          pathname={pathname}
          LinkComponent={PreviewLink}
          brand={
            <SiteBrand
              name={product}
              href={`/${locale}`}
              aria-label={`${product}, by Monark: ${t.home}`}
              LinkComponent={PreviewLink}
            />
          }
          links={t.links.slice(0, values.links)}
          labels={
            locale === "fr"
              ? { nav: "Principal", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", menu: "Menu" }
              : undefined
          }
          actions={
            <>
              {demoChip}
              {localeSwitch}
              {values.themeToggle && <ThemeToggle label={themeLabel} />}
              {values.action && action()}
            </>
          }
          mobileActions={
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                {demoChip ?? <span />}
                <div className="flex items-center gap-2.5">
                  {localeSwitch}
                  {values.themeToggle && <ThemeToggle label={themeLabel} className="size-11" />}
                </div>
              </div>
              {values.action && action("h-12 w-full rounded-full font-bold")}
            </div>
          }
        />
        <div className="h-24 bg-background px-6 py-5 text-sm text-muted-foreground">
          Current page: <code className="font-mono">{pathname}</code>
        </div>
      </div>
    </PreviewLayout>
  )
}
