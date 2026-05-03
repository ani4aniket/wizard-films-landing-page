import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SectionProps {
  id?: string
  eyebrow?: string
  title?: string
  description?: string
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-24", className)}
    >
      {(eyebrow || title || description) && (
        <div className="mb-10 max-w-3xl space-y-4 md:mb-14">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.32em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="font-heading text-4xl leading-tight text-foreground md:text-5xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  )
}
