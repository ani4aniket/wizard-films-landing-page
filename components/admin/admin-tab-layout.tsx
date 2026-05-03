"use client"

import {
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useState,
} from "react"

import { cn } from "@/lib/utils"

export type AdminTabPanel = {
  id: string
  /** Short label on the tab trigger */
  label: string
  /** Optional longer heading inside the panel (defaults to label) */
  title?: string
  description: string
  content: ReactNode
}

export function AdminTabLayout({ panels }: { panels: AdminTabPanel[] }) {
  const firstId = panels[0]?.id ?? ""
  const [activeId, setActiveId] = useState(firstId)

  useLayoutEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1)
      if (hash && panels.some((p) => p.id === hash)) {
        setActiveId(hash)
      }
    }
    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [panels])

  const selectTab = useCallback((id: string) => {
    setActiveId(id)
    window.history.replaceState(null, "", `#${id}`)
  }, [])

  const activePanel = panels.find((p) => p.id === activeId) ?? panels[0]

  if (!activePanel) {
    return null
  }

  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="Admin sections"
        className="flex flex-wrap gap-2"
      >
        {panels.map((panel) => {
          const selected = activeId === panel.id
          return (
            <button
              key={panel.id}
              role="tab"
              type="button"
              aria-selected={selected}
              id={`admin-tab-${panel.id}`}
              aria-controls={`admin-panel-${panel.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(panel.id)}
              className={cn(
                "pill-feedback rounded-full border px-4 py-2.5 text-sm transition",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:bg-secondary"
              )}
            >
              {panel.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`admin-panel-${activePanel.id}`}
        aria-labelledby={`admin-tab-${activePanel.id}`}
        className="mt-6 border border-border bg-background p-6 md:p-8"
      >
        <header className="max-w-3xl border-b border-border pb-6">
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            {activePanel.title ?? activePanel.label}
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {activePanel.description}
          </p>
        </header>
        <div className="mt-8">{activePanel.content}</div>
      </div>
    </div>
  )
}
