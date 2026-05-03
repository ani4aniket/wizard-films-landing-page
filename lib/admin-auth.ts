import { createHash, timingSafeEqual } from "node:crypto"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_COOKIE_NAME = "wizard_admin_session"

function getConfiguredPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || ""
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getConfiguredPassword()
}

function createSessionToken(password: string) {
  return createHash("sha256")
    .update(`${password}:${getSessionSecret()}`)
    .digest("hex")
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function isAdminPasswordConfigured() {
  return Boolean(getConfiguredPassword())
}

export async function isAdminAuthenticated() {
  const configuredPassword = getConfiguredPassword()

  if (!configuredPassword) {
    return false
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!token) {
    return false
  }

  return safeEqual(token, createSessionToken(configuredPassword))
}

export async function startAdminSession(password: string) {
  const configuredPassword = getConfiguredPassword()

  if (!configuredPassword || !safeEqual(password, configuredPassword)) {
    return false
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, createSessionToken(configuredPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return true
}

export async function endAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function requireAdminSession() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session-expired")
  }
}
