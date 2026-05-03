"use client"

import type { ReactNode } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AdminAccordionSections({
  defaultOpen,
  children,
}: {
  /** Item `value`s that start expanded */
  defaultOpen: string[]
  children: ReactNode
}) {
  return (
    <Accordion
      multiple
      defaultValue={defaultOpen}
      keepMounted
      className="w-full overflow-hidden rounded-none border border-border bg-background shadow-sm"
    >
      {children}
    </Accordion>
  )
}

export function AdminAccordionSection({
  value,
  title,
  description,
  children,
}: {
  value: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <AccordionItem
      value={value}
      className="border-0 not-last:border-b not-last:border-border"
    >
      <AccordionTrigger className="px-5 py-4 hover:bg-secondary/40 hover:no-underline">
        <span className="min-w-0 flex-1 pr-2">
          <span className="block text-sm font-medium text-foreground">
            {title}
          </span>
          {description ? (
            <span className="mt-1 block text-xs leading-relaxed font-normal text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
      </AccordionTrigger>
      <AccordionContent className="border-t border-border px-5 pb-5">
        <div className="space-y-5 pt-5">{children}</div>
      </AccordionContent>
    </AccordionItem>
  )
}
