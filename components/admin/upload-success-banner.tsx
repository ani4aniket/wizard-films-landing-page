"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { CopyMediaUrlButton } from "@/components/admin/copy-media-url-button"

type Props = {
  url: string
}

export function UploadSuccessBanner({ url }: Props) {
  const router = useRouter()

  const dismiss = useCallback(() => {
    router.replace("/admin/media")
  }, [router])

  return (
    <div className="mb-6 flex flex-col gap-4 border border-primary/30 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
          Upload complete
        </p>
        <p className="truncate text-sm text-foreground" title={url}>
          {url}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <CopyMediaUrlButton url={url} label="Copy URL" />
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="pill-feedback rounded-full border border-border px-4 py-2 text-sm text-foreground transition hover:bg-secondary"
        >
          Open
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="pill-feedback rounded-full border border-transparent px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
