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
import { getCroppedImageBlob } from "@/lib/crop-image"
import { cn } from "@/lib/utils"

const CROPPABLE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

type AspectPreset = "free" | "16:9" | "1:1" | "4:3"

const ASPECT_VALUES: Record<AspectPreset, number | undefined> = {
  free: undefined,
  "16:9": 16 / 9,
  "1:1": 1,
  "4:3": 4 / 3,
}

function outputMimeFor(fileType: string): "image/jpeg" | "image/png" | "image/webp" {
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
    file && CROPPABLE_TYPES.has(file.type) && file.type.startsWith("image/"),
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

  const onFileChange = useCallback((list: FileList | null) => {
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
  }, [imageSrc, videoPreviewUrl])

  const onCropComplete = useCallback(
    (_area: Area, areaPixels: Area) => {
      setCroppedAreaPixels(areaPixels)
    },
    [],
  )

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
            mime,
          )
          const base =
            file.name.replace(/\.[^.]+$/i, "").replace(/[^\w.-]+/g, "-") ||
            "image"
          fd.append(
            "file",
            blob,
            `${base}-cropped${extensionFor(mime)}`,
          )
        }

        startTransition(() => {
          void uploadMediaAction(fd)
        })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not prepare upload.",
        )
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
    ],
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[28px] border border-border/80 bg-secondary/30 p-5 md:p-7"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start">
        <div className="space-y-3">
          <span className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            File
          </span>
          <label
            htmlFor={inputId}
            className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-border bg-background/80 px-6 py-10 text-center transition hover:border-primary/50 hover:bg-background"
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
            <div className="overflow-hidden rounded-[20px] border border-border bg-black">
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
              <div className="relative aspect-video w-full overflow-hidden rounded-[20px] border border-border bg-black">
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
                <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-[0.2em]">
                  <span>Zoom</span>
                  <span>{zoom.toFixed(2)}×</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.02}
                  value={zoom}
                  onChange={(ev) => setZoom(Number(ev.target.value))}
                  className="h-2 w-full cursor-pointer accent-primary"
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
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAspectPreset(key)}
                    className={cn(
                      "pill-feedback rounded-full border px-3 py-1.5 text-xs transition",
                      aspectPreset === key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:bg-secondary",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <label className="space-y-2">
            <span className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
              Alt text
            </span>
            <input
              name="altText"
              value={altText}
              onChange={(ev) => setAltText(ev.target.value)}
              placeholder="Optional description"
              className="h-12 w-full rounded-full border border-transparent bg-background px-4 text-sm text-foreground transition outline-none focus:border-primary"
            />
          </label>

          {isCroppableImage ? (
            <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={skipCrop}
                onChange={(ev) => setSkipCrop(ev.target.checked)}
                className="size-4 rounded border-border accent-primary"
              />
              <span>Upload original (skip crop)</span>
            </label>
          ) : null}

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || pending}
            className="pill-feedback h-12 w-full rounded-full border border-primary bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {pending ? "Uploading…" : "Upload to library"}
          </button>
        </div>
      </div>
    </form>
  )
}
