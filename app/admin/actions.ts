"use server"

import path from "node:path"

import { del, put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { adminPathAfterAction } from "@/lib/admin-tabs"
import { endAdminSession, isAdminPasswordConfigured, requireAdminSession, startAdminSession } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/youtube"

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key)
  return value || null
}

function getNumber(formData: FormData, key: string) {
  const value = Number(getString(formData, key))
  return Number.isFinite(value) ? value : 0
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on"
}

function getCraftNotes(formData: FormData, key: string) {
  return getString(formData, key)
    .split("\n")
    .map((note) => note.trim())
    .filter(Boolean)
}

function revalidateAdminDashboard() {
  revalidatePath("/admin", "layout")
}

function revalidateCmsPaths() {
  revalidatePath("/", "layout")
  revalidatePath("/admin", "layout")
  revalidatePath("/work")
  revalidatePath("/work/[slug]", "page")
  revalidatePath("/services")
  revalidatePath("/about")
  revalidatePath("/contact")
}

function slugFromTitle(formData: FormData, slugKey: string, titleKey: string) {
  const explicitSlug = getString(formData, slugKey)

  if (explicitSlug) {
    return slugify(explicitSlug)
  }

  return slugify(getString(formData, titleKey))
}

function buildUploadPath(filename: string) {
  const extension = path.extname(filename)
  const baseName = filename.slice(0, filename.length - extension.length)
  const slug = slugify(baseName) || "asset"
  return `wizard-films/${Date.now()}-${slug}${extension.toLowerCase()}`
}

function redirectTo(section: string) {
  redirect(adminPathAfterAction(section))
}

export async function loginAction(formData: FormData) {
  if (!isAdminPasswordConfigured()) {
    redirect("/admin?error=missing-password")
  }

  const success = await startAdminSession(getString(formData, "password"))

  if (!success) {
    redirect("/admin?error=invalid-password")
  }

  redirect("/admin/media")
}

export async function logoutAction() {
  await endAdminSession()
  redirect("/admin")
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdminSession()
  await prisma.siteSettings.update({
    where: { id: "site-settings" },
    data: {
      siteName: getString(formData, "siteName"),
      siteDescription: getString(formData, "siteDescription"),
      siteUrl: getOptionalString(formData, "siteUrl"),
      footerBlurb: getOptionalString(formData, "footerBlurb"),
      contactEmail: getOptionalString(formData, "contactEmail"),
      ogImage: getOptionalString(formData, "ogImage"),
      navCtaLabel: getOptionalString(formData, "navCtaLabel"),
      navCtaHref: getOptionalString(formData, "navCtaHref"),
      searchArchivePlaceholder: getOptionalString(
        formData,
        "searchArchivePlaceholder"
      ),
      footerLeadLine: getOptionalString(formData, "footerLeadLine"),
      workPageEyebrow: getOptionalString(formData, "workPageEyebrow"),
      workPageHeroTitle: getOptionalString(formData, "workPageHeroTitle"),
      workPageHeroDescription: getOptionalString(
        formData,
        "workPageHeroDescription"
      ),
      servicesPageEyebrow: getOptionalString(formData, "servicesPageEyebrow"),
      servicesPageHeroTitle: getOptionalString(
        formData,
        "servicesPageHeroTitle"
      ),
      servicesPageHeroDescription: getOptionalString(
        formData,
        "servicesPageHeroDescription"
      ),
      projectRelatedEyebrow: getOptionalString(
        formData,
        "projectRelatedEyebrow"
      ),
      projectRelatedTitle: getOptionalString(formData, "projectRelatedTitle"),
      projectRelatedDescription: getOptionalString(
        formData,
        "projectRelatedDescription"
      ),
      projectPlaybackNote: getOptionalString(formData, "projectPlaybackNote"),
      homeFeaturedWorkCtaLabel: getOptionalString(
        formData,
        "homeFeaturedWorkCtaLabel"
      ),
      homeFeaturedWorkCtaHref: getOptionalString(
        formData,
        "homeFeaturedWorkCtaHref"
      ),
    },
  })

  revalidateCmsPaths()
  redirectTo("site-settings")
}

