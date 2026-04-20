"use client"

import * as React from "react"
import { LogOutIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "../../../../components/ui/button"
import { Separator } from "../../../../components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet"
import { ConnectWallet } from "../../../../components/ui/connect-wallet"
import { NetworkBadge } from "../../../../components/ui/network-badge"
import { WalletAddress, WalletAvatar } from "../../../../components/ui/wallet"

type ConnectionStatus = "disconnected" | "connecting" | "connected"

export interface WalletDrawerProps {
  /** Current connection state. Drives both the trigger and the drawer body. */
  status?: ConnectionStatus
  /** The connected account's address. Required when status="connected". */
  address?: string
  /** Optional display name (ENS, handle). Rendered above the address. */
  name?: string
  /** Chain name (e.g. "Base"). Shown as a NetworkBadge in the drawer. */
  chainName?: string
  /** Optional chain icon; forwarded to NetworkBadge. */
  chainIcon?: React.ReactNode
  /** Balance block rendered below the header; pass a <TokenAmount> or your own. */
  balance?: React.ReactNode
  /** Transaction list slot rendered below the balance; e.g. <TxStatus> items. */
  transactions?: React.ReactNode
  /** Extra actions rendered in the footer above the Disconnect row. */
  actions?: React.ReactNode
  /** Called when the user clicks the disconnected-state Connect button. */
  onConnect?: () => void
  /** Called when the user clicks the Disconnect button. */
  onDisconnect?: () => void
  /** Title for the drawer; defaults to "Wallet". */
  title?: React.ReactNode
  /** Description text under the title in the drawer header. */
  description?: React.ReactNode
  /** Controls whether the drawer renders its own trigger; set false when you
   *  want to wire the open state from outside. */
  withTrigger?: boolean
  /** Controlled open state. */
  open?: boolean
  /** Open-state change callback (pairs with `open`). */
  onOpenChange?: (open: boolean) => void
  className?: string
}

function WalletDrawer({
  status = "disconnected",
  address,
  name,
  chainName,
  chainIcon,
  balance,
  transactions,
  actions,
  onConnect,
  onDisconnect,
  title = "Wallet",
  description,
  withTrigger = true,
  open,
  onOpenChange,
  className,
}: WalletDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {withTrigger && (
        <SheetTrigger asChild>
          {/* The ConnectWallet trigger doubles as the sheet opener when
           *  connected; in disconnected state it fires onConnect and the
           *  sheet never opens. */}
          <div>
            <ConnectWallet
              status={status}
              address={address}
              name={name}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          </div>
        </SheetTrigger>
      )}

      <SheetContent
        side="right"
        data-slot="wallet-drawer"
        className={cn("flex flex-col gap-0 sm:max-w-sm", className)}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pb-4">
          {status === "connected" && address ? (
            <>
              <section className="flex items-center gap-3">
                <WalletAvatar address={address} size={48} />
                <div className="flex min-w-0 flex-col leading-tight">
                  {name && (
                    <span className="truncate text-base font-medium">
                      {name}
                    </span>
                  )}
                  <WalletAddress
                    address={address}
                    start={10}
                    end={8}
                    className={cn(
                      "text-muted-foreground",
                      name ? "text-xs" : "text-sm"
                    )}
                  />
                  {chainName && (
                    <div className="mt-1">
                      <NetworkBadge
                        name={chainName}
                        icon={chainIcon}
                        variant="subtle"
                      />
                    </div>
                  )}
                </div>
              </section>

              {balance && (
                <>
                  <Separator />
                  <section className="flex flex-col gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Balance
                    </p>
                    <div>{balance}</div>
                  </section>
                </>
              )}

              {transactions && (
                <>
                  <Separator />
                  <section className="flex flex-col gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Recent activity
                    </p>
                    <div className="flex flex-col gap-2">{transactions}</div>
                  </section>
                </>
              )}
            </>
          ) : (
            <section className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Connect a wallet to see your balance and recent activity.
              </p>
            </section>
          )}
        </div>

        <SheetFooter className="mt-auto flex flex-col gap-2">
          {actions}
          {status === "connected" && onDisconnect && (
            <Button
              variant="ghost"
              className="justify-start"
              onClick={onDisconnect}
            >
              <LogOutIcon className="mr-2 size-4" />
              Disconnect
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export { WalletDrawer }
