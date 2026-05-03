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
  description: "Start a film, edit, or post-production conversation with Wizard Films.",
}

export default async function ContactPage() {
  const contactResult = await getContactContent()
    .then((contact) => ({ contact, error: null }))
    .catch((error) => ({ contact: null, error }))

  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Bring the next frame into focus."
        description="Send a brief through the built-in form, or route people toward social channels managed by the CRM."
      />
      <Section className="pt-4">
        {contactResult.error || !contactResult.contact ? (
          <CmsErrorState
            title="Contact information unavailable."
            message="The contact page is ready, but the CRM contact endpoint is not responding."
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <Reveal>
              <div className="rounded-[2rem] border border-border/70 bg-card/70 p-6 backdrop-blur md:p-8">
                <p className="text-xs tracking-[0.3em] text-primary uppercase">
                  {contactResult.contact.title}
                </p>
                <p className="mt-5 text-base leading-8 text-muted-foreground">
                  {contactResult.contact.intro}
                </p>
                {contactResult.contact.email ? (
                  <Link
                    href={`mailto:${contactResult.contact.email}`}
                    className="mt-8 block text-lg text-foreground transition-colors hover:text-primary"
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
                        className="block text-sm tracking-[0.28em] text-muted-foreground uppercase transition-colors hover:text-primary"
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
