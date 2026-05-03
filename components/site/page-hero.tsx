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
    <section className={cn("mx-auto max-w-7xl px-6 pt-32 pb-12 md:px-10 md:pt-40", className)}>
      <div className="max-w-4xl space-y-6">
        <p className="text-xs font-semibold tracking-[0.32em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="font-heading text-5xl leading-none text-foreground md:text-7xl">
          {title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
        {children}
      </div>
    </section>
  )
}
