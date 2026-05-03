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
  navCtaLabel?: string
  navCtaHref?: string
  searchArchivePlaceholder?: string
  footerLeadLine?: string
  workPageEyebrow?: string
  workPageHeroTitle?: string
  workPageHeroDescription?: string
  servicesPageEyebrow?: string
  servicesPageHeroTitle?: string
  servicesPageHeroDescription?: string
  projectRelatedEyebrow?: string
  projectRelatedTitle?: string
  projectRelatedDescription?: string
  projectPlaybackNote?: string
  homeFeaturedWorkCtaLabel?: string
  homeFeaturedWorkCtaHref?: string
}

export interface NavLinkItem {
  id: string
  label: string
  href: string
  sortOrder: number
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
  heroEyebrow?: string
  heroAsideEyebrow?: string
  heroAsideFocus?: string
  featuredEyebrow?: string
  featuredTitle?: string
  featuredDescription?: string
  servicesEyebrow?: string
  servicesTitle?: string
  servicesDescription?: string
  approachEyebrow?: string
  approachTitle?: string
  approachDescription?: string
  approachBullets: string[]
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
  pageHeroEyebrow?: string
  pageHeroTitle?: string
  pageHeroDescription?: string
}

export interface ContactContent {
  title: string
  intro: string
  email?: string
  socialLinks: SocialLink[]
  pageHeroEyebrow?: string
  pageHeroTitle?: string
  pageHeroDescription?: string
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
