import { prisma } from "@/lib/prisma"
import { SITE_NAME } from "@/lib/constants"

const DEFAULT_SITE_DESCRIPTION =
  "A cinematic portfolio for film editing, color, sound, and story-led production."

let seedPromise: Promise<void> | null = null

export async function ensureCmsSeeded() {
  if (seedPromise) {
    return seedPromise
  }

  seedPromise = (async () => {
    await prisma.siteSettings.upsert({
      where: { id: "site-settings" },
      update: {},
      create: {
        id: "site-settings",
        siteName: SITE_NAME,
        siteDescription: DEFAULT_SITE_DESCRIPTION,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        footerBlurb:
          "Wizard Films builds cinematic edits, color, sound, and production systems around story first work.",
        contactEmail: "",
        ogImage: "",
      },
    })

    await prisma.homepageContent.upsert({
      where: { id: "homepage" },
      update: {},
      create: {
        id: "homepage",
        headline: "Frames built with atmosphere and intent.",
        tagline:
          "A film studio CRM-backed portfolio for edits, color, sound, and production work.",
        intro:
          "Use the admin dashboard to swap hero media, rewrite the homepage, and publish featured work without touching code.",
        heroVideoUrl: "",
        heroPosterUrl: "",
        primaryCtaLabel: "View Work",
        primaryCtaHref: "/work",
        secondaryCtaLabel: "Contact",
        secondaryCtaHref: "/contact",
      },
    })

    await prisma.aboutContent.upsert({
      where: { id: "about" },
      update: {},
      create: {
        id: "about",
        title: "A studio built around restraint, rhythm, and story.",
        story:
          "Wizard Films shapes edits, color, and sound with a cinematic eye. The copy here is seeded locally so the site renders immediately after Prisma is connected to Neon.",
        craftNotes: ["Editing", "Color", "Sound", "Production"],
        portraitUrl: "",
      },
    })

    await prisma.contactContent.upsert({
      where: { id: "contact" },
      update: {},
      create: {
        id: "contact",
        title: "Start a project",
        intro:
          "Share the brief, timeline, and mood you have in mind. New submissions land in the admin dashboard.",
        email: "",
      },
    })
  })()

  try {
    await seedPromise
  } catch (error) {
    seedPromise = null
    throw error
  }
}
