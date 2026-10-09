"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  MapPinIcon,
  Settings2Icon,
  Share2Icon,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

type Example = "settings" | "profile" | "share"

function SettingsExample({ titleId }: { titleId: string }) {
  const id = React.useId()
  return (
    <>
      <PopoverHeader>
        <PopoverTitle id={titleId}>Dimensions</PopoverTitle>
        <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
      </PopoverHeader>
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-3">
          <Label htmlFor={`${id}-width`}>Width</Label>
          <Input id={`${id}-width`} defaultValue="100%" className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-3">
          <Label htmlFor={`${id}-height`}>Height</Label>
          <Input id={`${id}-height`} defaultValue="25px" className="col-span-2 h-8" />
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <Label htmlFor={`${id}-ratio`}>Lock aspect ratio</Label>
          <Switch id={`${id}-ratio`} defaultChecked />
        </div>
      </div>
    </>
  )
}

function ProfileExample({ titleId }: { titleId: string }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src="https://api.dicebear.com/9.x/notionists/svg?seed=Monarch" alt="" />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <PopoverHeader className="min-w-0">
          <PopoverTitle id={titleId}>Ada Nakamoto</PopoverTitle>
          <PopoverDescription className="truncate">Governance delegate · ada.eth</PopoverDescription>
        </PopoverHeader>
      </div>
      <dl className="grid gap-1.5 text-sm">
        <div className="flex items-center gap-2">
          <dt>
            <MapPinIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            <span className="sr-only">Address</span>
          </dt>
          <dd className="truncate font-mono text-xs">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt>
            <UserRoundIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            <span className="sr-only">Delegators</span>
          </dt>
          <dd>1,284 delegators</dd>
        </div>
      </dl>
      <div className="flex gap-2">
        <Button size="sm" className="flex-1">
          Delegate
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          View profile
        </Button>
      </div>
    </>
  )
}

function ShareExample({ titleId }: { titleId: string }) {
  const id = React.useId()
  const url = "https://example.com/proposals/42"
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(url)
    } catch {
      // Clipboard can be blocked (iframe, http); the feedback is still shown.
    }
    setCopied(true)
  }

  return (
    <>
      <PopoverHeader>
        <PopoverTitle id={titleId}>Share proposal</PopoverTitle>
        <PopoverDescription>Anyone with the link can view and vote.</PopoverDescription>
      </PopoverHeader>
      <div className="flex items-center gap-2">
        <Label htmlFor={`${id}-link`} className="sr-only">
          Link
        </Label>
        <Input
          id={`${id}-link`}
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
          className="h-8 font-mono text-xs"
        />
        <Button size="sm" variant="outline" onClick={copy} className="shrink-0">
          {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </p>
    </>
  )
}

const EXAMPLES: Record<
  Example,
  { trigger: string; icon: LucideIcon; width: string; Body: React.ComponentType<{ titleId: string }> }
> = {
  settings: { trigger: "Dimensions", icon: Settings2Icon, width: "w-80", Body: SettingsExample },
  profile: { trigger: "ada.eth", icon: UserRoundIcon, width: "w-80", Body: ProfileExample },
  share: { trigger: "Share", icon: Share2Icon, width: "w-96", Body: ShareExample },
}

export function PopoverPreview() {
  const { values, entries } = useControls({
    example: { type: "select", options: ["settings", "profile", "share"], default: "settings" },
    side: { type: "select", options: ["bottom", "top", "left", "right"], default: "bottom" },
    align: { type: "select", options: ["center", "start", "end"], default: "center" },
  })

  const titleId = React.useId()
  const example = EXAMPLES[values.example as Example]
  const { Body, icon: Icon } = example

  return (
    <PreviewLayout controls={entries}>
      <Popover key={values.example}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Icon aria-hidden />
            {example.trigger}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side={values.side as "bottom" | "top" | "left" | "right"}
          align={values.align as "center" | "start" | "end"}
          aria-labelledby={titleId}
          className={cn(example.width, "max-w-[calc(100vw-2rem)] gap-3 p-4")}
        >
          <Body titleId={titleId} />
        </PopoverContent>
      </Popover>
    </PreviewLayout>
  )
}
