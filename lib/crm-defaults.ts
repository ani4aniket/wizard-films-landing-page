import { prisma } from "@/lib/prisma"
import { SITE_NAME } from "@/lib/constants"

const LEGACY_SITE_DESCRIPTION =
  "A cinematic portfolio for film editing, color, sound, and story-led production."

const LEGACY_FOOTER_BLURB =
  "Wizard Films builds cinematic edits, color, sound, and production systems around story first work."

const LEGACY_HOMEPAGE = {
  headline: "Frames built with atmosphere and intent.",
  tagline:
    "A film studio CRM-backed portfolio for edits, color, sound, and production work.",
  intro:
    "Use the admin dashboard to swap hero media, rewrite the homepage, and publish featured work without touching code.",
}

const LEGACY_ABOUT = {
  title: "A studio built around restraint, rhythm, and story.",
  story:
    "Wizard Films shapes edits, color, and sound with a cinematic eye. The copy here is seeded locally so the site renders immediately after Prisma is connected to Neon.",
}

const LEGACY_CONTACT = {
  title: "Start a project",
  intro:
    "Share the brief, timeline, and mood you have in mind. New submissions land in the admin dashboard.",
}

const SAMPLE_HOMEPAGE = {
  headline: "MAKE THE CUT FEEL PHYSICAL.",
  tagline:
    "A CRM-backed editorial portfolio for campaign films, social systems, and story-led post.",
  intro:
    "Built to feel like a printed catalog with cinematic energy up front and quiet chrome everywhere else.",
  heroPosterUrl: "https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
  primaryCtaLabel: "View Work",
  primaryCtaHref: "/work",
  secondaryCtaLabel: "Start a Project",
  secondaryCtaHref: "/contact",
}

const SAMPLE_ABOUT = {
  title: "Editorial discipline for moving image systems.",
  story:
    "Wizard Films builds campaign edits, social cutdowns, color finishing, and sound packages with the same philosophy: keep the interface quiet and let the image do the emotional work. The CRM is seeded with sample content so the site feels alive on first launch.",
  craftNotes: [
    "Campaign Editing",
    "Color Finishing",
    "Sound Design",
    "Social Systems",
  ],
  portraitUrl: "https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg",
}

const SAMPLE_CONTACT = {
  title: "Start a project",
  intro:
    "Send the brief, timeline, references, and delivery needs. Sample enquiries will appear in the CRM so the pipeline feels real immediately.",
  email: "hello@wizardfilms.studio",
}

const SAMPLE_SITE_SETTINGS = {
  siteDescription:
    "An editorial portfolio and CRM for campaign films, branded edits, color finishing, and post-production systems.",
  footerBlurb:
    "Wizard Films builds campaign edits, color, sound, and fast-turn post systems for brands, artists, and stories that need a clean emotional frame.",
  contactEmail: "hello@wizardfilms.studio",
}

const SAMPLE_SITE_LINKS = [
  {
    section: "SITE" as const,
    platform: "Instagram",
    label: "Instagram",
    url: "https://instagram.com/wizardfilms",
    sortOrder: 0,
  },
  {
    section: "SITE" as const,
    platform: "YouTube",
    label: "YouTube",
    url: "https://youtube.com/@wizardfilms",
    sortOrder: 1,
  },
  {
    section: "SITE" as const,
    platform: "Vimeo",
    label: "Vimeo",
    url: "https://vimeo.com/wizardfilms",
    sortOrder: 2,
  },
]

const SAMPLE_CONTACT_LINKS = [
  {
    section: "CONTACT" as const,
    platform: "Instagram",
    label: "DM on Instagram",
    url: "https://instagram.com/wizardfilms",
    sortOrder: 0,
  },
  {
    section: "CONTACT" as const,
    platform: "YouTube",
    label: "View channel",
    url: "https://youtube.com/@wizardfilms",
    sortOrder: 1,
  },
]

const SAMPLE_PROJECTS = [
  {
    slug: "night-runner-launch",
    title: "Night Runner Launch",
    description:
      "A pace-driven launch cut designed for paid social, broadcast trim-downs, and retail loop playback.",
    category: "Editing",
    youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    credits:
      "Director: Sample Director · Agency: North Unit · Music Edit: Wizard Films",
    role: "Offline edit, versioning, final conform",
    featured: true,
    sortOrder: 0,
  },
  {
    slug: "city-of-echoes",
    title: "City of Echoes",
    description:
      "A tonal brand film with cool-night grading, restrained pacing, and a cleaner dialogue between product and atmosphere.",
    category: "Color Grading",
    youtubeUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    credits: "Director: Sample Director · DP: Sample DP · Grade: Wizard Films",
    role: "Look development and finishing",
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "afterglow-sessions",
    title: "Afterglow Sessions",
    description:
      "Music-led social cutdowns built for repeatable release weeks, with alternate hooks and clean end-card packages.",
    category: "Audio",
    youtubeUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    credits: "Artist: Sample Artist · Mix support: Wizard Films",
    role: "Sound design, stems prep, delivery",
    featured: false,
    sortOrder: 2,
  },
  {
    slug: "dust-trail-anthem",
    title: "Dust Trail Anthem",
    description:
      "A location-driven outdoor spot shaped from field footage into a tight, modular campaign master and social variants.",
    category: "Shoot",
    youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    credits: "Production: Wizard Films · Edit assist: Sample Team",
    role: "Shoot supervision and post pipeline",
    featured: true,
    sortOrder: 3,
  },
]

