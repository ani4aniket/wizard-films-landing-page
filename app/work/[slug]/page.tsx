import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { VideoCard } from "@/components/site/video-card"
import { VideoPlayer } from "@/components/site/video-player"
import { buttonVariants } from "@/components/ui/button"
import { getProjectBySlug, getProjects } from "@/lib/crm"
import { buildProjectMetadata } from "@/lib/metadata"
import { cn } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return buildProjectMetadata(project)
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const relatedProjects = (await getProjects())
    .filter((entry) => entry.id !== project.id)
    .slice(0, 3)

  return (
    <main>
      <PageHero
        eyebrow={project.category}
        title={project.title}
        description={project.description}
      >
        <Link
          href="/work"
          className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
        >
          Back to Work
        </Link>
      </PageHero>

      <Section className="pt-2">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <Reveal>
            <VideoPlayer
              title={project.title}
              embedUrl={project.embedUrl}
              poster={project.thumbnailUrl}
            />
          </Reveal>
          <Reveal delay={0.12}>
            <aside className="space-y-6 border border-border bg-background p-6">
              <div>
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Category
                </p>
                <p className="mt-3 text-lg text-foreground">
                  {project.category}
                </p>
              </div>
              {project.role ? (
                <div>
                  <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                    Role
                  </p>
                  <p className="mt-3 text-lg text-foreground">{project.role}</p>
                </div>
              ) : null}
              {project.credits ? (
                <div>
                  <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                    Credits
                  </p>
                  <p className="mt-3 text-lg leading-7 text-foreground">
                    {project.credits}
                  </p>
                </div>
              ) : null}
              <div>
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Playback
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  The video is embedded directly in the portfolio using the
                  CRM-provided YouTube URL, with lazy loading for better
                  performance.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </Section>

      {relatedProjects.length ? (
        <Section
          eyebrow="More Work"
          title="More videos."
          description="More projects from CRM with credits, roles, and embedded playback."
        >
          <div className="grid gap-x-6 gap-y-10 lg:grid-cols-3">
            {relatedProjects.map((entry, index) => (
              <Reveal key={entry.id} delay={index * 0.06}>
                <VideoCard project={entry} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}
    </main>
  )
}
