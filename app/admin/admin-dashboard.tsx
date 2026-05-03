import type { MediaAsset } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

import {
  deleteMediaAssetAction,
  deleteNavLinkAction,
  deleteSubmissionAction,
  deleteProjectAction,
  deleteServiceAction,
  deleteSocialLinkAction,
  logoutAction,
  saveAboutAction,
  saveContactContentAction,
  saveHomepageAction,
  saveNavLinkAction,
  saveProjectAction,
  saveServiceAction,
  saveSiteSettingsAction,
  saveSocialLinkAction,
  toggleSubmissionReadAction,
} from "@/app/admin/actions"
import { AdminTabLayout } from "@/components/admin/admin-tab-layout"
import { Field, Area, SubmitRow } from "@/components/admin/admin-fields"
import { CopyMediaUrlButton } from "@/components/admin/copy-media-url-button"
import { MediaUploadForm } from "@/components/admin/media-upload-form"
import { UploadSuccessBanner } from "@/components/admin/upload-success-banner"
import { SITE_NAME } from "@/lib/constants"
import type { AdminTabId } from "@/lib/admin-tabs"
import { prisma } from "@/lib/prisma"

export async function AdminDashboard({
  section,
  error,
  uploadedUrl,
}: {
  section: AdminTabId
  error?: string
  uploadedUrl?: string
}) {
  const [
    siteSettings,
    homepage,
    about,
    contact,
    siteLinks,
    contactLinks,
    navLinks,
    projects,
    services,
    submissions,
  ] = await Promise.all([
    prisma.siteSettings.findUniqueOrThrow({ where: { id: "site-settings" } }),
    prisma.homepageContent.findUniqueOrThrow({ where: { id: "homepage" } }),
    prisma.aboutContent.findUniqueOrThrow({ where: { id: "about" } }),
    prisma.contactContent.findUniqueOrThrow({ where: { id: "contact" } }),
    prisma.socialLink.findMany({
      where: { section: "SITE" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.socialLink.findMany({
      where: { section: "CONTACT" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.navLink.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    }),
    prisma.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ])

  const media: MediaAsset[] = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  })

  return (
  <main className="mx-auto max-w-[1440px] px-6 py-12 md:px-10">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
          {SITE_NAME} CRM
        </p>
        <h1 className="mt-4 text-5xl font-medium text-foreground">
          Content admin
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          Edit the public site, upload Blob media, and review new enquiries
          from one place. The public-facing pages are already wired to this
          data.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="pill-feedback rounded-full border border-border px-5 py-3 text-sm text-foreground transition hover:bg-secondary"
        >
          View Site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="pill-feedback rounded-full border border-border px-5 py-3 text-sm text-foreground transition hover:bg-secondary"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>

    {error ? (
      <p className="mt-6 border border-destructive/20 bg-[#fff5f5] px-4 py-3 text-sm text-destructive">
        {error === "missing-blob-token"
          ? "Add BLOB_READ_WRITE_TOKEN before using uploads."
          : error === "missing-file"
            ? "Choose a file before uploading."
            : "Something needs attention in the admin form submission."}
      </p>
    ) : null}

    <AdminTabLayout
      activeSection={section}
      panels={[
        {
          id: "media",
          label: "Media",
          title: "Media Library",
          description:
            "Upload images or videos to Vercel Blob, then paste the returned URLs into hero, project, service, or portrait fields.",
          content: (
            <>
              {uploadedUrl ? (
                <UploadSuccessBanner url={uploadedUrl} />
              ) : null}

              <MediaUploadForm />

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {media.map((asset) => (
                  <article
                    key={asset.id}
                    className="overflow-hidden border border-border bg-background"
                  >
                    {asset.contentType?.startsWith("video/") ? (
                      <video
                        src={asset.url}
                        controls
                        className="aspect-video w-full border-b border-border/70 bg-black object-cover"
                      />
                    ) : (
                      <div className="relative aspect-video w-full border-b border-border/70 bg-black">
                        <Image
                          src={asset.url}
                          alt={asset.altText || asset.filename}
                          fill
                          sizes="(max-width: 1280px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-3 p-4">
                      <p className="truncate text-sm text-foreground">
                        {asset.filename}
                      </p>
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-sm text-foreground hover:underline"
                      >
                        {asset.url}
                      </a>
                      <p className="text-xs text-muted-foreground">
                        {asset.contentType || "Unknown type"}
                        {typeof asset.size === "number"
                          ? ` • ${Math.round(asset.size / 1024)} KB`
                          : ""}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <CopyMediaUrlButton url={asset.url} />
                        <form action={deleteMediaAssetAction} className="inline">
                          <input type="hidden" name="id" value={asset.id} />
                          <button
                            type="submit"
                            className="pill-feedback rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-destructive hover:text-destructive"
                          >
                            Delete Asset
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ),
        },
        {
          id: "site-settings",
          label: "Site",
          title: "Site Settings",
          description:
            "Global metadata, footer copy, and the social links shown across the site.",
          content: (
            <>
              <form action={saveSiteSettingsAction} className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Site Name"
                    name="siteName"
                    required
                    defaultValue={siteSettings.siteName}
                  />
                  <Field
                    label="Contact Email"
                    name="contactEmail"
                    type="email"
                    defaultValue={siteSettings.contactEmail}
                  />
                </div>
                <Area
                  label="Site Description"
                  name="siteDescription"
                  required
                  rows={3}
                  defaultValue={siteSettings.siteDescription}
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Site URL"
                    name="siteUrl"
                    type="url"
                    defaultValue={siteSettings.siteUrl}
                  />
                  <Field
                    label="OG Image URL"
                    name="ogImage"
                    type="url"
                    defaultValue={siteSettings.ogImage}
                  />
                </div>
                <Area
                  label="Footer Blurb"
                  name="footerBlurb"
                  rows={3}
                  defaultValue={siteSettings.footerBlurb}
                />
                <Area
                  label="Footer Lead Line"
                  name="footerLeadLine"
                  rows={2}
                  placeholder="Large headline above the footer blurb"
                  defaultValue={siteSettings.footerLeadLine}
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Nav CTA Label"
                    name="navCtaLabel"
                    defaultValue={siteSettings.navCtaLabel}
                  />
                  <Field
                    label="Nav CTA Href"
                    name="navCtaHref"
                    defaultValue={siteSettings.navCtaHref}
                  />
                </div>
                <Field
                  label="Archive Search Placeholder"
                  name="searchArchivePlaceholder"
                  defaultValue={siteSettings.searchArchivePlaceholder}
                />
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Work Page Hero
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Eyebrow (optional — defaults to site name)"
                    name="workPageEyebrow"
                    defaultValue={siteSettings.workPageEyebrow}
                  />
                  <Field
                    label="Title"
                    name="workPageHeroTitle"
                    defaultValue={siteSettings.workPageHeroTitle}
                  />
                </div>
                <Area
                  label="Description"
                  name="workPageHeroDescription"
                  rows={3}
                  defaultValue={siteSettings.workPageHeroDescription}
                />
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Services Page Hero
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    name="servicesPageEyebrow"
                    defaultValue={siteSettings.servicesPageEyebrow}
                  />
                  <Field
                    label="Title"
                    name="servicesPageHeroTitle"
                    defaultValue={siteSettings.servicesPageHeroTitle}
                  />
                </div>
                <Area
                  label="Description"
                  name="servicesPageHeroDescription"
                  rows={3}
                  defaultValue={siteSettings.servicesPageHeroDescription}
                />
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Project Detail — Related Section
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    name="projectRelatedEyebrow"
                    defaultValue={siteSettings.projectRelatedEyebrow}
                  />
                  <Field
                    label="Title"
                    name="projectRelatedTitle"
                    defaultValue={siteSettings.projectRelatedTitle}
                  />
                </div>
                <Area
                  label="Description"
                  name="projectRelatedDescription"
                  rows={2}
                  defaultValue={siteSettings.projectRelatedDescription}
                />
                <Area
                  label="Playback Note (sidebar)"
                  name="projectPlaybackNote"
                  rows={2}
                  defaultValue={siteSettings.projectPlaybackNote}
                />
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Homepage — Featured CTA
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Label"
                    name="homeFeaturedWorkCtaLabel"
                    defaultValue={siteSettings.homeFeaturedWorkCtaLabel}
                  />
                  <Field
                    label="Href"
                    name="homeFeaturedWorkCtaHref"
                    defaultValue={siteSettings.homeFeaturedWorkCtaHref}
                  />
                </div>
                <SubmitRow saveLabel="Save Site Settings" />
              </form>

              <div id="nav-links" className="mt-10 space-y-4">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Header Navigation
                </p>
                {navLinks.map((link) => (
                  <form
                    key={link.id}
                    action={saveNavLinkAction}
                    className="grid gap-4 border border-border bg-background p-4 md:grid-cols-[1fr_1fr_120px_auto]"
                  >
                    <input type="hidden" name="id" value={link.id} />
                    <Field
                      label="Label"
                      name="label"
                      required
                      defaultValue={link.label}
                    />
                    <Field
                      label="Href"
                      name="href"
                      required
                      defaultValue={link.href}
                    />
                    <Field
                      label="Order"
                      name="sortOrder"
                      type="number"
                      defaultValue={link.sortOrder}
                    />
                    <div className="self-end">
                      <SubmitRow saveLabel="Save Link">
                        <button
                          type="submit"
                          formAction={deleteNavLinkAction}
                          className="pill-feedback rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-destructive hover:text-destructive"
                        >
                          Delete
                        </button>
                      </SubmitRow>
                    </div>
                  </form>
                ))}

                <form
                  action={saveNavLinkAction}
                  className="grid gap-4 border border-dashed border-border bg-secondary/50 p-4 md:grid-cols-[1fr_1fr_120px_auto]"
                >
                  <Field label="Label" name="label" required />
                  <Field
                    label="Href"
                    name="href"
                    required
                    placeholder="/work"
                  />
                  <Field
                    label="Order"
                    name="sortOrder"
                    type="number"
                    defaultValue={0}
                  />
                  <div className="self-end">
                    <SubmitRow saveLabel="Add Nav Link" />
                  </div>
                </form>
              </div>

              <div id="site-links" className="mt-10 space-y-4">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Site Social Links
                </p>
                {siteLinks.map((link) => (
                  <form
                    key={link.id}
                    action={saveSocialLinkAction}
                    className="grid gap-4 border border-border bg-background p-4 md:grid-cols-[1fr_1fr_2fr_120px_auto]"
                  >
                    <input type="hidden" name="id" value={link.id} />
                    <input type="hidden" name="section" value="SITE" />
                    <Field
                      label="Platform"
                      name="platform"
                      required
                      defaultValue={link.platform}
                    />
                    <Field
                      label="Label"
                      name="label"
                      required
                      defaultValue={link.label}
                    />
                    <Field
                      label="URL"
                      name="url"
                      type="url"
                      required
                      defaultValue={link.url}
                    />
                    <Field
                      label="Order"
                      name="sortOrder"
                      type="number"
                      defaultValue={link.sortOrder}
                    />
                    <div className="self-end">
                      <SubmitRow saveLabel="Save Link">
                        <button
                          type="submit"
                          formAction={deleteSocialLinkAction}
                          className="pill-feedback rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-destructive hover:text-destructive"
                        >
                          Delete
                        </button>
                      </SubmitRow>
                    </div>
                  </form>
                ))}

                <form
                  action={saveSocialLinkAction}
                  className="grid gap-4 border border-dashed border-border bg-secondary/50 p-4 md:grid-cols-[1fr_1fr_2fr_120px_auto]"
                >
                  <input type="hidden" name="section" value="SITE" />
                  <Field
                    label="Platform"
                    name="platform"
                    required
                    placeholder="Instagram"
                  />
                  <Field
                    label="Label"
                    name="label"
                    required
                    placeholder="Follow"
                  />
                  <Field
                    label="URL"
                    name="url"
                    type="url"
                    required
                    placeholder="https://..."
                  />
                  <Field
                    label="Order"
                    name="sortOrder"
                    type="number"
                    defaultValue={0}
                  />
                  <div className="self-end">
                    <SubmitRow saveLabel="Add Link" />
                  </div>
                </form>
              </div>
            </>
          ),
        },
        {
          id: "homepage",
          label: "Homepage",
          description:
            "Headline copy plus hero media URLs. Upload in the Media Library tab, then paste the image or video URL here.",
          content: (
            <>
              <form action={saveHomepageAction} className="grid gap-5">
                <Field
                  label="Headline"
                  name="headline"
                  required
                  defaultValue={homepage.headline}
                />
                <Field
                  label="Tagline"
                  name="tagline"
                  required
                  defaultValue={homepage.tagline}
                />
                <Area
                  label="Intro"
                  name="intro"
                  rows={4}
                  defaultValue={homepage.intro}
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Hero Video URL"
                    name="heroVideoUrl"
                    type="url"
                    defaultValue={homepage.heroVideoUrl}
                  />
                  <Field
                    label="Hero Poster URL"
                    name="heroPosterUrl"
                    type="url"
                    defaultValue={homepage.heroPosterUrl}
                  />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Primary CTA Label"
                    name="primaryCtaLabel"
                    required
                    defaultValue={homepage.primaryCtaLabel}
                  />
                  <Field
                    label="Primary CTA Href"
                    name="primaryCtaHref"
                    required
                    defaultValue={homepage.primaryCtaHref}
                  />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Secondary CTA Label"
                    name="secondaryCtaLabel"
                    required
                    defaultValue={homepage.secondaryCtaLabel}
                  />
                  <Field
                    label="Secondary CTA Href"
                    name="secondaryCtaHref"
                    required
                    defaultValue={homepage.secondaryCtaHref}
                  />
                </div>
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Hero — Eyebrow & Aside
                </p>
                <Field
                  label="Hero Eyebrow (blank = site name + “ Portfolio”)"
                  name="heroEyebrow"
                  defaultValue={homepage.heroEyebrow}
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Aside Eyebrow"
                    name="heroAsideEyebrow"
                    defaultValue={homepage.heroAsideEyebrow}
                  />
                  <Field
                    label="Aside Focus Line (blank = first About craft notes)"
                    name="heroAsideFocus"
                    defaultValue={homepage.heroAsideFocus}
                  />
                </div>
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Featured Section
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    name="featuredEyebrow"
                    defaultValue={homepage.featuredEyebrow}
                  />
                  <Field
                    label="Title"
                    name="featuredTitle"
                    defaultValue={homepage.featuredTitle}
                  />
                </div>
                <Area
                  label="Description"
                  name="featuredDescription"
                  rows={2}
                  defaultValue={homepage.featuredDescription}
                />
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Services Section
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    name="servicesEyebrow"
                    defaultValue={homepage.servicesEyebrow}
                  />
                  <Field
                    label="Title"
                    name="servicesTitle"
                    defaultValue={homepage.servicesTitle}
                  />
                </div>
                <Area
                  label="Description"
                  name="servicesDescription"
                  rows={3}
                  defaultValue={homepage.servicesDescription}
                />
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Approach Section
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    name="approachEyebrow"
                    defaultValue={homepage.approachEyebrow}
                  />
                  <Field
                    label="Title"
                    name="approachTitle"
                    defaultValue={homepage.approachTitle}
                  />
                </div>
                <Area
                  label="Description"
                  name="approachDescription"
                  rows={3}
                  defaultValue={homepage.approachDescription}
                />
                <Area
                  label="Approach Bullets (one per line — optional; falls back to About craft notes)"
                  name="approachBullets"
                  rows={4}
                  defaultValue={homepage.approachBullets.join("\n")}
                />
                <SubmitRow saveLabel="Save Homepage" />
              </form>
            </>
          ),
        },
        {
          id: "projects",
          label: "Projects",
          description:
            "Each project powers the work archive and individual project page. YouTube is still used for playback, while thumbnails can come from Blob.",
          content: (
            <>
              <div className="space-y-6">
                {projects.map((project) => (
                  <form
                    key={project.id}
                    action={saveProjectAction}
                    className="grid gap-5 border border-border bg-background p-5"
                  >
                    <input type="hidden" name="id" value={project.id} />
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="Title"
                        name="title"
                        required
                        defaultValue={project.title}
                      />
                      <Field
                        label="Slug"
                        name="slug"
                        defaultValue={project.slug}
                      />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="Category"
                        name="category"
                        required
                        defaultValue={project.category}
                      />
                      <Field
                        label="Role"
                        name="role"
                        defaultValue={project.role}
                      />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="YouTube URL"
                        name="youtubeUrl"
                        type="url"
                        required
                        defaultValue={project.youtubeUrl}
                      />
                      <Field
                        label="Thumbnail URL"
                        name="thumbnailUrl"
                        type="url"
                        defaultValue={project.thumbnailUrl}
                      />
                    </div>
                    <Area
                      label="Description"
                      name="description"
                      required
                      rows={4}
                      defaultValue={project.description}
                    />
                    <Area
                      label="Credits"
                      name="credits"
                      rows={3}
                      defaultValue={project.credits}
                    />
                    <div className="flex flex-wrap items-center gap-5">
                      <Field
                        label="Sort Order"
                        name="sortOrder"
                        type="number"
                        defaultValue={project.sortOrder}
                      />
                      <label className="mt-6 inline-flex items-center gap-3 text-sm text-foreground">
                        <input
                          type="checkbox"
                          name="featured"
                          defaultChecked={project.featured}
                          className="size-4 rounded border-border"
                        />
                        Featured on homepage
                      </label>
                    </div>
                    <SubmitRow saveLabel="Save Project">
                      <button
                        type="submit"
                        formAction={deleteProjectAction}
                        className="pill-feedback rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-destructive hover:text-destructive"
                      >
                        Delete
                      </button>
                    </SubmitRow>
                  </form>
                ))}

                <form
                  action={saveProjectAction}
                  className="grid gap-5 border border-dashed border-border bg-secondary/50 p-5"
                >
                  <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                    Add Project
                  </p>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Title" name="title" required />
                    <Field
                      label="Slug"
                      name="slug"
                      placeholder="auto-generated-from-title"
                    />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Category"
                      name="category"
                      required
                      placeholder="Editing"
                    />
                    <Field label="Role" name="role" placeholder="Editor" />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="YouTube URL"
                      name="youtubeUrl"
                      type="url"
                      required
                    />
                    <Field
                      label="Thumbnail URL"
                      name="thumbnailUrl"
                      type="url"
                    />
                  </div>
                  <Area
                    label="Description"
                    name="description"
                    required
                    rows={4}
                  />
                  <Area label="Credits" name="credits" rows={3} />
                  <div className="flex flex-wrap items-center gap-5">
                    <Field
                      label="Sort Order"
                      name="sortOrder"
                      type="number"
                      defaultValue={0}
                    />
                    <label className="mt-6 inline-flex items-center gap-3 text-sm text-foreground">
                      <input
                        type="checkbox"
                        name="featured"
                        className="size-4 rounded border-border"
                      />
                      Featured on homepage
                    </label>
                  </div>
                  <SubmitRow saveLabel="Create Project" />
                </form>
              </div>
            </>
          ),
        },
        {
          id: "services",
          label: "Services",
          description:
            "Manage service cards and optional demo videos that appear on the homepage and services page.",
          content: (
            <>
              <div className="space-y-6">
                {services.map((service) => (
                  <form
                    key={service.id}
                    action={saveServiceAction}
                    className="grid gap-5 border border-border bg-background p-5"
                  >
                    <input type="hidden" name="id" value={service.id} />
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="Title"
                        name="title"
                        required
                        defaultValue={service.title}
                      />
                      <Field
                        label="Slug"
                        name="slug"
                        defaultValue={service.slug}
                      />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="Icon Label"
                        name="icon"
                        defaultValue={service.icon}
                      />
                      <Field
                        label="Demo Clip URL"
                        name="demoClipUrl"
                        type="url"
                        defaultValue={service.demoClipUrl}
                      />
                    </div>
                    <Area
                      label="Description"
                      name="description"
                      required
                      rows={4}
                      defaultValue={service.description}
                    />
                    <Field
                      label="Sort Order"
                      name="sortOrder"
                      type="number"
                      defaultValue={service.sortOrder}
                    />
                    <SubmitRow saveLabel="Save Service">
                      <button
                        type="submit"
                        formAction={deleteServiceAction}
                        className="pill-feedback rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-destructive hover:text-destructive"
                      >
                        Delete
                      </button>
                    </SubmitRow>
                  </form>
                ))}

                <form
                  action={saveServiceAction}
                  className="grid gap-5 border border-dashed border-border bg-secondary/50 p-5"
                >
                  <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                    Add Service
                  </p>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Title" name="title" required />
                    <Field
                      label="Slug"
                      name="slug"
                      placeholder="auto-generated-from-title"
                    />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Icon Label"
                      name="icon"
                      placeholder="Color"
                    />
                    <Field
                      label="Demo Clip URL"
                      name="demoClipUrl"
                      type="url"
                    />
                  </div>
                  <Area
                    label="Description"
                    name="description"
                    required
                    rows={4}
                  />
                  <Field
                    label="Sort Order"
                    name="sortOrder"
                    type="number"
                    defaultValue={0}
                  />
                  <SubmitRow saveLabel="Create Service" />
                </form>
              </div>
            </>
          ),
        },
        {
          id: "about",
          label: "About",
          title: "About Page",
          description:
            "Storytelling copy plus craft notes. Enter one craft note per line.",
          content: (
            <>
              <form action={saveAboutAction} className="grid gap-5">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Page Hero (optional overrides)
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    name="pageHeroEyebrow"
                    defaultValue={about.pageHeroEyebrow}
                  />
                  <Field
                    label="Title (blank = main title below)"
                    name="pageHeroTitle"
                    defaultValue={about.pageHeroTitle}
                  />
                </div>
                <Area
                  label="Description (blank = story excerpt on page hero)"
                  name="pageHeroDescription"
                  rows={3}
                  defaultValue={about.pageHeroDescription}
                />
                <Field
                  label="Title"
                  name="title"
                  required
                  defaultValue={about.title}
                />
                <Area
                  label="Story"
                  name="story"
                  required
                  rows={6}
                  defaultValue={about.story}
                />
                <Area
                  label="Craft Notes"
                  name="craftNotes"
                  rows={5}
                  defaultValue={about.craftNotes.join("\n")}
                />
                <Field
                  label="Portrait URL"
                  name="portraitUrl"
                  type="url"
                  defaultValue={about.portraitUrl}
                />
                <SubmitRow saveLabel="Save About Content" />
              </form>
            </>
          ),
        },
        {
          id: "contact",
          label: "Contact",
          title: "Contact Page",
          description:
            "Contact copy, direct email, social links, and the incoming message queue.",
          content: (
            <>
              <form action={saveContactContentAction} className="grid gap-5">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Page Hero
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Eyebrow"
                    name="pageHeroEyebrow"
                    defaultValue={contact.pageHeroEyebrow}
                  />
                  <Field
                    label="Title"
                    name="pageHeroTitle"
                    defaultValue={contact.pageHeroTitle}
                  />
                </div>
                <Area
                  label="Description"
                  name="pageHeroDescription"
                  rows={3}
                  defaultValue={contact.pageHeroDescription}
                />
                <Field
                  label="Title"
                  name="title"
                  required
                  defaultValue={contact.title}
                />
                <Area
                  label="Intro"
                  name="intro"
                  required
                  rows={4}
                  defaultValue={contact.intro}
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={contact.email}
                />
                <SubmitRow saveLabel="Save Contact Content" />
              </form>

              <div id="contact-links" className="mt-10 space-y-4">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Contact Social Links
                </p>
                {contactLinks.map((link) => (
                  <form
                    key={link.id}
                    action={saveSocialLinkAction}
                    className="grid gap-4 border border-border bg-background p-4 md:grid-cols-[1fr_1fr_2fr_120px_auto]"
                  >
                    <input type="hidden" name="id" value={link.id} />
                    <input type="hidden" name="section" value="CONTACT" />
                    <Field
                      label="Platform"
                      name="platform"
                      required
                      defaultValue={link.platform}
                    />
                    <Field
                      label="Label"
                      name="label"
                      required
                      defaultValue={link.label}
                    />
                    <Field
                      label="URL"
                      name="url"
                      type="url"
                      required
                      defaultValue={link.url}
                    />
                    <Field
                      label="Order"
                      name="sortOrder"
                      type="number"
                      defaultValue={link.sortOrder}
                    />
                    <div className="self-end">
                      <SubmitRow saveLabel="Save Link">
                        <button
                          type="submit"
                          formAction={deleteSocialLinkAction}
                          className="pill-feedback rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-destructive hover:text-destructive"
                        >
                          Delete
                        </button>
                      </SubmitRow>
                    </div>
                  </form>
                ))}

                <form
                  action={saveSocialLinkAction}
                  className="grid gap-4 border border-dashed border-border bg-secondary/50 p-4 md:grid-cols-[1fr_1fr_2fr_120px_auto]"
                >
                  <input type="hidden" name="section" value="CONTACT" />
                  <Field
                    label="Platform"
                    name="platform"
                    required
                    placeholder="Instagram"
                  />
                  <Field
                    label="Label"
                    name="label"
                    required
                    placeholder="Message"
                  />
                  <Field
                    label="URL"
                    name="url"
                    type="url"
                    required
                    placeholder="https://..."
                  />
                  <Field
                    label="Order"
                    name="sortOrder"
                    type="number"
                    defaultValue={0}
                  />
                  <div className="self-end">
                    <SubmitRow saveLabel="Add Link" />
                  </div>
                </form>
              </div>

              <div id="submissions" className="mt-10 space-y-4">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Latest Submissions
                </p>
                <div className="grid gap-4">
                  {submissions.map((submission) => (
                    <article
                      key={submission.id}
                      className="border border-border bg-background p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-lg text-foreground">
                            {submission.name}
                          </p>
                          <a
                            href={`mailto:${submission.email}`}
                            className="mt-1 block text-sm text-foreground hover:underline"
                          >
                            {submission.email}
                          </a>
                          <p className="mt-4 max-w-3xl text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
                            {submission.message}
                          </p>
                        </div>
                        <div className="space-y-3 md:shrink-0">
                          <p className="text-xs text-muted-foreground">
                            {submission.createdAt.toLocaleString()}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <form action={toggleSubmissionReadAction}>
                              <input
                                type="hidden"
                                name="id"
                                value={submission.id}
                              />
                              <input
                                type="hidden"
                                name="nextValue"
                                value={submission.isRead ? "false" : "true"}
                              />
                              <button
                                type="submit"
                                className="pill-feedback rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                              >
                                {submission.isRead
                                  ? "Mark Unread"
                                  : "Mark Read"}
                              </button>
                            </form>
                            <form action={deleteSubmissionAction}>
                              <input
                                type="hidden"
                                name="id"
                                value={submission.id}
                              />
                              <button
                                type="submit"
                                className="pill-feedback rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-destructive hover:text-destructive"
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                  {!submissions.length ? (
                    <p className="border border-dashed border-border bg-secondary/50 px-4 py-5 text-sm text-muted-foreground">
                      No contact submissions yet.
                    </p>
                  ) : null}
                </div>
              </div>
            </>
          ),
        },
      ]}
    />
  </main>
)
}
