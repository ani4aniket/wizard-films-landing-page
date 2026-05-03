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
    "Book Wizard Films for music videos, direction, editing, and shoot-based projects.",
}

export default async function ContactPage() {
  const contactResult = await getContactContent()
    .then((contact) => ({ contact, error: null }))
    .catch((error) => ({ contact: null, error }))

  return (
    <main>
      <PageHero
        eyebrow={contactResult.contact?.pageHeroEyebrow || "Contact"}
        title={
          contactResult.contact?.pageHeroTitle || "Start your next release."
        }
        description={
          contactResult.contact?.pageHeroDescription ||
          "Share your track, references, and timeline. Contact details and links stay current from admin."
        }
      />
      <Section className="pt-2">
        {contactResult.error || !contactResult.contact ? (
          <CmsErrorState
            title="Contact information unavailable."
            message="Contact information could not be fetched from CRM."
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
