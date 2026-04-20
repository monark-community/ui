"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays } from "lucide-react"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function HoverCardPreview() {
  return (
    <PreviewLayout>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@monark</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=monark" alt="" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Monark</h4>
              <p className="text-sm text-muted-foreground">
                Fostering collaboration within the Web3 community.
              </p>
              <div className="flex items-center pt-1 text-xs text-muted-foreground">
                <CalendarDays className="mr-1 size-3" />
                Joined April 2024
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </PreviewLayout>
  )
}
