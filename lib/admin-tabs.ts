export const ADMIN_TAB_IDS = [
  "media",
  "site-settings",
  "homepage",
  "projects",
  "services",
  "about",
  "contact",
] as const

export type AdminTabId = (typeof ADMIN_TAB_IDS)[number]

/** Shown together in the admin tab bar before the per-page tabs, with a divider after. */
export const ADMIN_TAB_SITE_GROUP_IDS = ["media", "site-settings"] as const

export function isAdminTabSiteGroupId(id: AdminTabId): boolean {
  return (ADMIN_TAB_SITE_GROUP_IDS as readonly string[]).includes(id)
}

export const DEFAULT_ADMIN_TAB: AdminTabId = "media"

export function isAdminTabId(value: string): value is AdminTabId {
  return (ADMIN_TAB_IDS as readonly string[]).includes(value)
}

/**
 * Build the path to return to after a server action. Some keys target a tab plus
 * an in-page section (hash), not a top-level tab id.
 */
export function adminPathAfterAction(section: string): string {
  const nested: Record<string, { tab: AdminTabId; hash?: string }> = {
    submissions: { tab: "contact", hash: "submissions" },
    "nav-links": { tab: "site-settings", hash: "nav-links" },
    "site-links": { tab: "site-settings", hash: "site-links" },
    "contact-links": { tab: "contact", hash: "contact-links" },
    "project-order": { tab: "projects", hash: "project-order" },
  }

  const mapped = nested[section]
  if (mapped) {
    const h = mapped.hash ? `#${mapped.hash}` : ""
    return `/admin/${mapped.tab}${h}`
  }

  if (isAdminTabId(section)) {
    return `/admin/${section}`
  }

  return `/admin/${DEFAULT_ADMIN_TAB}`
}
