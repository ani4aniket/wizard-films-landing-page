import { unstable_noStore as noStore } from "next/cache"

import { prisma } from "@/lib/prisma"
import { NAV_LINKS } from "@/lib/constants"
import type {
  AboutContent,
  ContactContent,
  HomepageContent,
  NavLinkItem,
  PortfolioProject,
  ServiceItem,
  SiteSettings,
  SocialLink,
} from "@/lib/types"
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
  slugify,
} from "@/lib/youtube"

function normalizeOptionalString(value: string | null | undefined) {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

function mapSocialLink(link: {
  id: string
  label: string
  platform: string
  url: string
}): SocialLink {
  return {
    id: link.id,
    label: link.label,
    platform: link.platform,
    url: link.url,
  }
}

function mapProject(project: {
  id: string
  slug: string
  title: string
  description: string
  category: string
  youtubeUrl: string
  thumbnailUrl: string | null
  credits: string | null
  role: string | null
  featured: boolean
}): PortfolioProject | null {
  const videoId = getYouTubeVideoId(project.youtubeUrl)

  if (!videoId) {
    return null
  }

  return {
    id: project.id,
    slug: project.slug || slugify(project.title),
    title: project.title,
    description: project.description,
    category: project.category,
    youtubeUrl: project.youtubeUrl,
    videoId,
    embedUrl: getYouTubeEmbedUrl(videoId),
    thumbnailUrl:
      normalizeOptionalString(project.thumbnailUrl) ||
      getYouTubeThumbnailUrl(videoId),
    credits: normalizeOptionalString(project.credits),
    role: normalizeOptionalString(project.role),
    featured: project.featured,
  }
}

function mapService(service: {
  id: string
  slug: string
  title: string
  description: string
  icon: string | null
  demoClipUrl: string | null
}): ServiceItem {
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    description: service.description,
    icon: normalizeOptionalString(service.icon),
    demoClipUrl: normalizeOptionalString(service.demoClipUrl),
  }
}

