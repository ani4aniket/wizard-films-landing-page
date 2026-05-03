import type { ReactNode } from "react"

export function Field({
  label,
  name,
  defaultValue,
  required = false,
  placeholder,
  type = "text",
}: {
  label: string
  name: string
  defaultValue?: string | number | null
  required?: boolean
  placeholder?: string
  type?: "text" | "email" | "url" | "number" | "password"
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-transparent bg-secondary px-4 text-sm text-foreground transition outline-none focus:border-primary focus:bg-background"
      />
    </label>
  )
}

export function Area({
  label,
  name,
  defaultValue,
  required = false,
  rows = 5,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string | null
  required?: boolean
  rows?: number
  placeholder?: string
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
        {label}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-[24px] border border-transparent bg-secondary px-4 py-3 text-sm text-foreground transition outline-none focus:border-primary focus:bg-background"
      />
    </label>
  )
}

export function SubmitRow({
  saveLabel = "Save",
  children,
}: {
  saveLabel?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        className="pill-feedback rounded-full border border-primary bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
      >
        {saveLabel}
      </button>
      {children}
    </div>
  )
}
