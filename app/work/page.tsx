import type { Metadata } from "next"

import { PageHero } from "@/components/site/page-hero"
import { ProjectGallery } from "@/components/site/project-gallery"
import { CmsErrorState, EmptyState } from "@/components/site/states"
import { Section } from "@/components/site/section"
import { getProjects } from "@/lib/crm"

export const metadata: Metadata = {
  title: "Work",
  description: "Video projects from Wizard Films, streamed directly inside the portfolio.",
}

export default async function WorkPage() {
  const projectsResult = await getProjects()
    .then((projects) => ({ projects, error: null }))
    .catch((error) => ({ projects: [], error }))

  return (
    <main>
      <PageHero
        eyebrow="Portfolio"
        title="Work that lives in atmosphere."
        description="Explore editing, color, audio, and shoot work through embedded playback, cinematic thumbnails, and CRM-driven metadata."
      />
      <Section className="pt-4">
        {projectsResult.error ? (
          <CmsErrorState
            title="Project feed unavailable."
            message="The work archive could not be fetched from the custom CRM."
          />
        ) : projectsResult.projects.length ? (
          <ProjectGallery projects={projectsResult.projects} />
        ) : (
          <EmptyState
            title="No portfolio projects yet."
            message="Publish projects in the CRM to fill the work archive."
          />
        )}
      </Section>
    </main>
  )
}
