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
    <div className="border border-border bg-secondary p-8">
      <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
        Content Unavailable
      </p>
      <h2 className="mt-4 text-3xl font-medium text-foreground">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
        {message}
      </p>
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
    <div className="border border-border bg-secondary p-8 text-center">
      <h3 className="text-3xl font-medium text-foreground">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        {message}
      </p>
      {href && label ? (
        <Link
          href={href}
          className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
        >
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
          className="h-[24rem] animate-pulse border border-border bg-secondary"
        />
      ))}
    </div>
  )
}
