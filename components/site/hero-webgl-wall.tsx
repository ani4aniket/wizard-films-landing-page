"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { HeroMediaWall } from "@/components/site/hero-media-wall"

interface HeroMediaItem {
  src: string
  alt: string
}

interface HeroWebGLWallProps {
  media: HeroMediaItem[]
}

function CinematicPlanes({ media }: { media: HeroMediaItem[] }) {
  const textures = useTexture(media.map((item) => item.src))
  const groupRef = useRef<THREE.Group>(null)
  const cardRefs = useRef<Array<THREE.Mesh | null>>([])
  const scrollVelocityRef = useRef(0)

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      scrollVelocityRef.current += event.deltaY * 0.0005
      scrollVelocityRef.current = THREE.MathUtils.clamp(scrollVelocityRef.current, -2.2, 2.2)
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    return () => window.removeEventListener("wheel", onWheel)
  }, [])

  const layout = useMemo(
    () =>
      media.map((_, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        return {
          baseX: (col - 1) * 3.2,
          baseY: 2.3 - row * 1.9,
          baseZ: -2.5 - (i % 6) * 1.05,
          rotZ: (col - 1) * 0.14,
          driftSeed: i * 0.83,
        }
      }),
    [media]
  )

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    scrollVelocityRef.current = THREE.MathUtils.damp(scrollVelocityRef.current, 0, 2.2, delta)

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.24 - scrollVelocityRef.current * 0.14,
        0.06
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0.31 + scrollVelocityRef.current * 0.2,
        0.05
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -0.12 + Math.sin(t * 0.35) * 0.08 + scrollVelocityRef.current * 0.22,
        0.06
      )
    }

    cardRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const spec = layout[i]
      const pulse = Math.sin(t * 1.2 + spec.driftSeed) * 0.18
      const sideFloat = Math.cos(t * 0.7 + spec.driftSeed) * 0.12
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, spec.baseX + sideFloat, 0.08)
      mesh.position.y = THREE.MathUtils.lerp(
        mesh.position.y,
        spec.baseY + pulse + scrollVelocityRef.current * 0.6,
        0.08
      )
      mesh.position.z = THREE.MathUtils.lerp(
        mesh.position.z,
        spec.baseZ - Math.abs(scrollVelocityRef.current) * 1.1,
        0.08
      )
      mesh.rotation.z = THREE.MathUtils.lerp(
        mesh.rotation.z,
        spec.rotZ + Math.sin(t * 0.9 + i) * 0.05,
        0.07
      )
    })
  })

  return (
    <>
      <ambientLight intensity={0.85} />
      <group ref={groupRef} position={[0, -0.1, -0.4]}>
        {media.map((item, i) => {
          const texture = textures[i]
          const image = texture?.image as { width?: number; height?: number } | undefined
          const aspect = image?.width && image?.height ? image.width / image.height : 16 / 9
          const width = 2.5
          const height = width / Math.max(aspect, 0.65)

          return (
            <mesh
              key={`${item.src}-${i}`}
              ref={(node) => {
                cardRefs.current[i] = node
              }}
            >
              <planeGeometry args={[width, height, 1, 1]} />
              <meshBasicMaterial map={texture} />
            </mesh>
          )
        })}
      </group>
    </>
  )
}

class WebGLErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // Intentionally swallow and render fallback.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export function HeroWebGLWall({ media }: HeroWebGLWallProps) {
  const [webglHealthy, setWebglHealthy] = useState(true)
  const [resolvedMedia, setResolvedMedia] = useState<HeroMediaItem[]>([])
  const [webglAllowed] = useState(() => {
    if (typeof window === "undefined") return true
    const crashedBefore = window.sessionStorage.getItem("hero-webgl-disabled") === "1"
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const veryLowMemory = typeof memory === "number" && memory <= 2
    return !(crashedBefore || veryLowMemory)
  })

  useEffect(() => {
    let cancelled = false
    let objectUrls: string[] = []

    const candidates = media
      .filter((item) => item.src && /^https?:\/\//.test(item.src))
      .slice(0, 8)

    async function resolveValidMedia() {
      const checks = await Promise.all(
        candidates.map(
          async (item): Promise<HeroMediaItem | null> => {
            try {
              const response = await fetch(item.src, { cache: "force-cache" })
              if (!response.ok) return null

              const contentType = response.headers.get("content-type") ?? ""
              if (!contentType.startsWith("image/")) return null

              const blob = await response.blob()
              const blobUrl = URL.createObjectURL(blob)
              objectUrls.push(blobUrl)

              return { src: blobUrl, alt: item.alt }
            } catch {
              return null
            }
          }
        )
      )

      if (!cancelled) {
        setResolvedMedia(checks.filter((item): item is HeroMediaItem => Boolean(item)).slice(0, 4))
      } else {
        objectUrls.forEach((url) => URL.revokeObjectURL(url))
        objectUrls = []
      }
    }

    resolveValidMedia()

    return () => {
      cancelled = true
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [media])

  const safeMedia = resolvedMedia

  if (!safeMedia.length) return null
  if (!webglAllowed || !webglHealthy) return <HeroMediaWall media={safeMedia} />

  return (
    <WebGLErrorBoundary fallback={<HeroMediaWall media={safeMedia} />}>
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 42 }}
          dpr={1}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              () => {
                window.sessionStorage.setItem("hero-webgl-disabled", "1")
                setWebglHealthy(false)
              },
              { once: true }
            )
          }}
        >
          <fog attach="fog" args={["#050505", 8, 18]} />
          <CinematicPlanes media={safeMedia} />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  )
}
