import { NextResponse } from "next/server"

import { submitContactForm } from "@/lib/crm"

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string
      email?: string
      message?: string
    }

    if (!payload.name || !payload.email || !payload.message) {
      return NextResponse.json(
        { message: "Name, email, and message are required." },
        { status: 400 },
      )
    }

    await submitContactForm({
      name: payload.name,
      email: payload.email,
      message: payload.message,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to submit the contact form right now."

    return NextResponse.json({ message }, { status: 500 })
  }
}
