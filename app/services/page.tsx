import type { Metadata } from "next"

import { PageHero } from "@/components/site/page-hero"
import { ServiceGrid } from "@/components/site/service-grid"
import { Section } from "@/components/site/section"
import { CmsErrorState, EmptyState } from "@/components/site/states"
import { getServices } from "@/lib/crm"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Music video direction, editing, shoot execution, and sound-led visual storytelling services.",
}

export default async function ServicesPage() {
  const servicesResult = await getServices()
    .then((services) => ({ services, error: null }))
    .catch((error) => ({ services: [], error }))

  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="What I do across music video production."
        description="Services are CRM-managed and can be updated anytime from admin."
      />
      <Section className="pt-2">
        {servicesResult.error ? (
          <CmsErrorState
            title="Services could not be loaded."
            message="Services could not be fetched from CRM."
          />
        ) : servicesResult.services.length ? (
          <ServiceGrid services={servicesResult.services} />
        ) : (
          <EmptyState
            title="No services published."
            message="Publish service entries in the CRM to populate this page."
          />
        )}
      </Section>
    </main>
  )
}
