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
    <article
      className={cn(
        "group block border border-transparent bg-background",
        className
      )}
    >
      <Link
        href={`/work/${project.slug}`}
        className="surface-soft relative block aspect-square overflow-hidden"
        aria-label={`Open ${project.title}`}
      >
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-black/55 text-white opacity-0 shadow-[0_12px_26px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-300 group-hover:opacity-100">
            <svg
              viewBox="0 0 24 24"
              className="ml-1 h-6 w-6 fill-current"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
        {project.featured ? (
          <span className="absolute top-4 left-4 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground">
            Featured
          </span>
        ) : null}
      </Link>
      <div className="space-y-2 px-1 pt-4 pb-1">
        <p className="text-sm text-muted-foreground">{project.category}</p>
        <h3 className="text-xl font-medium text-foreground">
          <Link href={`/work/${project.slug}`} className="hover:underline">
            {project.title}
          </Link>
        </h3>
        <p className="line-clamp-2 max-w-md text-sm leading-6 text-muted-foreground">
          {project.description}
        </p>
        {project.role ? (
          <p className="text-sm text-foreground">{project.role}</p>
        ) : null}
      </div>
    </article>
  )
}
