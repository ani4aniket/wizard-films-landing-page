import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { CmsErrorState, EmptyState } from "@/components/site/states"
import { VideoCard } from "@/components/site/video-card"
import { ServiceGrid } from "@/components/site/service-grid"
import { buttonVariants } from "@/components/ui/button"
import { getHomepageContent, getProjects, getServices } from "@/lib/crm"
import { cn } from "@/lib/utils"

export default async function Page() {
  const [homepageResult, projectsResult, servicesResult] = await Promise.allSettled([
    getHomepageContent(),
    getProjects(),
    getServices(),
  ])

  const homepage = homepageResult.status === "fulfilled" ? homepageResult.value : null
  const projects = projectsResult.status === "fulfilled" ? projectsResult.value : []
  const services = servicesResult.status === "fulfilled" ? servicesResult.value : []
  const featuredProjects =
    projects.filter((project) => project.featured).slice(0, 3).length > 0
      ? projects.filter((project) => project.featured).slice(0, 3)
      : projects.slice(0, 3)

  return (
    <main>
      {homepage ? (
        <section className="relative flex min-h-screen items-end overflow-hidden px-6 pt-28 pb-12 md:px-10 md:pt-36">
          <div className="absolute inset-0">
            {homepage.heroVideoUrl ? (
              <video
                className="h-full w-full object-cover"
                src={homepage.heroVideoUrl}
                poster={homepage.heroPosterUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : homepage.heroPosterUrl ? (
              <Image
                src={homepage.heroPosterUrl}
                alt={homepage.headline}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.32),transparent_26%),linear-gradient(160deg,#0d0d10_0%,#15131d_45%,#09090b_100%)]" />
            )}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/28 to-black/70" />
          </div>
          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <Reveal className="space-y-8">
              <div className="space-y-5">
                <p className="text-xs font-semibold tracking-[0.34em] text-primary uppercase">
                  Independent Film Studio
                </p>
                <h1 className="max-w-4xl font-heading text-6xl leading-none text-white md:text-8xl">
                  {homepage.headline}
                </h1>
                <p className="max-w-2xl text-xl text-white/86 md:text-2xl">
                  {homepage.tagline}
                </p>
                {homepage.intro ? (
                  <p className="max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                    {homepage.intro}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={homepage.primaryCtaHref}
                  className={buttonVariants({ variant: "default", size: "lg" })}
                >
                  {homepage.primaryCtaLabel}
                </Link>
                <Link
                  href={homepage.secondaryCtaHref}
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  {homepage.secondaryCtaLabel}
                </Link>
              </div>
            </Reveal>
            <Reveal
              delay={0.15}
              className="justify-self-start rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl lg:justify-self-end"
            >
              <p className="text-xs tracking-[0.3em] text-white/52 uppercase">Signature Craft</p>
              <p className="mt-4 font-heading text-3xl text-white md:text-4xl">
                Editing. Color. Sound. Story.
              </p>
              <Link
                href="#featured"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-6 border-white/20 bg-white/5 text-white hover:border-primary/50 hover:text-white",
                )}
              >
                Scroll to Showreel
              </Link>
            </Reveal>
          </div>
        </section>
      ) : (
        <div className="mx-auto max-w-7xl px-6 pt-36 pb-16 md:px-10">
          <CmsErrorState
            title="Homepage content could not be loaded."
            message="Connect the custom CRM endpoints in .env to populate the showreel, copy, and homepage sections."
          />
        </div>
      )}

      <Section
        id="featured"
        eyebrow="Selected Work"
        title="Frames built to hold attention."
        description="Project thumbnails, descriptions, and playback are all driven dynamically from the CRM, with embedded YouTube viewing inside the portfolio."
      >
        {projectsResult.status === "rejected" ? (
          <CmsErrorState
            title="Projects are unavailable."
            message="The work page is ready, but the CRM project endpoint did not respond."
          />
        ) : featuredProjects.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.08}>
                <VideoCard project={project} priority={index === 0} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured projects yet."
            message="Once the CRM starts returning projects, selected work will appear here automatically."
          />
        )}
      </Section>

      <Section
        eyebrow="Services"
        title="Post-production and production, shaped with restraint."
        description="Each service block can be managed from the CRM with custom descriptions, icons, and optional demo clips."
      >
        {servicesResult.status === "rejected" ? (
          <CmsErrorState
            title="Services are unavailable."
            message="The site is waiting on the services endpoint from the custom CRM."
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
    </main>
  )
}
