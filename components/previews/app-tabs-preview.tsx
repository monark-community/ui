"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { FileTextIcon, LayoutDashboardIcon, SettingsIcon, Share2Icon, TrophyIcon } from "lucide-react"
import { AppTabs, type AppTab } from "@/components/ui/app-tabs"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const base: (Omit<AppTab, "icon"> & { icon: React.ReactNode })[] = [
  { href: "/en/app", label: "Dashboard", exact: true, icon: <LayoutDashboardIcon /> },
  { href: "/en/app/invite", label: "Invite", icon: <Share2Icon /> },
  { href: "/en/app/leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
  { href: "/en/app/report", label: "Report", icon: <FileTextIcon /> },
  { href: "/en/app/settings", label: "Settings", icon: <SettingsIcon /> },
]

export function AppTabsPreview() {
  const { values, entries } = useControls({
    tabs: { type: "number", default: 3, min: 1, max: 5 },
    icons: { type: "boolean", default: true },
    count: { type: "number", default: 2, min: 0, max: 99 },
    actions: { type: "boolean", default: true },
  })

  const [pathname, setPathname] = useState("/en/app")
  const tabs: AppTab[] = base.slice(0, values.tabs).map((tab, i) => ({
    ...tab,
    icon: values.icons ? tab.icon : undefined,
    iconDesktopOnly: true,
    count: i === 1 ? values.count : undefined,
    countLabel: i === 1 ? `${values.count} pending invites` : undefined,
  }))
  useEffect(() => {
    if (!tabs.some((t) => t.href === pathname)) setPathname("/en/app")
  }, [tabs, pathname])

  const PreviewLink = React.useCallback(function PreviewLink({
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
  }, [])

  return (
    <PreviewLayout controls={entries}>
      <div className="w-[calc(100vw-2rem)] max-w-6xl overflow-hidden rounded-xl border">
        <AppTabs
          tabs={tabs}
          pathname={pathname}
          LinkComponent={PreviewLink}
          actions={
            values.actions ? (
              <span className="inline-flex h-9 items-center gap-2 rounded-full border bg-card px-3 text-xs font-semibold">
                <span aria-hidden="true" className="size-2 rounded-full bg-success" />
                Sepolia
              </span>
            ) : undefined
          }
        />
        <div className="h-24 bg-background px-6 py-5 text-sm text-muted-foreground">
          Current page: <code className="font-mono">{pathname}</code>
        </div>
      </div>
    </PreviewLayout>
  )
}
