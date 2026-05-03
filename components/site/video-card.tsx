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
        "group relative block overflow-hidden rounded-[2rem] border border-border/70 bg-card/60",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.18),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[11px] tracking-[0.3em] text-primary uppercase">
          {project.category}
        </p>
        <h3 className="mt-3 font-heading text-3xl text-white">{project.title}</h3>
        <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/72">
          {project.description}
        </p>
      </div>
    </Link>
  )
}
