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
import {
  AdminAccordionSection,
  AdminAccordionSections,
} from "@/components/admin/admin-section"
import { AdminTip } from "@/components/admin/admin-tip"
import {
  Area,
  Field,
  FieldRackActions,
  SubmitRow,
} from "@/components/admin/admin-fields"
import { CopyMediaUrlButton } from "@/components/admin/copy-media-url-button"
import { MediaUploadForm } from "@/components/admin/media-upload-form"
import { UploadSuccessBanner } from "@/components/admin/upload-success-banner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
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
            {SITE_NAME} — Website editor
          </p>
          <h1 className="mt-4 text-5xl font-medium text-foreground">
            Edit your website
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Choose a tab for the area you want to change. Saved updates appear
            on the public site.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View Site
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      {error ? (
        <Alert
          variant="destructive"
          className="mt-6 border-destructive/20 bg-[#fff5f5]"
        >
          <AlertDescription>
            {error === "missing-blob-token"
              ? "Uploads are not turned on yet. Ask your developer to add the file-hosting token (BLOB_READ_WRITE_TOKEN), or try again later."
              : error === "missing-file"
                ? "Pick a file from your computer first, then try uploading again."
                : "We could not save that. Check required fields are filled in, then try again."}
          </AlertDescription>
        </Alert>
      ) : null}

      <AdminTabLayout
        activeSection={section}
        panels={[
          {
            id: "media",
            label: "Media",
            title: "Photos & videos",
            tabHint: "Library of images and videos for your site.",
            description:
              "Upload a file, then use Copy link on it in the list below when another tab asks for an image or video address.",
            content: (
              <div className="space-y-6">
                {uploadedUrl ? <UploadSuccessBanner url={uploadedUrl} /> : null}

                <MediaUploadForm />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {media.map((asset) => (
                    <Card
                      key={asset.id}
                      size="sm"
                      className="gap-0 overflow-hidden rounded-none border border-border bg-background py-0 shadow-none ring-0"
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
                      <CardContent className="space-y-3 p-4">
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
                          <form
                            action={deleteMediaAssetAction}
                            className="inline"
                          >
                            <input type="hidden" name="id" value={asset.id} />
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="text-muted-foreground hover:border-destructive hover:text-destructive"
                            >
                              Remove from library
                            </Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
          {
            id: "site-settings",
            label: "Site",
            title: "Sitewide details",
            tabHint:
              "Business name, footer, sharing image, header button, menu links, and global social icons.",
            description:
              "These fields affect many pages at once. Open each accordion section as needed, edit the fields, then press Save site-wide settings once.",
            content: (
              <>
                <AdminTip>
                  <strong>One save button.</strong> Everything in the accordion
                  sections below is saved together when you press{" "}
                  <strong>Save site-wide settings</strong> — including fields
                  inside closed sections.
                </AdminTip>

                <form action={saveSiteSettingsAction} className="space-y-6">
                  <AdminAccordionSections defaultOpen={["name-contact"]}>
                    <AdminAccordionSection
                      value="name-contact"
                      title="Name & contact details"
                      description="Browser tab title, search previews, and how people recognize your brand."
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Business or site name"
                          name="siteName"
                          required
                          defaultValue={siteSettings.siteName}
                        />
                        <Field
                          label="Public email"
                          name="contactEmail"
                          type="email"
                          defaultValue={siteSettings.contactEmail}
                          hint="Where visitors expect to reach you."
                        />
                      </div>
                      <Area
                        label="Short description"
                        name="siteDescription"
                        required
                        rows={3}
                        defaultValue={siteSettings.siteDescription}
                        hint="Search engines may show this under your site name."
                      />
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Live website address"
                          name="siteUrl"
                          type="url"
                          defaultValue={siteSettings.siteUrl}
                          hint="Your public homepage, starting with https://"
                        />
                        <Field
                          label="Image when sharing on social apps"
                          name="ogImage"
                          type="url"
                          defaultValue={siteSettings.ogImage}
                          hint="Paste a link from Media. Used as the thumbnail when someone shares your site."
                        />
                      </div>
                    </AdminAccordionSection>

                    <AdminAccordionSection
                      value="footer"
                      title="Footer"
                      description="Text at the bottom of every page."
                    >
                      <Area
                        label="Footer text"
                        name="footerBlurb"
                        rows={3}
                        defaultValue={siteSettings.footerBlurb}
                      />
                      <Area
                        label="Large footer headline"
                        name="footerLeadLine"
                        rows={2}
                        placeholder="Large headline above the footer blurb"
                        defaultValue={siteSettings.footerLeadLine}
                        hint="Optional big line above the smaller footer text."
                      />
                    </AdminAccordionSection>

                    <AdminAccordionSection
                      value="header-search"
                      title="Header button & work search"
                      description="Optional highlight button next to your menu, and hint text inside the work archive search box."
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Header button — wording"
                          name="navCtaLabel"
                          defaultValue={siteSettings.navCtaLabel}
                        />
                        <Field
                          label="Header button — link"
                          name="navCtaHref"
                          defaultValue={siteSettings.navCtaHref}
                          hint="Example: /contact or a full https:// address."
                        />
                      </div>
                      <Field
                        label="Work archive search — hint text"
                        name="searchArchivePlaceholder"
                        defaultValue={siteSettings.searchArchivePlaceholder}
                        hint="Grey example text inside the search box on your work page."
                      />
                    </AdminAccordionSection>

                    <AdminAccordionSection
                      value="work-hero"
                      title="Work page — top banner"
                      description="Optional wording above your project grid."
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Small label above title"
                          name="workPageEyebrow"
                          defaultValue={siteSettings.workPageEyebrow}
                          hint="Leave blank to reuse your site name."
                        />
                        <Field
                          label="Main headline"
                          name="workPageHeroTitle"
                          defaultValue={siteSettings.workPageHeroTitle}
                        />
                      </div>
                      <Area
                        label="Supporting paragraph"
                        name="workPageHeroDescription"
                        rows={3}
                        defaultValue={siteSettings.workPageHeroDescription}
                      />
                    </AdminAccordionSection>

                    <AdminAccordionSection
                      value="services-hero"
                      title="Services page — top banner"
                      description="Optional wording above your services list."
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Small label above title"
                          name="servicesPageEyebrow"
                          defaultValue={siteSettings.servicesPageEyebrow}
                        />
                        <Field
                          label="Main headline"
                          name="servicesPageHeroTitle"
                          defaultValue={siteSettings.servicesPageHeroTitle}
                        />
                      </div>
                      <Area
                        label="Supporting paragraph"
                        name="servicesPageHeroDescription"
                        rows={3}
                        defaultValue={siteSettings.servicesPageHeroDescription}
                      />
                    </AdminAccordionSection>

                    <AdminAccordionSection
                      value="project-related"
                      title="Project page — related work"
                      description="Headings near other projects at the bottom of a single project."
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Small label"
                          name="projectRelatedEyebrow"
                          defaultValue={siteSettings.projectRelatedEyebrow}
                        />
                        <Field
                          label="Section title"
                          name="projectRelatedTitle"
                          defaultValue={siteSettings.projectRelatedTitle}
                        />
                      </div>
                      <Area
                        label="Short blurb"
                        name="projectRelatedDescription"
                        rows={2}
                        defaultValue={siteSettings.projectRelatedDescription}
                      />
                      <Area
                        label="Playback note (sidebar)"
                        name="projectPlaybackNote"
                        rows={2}
                        defaultValue={siteSettings.projectPlaybackNote}
                        hint="Short note beside the video, for example viewing tips."
                      />
                    </AdminAccordionSection>

                    <AdminAccordionSection
                      value="home-featured-cta"
                      title="Homepage — “see more work” button"
                      description="The button under featured projects that opens the full portfolio."
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Button wording"
                          name="homeFeaturedWorkCtaLabel"
                          defaultValue={siteSettings.homeFeaturedWorkCtaLabel}
                        />
                        <Field
                          label="Button link"
                          name="homeFeaturedWorkCtaHref"
                          defaultValue={siteSettings.homeFeaturedWorkCtaHref}
                        />
                      </div>
                    </AdminAccordionSection>
                  </AdminAccordionSections>

                  <SubmitRow saveLabel="Save site-wide settings" />
                </form>

                <Separator className="my-4" />

                <AdminAccordionSections defaultOpen={["nav-links"]}>
                  <AdminAccordionSection
                    value="nav-links"
                    title="Header menu links"
                    description="Labels in the top bar and where each one goes. Lower numbers appear first."
                  >
                    <div id="nav-links" className="space-y-4">
                      {navLinks.map((link) => (
                        <form key={link.id} action={saveNavLinkAction}>
                          <Card
                            size="sm"
                            className="rounded-none shadow-none ring-border"
                          >
                            <CardContent className="flex flex-col gap-4 p-4 md:grid md:grid-cols-[1fr_1fr_120px_auto] md:gap-x-4 md:gap-y-2">
                              <input type="hidden" name="id" value={link.id} />
                              <Field
                                label="Menu label"
                                name="label"
                                required
                                defaultValue={link.label}
                                rackColumn={1}
                              />
                              <Field
                                label="Page link"
                                name="href"
                                required
                                defaultValue={link.href}
                                hint="Use /work for an internal page or a full https:// link."
                                rackColumn={2}
                              />
                              <Field
                                label="Order"
                                name="sortOrder"
                                type="number"
                                defaultValue={link.sortOrder}
                                hint="1 shows before 2."
                                rackColumn={3}
                              />
                              <FieldRackActions column={4}>
                                <SubmitRow saveLabel="Save row">
                                  <Button
                                    type="submit"
                                    formAction={deleteNavLinkAction}
                                    variant="outline"
                                    size="sm"
                                    className="text-muted-foreground hover:border-destructive hover:text-destructive"
                                  >
                                    Remove link
                                  </Button>
                                </SubmitRow>
                              </FieldRackActions>
                            </CardContent>
                          </Card>
                        </form>
                      ))}

                      <form action={saveNavLinkAction}>
                        <Card
                          size="sm"
                          className="rounded-none border border-dashed border-border bg-secondary/50 shadow-none ring-0"
                        >
                          <CardContent className="flex flex-col gap-4 p-4 md:grid md:grid-cols-[1fr_1fr_120px_auto] md:gap-x-4 md:gap-y-2">
                            <Field
                              label="Menu label"
                              name="label"
                              required
                              rackColumn={1}
                            />
                            <Field
                              label="Page link"
                              name="href"
                              required
                              placeholder="/work"
                              rackColumn={2}
                            />
                            <Field
                              label="Order"
                              name="sortOrder"
                              type="number"
                              defaultValue={0}
                              rackColumn={3}
                            />
                            <FieldRackActions column={4}>
                              <SubmitRow saveLabel="Add menu link" />
                            </FieldRackActions>
                          </CardContent>
                        </Card>
                      </form>
                    </div>
                  </AdminAccordionSection>

                  <AdminAccordionSection
                    value="social-site"
                    title="Social icons (sitewide)"
                    description="Instagram, Vimeo, and similar links shown in the footer and other global spots."
                  >
                    <div id="site-links" className="space-y-4">
                      {siteLinks.map((link) => (
                        <form key={link.id} action={saveSocialLinkAction}>
                          <Card
                            size="sm"
                            className="rounded-none shadow-none ring-border"
                          >
                            <CardContent className="flex flex-col gap-4 p-4 md:grid md:grid-cols-[1fr_1fr_2fr_120px_auto] md:gap-x-4 md:gap-y-2">
                              <input type="hidden" name="id" value={link.id} />
                              <input
                                type="hidden"
                                name="section"
                                value="SITE"
                              />
                              <Field
                                label="Platform"
                                name="platform"
                                required
                                defaultValue={link.platform}
                                rackColumn={1}
                              />
                              <Field
                                label="Link wording"
                                name="label"
                                required
                                defaultValue={link.label}
                                hint="Short text next to the icon, e.g. Follow or Watch."
                                rackColumn={2}
                              />
                              <Field
                                label="Full profile link"
                                name="url"
                                type="url"
                                required
                                defaultValue={link.url}
                                rackColumn={3}
                              />
                              <Field
                                label="Order"
                                name="sortOrder"
                                type="number"
                                defaultValue={link.sortOrder}
                                hint="Lower numbers appear first."
                                rackColumn={4}
                              />
                              <FieldRackActions column={5}>
                                <SubmitRow saveLabel="Save row">
                                  <Button
                                    type="submit"
                                    formAction={deleteSocialLinkAction}
                                    variant="outline"
                                    size="sm"
                                    className="text-muted-foreground hover:border-destructive hover:text-destructive"
                                  >
                                    Remove link
                                  </Button>
                                </SubmitRow>
                              </FieldRackActions>
                            </CardContent>
                          </Card>
                        </form>
                      ))}

                      <form action={saveSocialLinkAction}>
                        <Card
                          size="sm"
                          className="rounded-none border border-dashed border-border bg-secondary/50 shadow-none ring-0"
                        >
                          <CardContent className="flex flex-col gap-4 p-4 md:grid md:grid-cols-[1fr_1fr_2fr_120px_auto] md:gap-x-4 md:gap-y-2">
                            <input type="hidden" name="section" value="SITE" />
                            <Field
                              label="Platform"
                              name="platform"
                              required
                              placeholder="Instagram"
                              rackColumn={1}
                            />
                            <Field
                              label="Link wording"
                              name="label"
                              required
                              placeholder="Follow"
                              rackColumn={2}
                            />
                            <Field
                              label="URL"
                              name="url"
                              type="url"
                              required
                              placeholder="https://..."
                              rackColumn={3}
                            />
                            <Field
                              label="Order"
                              name="sortOrder"
                              type="number"
                              defaultValue={0}
                              rackColumn={4}
                            />
                            <FieldRackActions column={5}>
                              <SubmitRow saveLabel="Add social link" />
                            </FieldRackActions>
                          </CardContent>
                        </Card>
                      </form>
                    </div>
                  </AdminAccordionSection>
                </AdminAccordionSections>
              </>
            ),
          },
          {
            id: "homepage",
            label: "Home",
            tabHint:
              "Main headline, hero video or image, and section text on the front page.",
            description:
              "Headlines, intro text, and hero video or image addresses (paste links from your Media library).",
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
                      label="Hero video link"
                      name="heroVideoUrl"
                      type="url"
                      defaultValue={homepage.heroVideoUrl}
                      hint="YouTube or a video file from Media."
                    />
                    <Field
                      label="Hero poster image"
                      name="heroPosterUrl"
                      type="url"
                      defaultValue={homepage.heroPosterUrl}
                      hint="Still image shown before the video plays. Paste a Media link."
                    />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Main button — wording"
                      name="primaryCtaLabel"
                      required
                      defaultValue={homepage.primaryCtaLabel}
                    />
                    <Field
                      label="Main button — link"
                      name="primaryCtaHref"
                      required
                      defaultValue={homepage.primaryCtaHref}
                    />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Second button — wording"
                      name="secondaryCtaLabel"
                      required
                      defaultValue={homepage.secondaryCtaLabel}
                    />
                    <Field
                      label="Second button — link"
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
                  <SubmitRow saveLabel="Save homepage" />
                </form>
              </>
            ),
          },
          {
            id: "projects",
            label: "Work",
            tabHint:
              "Portfolio pieces: title, video, cover image, and text on each work page.",
            description:
              "Each block is one film or piece of work. Video plays from YouTube; the cover image can be a link from your Media library.",
            content: (
              <div className="space-y-6">
                <AdminTip>
                  After you change a project card, press{" "}
                  <strong>Save project</strong> on that card.{" "}
                  <strong>Featured on homepage</strong> controls whether it
                  appears in the highlighted strip on the front page.
                </AdminTip>
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
                        label="Web address ending"
                        name="slug"
                        defaultValue={project.slug}
                        hint="Short piece of the URL, e.g. my-film. Leave as-is unless you know you need to change it."
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
                        label="YouTube or Vimeo link"
                        name="youtubeUrl"
                        type="url"
                        required
                        defaultValue={project.youtubeUrl}
                        hint="Paste the watch link from YouTube (or supported player link)."
                      />
                      <Field
                        label="Cover image link"
                        name="thumbnailUrl"
                        type="url"
                        defaultValue={project.thumbnailUrl}
                        hint="Square or wide image from Media shown in grids and cards."
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
                        label="List order"
                        name="sortOrder"
                        type="number"
                        defaultValue={project.sortOrder}
                        hint="Lower numbers appear first in lists."
                      />
                      <div className="mt-6 flex items-center gap-3">
                        <Checkbox
                          id={`featured-${project.id}`}
                          name="featured"
                          defaultChecked={project.featured}
                        />
                        <Label
                          htmlFor={`featured-${project.id}`}
                          className="text-sm font-normal tracking-normal text-foreground normal-case"
                        >
                          Show on homepage featured strip
                        </Label>
                      </div>
                    </div>
                    <SubmitRow saveLabel="Save project">
                      <Button
                        type="submit"
                        formAction={deleteProjectAction}
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground hover:border-destructive hover:text-destructive"
                      >
                        Remove project
                      </Button>
                    </SubmitRow>
                  </form>
                ))}

                <form
                  action={saveProjectAction}
                  className="grid gap-5 border border-dashed border-border bg-secondary/50 p-5"
                >
                  <p className="text-sm font-medium text-foreground">
                    Add a new project
                  </p>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Title" name="title" required />
                    <Field
                      label="Web address ending"
                      name="slug"
                      placeholder="filled-in-for-you"
                      hint="You can leave this blank; it is filled from the title."
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
                      label="YouTube or Vimeo link"
                      name="youtubeUrl"
                      type="url"
                      required
                    />
                    <Field
                      label="Cover image link"
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
                    <div className="mt-6 flex items-center gap-3">
                      <Checkbox id="featured-new-project" name="featured" />
                      <Label
                        htmlFor="featured-new-project"
                        className="text-sm font-normal tracking-normal text-foreground normal-case"
                      >
                        Show on homepage featured strip
                      </Label>
                    </div>
                  </div>
                  <SubmitRow saveLabel="Add project" />
                </form>
              </div>
            ),
          },
          {
            id: "services",
            label: "Services",
            tabHint:
              "What you offer: card titles, short descriptions, and optional looping clips.",
            description:
              "Each card appears on your services page and can surface on the homepage.",
            content: (
              <div className="space-y-6">
                <AdminTip>
                  Each card has its own <strong>Save service</strong> button.
                </AdminTip>
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
                        label="Web address ending"
                        name="slug"
                        defaultValue={service.slug}
                        hint="Short part of the URL for this service page."
                      />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="Small label on icon"
                        name="icon"
                        defaultValue={service.icon}
                        hint="One short word beside the icon, e.g. Color or Edit."
                      />
                      <Field
                        label="Short demo video"
                        name="demoClipUrl"
                        type="url"
                        defaultValue={service.demoClipUrl}
                        hint="Optional looping clip from Media."
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
                      label="List order"
                      name="sortOrder"
                      type="number"
                      defaultValue={service.sortOrder}
                      hint="Lower numbers appear first."
                    />
                    <SubmitRow saveLabel="Save service">
                      <Button
                        type="submit"
                        formAction={deleteServiceAction}
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground hover:border-destructive hover:text-destructive"
                      >
                        Remove service
                      </Button>
                    </SubmitRow>
                  </form>
                ))}

                <form
                  action={saveServiceAction}
                  className="grid gap-5 border border-dashed border-border bg-secondary/50 p-5"
                >
                  <p className="text-sm font-medium text-foreground">
                    Add a service card
                  </p>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Title" name="title" required />
                    <Field
                      label="Web address ending"
                      name="slug"
                      placeholder="auto-generated-from-title"
                    />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Small label on icon"
                      name="icon"
                      placeholder="Color"
                    />
                    <Field
                      label="Short demo video"
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
                    label="List order"
                    name="sortOrder"
                    type="number"
                    defaultValue={0}
                  />
                  <SubmitRow saveLabel="Add service" />
                </form>
              </div>
            ),
          },
          {
            id: "about",
            label: "About",
            title: "About page",
            tabHint:
              "Your story, bullet-style craft notes, team portrait, and optional hero text.",
            description:
              "Long-form story for the About page, plus optional lines that become bullet points (one line per point).",
            content: (
              <>
                <form action={saveAboutAction} className="grid gap-5">
                  <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                    Top of page (optional)
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
                    label="Craft notes (one per line)"
                    name="craftNotes"
                    rows={5}
                    defaultValue={about.craftNotes.join("\n")}
                    hint="Each line becomes its own bullet on the public page."
                  />
                  <Field
                    label="Portrait photo"
                    name="portraitUrl"
                    type="url"
                    defaultValue={about.portraitUrl}
                    hint="Paste an image link from Media."
                  />
                  <SubmitRow saveLabel="Save about page" />
                </form>
              </>
            ),
          },
          {
            id: "contact",
            label: "Contact",
            title: "Contact page & inbox",
            tabHint:
              "Contact wording, email shown to visitors, extra social links, and new form messages.",
            description:
              "Edit the contact page text, the email visitors see, optional social buttons, and read or remove messages people send from the site.",
            content: (
              <div className="space-y-8">
                <AdminTip>
                  <strong>Latest Submissions</strong> is your inbox for the
                  contact form. Mark messages as read when you have handled
                  them.
                </AdminTip>
                <form action={saveContactContentAction} className="grid gap-5">
                  <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                    Top banner
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
                  <SubmitRow saveLabel="Save contact page" />
                </form>

                <div id="contact-links" className="space-y-4">
                  <p className="text-sm font-medium text-foreground">
                    Extra links on the contact page
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Shown only on Contact — separate from the sitewide social
                    icons under Site.
                  </p>
                  {contactLinks.map((link) => (
                    <form
                      key={link.id}
                      action={saveSocialLinkAction}
                      className="flex flex-col gap-4 border border-border bg-background p-4 md:grid md:grid-cols-[1fr_1fr_2fr_120px_auto] md:gap-x-4 md:gap-y-2"
                    >
                      <input type="hidden" name="id" value={link.id} />
                      <input type="hidden" name="section" value="CONTACT" />
                      <Field
                        label="Platform"
                        name="platform"
                        required
                        defaultValue={link.platform}
                        rackColumn={1}
                      />
                      <Field
                        label="Link wording"
                        name="label"
                        required
                        defaultValue={link.label}
                        rackColumn={2}
                      />
                      <Field
                        label="Full profile link"
                        name="url"
                        type="url"
                        required
                        defaultValue={link.url}
                        rackColumn={3}
                      />
                      <Field
                        label="Order"
                        name="sortOrder"
                        type="number"
                        defaultValue={link.sortOrder}
                        hint="Lower numbers appear first."
                        rackColumn={4}
                      />
                      <FieldRackActions column={5}>
                        <SubmitRow saveLabel="Save row">
                          <Button
                            type="submit"
                            formAction={deleteSocialLinkAction}
                            variant="outline"
                            size="sm"
                            className="text-muted-foreground hover:border-destructive hover:text-destructive"
                          >
                            Remove link
                          </Button>
                        </SubmitRow>
                      </FieldRackActions>
                    </form>
                  ))}

                  <form
                    action={saveSocialLinkAction}
                    className="flex flex-col gap-4 border border-dashed border-border bg-secondary/50 p-4 md:grid md:grid-cols-[1fr_1fr_2fr_120px_auto] md:gap-x-4 md:gap-y-2"
                  >
                    <input type="hidden" name="section" value="CONTACT" />
                    <Field
                      label="Platform"
                      name="platform"
                      required
                      placeholder="Instagram"
                      rackColumn={1}
                    />
                    <Field
                      label="Link wording"
                      name="label"
                      required
                      placeholder="Message"
                      rackColumn={2}
                    />
                    <Field
                      label="Full profile link"
                      name="url"
                      type="url"
                      required
                      placeholder="https://..."
                      rackColumn={3}
                    />
                    <Field
                      label="Order"
                      name="sortOrder"
                      type="number"
                      defaultValue={0}
                      rackColumn={4}
                    />
                    <FieldRackActions column={5}>
                      <SubmitRow saveLabel="Add link" />
                    </FieldRackActions>
                  </form>
                </div>

                <div id="submissions" className="space-y-4">
                  <p className="text-sm font-medium text-foreground">
                    Messages from the contact form
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Newest first. Remove when you no longer need a copy here.
                  </p>
                  <div className="grid gap-4">
                    {submissions.map((submission) => (
                      <Card
                        key={submission.id}
                        size="sm"
                        className="gap-0 rounded-none border border-border bg-background py-0 shadow-none ring-0"
                      >
                        <CardContent className="p-5">
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
                                  <Button
                                    type="submit"
                                    variant="outline"
                                    size="sm"
                                    className="text-muted-foreground hover:bg-secondary hover:text-foreground"
                                  >
                                    {submission.isRead
                                      ? "Mark as new"
                                      : "Mark as handled"}
                                  </Button>
                                </form>
                                <form action={deleteSubmissionAction}>
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={submission.id}
                                  />
                                  <Button
                                    type="submit"
                                    variant="outline"
                                    size="sm"
                                    className="text-muted-foreground hover:border-destructive hover:text-destructive"
                                  >
                                    Remove message
                                  </Button>
                                </form>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {!submissions.length ? (
                      <p className="border border-dashed border-border bg-secondary/50 px-4 py-5 text-sm text-muted-foreground">
                        No contact submissions yet.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
    </main>
  )
}
