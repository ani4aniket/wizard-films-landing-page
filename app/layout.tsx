import type { Metadata } from "next"

import "./globals.css"
import { Footer } from "@/components/site/footer"
import { Navbar } from "@/components/site/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { buildSiteMetadata } from "@/lib/metadata"
import {
  getContactContent,
  getNavigationLinks,
  getSiteSettings,
} from "@/lib/crm"
import { NAV_LINKS, SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null)
  return buildSiteMetadata(settings || undefined)
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [settingsResult, contactResult, navResult] = await Promise.allSettled([
    getSiteSettings(),
    getContactContent(),
    getNavigationLinks(),
  ])

  const settings =
    settingsResult.status === "fulfilled"
      ? settingsResult.value
      : {
          siteName: SITE_NAME,
          siteDescription:
            "Music video direction, editing, and shoot execution with sound-led visual storytelling.",
          socialLinks: [],
          contactEmail: "",
          footerBlurb: "",
        }

  const mergedSettings = {
    ...settings,
    socialLinks:
      settings.socialLinks.length > 0
        ? settings.socialLinks
        : contactResult.status === "fulfilled"
          ? contactResult.value.socialLinks
          : [],
    contactEmail:
      settings.contactEmail ||
      (contactResult.status === "fulfilled" ? contactResult.value.email : ""),
  }

  const navLinks =
    navResult.status === "fulfilled"
      ? navResult.value.map((item) => ({ label: item.label, href: item.href }))
      : NAV_LINKS

  const navCtaLabel = mergedSettings.navCtaLabel || "Start a Project"
  const navCtaHref = mergedSettings.navCtaHref || "/contact"
  const searchPlaceholder =
    mergedSettings.searchArchivePlaceholder || "Search the archive"

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("scroll-smooth antialiased")}
    >
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
        >
          <Navbar
            siteName={mergedSettings.siteName}
            navLinks={navLinks}
            navCtaLabel={navCtaLabel}
            navCtaHref={navCtaHref}
            searchPlaceholder={searchPlaceholder}
          />
          {children}
          <Footer settings={mergedSettings} navLinks={navLinks} />
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
