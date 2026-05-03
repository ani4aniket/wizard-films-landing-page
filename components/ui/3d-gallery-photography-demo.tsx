"use client"

import InfiniteGallery from "@/components/ui/3d-gallery-photography"

const sampleImages = [
  {
    src: "https://images.unsplash.com/photo-1741332966416-414d8a5b8887?w=600&auto=format&fit=crop&q=60",
    alt: "Image 1",
  },
  {
    src: "https://images.unsplash.com/photo-1754769440490-2eb64d715775?q=80&w=1113&auto=format&fit=crop",
    alt: "Image 2",
  },
  {
    src: "https://images.unsplash.com/photo-1758640920659-0bb864175983?w=600&auto=format&fit=crop&q=60",
    alt: "Image 3",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1758367454070-731d3cc11774?w=600&auto=format&fit=crop&q=60",
    alt: "Image 4",
  },
  {
    src: "https://images.unsplash.com/photo-1746023841657-e5cd7cc90d2c?w=600&auto=format&fit=crop&q=60",
    alt: "Image 5",
  },
  {
    src: "https://images.unsplash.com/photo-1741715661559-6149723ea89a?w=600&auto=format&fit=crop&q=60",
    alt: "Image 6",
  },
]

export default function GalleryPhotographyDemo() {
  return (
    <main className="h-screen min-h-screen w-full">
      <InfiniteGallery
        images={sampleImages}
        speed={1.2}
        visibleCount={12}
        className="h-screen w-full"
      />
    </main>
  )
}