async function prepareRead() {
  noStore()
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await prepareRead()

  const [settings, socialLinks] = await Promise.all([
    prisma.siteSettings.findUniqueOrThrow({
      where: { id: "site-settings" },
    }),
    prisma.socialLink.findMany({
      where: { section: "SITE" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ])

  return {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    siteUrl: normalizeOptionalString(settings.siteUrl),
    footerBlurb: normalizeOptionalString(settings.footerBlurb),
    contactEmail: normalizeOptionalString(settings.contactEmail),
    ogImage: normalizeOptionalString(settings.ogImage),
    socialLinks: socialLinks.map(mapSocialLink),
    navCtaLabel: normalizeOptionalString(settings.navCtaLabel),
    navCtaHref: normalizeOptionalString(settings.navCtaHref),
    searchArchivePlaceholder: normalizeOptionalString(
      settings.searchArchivePlaceholder
    ),
    footerLeadLine: normalizeOptionalString(settings.footerLeadLine),
    workPageEyebrow: normalizeOptionalString(settings.workPageEyebrow),
    workPageHeroTitle: normalizeOptionalString(settings.workPageHeroTitle),
    workPageHeroDescription: normalizeOptionalString(
      settings.workPageHeroDescription
    ),
    servicesPageEyebrow: normalizeOptionalString(settings.servicesPageEyebrow),
    servicesPageHeroTitle: normalizeOptionalString(
      settings.servicesPageHeroTitle
    ),
    servicesPageHeroDescription: normalizeOptionalString(
      settings.servicesPageHeroDescription
    ),
    projectRelatedEyebrow: normalizeOptionalString(
      settings.projectRelatedEyebrow
    ),
    projectRelatedTitle: normalizeOptionalString(settings.projectRelatedTitle),
    projectRelatedDescription: normalizeOptionalString(
      settings.projectRelatedDescription
    ),
    projectPlaybackNote: normalizeOptionalString(settings.projectPlaybackNote),
    homeFeaturedWorkCtaLabel: normalizeOptionalString(
      settings.homeFeaturedWorkCtaLabel
    ),
    homeFeaturedWorkCtaHref: normalizeOptionalString(
      settings.homeFeaturedWorkCtaHref
    ),
  }
}

export async function getNavigationLinks(): Promise<NavLinkItem[]> {
  await prepareRead()

  const links = await prisma.navLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  })

  if (links.length) {
    return links.map((link) => ({
      id: link.id,
      label: link.label,
      href: link.href,
      sortOrder: link.sortOrder,
    }))
  }

  return NAV_LINKS.map((item, index) => ({
    id: `fallback-${index}`,
    label: item.label,
    href: item.href,
    sortOrder: index,
  }))
}

export async function getHomepageContent(): Promise<HomepageContent> {
  await prepareRead()

  const homepage = await prisma.homepageContent.findUniqueOrThrow({
    where: { id: "homepage" },
  })

  return {
    headline: homepage.headline,
    tagline: homepage.tagline,
    intro: normalizeOptionalString(homepage.intro),
    heroVideoUrl: normalizeOptionalString(homepage.heroVideoUrl) || "",
    heroPosterUrl: normalizeOptionalString(homepage.heroPosterUrl),
    primaryCtaLabel: homepage.primaryCtaLabel,
    primaryCtaHref: homepage.primaryCtaHref,
    secondaryCtaLabel: homepage.secondaryCtaLabel,
    secondaryCtaHref: homepage.secondaryCtaHref,
    heroEyebrow: normalizeOptionalString(homepage.heroEyebrow),
    heroAsideEyebrow: normalizeOptionalString(homepage.heroAsideEyebrow),
    heroAsideFocus: normalizeOptionalString(homepage.heroAsideFocus),
    featuredEyebrow: normalizeOptionalString(homepage.featuredEyebrow),
    featuredTitle: normalizeOptionalString(homepage.featuredTitle),
    featuredDescription: normalizeOptionalString(homepage.featuredDescription),
    servicesEyebrow: normalizeOptionalString(homepage.servicesEyebrow),
    servicesTitle: normalizeOptionalString(homepage.servicesTitle),
    servicesDescription: normalizeOptionalString(homepage.servicesDescription),
    approachEyebrow: normalizeOptionalString(homepage.approachEyebrow),
    approachTitle: normalizeOptionalString(homepage.approachTitle),
    approachDescription: normalizeOptionalString(homepage.approachDescription),
    approachBullets: homepage.approachBullets.filter(Boolean),
  }
}

export async function getProjects(): Promise<PortfolioProject[]> {
  await prepareRead()

  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  })

  return projects
    .map(mapProject)
    .filter((project): project is PortfolioProject => Boolean(project))
}

export async function getServices(): Promise<ServiceItem[]> {
  await prepareRead()

  const services = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  })

  return services.map(mapService)
}

export async function getAboutContent(): Promise<AboutContent> {
  await prepareRead()

  const about = await prisma.aboutContent.findUniqueOrThrow({
    where: { id: "about" },
  })

  return {
    title: about.title,
    story: about.story,
    craftNotes: about.craftNotes.filter(Boolean),
    portraitUrl: normalizeOptionalString(about.portraitUrl),
    pageHeroEyebrow: normalizeOptionalString(about.pageHeroEyebrow),
    pageHeroTitle: normalizeOptionalString(about.pageHeroTitle),
    pageHeroDescription: normalizeOptionalString(about.pageHeroDescription),
  }
}

export async function getContactContent(): Promise<ContactContent> {
  await prepareRead()

  const [contact, socialLinks] = await Promise.all([
    prisma.contactContent.findUniqueOrThrow({
      where: { id: "contact" },
    }),
    prisma.socialLink.findMany({
      where: { section: "CONTACT" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ])

  return {
    title: contact.title,
    intro: contact.intro,
    email: normalizeOptionalString(contact.email),
    socialLinks: socialLinks.map(mapSocialLink),
    pageHeroEyebrow: normalizeOptionalString(contact.pageHeroEyebrow),
    pageHeroTitle: normalizeOptionalString(contact.pageHeroTitle),
    pageHeroDescription: normalizeOptionalString(contact.pageHeroDescription),
  }
}

export async function submitContactForm(payload: {
  name: string
  email: string
  message: string
}) {
  return prisma.contactSubmission.create({
    data: {
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
    },
  })
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects()
  return projects.find((project) => project.slug === slug) || null
}
