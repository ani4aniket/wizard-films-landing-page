import type { Metadata } from "next"

import "./globals.css"
import { Footer } from "@/components/site/footer"
import { Navbar } from "@/components/site/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { buildSiteMetadata } from "@/lib/metadata"
import { getContactContent, getSiteSettings } from "@/lib/crm"
import { SITE_NAME } from "@/lib/constants"
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
  const [settingsResult, contactResult] = await Promise.allSettled([
    getSiteSettings(),
    getContactContent(),
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
          <Navbar siteName={mergedSettings.siteName} />
          {children}
          <Footer settings={mergedSettings} />
        </ThemeProvider>
      </body>
    </html>
  )
}
