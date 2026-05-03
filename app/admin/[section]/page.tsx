import { redirect } from "next/navigation"

import { AdminDashboard } from "../admin-dashboard"
import { AdminGate } from "../admin-gate"
import { DEFAULT_ADMIN_TAB, isAdminTabId } from "@/lib/admin-tabs"

export default async function AdminSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>
  searchParams: Promise<{ error?: string; uploadedUrl?: string }>
}) {
  const { section: raw } = await params
  if (!isAdminTabId(raw)) {
    redirect(`/admin/${DEFAULT_ADMIN_TAB}`)
  }

  const { error, uploadedUrl } = await searchParams

  return (
    <AdminGate error={error}>
      <AdminDashboard
        section={raw}
        error={error}
        uploadedUrl={uploadedUrl}
      />
    </AdminGate>
  )
}