export async function saveHomepageAction(formData: FormData) {
  await requireAdminSession()
  await prisma.homepageContent.update({
    where: { id: "homepage" },
    data: {
      headline: getString(formData, "headline"),
      tagline: getString(formData, "tagline"),
      intro: getOptionalString(formData, "intro"),
      heroVideoUrl: getOptionalString(formData, "heroVideoUrl"),
      heroPosterUrl: getOptionalString(formData, "heroPosterUrl"),
      primaryCtaLabel: getString(formData, "primaryCtaLabel"),
      primaryCtaHref: getString(formData, "primaryCtaHref"),
      secondaryCtaLabel: getString(formData, "secondaryCtaLabel"),
      secondaryCtaHref: getString(formData, "secondaryCtaHref"),
      heroEyebrow: getOptionalString(formData, "heroEyebrow"),
      heroAsideEyebrow: getOptionalString(formData, "heroAsideEyebrow"),
      heroAsideFocus: getOptionalString(formData, "heroAsideFocus"),
      featuredEyebrow: getOptionalString(formData, "featuredEyebrow"),
      featuredTitle: getOptionalString(formData, "featuredTitle"),
      featuredDescription: getOptionalString(formData, "featuredDescription"),
      servicesEyebrow: getOptionalString(formData, "servicesEyebrow"),
      servicesTitle: getOptionalString(formData, "servicesTitle"),
      servicesDescription: getOptionalString(formData, "servicesDescription"),
      approachEyebrow: getOptionalString(formData, "approachEyebrow"),
      approachTitle: getOptionalString(formData, "approachTitle"),
      approachDescription: getOptionalString(formData, "approachDescription"),
      approachBullets: getCraftNotes(formData, "approachBullets"),
    },
  })

  revalidateCmsPaths()
  redirectTo("homepage")
}

export async function saveAboutAction(formData: FormData) {
  await requireAdminSession()
  await prisma.aboutContent.update({
    where: { id: "about" },
    data: {
      title: getString(formData, "title"),
      story: getString(formData, "story"),
      craftNotes: getCraftNotes(formData, "craftNotes"),
      portraitUrl: getOptionalString(formData, "portraitUrl"),
      pageHeroEyebrow: getOptionalString(formData, "pageHeroEyebrow"),
      pageHeroTitle: getOptionalString(formData, "pageHeroTitle"),
      pageHeroDescription: getOptionalString(formData, "pageHeroDescription"),
    },
  })

  revalidateCmsPaths()
  redirectTo("about")
}

export async function saveContactContentAction(formData: FormData) {
  await requireAdminSession()
  await prisma.contactContent.update({
    where: { id: "contact" },
    data: {
      title: getString(formData, "title"),
      intro: getString(formData, "intro"),
      email: getOptionalString(formData, "email"),
      pageHeroEyebrow: getOptionalString(formData, "pageHeroEyebrow"),
      pageHeroTitle: getOptionalString(formData, "pageHeroTitle"),
      pageHeroDescription: getOptionalString(formData, "pageHeroDescription"),
    },
  })

  revalidateCmsPaths()
  redirectTo("contact")
}

export async function saveNavLinkAction(formData: FormData) {
  await requireAdminSession()
  const id = getString(formData, "id")

  await prisma.navLink.upsert({
    where: { id: id || "__new__" },
    update: {
      label: getString(formData, "label"),
      href: getString(formData, "href"),
      sortOrder: getNumber(formData, "sortOrder"),
    },
    create: {
      label: getString(formData, "label"),
      href: getString(formData, "href"),
      sortOrder: getNumber(formData, "sortOrder"),
    },
  })

  revalidateCmsPaths()
  redirectTo("nav-links")
}

export async function deleteNavLinkAction(formData: FormData) {
  await requireAdminSession()

  const id = getString(formData, "id")

  if (id) {
    await prisma.navLink.delete({
      where: { id },
    })
  }

  revalidateCmsPaths()
  redirectTo("nav-links")
}

export async function saveSocialLinkAction(formData: FormData) {
  await requireAdminSession()
  const id = getString(formData, "id")
  const section = getString(formData, "section")

  await prisma.socialLink.upsert({
    where: { id: id || "__new__" },
    update: {
      platform: getString(formData, "platform"),
      label: getString(formData, "label"),
      url: getString(formData, "url"),
      sortOrder: getNumber(formData, "sortOrder"),
    },
    create: {
      section: section === "CONTACT" ? "CONTACT" : "SITE",
      platform: getString(formData, "platform"),
      label: getString(formData, "label"),
      url: getString(formData, "url"),
      sortOrder: getNumber(formData, "sortOrder"),
    },
  })

  revalidateCmsPaths()
  redirectTo(section === "CONTACT" ? "contact-links" : "site-links")
}

