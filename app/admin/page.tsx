import { redirect } from "next/navigation"

import {
  isAdminAuthenticated,
  isAdminPasswordConfigured,
} from "@/lib/admin-auth"

import { LoginScreen, MissingPasswordScreen } from "./admin-gate"

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; uploadedUrl?: string }>
}) {
  const sp = await searchParams

  if (!isAdminPasswordConfigured()) {
    return <MissingPasswordScreen />
  }

  if (!(await isAdminAuthenticated())) {
    return <LoginScreen error={sp.error} />
  }

  const qs = new URLSearchParams()
  if (sp.error) qs.set("error", sp.error)
  if (sp.uploadedUrl) qs.set("uploadedUrl", sp.uploadedUrl)
  const q = qs.toString()
  redirect(`/admin/media${q ? `?${q}` : ""}`)
}
