import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CmsErrorState({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="rounded-[2rem] border border-border/70 bg-card/70 p-8 backdrop-blur">
      <p className="text-xs font-semibold tracking-[0.32em] text-primary uppercase">
        Content Unavailable
      </p>
      <h2 className="mt-4 font-heading text-3xl text-foreground">{title}</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">{message}</p>
    </div>
  )
}

export function EmptyState({
  title,
  message,
  href,
  label,
}: {
  title: string
  message: string
  href?: string
  label?: string
}) {
  return (
    <div className="rounded-[2rem] border border-border/70 bg-card/70 p-8 text-center backdrop-blur">
      <h3 className="font-heading text-3xl text-foreground">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{message}</p>
      {href && label ? (
        <Link href={href} className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          {label}
        </Link>
      ) : null}
    </div>
  )
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-[24rem] animate-pulse rounded-[2rem] border border-border/60 bg-card/60"
        />
      ))}
    </div>
  )
}
