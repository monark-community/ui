"use client"

import * as React from "react"
import Cropper, { type Area } from "react-easy-crop"
import { ZoomIn } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

async function cropImage(file: File, pixelCrop: Area): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(
    bitmap,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )
  bitmap.close()

  const mime = ["image/png", "image/webp", "image/gif"].includes(file.type)
    ? file.type
    : "image/jpeg"
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), mime, 0.92),
  )
  return new File([blob], file.name, { type: mime, lastModified: Date.now() })
}

export interface ImageCropDialogProps {
  /** The source File to crop. Dialog is open while non-null. */
  file: File | null
  /** Aspect ratio for the crop area (1 for square, 3 for 3:1 banner). */
  aspect: number
  /** Closes the dialog without producing output. */
  onCancel: () => void
  /** Receives the cropped File ready for upload. */
  onCrop: (cropped: File) => void
  /** Dialog title. */
  title?: string
  /** Dialog description. */
  description?: string
  /** Label for the confirm button. */
  confirmLabel?: string
  /** Label for the cancel button. */
  cancelLabel?: string
  /** Label for the zoom slider. */
  zoomLabel?: string
}

/**
 * Client-side image crop dialog built on `react-easy-crop`. The user
 * picks a focal point and zoom level; the output is a new File with
 * the cropped region, preserving the source MIME type where possible.
 *
 * Designed for avatar (aspect=1) and banner (aspect=3) use cases but
 * accepts any numeric aspect ratio.
 */
function ImageCropDialog({
  file,
  aspect,
  onCancel,
  onCrop,
  title = "Crop image",
  description = "Drag to reposition. Scroll or use the slider to zoom.",
  confirmLabel = "Apply",
  cancelLabel = "Cancel",
  zoomLabel = "Zoom",
}: ImageCropDialogProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  React.useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleComplete = React.useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels)
  }, [])

  const handleConfirm = React.useCallback(async () => {
    if (!file || !croppedArea) return
    setPending(true)
    try {
      const cropped = await cropImage(file, croppedArea)
      onCrop(cropped)
    } finally {
      setPending(false)
    }
  }, [file, croppedArea, onCrop])

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {preview && (
          <div className="relative h-64 w-full overflow-hidden rounded-md bg-muted">
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleComplete}
            />
          </div>
        )}

        <div className="flex items-center gap-3 px-1">
          <ZoomIn className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <label className="sr-only">{zoomLabel}</label>
          <Slider
            min={1}
            max={3}
            step={0.05}
            value={[zoom]}
            onValueChange={([v]) => setZoom(v)}
            className="flex-1"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button onClick={handleConfirm} disabled={pending || !croppedArea}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ImageCropDialog }
