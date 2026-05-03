"use client"

import Image from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"

export function VideoPlayer({
  title,
  embedUrl,
  poster,
  className,
}: {
  title: string
  embedUrl: string
  poster: string
  className?: string
}) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-[2rem] border border-border/70 bg-card/70",
        className,
      )}
    >
      {isPlaying ? (
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group relative block h-full w-full text-left"
          aria-label={`Play ${title}`}
        >
          <Image
            src={poster}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.2),transparent_34%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-20 items-center justify-center rounded-full border border-primary/60 bg-black/60 backdrop-blur">
              <span className="ml-1 inline-block size-0 border-y-[12px] border-y-transparent border-l-[18px] border-l-primary" />
            </span>
          </div>
        </button>
      )}
    </div>
  )
}
