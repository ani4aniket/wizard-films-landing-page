import { LoadingGrid } from "@/components/site/states"

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-10">
      <div className="mb-12 h-24 w-full max-w-3xl animate-pulse rounded-[2rem] bg-card/60" />
      <LoadingGrid />
    </main>
  )
}
