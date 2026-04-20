"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function CarouselPreview() {
  const { values, entries } = useControls({
    orientation: {
      type: "select",
      options: ["horizontal", "vertical"],
      default: "horizontal",
    },
    slides: {
      type: "select",
      options: ["3", "5", "8"],
      default: "5",
    },
  })

  const count = parseInt(values.slides, 10)
  const isVertical = values.orientation === "vertical"

  return (
    <PreviewLayout controls={entries}>
      <Carousel
        orientation={values.orientation as "horizontal" | "vertical"}
        className={isVertical ? "w-48" : "w-full max-w-xs"}
      >
        <CarouselContent className={isVertical ? "h-56 -mt-1" : undefined}>
          {Array.from({ length: count }).map((_, i) => (
            <CarouselItem key={i} className={isVertical ? "pt-1 basis-1/2" : undefined}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{i + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </PreviewLayout>
  )
}
