export type ProjectCategory =
  | "Editing"
  | "Color Grading"
  | "Audio"
  | "Shoot"
  | string

export interface SocialLink {
  id: string
  label: string
  platform: string
  url: string
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl?: string
  footerBlurb?: string
  contactEmail?: string
  socialLinks: SocialLink[]
  ogImage?: string
}

export interface HomepageContent {
  headline: string
  tagline: string
  intro?: string
  heroVideoUrl: string
  heroPosterUrl?: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export interface PortfolioProject {
  id: string
  slug: string
  title: string
  description: string
  category: ProjectCategory
  youtubeUrl: string
  videoId: string
  embedUrl: string
  thumbnailUrl: string
  credits?: string
  role?: string
  featured: boolean
}

export interface ServiceItem {
  id: string
  slug: string
  title: string
  description: string
  icon?: string
  demoClipUrl?: string
}

export interface AboutContent {
  title: string
  story: string
  craftNotes: string[]
  portraitUrl?: string
}

export interface ContactContent {
  title: string
  intro: string
  email?: string
  socialLinks: SocialLink[]
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  isRead: boolean
  createdAt: Date
}

export interface MediaAsset {
  id: string
  filename: string
  pathname: string
  url: string
  contentType?: string
  size?: number
  altText?: string
  createdAt: Date
}
