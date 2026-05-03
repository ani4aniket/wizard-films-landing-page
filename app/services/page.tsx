import type { Metadata } from "next"

import { PageHero } from "@/components/site/page-hero"
import { ServiceGrid } from "@/components/site/service-grid"
import { Section } from "@/components/site/section"
import { CmsErrorState, EmptyState } from "@/components/site/states"
import { getServices } from "@/lib/crm"

export const metadata: Metadata = {
  title: "Services",
  description: "Editing, color grading, audio production, and shoot production by Wizard Films.",
}

export default async function ServicesPage() {
  const servicesResult = await getServices()
    .then((services) => ({ services, error: null }))
    .catch((error) => ({ services: [], error }))

  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Editorial precision, crafted atmosphere."
        description="Each service section is designed to be managed through the custom CRM, including clip previews and flexible descriptions."
      />
      <Section className="pt-4">
        {servicesResult.error ? (
          <CmsErrorState
            title="Services could not be loaded."
            message="Connect the services endpoint to show the full Wizard Films capabilities."
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
