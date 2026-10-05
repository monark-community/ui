"use client"

import * as React from "react"
import {
  ArrowLeftRight,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  Coins,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  UserRound,
  Users,
  Vote,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { MonarkMark } from "@/components/ui/site-brand"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "cn"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

interface NavItem {
  title: string
  icon: LucideIcon
  badge?: number
  items?: string[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard },
      { title: "Wallets", icon: Wallet, badge: 3, items: ["Main vault", "Treasury multisig", "Hot wallet"] },
      { title: "Transactions", icon: ArrowLeftRight, badge: 12, items: ["Pending", "Confirmed", "Failed"] },
    ],
  },
  {
    label: "Community",
    items: [
      { title: "Governance", icon: Vote, badge: 2, items: ["Active proposals", "Passed", "Drafts"] },
      { title: "Delegates", icon: Users },
      { title: "Staking", icon: Coins },
    ],
  },
  {
    label: "Workspace",
    items: [{ title: "Settings", icon: Settings, items: ["General", "Networks", "API keys"] }],
  },
]

interface Active {
  group: string
  item: string
  sub?: string
}

const matches = (text: string, query: string) => text.toLowerCase().includes(query)

/** Filters the nav by the search query, keeping parents whose sub-items match. */
function filterNav(query: string): NavGroup[] {
  const q = query.trim().toLowerCase()
  if (!q) return NAV
  return NAV.map((group) => ({
    ...group,
    items: group.items.flatMap((item) => {
      if (matches(item.title, q)) return [item]
      const subs = item.items?.filter((sub) => matches(sub, q)) ?? []
      return subs.length > 0 ? [{ ...item, items: subs }] : []
    }),
  })).filter((group) => group.items.length > 0)
}

