"use client"

import type { ReactNode } from "react"
import { useId } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const fieldLabelClass =
  "w-full items-start justify-start text-left text-xs tracking-[0.24em] text-muted-foreground uppercase"

const inputChromeClass =
  "h-12 w-full rounded-none border border-transparent bg-secondary px-4 text-sm text-foreground transition outline-none focus-visible:border-primary focus-visible:ring-0 focus-visible:bg-background"

const textareaChromeClass =
  "min-h-[unset] w-full resize-y rounded-none border border-transparent bg-secondary px-4 py-3 text-sm text-foreground transition outline-none focus-visible:border-primary focus-visible:ring-0 focus-visible:bg-background"

const RACK_COL = {
  1: "md:col-start-1",
  2: "md:col-start-2",
  3: "md:col-start-3",
  4: "md:col-start-4",
  5: "md:col-start-5",
  6: "md:col-start-6",
} as const

export type FieldRackColumn = keyof typeof RACK_COL

/** Last column in a `md:grid` rack — keeps Save / Remove on the same row as inputs. */
export function FieldRackActions({
  column,
  children,
}: {
  column: FieldRackColumn
  children: ReactNode
}) {
  const col = RACK_COL[column]
  return (
    <div className="max-md:mt-2 md:contents">
      <div
        className={cn(
          "flex w-full flex-wrap items-end gap-3",
          "md:row-start-2",
          col
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function Field({
  label,
  name,
  defaultValue,
  required = false,
  placeholder,
  type = "text",
  hint,
  rackColumn,
}: {
  label: string
  name: string
  defaultValue?: string | number | null
  required?: boolean
  placeholder?: string
  type?: "text" | "email" | "url" | "number" | "password"
  hint?: ReactNode
  /** When set, participates in parent `md:grid`: row1 label, row2 input, row3 hint. */
  rackColumn?: FieldRackColumn
}) {
  const baseId = useId()
  const inputId = `${baseId}-input`
  const hintElId = hint ? `${baseId}-hint` : undefined
  const rack = rackColumn != null
  const col = rack ? RACK_COL[rackColumn] : ""

  const labelEl = (
    <Label
      htmlFor={inputId}
      className={cn(
        "flex w-full flex-col gap-2",
        fieldLabelClass,
        rack && "md:row-start-1 md:self-end",
        rack && col
      )}
    >
      {label}
    </Label>
  )

  const inputEl = (
    <Input
      id={inputId}
      name={name}
      type={type}
      required={required}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      aria-describedby={hintElId}
      className={cn(inputChromeClass, rack && "md:row-start-2", rack && col)}
    />
  )

  const hintEl = hint ? (
    <p
      id={hintElId}
      className={cn(
        "text-xs leading-relaxed text-muted-foreground",
        rack && "md:row-start-3 md:self-start",
        rack && col
      )}
    >
      {hint}
    </p>
  ) : null

  if (!rack) {
    return (
      <div className="space-y-2">
        {labelEl}
        {inputEl}
        {hintEl}
      </div>
    )
  }

  return (
    <div className="max-md:space-y-2 md:contents">
      {labelEl}
      {inputEl}
      {hintEl}
    </div>
  )
}

export function Area({
  label,
  name,
  defaultValue,
  required = false,
  rows = 5,
  placeholder,
  hint,
}: {
  label: string
  name: string
  defaultValue?: string | null
  required?: boolean
  rows?: number
  placeholder?: string
  hint?: ReactNode
}) {
  const baseId = useId()
  const areaId = `${baseId}-area`
  const hintElId = hint ? `${baseId}-hint` : undefined
  return (
    <div className="space-y-2">
      <Label
        htmlFor={areaId}
        className={cn("flex w-full flex-col gap-2", fieldLabelClass)}
      >
        {label}
      </Label>
      <Textarea
        id={areaId}
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        aria-describedby={hintElId}
        className={textareaChromeClass}
      />
      {hint ? (
        <p
          id={hintElId}
          className="text-xs leading-relaxed text-muted-foreground"
        >
          {hint}
        </p>
      ) : null}
    </div>
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
      <Button type="submit" size="default">
        {saveLabel}
      </Button>
      {children}
    </div>
  )
}
