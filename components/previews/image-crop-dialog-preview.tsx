"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ImageCropDialog } from "@/components/ui/image-crop-dialog"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const aspects: Record<string, number> = {
  "1:1": 1,
  "4:3": 4 / 3,
  "16:9": 16 / 9,
  "3:1": 3,
}

/** Draws a sample landscape on a canvas so the preview needs no network. */
function createSampleFile(): Promise<File> {
  const canvas = document.createElement("canvas")
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext("2d")!

  const sky = ctx.createLinearGradient(0, 0, 0, 800)
  sky.addColorStop(0, "#fde7c8")
  sky.addColorStop(1, "#f88d10")
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 1200, 800)

  ctx.fillStyle = "#fff7e6"
  ctx.beginPath()
  ctx.arc(840, 300, 110, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "#7a5c3e"
  ctx.beginPath()
  ctx.moveTo(0, 800)
  ctx.lineTo(0, 560)
  ctx.lineTo(320, 380)
  ctx.lineTo(620, 600)
  ctx.lineTo(900, 450)
  ctx.lineTo(1200, 620)
  ctx.lineTo(1200, 800)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = "#3d2b1c"
  ctx.fillRect(0, 700, 1200, 100)

  return new Promise((resolve) =>
    canvas.toBlob(
      (blob) => resolve(new File([blob!], "landscape.png", { type: "image/png" })),
      "image/png",
    ),
  )
}

export function ImageCropDialogPreview() {
  const { values, entries } = useControls({
    aspect: { type: "select", options: ["1:1", "4:3", "16:9", "3:1"], default: "1:1" },
    title: { type: "text", default: "Crop profile picture" },
  })

  const [file, setFile] = React.useState<File | null>(null)
  const [result, setResult] = React.useState<string | null>(null)

  React.useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result)
    }
  }, [result])

  const open = async () => setFile(await createSampleFile())

  return (
    <PreviewLayout controls={entries}>
      <div className="flex w-[320px] max-w-full flex-col items-center gap-4">
        <Button onClick={open}>Choose image</Button>
        {result ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result}
            alt="Cropped result"
            className="max-h-40 max-w-full rounded-md border border-border"
          />
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            The cropped image appears here.
          </p>
        )}
      </div>
      <ImageCropDialog
        file={file}
        aspect={aspects[values.aspect]}
        title={values.title}
        onCancel={() => setFile(null)}
        onCrop={(cropped) => {
          setResult(URL.createObjectURL(cropped))
          setFile(null)
        }}
      />
    </PreviewLayout>
  )
}
