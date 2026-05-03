"use client"

import { EyeIcon, ViewOffIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { loginAction } from "./actions"

const fieldLabelClass =
  "text-left text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground"

const inputChromeClass =
  "h-11 w-full rounded-md border border-border bg-background py-0 pr-11 pl-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"

export function AdminLoginForm({ errorMessage }: { errorMessage?: string }) {
  const [visible, setVisible] = useState(false)
  const baseId = useId()
  const inputId = `${baseId}-password`

  return (
    <form action={loginAction} className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor={inputId} className={cn("flex flex-col items-start gap-1", fieldLabelClass)}>
          Password
        </Label>
        <div className="relative">
          <input
            id={inputId}
            name="password"
            type={visible ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="Enter the admin password"
            className={inputChromeClass}
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={errorMessage ? `${baseId}-error` : undefined}
          />
          <button
            type="button"
            className={cn(
              "absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-md",
              "text-muted-foreground outline-none transition-colors",
              "hover:bg-secondary hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring/30"
            )}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            <HugeiconsIcon
              icon={visible ? ViewOffIcon : EyeIcon}
              strokeWidth={2}
              className="size-4 shrink-0"
            />
          </button>
        </div>
        {errorMessage ? (
          <p id={`${baseId}-error`} className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <Button type="submit" variant="default" className="w-full sm:self-start sm:min-w-48">
        Enter Admin
      </Button>
      <Link
        href="/"
        className={cn(
          "self-center text-center text-sm text-muted-foreground underline-offset-4 transition-colors",
          "hover:text-foreground hover:underline"
        )}
      >
        Back to home
      </Link>
    </form>
  )
}
