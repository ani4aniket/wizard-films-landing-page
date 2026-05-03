"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useId, useState } from "react"

import type { PortfolioProject } from "@/lib/types"
import { cn } from "@/lib/utils"

export function FeaturedVideoCard({
  project,
  priority = false,
  className,
}: {
  project: PortfolioProject
  priority?: boolean
  className?: string
}) {
  const cardInstanceId = useId()
  const [isPlaying, setIsPlaying] = useState(false)
  const autoplayEmbedUrl = `${project.embedUrl}${project.embedUrl.includes("?") ? "&" : "?"}autoplay=1&mute=0&loop=1&playlist=${project.videoId}&controls=1&rel=0&modestbranding=1&playsinline=1`

  useEffect(() => {
    const onCardPlay = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string }>
      if (customEvent.detail?.id !== cardInstanceId) {
        setIsPlaying(false)
      }
    }

    window.addEventListener("video-card-play", onCardPlay)
    return () => window.removeEventListener("video-card-play", onCardPlay)
  }, [cardInstanceId])

  const handlePlay = () => {
    window.dispatchEvent(
      new CustomEvent("video-card-play", {
        detail: { id: cardInstanceId },
      })
    )
    setIsPlaying(true)
  }

  return (
    <article
      className={cn("group block border border-transparent bg-background", className)}
    >
      <div className="surface-soft relative aspect-square overflow-hidden">
        {isPlaying ? (
          <iframe
            src={autoplayEmbedUrl}
            title={project.title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            loading={priority ? "eager" : "lazy"}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <>
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <button
              type="button"
              aria-label={`Play ${project.title}`}
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 hover:bg-black/25"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.72)_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />
              <span className="relative flex h-17 w-17 items-center justify-center rounded-full border border-white/75 bg-black/50 text-white opacity-0 shadow-[0_14px_35px_rgba(0,0,0,0.45)] backdrop-blur-sm transition duration-300 group-hover:scale-105 group-hover:bg-black/45 group-hover:opacity-100">
                <svg
                  viewBox="0 0 24 24"
                  className="ml-1 h-7 w-7 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </>
        )}
        {project.featured ? (
          <span className="absolute top-4 left-4 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground">
            Featured
          </span>
        ) : null}
      </div>
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
