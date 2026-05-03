import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageHeroProps {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
  className?: string
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[1440px] px-6 pt-28 pb-10 md:px-10 md:pt-36",
        className
      )}
    >
      <div className="section-rule max-w-5xl space-y-5 pt-8">
        <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl text-4xl leading-none font-medium text-foreground md:text-6xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
        {children}
      </div>
    </section>
  )
}
