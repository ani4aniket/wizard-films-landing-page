import type { Metadata } from "next"
import Image from "next/image"

import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { CmsErrorState } from "@/components/site/states"
import { getAboutContent } from "@/lib/crm"

export const metadata: Metadata = {
  title: "About",
  description: "About Wizard Films: direction, editing, shoot execution, and music-led visuals.",
}

export default async function AboutPage() {
  const aboutResult = await getAboutContent()
    .then((about) => ({ about, error: null }))
    .catch((error) => ({ about: null, error }))

  return (
    <main>
      <PageHero
        eyebrow={aboutResult.about?.pageHeroEyebrow || "About"}
        title={
          aboutResult.about?.pageHeroTitle ||
          aboutResult.about?.title ||
          "Direction, edit, and shoot craft."
        }
        description={
          aboutResult.about?.pageHeroDescription ||
          aboutResult.about?.story ||
          "This page reflects the current bio, focus, and creative approach."
        }
      />
      <Section className="pt-2">
        {aboutResult.error || !aboutResult.about ? (
          <CmsErrorState
            title="About content unavailable."
            message="About content could not be fetched from CRM."
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            {aboutResult.about.portraitUrl ? (
              <Reveal>
                <div className="surface-soft relative aspect-4/5 overflow-hidden border border-border">
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
              <div className="space-y-6 border border-border bg-background p-6 md:p-8">
                <h2 className="text-4xl font-medium text-foreground">
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
                        className="rounded-full bg-secondary px-4 py-2 text-sm text-foreground"
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
