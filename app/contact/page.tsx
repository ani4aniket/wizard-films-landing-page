import type { Metadata } from "next"
import Link from "next/link"

import { ContactForm } from "@/components/site/contact-form"
import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { CmsErrorState } from "@/components/site/states"
import { getContactContent } from "@/lib/crm"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a film, edit, or post-production conversation with Wizard Films.",
}

export default async function ContactPage() {
  const contactResult = await getContactContent()
    .then((contact) => ({ contact, error: null }))
    .catch((error) => ({ contact: null, error }))

  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Start the next project with a clean brief."
        description="Use the built-in form, route people toward social channels, and manage the entire contact surface from the CRM."
      />
      <Section className="pt-2">
        {contactResult.error || !contactResult.contact ? (
          <CmsErrorState
            title="Contact information unavailable."
            message="The contact page is ready, but the CRM contact endpoint is not responding."
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <Reveal>
              <div className="surface-soft p-6 md:p-8">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  {contactResult.contact.title}
                </p>
                <p className="mt-5 text-base leading-8 text-muted-foreground">
                  {contactResult.contact.intro}
                </p>
                {contactResult.contact.email ? (
                  <Link
                    href={`mailto:${contactResult.contact.email}`}
                    className="mt-8 block text-lg text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {contactResult.contact.email}
                  </Link>
                ) : null}
                {contactResult.contact.socialLinks.length ? (
                  <div className="mt-8 space-y-4">
                    {contactResult.contact.socialLinks.map((link) => (
                      <Link
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-foreground transition-colors hover:text-muted-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <ContactForm />
            </Reveal>
          </div>
        )}
      </Section>
    </main>
  )
}
