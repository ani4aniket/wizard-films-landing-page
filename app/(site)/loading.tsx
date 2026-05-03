import { LoadingGrid } from "@/components/site/states"

export default function Loading() {
  return (
    <main className="mx-auto max-w-[1440px] px-6 pt-32 pb-16 md:px-10">
      <div className="mb-12 h-24 w-full max-w-3xl animate-pulse bg-secondary" />
      <LoadingGrid />
    </main>
  )
}
