"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { CopyMediaUrlButton } from "@/components/admin/copy-media-url-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  url: string
}

export function UploadSuccessBanner({ url }: Props) {
  const router = useRouter()

  const dismiss = useCallback(() => {
    router.replace("/admin/media")
  }, [router])

  return (
    <Alert
      role="status"
      className={cn(
        "flex flex-col gap-4 border-primary/30 bg-primary/5 md:flex-row md:items-center md:justify-between",
        "after:bg-primary/50"
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <AlertTitle className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
          Upload complete
        </AlertTitle>
        <AlertDescription
          className="truncate text-sm text-foreground"
          title={url}
        >
          {url}
        </AlertDescription>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <CopyMediaUrlButton url={url} label="Copy URL" />
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Open
        </a>
        <Button variant="ghost" size="sm" type="button" onClick={dismiss}>
          Dismiss
        </Button>
      </div>
    </Alert>
  )
}
