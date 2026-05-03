"use client"

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  useTransition,
} from "react"
import Cropper, { type Area } from "react-easy-crop"

import { uploadMediaAction } from "@/app/admin/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { getCroppedImageBlob } from "@/lib/crop-image"
import { toast } from "sonner"

const CROPPABLE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

type AspectPreset = "free" | "16:9" | "1:1" | "4:3"

const ASPECT_VALUES: Record<AspectPreset, number | undefined> = {
  free: undefined,
  "16:9": 16 / 9,
  "1:1": 1,
  "4:3": 4 / 3,
}

function outputMimeFor(
  fileType: string
): "image/jpeg" | "image/png" | "image/webp" {
  if (fileType === "image/png") return "image/png"
  if (fileType === "image/webp") return "image/webp"
  return "image/jpeg"
}

function extensionFor(mime: "image/jpeg" | "image/png" | "image/webp") {
  if (mime === "image/png") return ".png"
  if (mime === "image/webp") return ".webp"
  return ".jpg"
}

export function MediaUploadForm() {
  const inputId = useId()
  const [file, setFile] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [altText, setAltText] = useState("")
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspectPreset, setAspectPreset] = useState<AspectPreset>("16:9")
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [skipCrop, setSkipCrop] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)

  const aspect = ASPECT_VALUES[aspectPreset]

  const isVideo = Boolean(file?.type.startsWith("video/"))
  const isCroppableImage = Boolean(
    file && CROPPABLE_TYPES.has(file.type) && file.type.startsWith("image/")
  )
  const showCropper = isCroppableImage && imageSrc && !skipCrop

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc)
    }
  }, [imageSrc])

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
    }
  }, [videoPreviewUrl])

  const onFileChange = useCallback(
    (list: FileList | null) => {
      const next = list?.[0]
      setError(null)
      setCroppedAreaPixels(null)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setSkipCrop(false)

      if (imageSrc) {
        URL.revokeObjectURL(imageSrc)
        setImageSrc(null)
      }
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl)
        setVideoPreviewUrl(null)
      }

      if (!next?.size) {
        setFile(null)
        return
      }

      setFile(next)
      if (next.type.startsWith("image/") && CROPPABLE_TYPES.has(next.type)) {
        setImageSrc(URL.createObjectURL(next))
      } else if (next.type.startsWith("video/")) {
        setVideoPreviewUrl(URL.createObjectURL(next))
      } else {
        setImageSrc(null)
      }
    },
    [imageSrc, videoPreviewUrl]
  )

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const canSubmit = useMemo(() => {
    if (!file) return false
    if (isVideo) return true
    if (isCroppableImage && !skipCrop) return Boolean(croppedAreaPixels)
    return true
  }, [file, isVideo, isCroppableImage, skipCrop, croppedAreaPixels])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!file || !canSubmit) return

      setError(null)
      const fd = new FormData()
      fd.append("altText", altText.trim())

      try {
        if (isVideo || !isCroppableImage || skipCrop) {
          fd.append("file", file)
        } else {
          if (!imageSrc || !croppedAreaPixels) return
          const mime = outputMimeFor(file.type)
          const blob = await getCroppedImageBlob(
            imageSrc,
            croppedAreaPixels,
            mime
          )
          const base =
            file.name.replace(/\.[^.]+$/i, "").replace(/[^\w.-]+/g, "-") ||
            "image"
          fd.append("file", blob, `${base}-cropped${extensionFor(mime)}`)
        }

        startTransition(() => {
          void uploadMediaAction(fd)
        })
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Could not prepare upload."
        setError(msg)
        toast.error(msg)
      }
    },
    [
      file,
      canSubmit,
      altText,
      isVideo,
      isCroppableImage,
      skipCrop,
      imageSrc,
      croppedAreaPixels,
    ]
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-none border border-border/80 bg-secondary/30 p-5 md:p-7"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start">
        <div className="space-y-3">
          <span className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            File
          </span>
          <label
            htmlFor={inputId}
            className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-none border border-dashed border-border bg-background/80 px-6 py-10 text-center transition hover:border-primary/50 hover:bg-background"
          >
            <span className="text-sm font-medium text-foreground">
              {file ? file.name : "Choose image or video"}
            </span>
            <span className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              JPEG, PNG, WebP (crop before upload), or video. Max size follows
              your hosting limits.
            </span>
            <span className="rounded-full border border-border bg-secondary px-4 py-2 text-xs text-foreground">
              Browse files
            </span>
            <input
              id={inputId}
              name="file"
              type="file"
              accept="image/*,video/*"
              className="sr-only"
              onChange={(ev) => onFileChange(ev.target.files)}
            />
          </label>

          {file && isVideo && videoPreviewUrl ? (
            <div className="overflow-hidden rounded-none border border-border bg-black">
              <video
                src={videoPreviewUrl}
                controls
                className="aspect-video w-full object-contain"
              />
            </div>
          ) : null}

          {file && !isVideo && !isCroppableImage ? (
            <p className="text-xs text-muted-foreground">
              Cropping is available for JPEG, PNG, and WebP. This file will
              upload as-is.
            </p>
          ) : null}

          {showCropper ? (
            <div className="space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-none border border-border bg-black">
                <Cropper
                  image={imageSrc!}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  <span>Zoom</span>
                  <span>{zoom.toFixed(2)}×</span>
                </div>
                <Slider
                  min={1}
                  max={3}
                  step={0.02}
                  value={[zoom]}
                  onValueChange={(v) => {
                    const next = Array.isArray(v) ? v[0] : v
                    setZoom(typeof next === "number" ? next : 1)
                  }}
                  className="py-1"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["free", "Free"],
                    ["16:9", "16:9"],
                    ["1:1", "1:1"],
                    ["4:3", "4:3"],
                  ] as const
                ).map(([key, label]) => (
                  <Button
                    key={key}
                    type="button"
                    size="xs"
                    variant={aspectPreset === key ? "default" : "outline"}
                    onClick={() => setAspectPreset(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label
              htmlFor={`${inputId}-alt`}
              className="flex w-full flex-col items-start justify-start text-left text-xs tracking-[0.24em] text-muted-foreground uppercase"
            >
              Short description (optional)
            </Label>
            <Input
              id={`${inputId}-alt`}
              name="altText"
              value={altText}
              onChange={(ev) => setAltText(ev.target.value)}
              placeholder="Helps visitors who use screen readers"
              className="h-12 w-full rounded-none border border-transparent bg-background px-4 text-sm text-foreground transition outline-none focus-visible:border-primary focus-visible:ring-0"
            />
          </div>

          {isCroppableImage ? (
            <div className="flex items-center gap-3">
              <Checkbox
                checked={skipCrop}
                onCheckedChange={(checked) =>
                  setSkipCrop(checked === true)
                }
                id={`${inputId}-skip-crop`}
              />
              <Label
                htmlFor={`${inputId}-skip-crop`}
                className="cursor-pointer text-sm font-normal normal-case tracking-normal text-foreground"
              >
                Upload original (skip crop)
              </Label>
            </div>
          ) : null}

          {error ? (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            type="submit"
            disabled={!canSubmit || pending}
            className="w-full"
          >
            {pending ? "Uploading…" : "Upload to library"}
          </Button>
        </div>
      </div>
    </form>
  )
}
