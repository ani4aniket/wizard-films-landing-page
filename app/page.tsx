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
  const [homepageResult, projectsResult, servicesResult] =
    await Promise.allSettled([
      getHomepageContent(),
      getProjects(),
      getServices(),
    ])

  const homepage =
    homepageResult.status === "fulfilled" ? homepageResult.value : null
  const projects =
    projectsResult.status === "fulfilled" ? projectsResult.value : []
  const services =
    servicesResult.status === "fulfilled" ? servicesResult.value : []
  const featuredProjects =
    projects.filter((project) => project.featured).slice(0, 3).length > 0
      ? projects.filter((project) => project.featured).slice(0, 3)
      : projects.slice(0, 3)

  return (
    <main>
      {homepage ? (
        <section className="mx-auto max-w-[1440px] px-6 pt-24 md:px-10 md:pt-28">
          <div className="relative min-h-[78svh] overflow-hidden bg-black">
            {homepage.heroVideoUrl ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
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
                className="object-cover opacity-90"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#111111_0%,#2b2b2d_55%,#111111_100%)]" />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex min-h-[78svh] items-end">
              <div className="grid w-full gap-10 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[1.45fr_0.55fr] lg:items-end">
                <Reveal className="space-y-8">
                  <div className="space-y-5">
                    <p className="text-xs tracking-[0.28em] text-white/78 uppercase">
                      Editorial Portfolio
                    </p>
                    <h1 className="editorial-display max-w-5xl text-white">
                      {homepage.headline}
                    </h1>
                    <p className="max-w-2xl text-lg leading-7 text-white/90 md:text-2xl md:leading-8">
                      {homepage.tagline}
                    </p>
                    {homepage.intro ? (
                      <p className="max-w-2xl text-base leading-7 text-white/74">
                        {homepage.intro}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={homepage.primaryCtaHref}
                      className={buttonVariants({
                        variant: "secondary",
                        size: "lg",
                      })}
                    >
                      {homepage.primaryCtaLabel}
                    </Link>
                    <Link
                      href={homepage.secondaryCtaHref}
                      className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                      })}
                    >
                      {homepage.secondaryCtaLabel}
                    </Link>
                  </div>
                </Reveal>
                <Reveal
                  delay={0.15}
                  className="self-end border border-white/18 bg-white/10 p-6 backdrop-blur-sm"
                >
                  <p className="text-xs tracking-[0.24em] text-white/70 uppercase">
                    Current Focus
                  </p>
                  <p className="mt-4 text-3xl leading-tight font-medium text-white">
                    Campaign cuts, social edit systems, and fast-turn post
                    packages.
                  </p>
                  <Link
                    href="#featured"
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "mt-6 bg-white text-foreground"
                    )}
                  >
                    View Selected Work
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
            message="Connect the custom CRM endpoints in .env to populate the showreel, copy, and homepage sections."
          />
        </div>
      )}

      <Section
        id="featured"
        eyebrow="Selected Work"
        title="Catalog structure. Cinematic content."
        description="The archive is pulled from the CRM and presented like a flat editorial product grid: square imagery, restrained metadata, and one clear path into each case study."
      >
        {projectsResult.status === "rejected" ? (
          <CmsErrorState
            title="Projects are unavailable."
            message="The work page is ready, but the CRM project endpoint did not respond."
          />
        ) : featuredProjects.length ? (
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
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
        title="What the studio ships."
        description="These service blocks are CRM-managed too, so you can swap positioning, descriptions, and demo media without touching the frontend."
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

      <Section
        eyebrow="Process"
        title="One system, repeated cleanly."
        description="Homepage hero, archive cards, service rows, and detail pages all now share the same restrained visual language so the content carries the atmosphere, not the chrome."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Full-bleed campaign presentation for the hero tier.",
            "Soft-cloud media staging for every case-study thumbnail.",
            "Pill CTAs and neutral typography across the public site and CRM.",
          ].map((item) => (
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
