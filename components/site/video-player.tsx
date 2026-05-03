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
        "surface-soft relative aspect-video overflow-hidden border border-border",
        className
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
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-background/92">
              <span className="ml-1 inline-block size-0 border-y-[12px] border-l-[18px] border-y-transparent border-l-foreground" />
            </span>
          </div>
        </button>
      )}
    </div>
  )
}
