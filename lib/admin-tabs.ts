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
