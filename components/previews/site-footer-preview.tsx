"use client"

import * as React from "react"
import { SiteFooter } from "@/components/ui/site-footer"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

// Keeps the preview's links from leaving the page.
function PreviewLink({
  onClick,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      onClick={(event) => {
        onClick?.(event)
        event.preventDefault()
      }}
      {...props}
    />
  )
}

export function SiteFooterPreview() {
  const { values, entries } = useControls({
    product: { type: "text", default: "LedgerLift" },
    description: {
      type: "text",
      default: "Wallet history turned into books your accountant can read.",
    },
    links: { type: "number", default: 4, min: 0, max: 4 },
    resources: { type: "boolean", default: true },
    socials: { type: "boolean", default: true },
    demoNotice: { type: "boolean", default: true },
    family: { type: "boolean", default: false },
  })

  const product = values.product || "LedgerLift"
  const links = [
    { href: "/en", label: "Overview" },
    { href: "/en/how-it-works", label: "How it works" },
    { href: "/en/app", label: "Demo" },
    { href: "/en/credits", label: "Credits" },
  ].slice(0, values.links)

  return (
    <PreviewLayout controls={entries}>
      <div className="w-[min(72rem,calc(100vw-4rem))] overflow-hidden rounded-xl border">
        <div className="h-24 bg-background px-6 py-5 text-sm text-muted-foreground">Page content</div>
        <SiteFooter
          product={product}
          description={values.description || undefined}
          links={links}
          LinkComponent={PreviewLink}
          labels={{ productNav: `${product} pages`, builtBy: `${product} is built by Monark` }}
          resources={
            values.resources
              ? [
                  { href: "https://www.monark.io", label: "Project page on monark.io" },
                  { href: "https://github.com/monark-community", label: "Source on GitHub" },
                ]
              : []
          }
          socials={values.socials ? undefined : []}
          demoNotice={values.demoNotice ? "Demo · simulated data" : null}
          legalLinks={[{ href: "/en/credits", label: "Photo credits" }]}
        >
          {values.family ? (
            <nav
              aria-label="The Monark DeFi family"
              className="flex flex-col gap-3 rounded-2xl border border-dashed p-4 sm:flex-row sm:items-center sm:gap-6"
            >
              <p className="shrink-0 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                The Monark DeFi family
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {["Swaps", "Lending", "Loans"].map((name) => (
                  <li key={name}>
                    <a href="#" className="font-bold text-foreground underline-offset-4 hover:underline">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </SiteFooter>
      </div>
    </PreviewLayout>
  )
}
