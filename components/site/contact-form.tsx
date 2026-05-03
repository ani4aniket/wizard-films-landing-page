"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

const EMPTY_FORM = {
  name: "",
  email: "",
  message: "",
}

export function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const loadingId = toast.loading("Sending…")
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        })

        const payload = (await response.json().catch(() => null)) as {
          message?: string
        } | null

        toast.dismiss(loadingId)

        if (!response.ok) {
          toast.error(
            payload?.message || "Unable to send your message right now."
          )
          return
        }

        toast.success("Message sent. You will hear back soon.")
        setForm(EMPTY_FORM)
      } catch {
        toast.dismiss(loadingId)
        toast.error("Unable to send your message right now.")
      }
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 border border-border bg-background p-6 md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Name
          </span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="h-12 w-full rounded-full border border-transparent bg-secondary px-4 text-sm text-foreground transition outline-none focus:border-primary focus:bg-background"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Email
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="h-12 w-full rounded-full border border-transparent bg-secondary px-4 text-sm text-foreground transition outline-none focus:border-primary focus:bg-background"
          />
        </label>
      </div>
      <label className="space-y-2">
        <span className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
          Message
        </span>
        <textarea
          required
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={7}
          className="w-full rounded-[24px] border border-transparent bg-secondary px-4 py-4 text-sm text-foreground transition outline-none focus:border-primary focus:bg-background"
        />
      </label>
      <div className="flex flex-col items-start gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  )
}
