import type { ReactNode } from "react"

import {
  isAdminAuthenticated,
  isAdminPasswordConfigured,
} from "@/lib/admin-auth"
import { Field } from "@/components/admin/admin-fields"
import { SITE_NAME } from "@/lib/constants"

import { loginAction } from "./actions"

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
          Admin sign in
        </h1>
        <form action={loginAction} className="mt-8 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Field
              label="Password"
              name="password"
              required
              type="password"
              placeholder="Enter the admin password"
            />
          </div>
          <button
            type="submit"
            className="pill-feedback w-1/2 rounded-full border border-primary bg-primary px-6 py-3 text-base font-medium text-primary-foreground"
          >
            Enter Admin
          </button>
        </form>
        {errorMessage ? (
          <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
        ) : null}
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
