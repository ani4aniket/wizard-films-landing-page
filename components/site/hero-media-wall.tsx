"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion"

interface HeroMediaItem {
  src: string
  alt: string
}

interface HeroMediaWallProps {
  media: HeroMediaItem[]
}

export function HeroMediaWall({ media }: HeroMediaWallProps) {
  const [validMedia, setValidMedia] = useState<HeroMediaItem[]>([])
  const { scrollY } = useScroll()
  const autoLift = useMotionValue(0)
  const animationStartRef = useRef<number | null>(null)
  const hasUserScrolledRef = useRef(false)
  const driftY = useTransform(scrollY, [0, 900], [0, -320])
  const cinematicY = useTransform(() => driftY.get() - autoLift.get())
  const tiltX = useTransform(scrollY, [0, 900], [12.5, 3.5])
  const tiltY = useTransform(scrollY, [0, 900], [-16, -4])

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest > 0) {
        hasUserScrolledRef.current = true
      }
    })
    return unsubscribe
  }, [scrollY])

  useAnimationFrame((_, delta) => {
    if (!hasUserScrolledRef.current) {
      animationStartRef.current = null
      return
    }

    if (animationStartRef.current === null) {
      animationStartRef.current = performance.now()
    }

    const delayMs = 900
    if (performance.now() - animationStartRef.current < delayMs) {
      return
    }

    const cycleHeight = 120
    const next = (autoLift.get() + delta * 0.01) % cycleHeight
    autoLift.set(next)
  })

  useEffect(() => {
    let cancelled = false
    const candidates = media.filter((item) => item.src).slice(0, 18)

    Promise.all(
      candidates.map(
        (item) =>
          new Promise<HeroMediaItem | null>((resolve) => {
            const img = new window.Image()
            img.decoding = "async"
            img.onload = () => resolve(item)
            img.onerror = () => resolve(null)
            img.src = item.src
          })
      )
    ).then((items) => {
      if (cancelled) return
      setValidMedia(
        items.filter((item): item is HeroMediaItem => Boolean(item))
      )
    })

    return () => {
      cancelled = true
    }
  }, [media])

  const displayItems = useMemo(() => {
    if (!validMedia.length) return []
    const filled: HeroMediaItem[] = []
    const cols = 7
    const rowsPerCycle = 6
    const cycles = 2
    const totalCards = cols * rowsPerCycle * cycles
    for (let i = 0; i < totalCards; i++) {
      filled.push(validMedia[i % validMedia.length])
    }
    return filled
  }, [validMedia])

  const removeItem = (src: string) => {
    setValidMedia((prev) => prev.filter((item) => item.src !== src))
  }

  if (!displayItems.length) {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#111111_0%,#2b2b2d_55%,#111111_100%)]" />
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden perspective-[1300px]">
      <motion.div
        className="absolute inset-0 transform-3d"
        style={{
          y: cinematicY,
          rotateX: tiltX,
          rotateY: tiltY,
          translateZ: "-60px",
        }}
      >
        {displayItems.map((item, index) => {
          const cols = 7
          const col = index % cols
          const row = Math.floor(index / cols)
          const x = -51 + col * 16
          const y = -18 + row * 20
          const depth = 240 - row * 46 - (col % 3) * 20
          const rotate = (col - 2.5) * 2.1 + (row % 2 === 0 ? -1 : 1)

          return (
            <div
              key={`${item.src}-${index}`}
              className="absolute top-1/2 left-1/2 h-[16svh] w-[20vw] max-w-[260px] min-w-[120px] overflow-hidden border border-white/15 shadow-[0_24px_55px_-30px_rgba(0,0,0,0.95)] md:h-[18svh]"
              style={{
                transform: `translate3d(${x}vw, ${y}vh, ${depth}px) rotateZ(${rotate}deg)`,
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 33vw, 20vw"
                className="object-cover"
                priority={index < 8}
                onError={() => removeItem(item.src)}
              />
            </div>
          )
        })}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black via-black/80 to-transparent" />
    </div>
  )
}
