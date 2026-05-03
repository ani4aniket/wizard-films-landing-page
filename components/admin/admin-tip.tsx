import type { ReactNode } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export function AdminTip({ children }: { children: ReactNode }) {
  return (
    <Alert
      role="note"
      className={cn(
        "mb-5 border-primary/20 bg-primary/[0.07] after:bg-primary/40",
        "gap-0 py-3 *:data-[slot=alert-description]:mt-0"
      )}
    >
      <AlertDescription className="flex gap-3 text-sm leading-relaxed text-muted-foreground [&>strong]:font-medium [&>strong]:text-foreground">
        <span className="text-primary select-none" aria-hidden>
          ●
        </span>
        <span className="min-w-0">{children}</span>
      </AlertDescription>
    </Alert>
  )
}
