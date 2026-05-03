"use client"

import { Image03Icon, Settings02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ReactNode, useLayoutEffect } from "react"

import { buttonVariants } from "@/components/ui/button"
import { isAdminTabSiteGroupId, type AdminTabId } from "@/lib/admin-tabs"
import { cn } from "@/lib/utils"

const ADMIN_TAB_TRIGGER_ICONS: Partial<
  Record<AdminTabId, typeof Image03Icon>
> = {
  media: Image03Icon,
  "site-settings": Settings02Icon,
}

export type AdminTabPanel = {
  id: AdminTabId
  /** Short label on the tab trigger */
  label: string
  /** Optional longer heading inside the panel (defaults to label) */
  title?: string
  description: string
  /** Extra context on hover (non-technical users can discover what each tab does). */
  tabHint?: string
  /** Override save reminder visibility (by default it is hidden on Media only). */
  showSaveReminder?: boolean
  content: ReactNode
}

export function AdminTabLayout({
  panels,
  activeSection,
}: {
  panels: AdminTabPanel[]
  activeSection: AdminTabId
}) {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" })
      })
    })
  }, [pathname, activeSection])

  const activePanel = panels.find((p) => p.id === activeSection) ?? panels[0]

  if (!activePanel) {
    return null
  }

  const showSaveLine =
    activePanel.showSaveReminder ?? activePanel.id !== "media"

  const siteGroupPanels = panels.filter((p) => isAdminTabSiteGroupId(p.id))
  const pagePanels = panels.filter((p) => !isAdminTabSiteGroupId(p.id))
  const showTabBarDivider =
    siteGroupPanels.length > 0 && pagePanels.length > 0

  const renderTabLink = (panel: AdminTabPanel) => {
    const selected = activeSection === panel.id
    const tabIcon = ADMIN_TAB_TRIGGER_ICONS[panel.id]
    return (
      <Link
        key={panel.id}
        href={`/admin/${panel.id}`}
        title={panel.tabHint}
        role="tab"
        aria-selected={selected}
        id={`admin-tab-${panel.id}`}
        aria-controls={`admin-panel-${panel.id}`}
        tabIndex={selected ? 0 : -1}
        scroll={false}
        className={cn(
          buttonVariants({
            variant: selected ? "default" : "outline",
            size: "sm",
          }),
          "inline-flex h-auto items-center gap-2 rounded-full px-4 py-2.5 text-sm"
        )}
      >
        {tabIcon ? (
          <HugeiconsIcon
            icon={tabIcon}
            strokeWidth={2}
            className="size-4 shrink-0"
            aria-hidden
          />
        ) : null}
        {panel.label}
      </Link>
    )
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div
          role="tablist"
          aria-label="Media and site"
          className="flex flex-wrap items-center gap-2"
        >
          {siteGroupPanels.map(renderTabLink)}
        </div>
        {showTabBarDivider ? (
          <div
            aria-hidden
            className="h-7 w-px shrink-0 self-center bg-border"
          />
        ) : null}
        <div
          role="tablist"
          aria-label="Pages"
          className="flex flex-wrap items-center gap-2"
        >
          {pagePanels.map(renderTabLink)}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`admin-panel-${activePanel.id}`}
        aria-labelledby={`admin-tab-${activePanel.id}`}
        className="mt-6 border border-border bg-background p-6 md:p-8"
      >
        <header className="max-w-3xl border-b border-border pb-5">
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            {activePanel.title ?? activePanel.label}
          </p>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            {activePanel.description}
          </p>
          {showSaveLine ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Scroll down on this tab, then press{" "}
              <strong className="font-medium text-foreground">Save</strong> on
              the section you edited.
            </p>
          ) : null}
        </header>
        <div className="mt-6">{activePanel.content}</div>
      </div>
    </div>
  )
}
