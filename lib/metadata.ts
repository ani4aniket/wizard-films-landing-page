import type { Metadata } from "next"

import { SITE_NAME } from "@/lib/constants"
import type { PortfolioProject, SiteSettings } from "@/lib/types"

export function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  )
}

export function buildSiteMetadata(settings?: Partial<SiteSettings>): Metadata {
  const siteName = settings?.siteName || SITE_NAME
  const description =
    settings?.siteDescription ||
    "A cinematic portfolio for film editing, color, sound, and story-led production."

  return {
    metadataBase: new URL(settings?.siteUrl || getBaseUrl()),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      title: siteName,
      description,
      type: "website",
      siteName,
      images: settings?.ogImage ? [{ url: settings.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: settings?.ogImage ? [settings.ogImage] : undefined,
    },
  }
}

export function buildProjectMetadata(project: PortfolioProject): Metadata {
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: [{ url: project.thumbnailUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.thumbnailUrl],
    },
  }
}
