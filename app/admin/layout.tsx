import type { Metadata } from "next"
import type { ReactNode } from "react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage site content, media, and submissions.",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children
}
