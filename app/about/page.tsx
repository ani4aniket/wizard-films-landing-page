import type { Metadata } from "next"
import Image from "next/image"

import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { CmsErrorState } from "@/components/site/states"
import { getAboutContent } from "@/lib/crm"

export const metadata: Metadata = {
  title: "About",
  description: "The story and craft philosophy behind Wizard Films.",
}

export default async function AboutPage() {
  const aboutResult = await getAboutContent()
    .then((about) => ({ about, error: null }))
    .catch((error) => ({ about: null, error }))

  return (
    <main>
      <PageHero
        eyebrow="About"
        title="A studio built around restraint, rhythm, and story."
        description="The about page is fully CRM-managed, letting Wizard Films update the story, craft notes, and imagery without touching the frontend."
      />
      <Section className="pt-4">
        {aboutResult.error || !aboutResult.about ? (
          <CmsErrorState
            title="About content unavailable."
            message="The about section could not be fetched from the custom CRM."
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            {aboutResult.about.portraitUrl ? (
              <Reveal>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/70">
                  <Image
                    src={aboutResult.about.portraitUrl}
                    alt={aboutResult.about.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ) : null}
            <Reveal delay={0.12}>
              <div className="space-y-6 rounded-[2rem] border border-border/70 bg-card/70 p-6 backdrop-blur md:p-8">
                <h2 className="font-heading text-4xl text-foreground">
                  {aboutResult.about.title}
                </h2>
                <p className="text-base leading-8 text-muted-foreground">
                  {aboutResult.about.story}
                </p>
                {aboutResult.about.craftNotes.length ? (
                  <div className="flex flex-wrap gap-3">
                    {aboutResult.about.craftNotes.map((note) => (
                      <span
                        key={note}
                        className="rounded-full border border-primary/30 bg-primary/8 px-4 py-2 text-xs tracking-[0.22em] text-primary uppercase"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>
          </div>
        )}
      </Section>
    </main>
  )
}
