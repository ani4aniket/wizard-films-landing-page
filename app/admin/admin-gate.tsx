import type { ReactNode } from "react"

import {
  isAdminAuthenticated,
  isAdminPasswordConfigured,
} from "@/lib/admin-auth"
import { SITE_NAME } from "@/lib/constants"

import { AdminLoginForm } from "./admin-login-form"

export function LoginScreen({ error }: { error?: string }) {
  const errorMessage =
    error === "invalid-password"
      ? "That password did not match the one in your environment file."
      : error === "session-expired"
        ? "Your admin session expired. Please sign in again."
        : undefined

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-16">
      <div className="w-full border border-border bg-background p-8">
        <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
          {SITE_NAME} CRM
        </p>
        <h1 className="mt-4 text-4xl font-medium text-foreground">
          Admin Login
        </h1>
        <AdminLoginForm errorMessage={errorMessage} />
      </div>
    </main>
  )
}

export function MissingPasswordScreen() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
      <div className="border border-border bg-background p-8">
        <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
          Admin setup needed
        </p>
        <h1 className="mt-4 text-4xl font-medium text-foreground">
          Set `ADMIN_PASSWORD` first
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          The CRM route is installed, but it will stay locked until
          `ADMIN_PASSWORD` is present in your environment. You can also add
          `ADMIN_SESSION_SECRET` if you want a separate cookie signing secret.
        </p>
      </div>
    </main>
  )
}

export async function AdminGate({
  error,
  children,
}: {
  error?: string
  children: ReactNode
}) {
  if (!isAdminPasswordConfigured()) {
    return <MissingPasswordScreen />
  }

  if (!(await isAdminAuthenticated())) {
    return <LoginScreen error={error} />
  }

  return <>{children}</>
}