function NavUser() {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src="https://api.dicebear.com/9.x/notionists/svg?seed=Monarch" alt="" />
                <AvatarFallback className="rounded-lg">AN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Ada Nakamoto</span>
                <span className="truncate font-mono text-xs text-muted-foreground">ada.eth</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            className="min-w-56"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="grid text-sm leading-tight">
                <span className="font-medium text-foreground">Ada Nakamoto</span>
                <span className="font-mono text-xs text-muted-foreground">0x71C7…976F</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserRound />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Wallet />
                Connected wallets
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function SidebarPreview() {
  const { values, entries } = useControls({
    variant: {
      type: "select",
      options: ["sidebar", "floating", "inset"],
      default: "sidebar",
    },
    collapsible: {
      type: "select",
      options: ["offcanvas", "icon", "none"],
      default: "icon",
    },
    side: {
      type: "select",
      options: ["left", "right"],
      default: "left",
    },
  })

  const [active, setActive] = React.useState<Active>({ group: "Overview", item: "Dashboard" })
  const [open, setOpen] = React.useState<Record<string, boolean>>({})
  const [query, setQuery] = React.useState("")

  const nav = filterNav(query)
  const searching = query.trim() !== ""
  const collapsible = values.collapsible as "offcanvas" | "icon" | "none"
  const side = values.side as "left" | "right"

  const select = (next: Active) => setActive(next)

  return (
    <PreviewLayout controls={entries}>
      <TooltipProvider>
        <div className="relative h-[36rem] w-[min(60rem,calc(100vw-4rem))] overflow-hidden rounded-xl border bg-background">
          <SidebarProvider defaultOpen className="h-full min-h-0!">
            <Sidebar
              variant={values.variant as "sidebar" | "floating" | "inset"}
              collapsible={collapsible}
              side={side}
              // The sidebar is `fixed` to the viewport by default; pin it to
              // this box instead so the preview stays self-contained.
              className={
                collapsible === "none"
                  ? cn("h-full", side === "right" ? "order-last border-l" : "border-r")
                  : "absolute! h-full!"
              }
            >
              <SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      size="lg"
                      tooltip="Monark Demo"
                      onClick={() => select({ group: "Overview", item: "Dashboard" })}
                    >
                      <MonarkMark className="size-8!" />
                      <div className="grid flex-1 text-left leading-tight">
                        <span className="truncate text-base font-extrabold tracking-[-0.02em]">
                          Monark Demo
                        </span>
                        <span className="truncate text-xs text-muted-foreground">Mainnet workspace</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <div className="relative group-data-[collapsible=icon]:hidden">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <SidebarInput
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search…"
                    aria-label="Search navigation"
                    className="pl-8"
                  />
                </div>
              </SidebarHeader>

              <SidebarContent>
                {nav.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                    No results for “{query}”.
                  </p>
                ) : null}
                {nav.map((group) => (
                  <SidebarGroup key={group.label}>
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {group.items.map((item) => {
                          const isActive = active.item === item.title
                          const Icon = item.icon
                          if (!item.items) {
                            return (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                  isActive={isActive}
                                  aria-current={isActive ? "page" : undefined}
                                  tooltip={item.title}
                                  onClick={() => select({ group: group.label, item: item.title })}
                                >
                                  <Icon />
                                  <span>{item.title}</span>
                                </SidebarMenuButton>
                                {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                              </SidebarMenuItem>
                            )
                          }
                          const isOpen = searching || !!open[item.title]
                          return (
                            <Collapsible
                              key={item.title}
                              asChild
                              open={isOpen}
                              onOpenChange={(next) => setOpen((prev) => ({ ...prev, [item.title]: next }))}
                            >
                              <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton
                                    isActive={isActive && !active.sub}
                                    tooltip={item.title}
                                    onClick={() => select({ group: group.label, item: item.title })}
                                  >
                                    <Icon />
                                    <span>{item.title}</span>
                                    <ChevronRight
                                      aria-hidden="true"
                                      className={cn(
                                        "ml-auto transition-transform duration-200",
                                        item.badge && "mr-6",
                                        isOpen && "rotate-90"
                                      )}
                                    />
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                                <CollapsibleContent>
                                  <SidebarMenuSub>
                                    {item.items.map((sub) => {
                                      const subActive = isActive && active.sub === sub
                                      return (
                                        <SidebarMenuSubItem key={sub}>
                                          <SidebarMenuSubButton asChild isActive={subActive}>
                                            <button
                                              type="button"
                                              className="w-full"
                                              aria-current={subActive ? "page" : undefined}
                                              onClick={() =>
                                                select({ group: group.label, item: item.title, sub })
                                              }
                                            >
                                              <span>{sub}</span>
                                            </button>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      )
                                    })}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuItem>
                            </Collapsible>
                          )
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ))}
              </SidebarContent>

              <SidebarFooter>
                <NavUser />
              </SidebarFooter>
              {collapsible !== "none" ? <SidebarRail /> : null}
            </Sidebar>

            <SidebarInset className="min-w-0 overflow-hidden">
              <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
                {collapsible !== "none" ? (
                  <>
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-1 h-4!" />
                  </>
                ) : null}
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden sm:inline-flex">{active.group}</BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden sm:inline-flex" />
                    {active.sub ? (
                      <>
                        <BreadcrumbItem>{active.item}</BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{active.sub}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbPage>{active.item}</BreadcrumbPage>
                      </BreadcrumbItem>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              </header>
              <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
                <div>
                  <h2 className="text-lg font-semibold">{active.sub ?? active.item}</h2>
                  <p className="text-sm text-muted-foreground">
                    Placeholder content for {active.sub ? `${active.item} / ${active.sub}` : active.item}.
                    Pick another item in the sidebar, or press Ctrl+B to toggle it.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {["Total value", "24h volume", "Active wallets"].map((label) => (
                    <div key={label} className="rounded-xl border bg-card p-4">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <div className="mt-2 h-6 w-2/3 rounded-md bg-muted" />
                    </div>
                  ))}
                </div>
                <div className="min-h-40 flex-1 rounded-xl border bg-card p-4">
                  <div className="flex flex-col gap-3">
                    {[0, 1, 2, 3].map((row) => (
                      <div key={row} className="flex items-center gap-3">
                        <div className="size-8 shrink-0 rounded-full bg-muted" />
                        <div className="h-3 flex-1 rounded bg-muted" />
                        <div className="h-3 w-16 rounded bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </TooltipProvider>
    </PreviewLayout>
  )
}
