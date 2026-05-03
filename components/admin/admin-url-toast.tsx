"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

const ERROR_MESSAGES: Record<string, string> = {
  "missing-blob-token":
    "Uploads are not turned on yet. Add BLOB_READ_WRITE_TOKEN, or try again later.",
  "missing-file": "Pick a file from your computer first, then try uploading again.",
  "invalid-password":
    "That password did not match the one in your environment file.",
  "missing-password": "Set ADMIN_PASSWORD in your environment to use the admin area.",
  "session-expired": "Your admin session expired. Please sign in again.",
}

function messageForError(code: string) {
  return (
    ERROR_MESSAGES[code] ??
    "We could not save that. Check required fields are filled in, then try again."
  )
}

/**
 * Shows sonner toasts from `toast` and `error` search params after server action
 * redirects, then strips those params (preserves hash and other query keys).
 */
export function AdminUrlToast() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const toastKey = searchParams.get("toast")
    const errorKey = searchParams.get("error")

    if (!toastKey && !errorKey) {
      return
    }

    const dedupe = { id: "admin-url-feedback" as const }

    if (toastKey === "saved") {
      toast.success("Saved.", dedupe)
    } else if (toastKey === "deleted") {
      toast.success("Removed.", dedupe)
    } else if (toastKey === "signed-in") {
      toast.success("Signed in.", dedupe)
    } else if (toastKey === "signed-out") {
      toast.success("Signed out.", dedupe)
    } else if (toastKey === "uploaded") {
      toast.success("Upload complete.", dedupe)
    }

    if (errorKey) {
      toast.error(messageForError(errorKey), {
        id: "admin-url-error",
      })
    }

    const next = new URLSearchParams(searchParams.toString())
    next.delete("toast")
    next.delete("error")
    const q = next.toString()
    const hash = typeof window !== "undefined" ? window.location.hash : ""
    const path = q ? `${pathname}?${q}${hash}` : `${pathname}${hash}`
    router.replace(path)
  }, [pathname, router, searchParams])

  return null
}