const SAMPLE_SERVICES = [
  {
    slug: "campaign-editing",
    title: "Campaign Editing",
    description:
      "Narrative assembly, pace design, music-driven cut structure, and delivery masters for launch films and hero edits.",
    icon: "Edit",
    sortOrder: 0,
  },
  {
    slug: "color-finishing",
    title: "Color Finishing",
    description:
      "Look development, shot balancing, and restrained grade systems that keep brand imagery consistent across formats.",
    icon: "Color",
    sortOrder: 1,
  },
  {
    slug: "sound-design",
    title: "Sound Design",
    description:
      "Clean dialog polish, tactile sound layers, music shaping, and final mix prep for social, film, and retail playback.",
    icon: "Sound",
    sortOrder: 2,
  },
  {
    slug: "social-cutdown-systems",
    title: "Social Cutdown Systems",
    description:
      "Versioned assets, alternate hooks, channel-specific durations, and delivery logic for repeatable campaign rollout.",
    icon: "Production",
    sortOrder: 3,
  },
]

const SAMPLE_SUBMISSIONS = [
  {
    name: "Maya Chen",
    email: "maya@northunit.co",
    message:
      "We need a 45-second launch film plus six social cutdowns for a trail collection. Timeline is two weeks from locked footage.",
    isRead: false,
  },
  {
    name: "Jordan Ellis",
    email: "jordan@rivetmusic.com",
    message:
      "Looking for editorial support and finishing on a live session package with three deliverables and quick-turn captions.",
    isRead: true,
  },
  {
    name: "Leah Ortiz",
    email: "leah@atelierstudio.tv",
    message:
      "Can you handle offline edit and color for a short hospitality spot? We have references and rough selects ready.",
    isRead: false,
  },
]

let seedPromise: Promise<void> | null = null

function isBlank(value: string | null | undefined) {
  return !value || !value.trim()
}