export async function deleteSocialLinkAction(formData: FormData) {
  await requireAdminSession()

  const id = getString(formData, "id")
  const section = getString(formData, "section")

  if (id) {
    await prisma.socialLink.delete({
      where: { id },
    })
  }

  revalidateCmsPaths()
  redirectTo(section === "CONTACT" ? "contact-links" : "site-links")
}

export async function saveProjectAction(formData: FormData) {
  await requireAdminSession()
  const id = getString(formData, "id")
  const data = {
    slug: slugFromTitle(formData, "slug", "title"),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    category: getString(formData, "category"),
    youtubeUrl: getString(formData, "youtubeUrl"),
    thumbnailUrl: getOptionalString(formData, "thumbnailUrl"),
    credits: getOptionalString(formData, "credits"),
    role: getOptionalString(formData, "role"),
    featured: getBoolean(formData, "featured"),
    sortOrder: getNumber(formData, "sortOrder"),
  }

  if (id) {
    await prisma.project.update({
      where: { id },
      data,
    })
  } else {
    await prisma.project.create({ data })
  }

  revalidateCmsPaths()
  redirectTo("projects")
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdminSession()

  const id = getString(formData, "id")

  if (id) {
    await prisma.project.delete({
      where: { id },
    })
  }

  revalidateCmsPaths()
  redirectTo("projects")
}

export async function saveServiceAction(formData: FormData) {
  await requireAdminSession()
  const id = getString(formData, "id")
  const data = {
    slug: slugFromTitle(formData, "slug", "title"),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    icon: getOptionalString(formData, "icon"),
    demoClipUrl: getOptionalString(formData, "demoClipUrl"),
    sortOrder: getNumber(formData, "sortOrder"),
  }

  if (id) {
    await prisma.service.update({
      where: { id },
      data,
    })
  } else {
    await prisma.service.create({ data })
  }

  revalidateCmsPaths()
  redirectTo("services")
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdminSession()

  const id = getString(formData, "id")

  if (id) {
    await prisma.service.delete({
      where: { id },
    })
  }

  revalidateCmsPaths()
  redirectTo("services")
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdminSession()

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    redirect("/admin/media?error=missing-blob-token")
  }

  const file = formData.get("file")

  if (!(file instanceof File) || !file.size) {
    redirect("/admin/media?error=missing-file")
  }

  const pathname = buildUploadPath(file.name)
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
  })

  await prisma.mediaAsset.create({
    data: {
      filename: file.name,
      pathname: blob.pathname,
      url: blob.url,
      contentType: file.type || null,
      size: file.size,
      altText: getOptionalString(formData, "altText"),
    },
  })

  revalidateCmsPaths()
  redirect(`/admin/media?uploadedUrl=${encodeURIComponent(blob.url)}`)
}

export async function deleteMediaAssetAction(formData: FormData) {
  await requireAdminSession()

  const id = getString(formData, "id")

  if (!id) {
    redirectTo("media")
  }

  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
  })

  if (asset?.url && process.env.BLOB_READ_WRITE_TOKEN) {
    await del(asset.url)
  }

  if (asset) {
    await prisma.mediaAsset.delete({
      where: { id: asset.id },
    })
  }

  revalidateAdminDashboard()
  redirectTo("media")
}

export async function toggleSubmissionReadAction(formData: FormData) {
  await requireAdminSession()

  const id = getString(formData, "id")
  const nextValue = getString(formData, "nextValue") === "true"

  if (id) {
    await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: nextValue },
    })
  }

  revalidateAdminDashboard()
  redirectTo("submissions")
}

export async function deleteSubmissionAction(formData: FormData) {
  await requireAdminSession()

  const id = getString(formData, "id")

  if (id) {
    await prisma.contactSubmission.deleteMany({
      where: { id },
    })
  }

  revalidateAdminDashboard()
  redirectTo("submissions")
}
