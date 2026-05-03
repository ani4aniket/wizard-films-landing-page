import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Suspense } from "react"

import { AdminUrlToast } from "@/components/admin/admin-url-toast"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage site content, media, and submissions.",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AdminUrlToast />
      </Suspense>
      {children}
    </>
  )
}