export async function ensureCmsSeeded() {
  if (seedPromise) {
    return seedPromise
  }

  seedPromise = (async () => {
    const siteSettings = await prisma.siteSettings.upsert({
      where: { id: "site-settings" },
      update: {},
      create: {
        id: "site-settings",
        siteName: SITE_NAME,
        siteDescription: SAMPLE_SITE_SETTINGS.siteDescription,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        footerBlurb: SAMPLE_SITE_SETTINGS.footerBlurb,
        contactEmail: SAMPLE_SITE_SETTINGS.contactEmail,
        ogImage: SAMPLE_HOMEPAGE.heroPosterUrl,
      },
    })

    if (
      siteSettings.siteDescription === LEGACY_SITE_DESCRIPTION ||
      siteSettings.footerBlurb === LEGACY_FOOTER_BLURB ||
      isBlank(siteSettings.contactEmail) ||
      isBlank(siteSettings.ogImage)
    ) {
      await prisma.siteSettings.update({
        where: { id: "site-settings" },
        data: {
          siteDescription:
            siteSettings.siteDescription === LEGACY_SITE_DESCRIPTION
              ? SAMPLE_SITE_SETTINGS.siteDescription
              : siteSettings.siteDescription,
          footerBlurb:
            siteSettings.footerBlurb === LEGACY_FOOTER_BLURB
              ? SAMPLE_SITE_SETTINGS.footerBlurb
              : siteSettings.footerBlurb,
          contactEmail: isBlank(siteSettings.contactEmail)
            ? SAMPLE_SITE_SETTINGS.contactEmail
            : siteSettings.contactEmail,
          ogImage: isBlank(siteSettings.ogImage)
            ? SAMPLE_HOMEPAGE.heroPosterUrl
            : siteSettings.ogImage,
        },
      })
    }

    const homepage = await prisma.homepageContent.upsert({
      where: { id: "homepage" },
      update: {},
      create: {
        id: "homepage",
        headline: SAMPLE_HOMEPAGE.headline,
        tagline: SAMPLE_HOMEPAGE.tagline,
        intro: SAMPLE_HOMEPAGE.intro,
        heroVideoUrl: "",
        heroPosterUrl: SAMPLE_HOMEPAGE.heroPosterUrl,
        primaryCtaLabel: SAMPLE_HOMEPAGE.primaryCtaLabel,
        primaryCtaHref: SAMPLE_HOMEPAGE.primaryCtaHref,
        secondaryCtaLabel: SAMPLE_HOMEPAGE.secondaryCtaLabel,
        secondaryCtaHref: SAMPLE_HOMEPAGE.secondaryCtaHref,
      },
    })

    if (
      homepage.headline === LEGACY_HOMEPAGE.headline ||
      homepage.tagline === LEGACY_HOMEPAGE.tagline ||
      homepage.intro === LEGACY_HOMEPAGE.intro ||
      isBlank(homepage.heroPosterUrl)
    ) {
      await prisma.homepageContent.update({
        where: { id: "homepage" },
        data: {
          headline:
            homepage.headline === LEGACY_HOMEPAGE.headline
              ? SAMPLE_HOMEPAGE.headline
              : homepage.headline,
          tagline:
            homepage.tagline === LEGACY_HOMEPAGE.tagline
              ? SAMPLE_HOMEPAGE.tagline
              : homepage.tagline,
          intro:
            homepage.intro === LEGACY_HOMEPAGE.intro
              ? SAMPLE_HOMEPAGE.intro
              : homepage.intro,
          heroPosterUrl: isBlank(homepage.heroPosterUrl)
            ? SAMPLE_HOMEPAGE.heroPosterUrl
            : homepage.heroPosterUrl,
          primaryCtaLabel:
            homepage.primaryCtaLabel || SAMPLE_HOMEPAGE.primaryCtaLabel,
          primaryCtaHref:
            homepage.primaryCtaHref || SAMPLE_HOMEPAGE.primaryCtaHref,
          secondaryCtaLabel:
            homepage.secondaryCtaLabel || SAMPLE_HOMEPAGE.secondaryCtaLabel,
          secondaryCtaHref:
            homepage.secondaryCtaHref || SAMPLE_HOMEPAGE.secondaryCtaHref,
        },
      })
    }

    const about = await prisma.aboutContent.upsert({
      where: { id: "about" },
      update: {},
      create: {
        id: "about",
        title: SAMPLE_ABOUT.title,
        story: SAMPLE_ABOUT.story,
        craftNotes: SAMPLE_ABOUT.craftNotes,
        portraitUrl: SAMPLE_ABOUT.portraitUrl,
      },
    })

    if (
      about.title === LEGACY_ABOUT.title ||
      about.story === LEGACY_ABOUT.story ||
      !about.craftNotes.length ||
      isBlank(about.portraitUrl)
    ) {
      await prisma.aboutContent.update({
        where: { id: "about" },
        data: {
          title:
            about.title === LEGACY_ABOUT.title
              ? SAMPLE_ABOUT.title
              : about.title,
          story:
            about.story === LEGACY_ABOUT.story
              ? SAMPLE_ABOUT.story
              : about.story,
          craftNotes: about.craftNotes.length
            ? about.craftNotes
            : SAMPLE_ABOUT.craftNotes,
          portraitUrl: isBlank(about.portraitUrl)
            ? SAMPLE_ABOUT.portraitUrl
            : about.portraitUrl,
        },
      })
    }

    const contact = await prisma.contactContent.upsert({
      where: { id: "contact" },
      update: {},
      create: {
        id: "contact",
        title: SAMPLE_CONTACT.title,
        intro: SAMPLE_CONTACT.intro,
        email: SAMPLE_CONTACT.email,
      },
    })

    if (
      contact.title === LEGACY_CONTACT.title ||
      contact.intro === LEGACY_CONTACT.intro ||
      isBlank(contact.email)
    ) {
      await prisma.contactContent.update({
        where: { id: "contact" },
        data: {
          title:
            contact.title === LEGACY_CONTACT.title
              ? SAMPLE_CONTACT.title
              : contact.title,
          intro:
            contact.intro === LEGACY_CONTACT.intro
              ? SAMPLE_CONTACT.intro
              : contact.intro,
          email: isBlank(contact.email) ? SAMPLE_CONTACT.email : contact.email,
        },
      })
    }

    const [
      siteLinkCount,
      contactLinkCount,
      projectCount,
      serviceCount,
      submissionCount,
    ] = await Promise.all([
      prisma.socialLink.count({ where: { section: "SITE" } }),
      prisma.socialLink.count({ where: { section: "CONTACT" } }),
      prisma.project.count(),
      prisma.service.count(),
      prisma.contactSubmission.count(),
    ])

    if (siteLinkCount === 0) {
      await prisma.socialLink.createMany({ data: SAMPLE_SITE_LINKS })
    }

    if (contactLinkCount === 0) {
      await prisma.socialLink.createMany({ data: SAMPLE_CONTACT_LINKS })
    }

    if (projectCount === 0) {
      await prisma.project.createMany({ data: SAMPLE_PROJECTS })
    }

    if (serviceCount === 0) {
      await prisma.service.createMany({ data: SAMPLE_SERVICES })
    }

    if (submissionCount === 0) {
      await prisma.contactSubmission.createMany({ data: SAMPLE_SUBMISSIONS })
    }
  })()

  try {
    await seedPromise
  } catch (error) {
    seedPromise = null
    throw error
  }
}
