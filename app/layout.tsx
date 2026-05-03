import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { buildSiteMetadata } from "@/lib/metadata"
import { getSiteSettings } from "@/lib/crm"
import { cn } from "@/lib/utils"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null)
  return buildSiteMetadata(settings || undefined)
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
