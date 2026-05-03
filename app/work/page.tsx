import type { Metadata } from "next"

import { PageHero } from "@/components/site/page-hero"
import { ProjectGallery } from "@/components/site/project-gallery"
import { CmsErrorState, EmptyState } from "@/components/site/states"
import { Section } from "@/components/site/section"
import { getProjects, getSiteSettings } from "@/lib/crm"

export const metadata: Metadata = {
  title: "Work",
  description: "Music videos and visual projects by Wizard Films.",
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[] }>
}) {
  const resolvedSearchParams = await searchParams
  const rawQuery = resolvedSearchParams?.q
  const initialQuery =
    typeof rawQuery === "string"
      ? rawQuery.trim()
      : Array.isArray(rawQuery)
        ? rawQuery[0]?.trim() ?? ""
        : ""

  const [projectsResult, siteSettingsResult] = await Promise.all([
    getProjects()
      .then((projects) => ({ projects, error: null }))
      .catch((error) => ({ projects: [], error })),
    getSiteSettings()
      .then((siteSettings) => ({ siteSettings, error: null }))
      .catch((error) => ({ siteSettings: null, error })),
  ])

  const settings = siteSettingsResult.siteSettings
  const workEyebrow =
    settings?.workPageEyebrow?.trim() || settings?.siteName || "Work"
  const workTitle =
    settings?.workPageHeroTitle || "Music videos and visual stories."
  const workDescription =
    settings?.workPageHeroDescription ||
    "Browse projects with direction credits, roles, and playback."

  return (
    <main>
      <PageHero
        eyebrow={workEyebrow}
        title={workTitle}
        description={workDescription}
      />
      <Section className="pt-2">
        {projectsResult.error ? (
          <CmsErrorState
            title="Project feed unavailable."
            message="Project data could not be fetched from CRM."
          />
        ) : projectsResult.projects.length ? (
          <ProjectGallery
            projects={projectsResult.projects}
            initialQuery={initialQuery}
          />
        ) : (
          <EmptyState
            title="No portfolio projects yet."
            message="Add projects in CRM to publish the work archive."
          />
        )}
      </Section>
    </main>
  )
}
