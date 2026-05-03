import Image from "next/image"
import Link from "next/link"

import type { PortfolioProject } from "@/lib/types"
import { cn } from "@/lib/utils"

export function VideoCard({
  project,
  priority = false,
  className,
}: {
  project: PortfolioProject
  priority?: boolean
  className?: string
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "group block border border-transparent bg-background",
        className
      )}
    >
      <div className="surface-soft relative aspect-square overflow-hidden">
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {project.featured ? (
          <span className="absolute top-4 left-4 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground">
            Featured
          </span>
        ) : null}
      </div>
      <div className="space-y-2 px-1 pt-4 pb-1">
        <p className="text-sm text-muted-foreground">{project.category}</p>
        <h3 className="text-xl font-medium text-foreground">{project.title}</h3>
        <p className="line-clamp-2 max-w-md text-sm leading-6 text-muted-foreground">
          {project.description}
        </p>
        {project.role ? (
          <p className="text-sm text-foreground">{project.role}</p>
        ) : null}
      </div>
    </Link>
  )
}
