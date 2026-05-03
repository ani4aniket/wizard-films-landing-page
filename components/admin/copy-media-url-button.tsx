"use client"

import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  url: string
  className?: string
  label?: string
}

export function CopyMediaUrlButton({
  url,
  className,
  label = "Copy link",
}: Props) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle")

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setState("copied")
      window.setTimeout(() => setState("idle"), 2000)
    } catch {
      setState("error")
      window.setTimeout(() => setState("idle"), 2500)
    }
  }, [url])

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={copy}
      className={cn(className)}
    >
      {state === "copied"
        ? "Copied"
        : state === "error"
          ? "Copy failed"
          : label}
    </Button>
  )
}
