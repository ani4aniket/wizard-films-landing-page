import Link from "next/link"

import { Reveal } from "@/components/site/reveal"
import { FeaturedVideoCard } from "@/components/site/featured-video-card"
import { HeroMediaWall } from "@/components/site/hero-media-wall"
import { Section } from "@/components/site/section"
import { CmsErrorState, EmptyState } from "@/components/site/states"
import { ServiceGrid } from "@/components/site/service-grid"
import { buttonVariants } from "@/components/ui/button"
import {
  getAboutContent,
  getHomepageContent,
  getProjects,
  getServices,
  getSiteSettings,
} from "@/lib/crm"
import { cn } from "@/lib/utils"

export default async function Page() {
  const [homepageResult, projectsResult, servicesResult, aboutResult, siteSettingsResult] =
    await Promise.allSettled([
      getHomepageContent(),
      getProjects(),
      getServices(),
      getAboutContent(),
      getSiteSettings(),
    ])

  const homepage =
    homepageResult.status === "fulfilled" ? homepageResult.value : null
  const projects =
    projectsResult.status === "fulfilled" ? projectsResult.value : []
  const services =
    servicesResult.status === "fulfilled" ? servicesResult.value : []
  const about = aboutResult.status === "fulfilled" ? aboutResult.value : null
  const siteSettings =
    siteSettingsResult.status === "fulfilled" ? siteSettingsResult.value : null
  const featuredProjects =
    projects.filter((project) => project.featured).slice(0, 3).length > 0
      ? projects.filter((project) => project.featured).slice(0, 3)
      : projects.slice(0, 3)
  const heroMediaImages = projects
    .filter((project) => project.thumbnailUrl)
    .map((project) => ({ src: project.thumbnailUrl, alt: project.title }))
  const heroMediaLoop =
    heroMediaImages.length > 0
      ? [...heroMediaImages, ...heroMediaImages, ...heroMediaImages].slice(
          0,
          12
        )
      : []
  const primaryCtaHref = homepage?.primaryCtaHref || "/work"
  const primaryCtaLabel = homepage?.primaryCtaLabel || "View Work"
  const secondaryCtaHref = homepage?.secondaryCtaHref || "/contact"
  const secondaryCtaLabel = homepage?.secondaryCtaLabel || "Start a Project"
  const siteName = siteSettings?.siteName || "Wizard Films"
  const heroEyebrow =
    homepage?.heroEyebrow?.trim() || `${siteName} Portfolio`
  const heroAsideEyebrow = homepage?.heroAsideEyebrow || "Creative Focus"
  const heroFocus =
    homepage?.heroAsideFocus?.trim() ||
    (about?.craftNotes.length
      ? about.craftNotes.slice(0, 3).join(" · ")
      : "Direction · Production · Edit")
  const featuredEyebrow = homepage?.featuredEyebrow || "Selected Work"
  const featuredTitle = homepage?.featuredTitle || "Featured projects."
  const featuredDescription =
    homepage?.featuredDescription ||
    homepage?.tagline ||
    "Highlighted videos with direct playback."
  const servicesEyebrow = homepage?.servicesEyebrow || "Services"
  const servicesTitle = homepage?.servicesTitle || "Services"
  const servicesDescription =
    homepage?.servicesDescription ||
    homepage?.intro ||
    "Direction, editing, shoot execution, and music-led visual services."
  const approachEyebrow = homepage?.approachEyebrow || "Approach"
  const approachTitle =
    homepage?.approachTitle || about?.title || "How each release is shaped."
  const approachDescription =
    homepage?.approachDescription ||
    about?.story ||
    homepage?.intro ||
    homepage?.tagline ||
    ""
  const approachItems = homepage?.approachBullets.length
    ? homepage.approachBullets
    : about?.craftNotes.length
      ? about.craftNotes
      : [
          "Direction that supports artist identity and song emotion.",
          "Editing built around rhythm, energy shifts, and narrative flow.",
          "Shoot execution and post finishing aligned for final impact.",
        ]
  const featuredWorkCtaLabel =
    siteSettings?.homeFeaturedWorkCtaLabel || "View More Work"
  const featuredWorkCtaHref =
    siteSettings?.homeFeaturedWorkCtaHref || "/work"

  return (
    <main>
      {homepage ? (
        <section className="mx-auto max-w-[1440px] px-6 pt-0 md:px-10 md:pt-0">
          <div className="relative min-h-[78svh] overflow-hidden border border-white/14 bg-black">
            {heroMediaLoop.length > 0 ? (
              <HeroMediaWall media={heroMediaLoop} />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#111111_0%,#2b2b2d_55%,#111111_100%)]" />
            )}
            <div className="absolute inset-0 bg-black/52" />
            <div className="relative z-10 flex min-h-[78svh] items-end">
              <div className="grid w-full gap-10 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[1.45fr_0.55fr] lg:items-end">
                <Reveal className="space-y-8">
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.28em] text-white/78 uppercase">
                      {heroEyebrow}
                    </p>
                    <h1 className="editorial-display max-w-5xl tracking-wider text-white">
                      {homepage.headline}
                    </h1>
                    <p className="max-w-2xl text-lg leading-7 text-white/90 md:text-2xl md:leading-8">
                      {homepage.tagline}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={primaryCtaHref}
                      className={buttonVariants({
                        variant: "secondary",
                        size: "lg",
                      })}
                    >
                      {primaryCtaLabel}
                    </Link>
                  </div>
                </Reveal>
                <Reveal
                  delay={0.15}
                  className="self-end border border-white/18 bg-white/10 p-6 backdrop-blur-sm"
                >
                  <p className="text-xs tracking-[0.24em] text-white/70 uppercase">
                    {heroAsideEyebrow}
                  </p>
                  <p className="mt-4 text-xl leading-tight font-medium text-white">
                    {heroFocus}
                  </p>
                  <Link
                    href={secondaryCtaHref}
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "mt-6 bg-white text-foreground"
                    )}
                  >
                    {secondaryCtaLabel}
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="mx-auto max-w-[1440px] px-6 pt-32 pb-16 md:px-10">
          <CmsErrorState
            title="Homepage content could not be loaded."
            message="Homepage content could not be fetched from CRM."
          />
        </div>
      )}

      <Section
        id="featured"
        eyebrow={featuredEyebrow}
        title={featuredTitle}
        description={featuredDescription}
      >
        {projectsResult.status === "rejected" ? (
          <CmsErrorState
            title="Projects are unavailable."
            message="Projects could not be fetched from CRM."
          />
        ) : featuredProjects.length ? (
          <div className="space-y-10">
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <Reveal key={project.id} delay={index * 0.08}>
                  <FeaturedVideoCard project={project} priority={index === 0} />
                </Reveal>
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                href={featuredWorkCtaHref}
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                })}
              >
                {featuredWorkCtaLabel}
              </Link>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No featured projects yet."
            message="Mark projects as featured in CRM to show them here."
          />
        )}
      </Section>

      <Section
        eyebrow={servicesEyebrow}
        title={servicesTitle}
        description={servicesDescription}
      >
        {servicesResult.status === "rejected" ? (
          <CmsErrorState
            title="Services are unavailable."
            message="Services could not be fetched from CRM."
          />
        ) : services.length ? (
          <ServiceGrid services={services.slice(0, 4)} compact />
        ) : (
          <EmptyState
            title="No services published."
            message="Publish service entries from the CRM to populate this section."
          />
        )}
      </Section>

      <Section
        eyebrow={approachEyebrow}
        title={approachTitle}
        description={approachDescription}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {approachItems.map((item) => (
            <div
              key={item}
              className="surface-soft p-6 text-base leading-7 text-foreground"
            >
              {item}
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
