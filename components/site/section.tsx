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
      className={cn(
        "section-rule mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16",
        className
      )}
    >
      {(eyebrow || title || description) && (
        <div className="mb-8 max-w-4xl space-y-4 md:mb-10">
          {eyebrow ? (
            <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="max-w-3xl text-3xl leading-tight font-medium text-foreground md:text-4xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  )
}
