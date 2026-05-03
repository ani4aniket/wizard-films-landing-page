import { prisma } from "@/lib/prisma"
import { NAV_LINKS, SITE_NAME } from "@/lib/constants"
import { slugify } from "@/lib/youtube"

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
  headline: "VISUALS THAT MOVE WITH THE SONG.",
  tagline:
    "Wizard Films — director and visual creative for music videos, editing, shoot execution, and sound- and music-driven storytelling.",
  intro:
    "Wizard Films builds cinematic visuals that follow the rhythm and emotion of each track. He is credited as director on projects including Sikhi Vs Maut and Lahore, working on Punjabi music releases with production teams and label partners. His approach pairs strong direction, polished edits, and on-set visual coordination so the final film lands with impact.",
  heroPosterUrl: "https://img.youtube.com/vi/RmTLqCPnUcs/hqdefault.jpg",
  primaryCtaLabel: "View Work",
  primaryCtaHref: "/work",
  secondaryCtaLabel: "Start a Project",
  secondaryCtaHref: "/contact",
  heroEyebrow: "",
  heroAsideEyebrow: "Creative Focus",
  heroAsideFocus: "",
  featuredEyebrow: "Selected Work",
  featuredTitle: "Featured projects.",
  featuredDescription:
    "Highlighted selections with roles, descriptions, and direct playback.",
  servicesEyebrow: "Services",
  servicesTitle: "Services",
  servicesDescription:
    "Direction, editing, shoot execution, and music-led storytelling—kept current from admin.",
  approachEyebrow: "Approach",
  approachTitle: "How each release is shaped.",
  approachDescription:
    "A focused path from concept to delivery: direction, rhythm-aware editing, and polished finishing.",
  approachBullets: [] as string[],
}

const SAMPLE_ABOUT = {
  title: "Wizard Films",
  story:
    "Wizard Films is a director and visual creative working in music videos, video editing, shoot execution, and sound- and music-led storytelling. His work focuses on cinematic visuals that move with the rhythm and emotion of each song. He has been credited as director on projects such as Sikhi Vs Maut and Lahore, collaborating with production teams and labels on Punjabi music releases. His style combines strong direction, refined editing, and on-set visual coordination to deliver memorable final videos. Wizard Films creates music videos and visual content with a focus on direction, editing, and production detail—turning songs into cinematic pieces that connect with the audience.",
  craftNotes: [
    "Music video direction",
    "Video editing",
    "Shoot execution",
    "Sound- and music-led creative work",
    "Artist visual storytelling",
  ],
  portraitUrl: "https://img.youtube.com/vi/RmTLqCPnUcs/hqdefault.jpg",
  pageHeroEyebrow: "About",
  pageHeroTitle: "",
  pageHeroDescription: "",
}

const SAMPLE_CONTACT = {
  title: "Start a project",
  intro:
    "Available for music videos, creative direction, editing, and shoot-based projects. Share the track, references, timeline, and how you want the release to feel.",
  email: "hello@wizardfilms.studio",
  pageHeroEyebrow: "Contact",
  pageHeroTitle: "Start your next release.",
  pageHeroDescription:
    "Share your track, references, and timeline. Contact details and links stay current from admin.",
}

const SAMPLE_SITE_SETTINGS = {
  siteDescription:
    "Wizard Films presents Wizard Films — music video direction, editing, shoot execution, and sound-led storytelling for Punjabi and label-driven releases.",
  footerBlurb:
    "Wizard Films · Wizard Films: music video direction, editing, shoot execution, and artist-focused visual storytelling.",
  contactEmail: "hello@wizardfilms.studio",
  navCtaLabel: "Start a Project",
  navCtaHref: "/contact",
  searchArchivePlaceholder: "Search the archive",
  footerLeadLine:
    "Music videos shaped through direction, editing, and rhythm-led storytelling.",
  workPageEyebrow: "",
  workPageHeroTitle: "Music videos and visual stories.",
  workPageHeroDescription:
    "Browse projects with direction credits, roles, and playback.",
  servicesPageEyebrow: "Services",
  servicesPageHeroTitle: "What I do across music video production.",
  servicesPageHeroDescription:
    "Wizard Films builds cinematic visuals that follow the rhythm and emotion of each track.",
  projectRelatedEyebrow: "More Work",
  projectRelatedTitle: "More videos.",
  projectRelatedDescription:
    "More projects with credits, roles, and embedded playback.",
  projectPlaybackNote:
    "Embedded playback with optimized loading for smoother viewing and faster page performance.",
  homeFeaturedWorkCtaLabel: "View More Work",
  homeFeaturedWorkCtaHref: "/work",
}

const SAMPLE_NAV_LINKS = NAV_LINKS.map((link, index) => ({
  label: link.label,
  href: link.href,
  sortOrder: index,
}))

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

const PROJECT_CATEGORY = "Music Videos"

const PROJECT_SEED_ROWS = [
  {
    title: "Sikhi Vs Maut",
    youtubeUrl: "https://www.youtube.com/watch?v=RmTLqCPnUcs",
    role: "Director",
    description:
      "Director on the official music video for Wizard Films, leading music video direction from concept through delivery.",
    featured: true,
  },
  {
    title: "Lahore",
    youtubeUrl: "https://www.youtube.com/watch?v=6FpRgTw7Q1A",
    role: "Director",
    description:
      "Director on Lahore—visual direction for the official video under Wizard Films.",
    featured: true,
  },
  {
    title: "Gift",
    youtubeUrl: "https://www.youtube.com/watch?v=n4Bk4NAjxHY",
    role: "Director & DOP",
    description:
      "Director and director of photography on Gift—visual treatment and shoot execution for the official Wizard Films release.",
    featured: true,
  },
  {
    title: "Sarpanchi",
    youtubeUrl: "https://www.youtube.com/watch?v=LkzpvGD4T3k",
    role: "Co-director",
    description:
      "Co-director on Sarpanchi—shared direction and screen execution on the official video.",
    featured: true,
  },
  {
    title: "Bhujangi",
    youtubeUrl: "https://www.youtube.com/watch?v=U3CU8Gv1dhg",
    role: "Director",
    description:
      "Director on Bhujangi—visual storytelling and overall music video direction for Wizard Films.",
    featured: true,
  },
  {
    title: "Ranihaar",
    youtubeUrl: "https://www.youtube.com/watch?v=mZcbxGO57vw",
    role: "Director",
    description:
      "Director on Ranihaar—concept-to-screen visual direction for Wizard Films.",
    featured: true,
  },
  {
    title: "Ikk Mikk",
    youtubeUrl: "https://www.youtube.com/watch?v=VMrwnq_GaV4",
    role: "Director",
    description:
      "Director on Ikk Mikk—visual direction and music video execution for Heat Records and Wizard Films.",
    featured: false,
  },
  {
    title: "Heeriye",
    youtubeUrl: "https://www.youtube.com/watch?v=AtRbtqa6WXU",
    role: "Director",
    description:
      "Director on Heeriye—official video direction and overall visual treatment with Wizard Films.",
    featured: false,
  },
  {
    title: "Shukrana",
    youtubeUrl: "https://www.youtube.com/watch?v=hpvhwPOFzQk",
    role: "Director",
    description:
      "Director on Shukrana—official video direction; edit through Wizard Editing Studio.",
    featured: false,
  },
  {
    title: "Sapera",
    youtubeUrl: "https://www.youtube.com/watch?v=_Q7GghaHEsA",
    role: "Director & DOP",
    description:
      "Director and DOP on Sapera—direction and camera execution; edit by Wizard Editing Studio.",
    featured: false,
  },
  {
    title: "Amli",
    youtubeUrl: "https://www.youtube.com/watch?v=bp7A1AuHOsk",
    role: "Director & lyricist",
    description:
      "Director and lyricist on Amli—creative direction for the official video plus lyrics credit.",
    featured: false,
  },
  {
    title: "Taur Banju",
    youtubeUrl: "https://www.youtube.com/watch?v=nuWegmnXtGY",
    role: "Director",
    description:
      "Director on Taur Banju—visual direction for the official video; edit by Wizard Editing Studio; presentation under Wizard Films.",
    featured: false,
  },
  {
    title: "Saadhe Satt",
    youtubeUrl: "https://www.youtube.com/watch?v=wVzoLu1fvJQ",
    role: "Director & DOP",
    description:
      "Director and DOP on Saadhe Satt—on-set execution for the official release under Wizard Films.",
    featured: false,
  },
  {
    title: "Bebe Teri Soh",
    youtubeUrl: "https://www.youtube.com/watch?v=Vlq7LNnX5jc",
    role: "Director",
    description:
      "Director on Bebe Teri Soh—official video direction for Wizard Films.",
    featured: false,
  },
  {
    title: "Let's See",
    youtubeUrl: "https://www.youtube.com/watch?v=XvbursEIVWE",
    role: "Portfolio",
    description:
      "Included in the portfolio reel; specific on-video credit was not verified from public metadata—role listed as TBD pending label or upload confirmation.",
    featured: false,
  },
  {
    title: "Mohali Di Cream",
    youtubeUrl: "https://www.youtube.com/watch?v=jjpZSTCbQHs",
    role: "Director & DOP",
    description:
      "Director and DOP on Mohali Di Cream—direction and cinematography with Team Wizard Films.",
    featured: false,
  },
  {
    title: "Use And Throw",
    youtubeUrl: "https://www.youtube.com/watch?v=Co7ryB-JObY",
    role: "Portfolio",
    description:
      "Included in the portfolio reel; specific on-video credit was not verified from public metadata—role listed as TBD pending label or upload confirmation.",
    featured: false,
  },
  {
    title: "Brave Talk",
    youtubeUrl: "https://www.youtube.com/watch?v=My0eqYmPQxY",
    role: "DOP & editor",
    description:
      "DOP and editor on Brave Talk—camera execution and post-production editing for the official video.",
    featured: false,
  },
  {
    title: "Rishta",
    youtubeUrl: "https://www.youtube.com/watch?v=X2f37WTyauM",
    role: "Director",
    description:
      "Director on Rishta—official video direction for Wizard Films; post-production through Wizard Editing Studio.",
    featured: false,
  },
  {
    title: "VIBE",
    youtubeUrl: "https://www.youtube.com/watch?v=UgWcedfTEUs",
    role: "Director",
    description:
      "Director on VIBE—visual direction for the official video under Wizard Films; edit by Wizard Editing Studio.",
    featured: false,
  },
  {
    title: "Mashook",
    youtubeUrl: "https://www.youtube.com/watch?v=tDdmOZoPCMo",
    role: "Director",
    description:
      "Director on Mashook—official music video direction for the Wizard Films release.",
    featured: false,
  },
  {
    title: "Dil Mangda",
    youtubeUrl: "https://www.youtube.com/watch?v=b0H14UoqrmA",
    role: "Director",
    description:
      "Director on Dil Mangda—visual direction for the official video under Wizard Films; post through Wizard Editing Studio.",
    featured: false,
  },
  {
    title: "Loon Di Theli",
    youtubeUrl: "https://www.youtube.com/watch?v=ZBF1zqfzKrc",
    role: "Director",
    description:
      "Director on Loon Di Theli—official video direction for Heat Records with production by Wizard Films.",
    featured: false,
  },
  {
    title: "KANDDA",
    youtubeUrl: "https://www.youtube.com/watch?v=CVz-bqQFnhA",
    role: "Director",
    description:
      "Director on KANDDA—visual direction for the official video under Wizard Films; edit by Wizard Editing Studio.",
    featured: false,
  },
  {
    title: "Tu Nach Gi",
    youtubeUrl: "https://www.youtube.com/watch?v=Yc_Rp6pMdD4",
    role: "Director",
    description:
      "Director on Tu Nach Gi—official video direction for Wizard Films; edit through Wizard Editing Studio.",
    featured: false,
  },
  {
    title: "Mitha Banke",
    youtubeUrl: "https://www.youtube.com/watch?v=EXMt2WytSA8",
    role: "Director",
    description:
      "Director on Mitha Banke—official music video direction for Wizard Films.",
    featured: false,
  },
  {
    title: "Pleasure Mood",
    youtubeUrl: "https://www.youtube.com/watch?v=_yBgpX3R7pw",
    role: "Director",
    description:
      "Director on Pleasure Mood—official video direction for Wizard Films; post-production by Wizard Editing Studio.",
    featured: false,
  },
  {
    title: "Hunt",
    youtubeUrl: "https://www.youtube.com/watch?v=gQ4NsT2O5k0",
    role: "Director",
    description:
      "Director on Hunt—visual direction for the official video under Wizard Films; edit by Wizard Editing Studio.",
    featured: false,
  },
  {
    title: "Sade Aale",
    youtubeUrl: "https://www.youtube.com/watch?v=mRhQsa5yNxE",
    role: "Director",
    description:
      "Director on Sade Aale—official video direction for Royal Heat Music with video production by Wizard Films.",
    featured: false,
  },
  {
    title: "ASLA",
    youtubeUrl: "https://www.youtube.com/watch?v=e0mhZ4-qx7M",
    role: "Director",
    description:
      "Director on ASLA—official video direction for Wizard Films.",
    featured: false,
  },
  {
    title: "Black Whip",
    youtubeUrl: "https://www.youtube.com/watch?v=xgz6ETm6ieI",
    role: "Production team",
    description:
      "Contributed to Black Whip as part of the Wizard Films production team on the official music video presentation.",
    featured: false,
  },
  {
    title: "Rakh Honsla",
    youtubeUrl: "https://www.youtube.com/watch?v=iyOEhvOQiBI",
    role: "Portfolio",
    description:
      "Included in the portfolio reel; specific on-video credit was not verified from public description text—role listed as TBD pending confirmation.",
    featured: false,
  },
] as const

const LEGACY_PROJECT_SLUGS = [
  "night-runner-launch",
  "city-of-echoes",
  "afterglow-sessions",
  "dust-trail-anthem",
]

const SAMPLE_PROJECTS = PROJECT_SEED_ROWS.map((project, index) => ({
  slug: slugify(project.title),
  title: project.title,
  description: project.description,
  category: PROJECT_CATEGORY,
  youtubeUrl: project.youtubeUrl,
  credits: `Wizard Films · ${project.role}`,
  role: project.role,
  featured: project.featured,
  sortOrder: index,
}))

const SAMPLE_SERVICES = [
  {
    slug: "music-video-direction",
    title: "Music Video Direction",
    description:
      "Concept through delivery: performance blocking, narrative beats, on-set leadership, and a clear visual plan that serves the track.",
    icon: "Production",
    sortOrder: 0,
  },
  {
    slug: "video-editing",
    title: "Video Editing",
    description:
      "Pace, structure, and polish—cuts that follow the song, label notes, and platform delivery needs.",
    icon: "Edit",
    sortOrder: 1,
  },
  {
    slug: "shoot-execution",
    title: "Shoot Execution",
    description:
      "On-set coverage, DOP collaboration or operation, and coordination so the day captures what the edit will need.",
    icon: "Production",
    sortOrder: 2,
  },
  {
    slug: "sound-music-led-creative",
    title: "Sound- & Music-Led Creative",
    description:
      "Visual storytelling built around rhythm, drops, and emotional shifts in the music—sound-first creative direction.",
    icon: "Sound",
    sortOrder: 3,
  },
  {
    slug: "artist-visual-storytelling",
    title: "Artist Visual Storytelling",
    description:
      "Imagery that fits the artist’s world—performance, styling context, and memorable frames fans return to.",
    icon: "Color",
    sortOrder: 4,
  },
]

const SAMPLE_SUBMISSIONS = [
  {
    name: "Harpreet K.",
    email: "label.coord@example.com",
    message:
      "Punjabi single dropping in six weeks—need director + edit for official music video, two teasers, and vertical cutdowns. Budget and references ready.",
    isRead: false,
  },
  {
    name: "Simran R.",
    email: "artist.mgmt@example.com",
    message:
      "Looking for Wizard Films to direct next video—night exterior performance, one narrative thread, Wizard Films-style polish.",
    isRead: true,
  },
  {
    name: "Jaz B.",
    email: "production@example.com",
    message:
      "Need shoot execution and edit-only pass on locked footage for a label lyric video variant—tight turnaround.",
    isRead: false,
  },
]

let seedPromise: Promise<void> | null = null

function isBlank(value: string | null | undefined) {
  return !value || !value.trim()
}

export async function replaceCmsWithSampleData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  await prisma.$transaction(
    async (tx) => {
    await tx.contactSubmission.deleteMany()
    await tx.project.deleteMany()
    await tx.service.deleteMany()
    await tx.socialLink.deleteMany()
    await tx.navLink.deleteMany()

    await tx.siteSettings.upsert({
      where: { id: "site-settings" },
      update: {
        siteName: SITE_NAME,
        siteDescription: SAMPLE_SITE_SETTINGS.siteDescription,
        siteUrl,
        footerBlurb: SAMPLE_SITE_SETTINGS.footerBlurb,
        contactEmail: SAMPLE_SITE_SETTINGS.contactEmail,
        ogImage: SAMPLE_HOMEPAGE.heroPosterUrl,
        navCtaLabel: SAMPLE_SITE_SETTINGS.navCtaLabel,
        navCtaHref: SAMPLE_SITE_SETTINGS.navCtaHref,
        searchArchivePlaceholder: SAMPLE_SITE_SETTINGS.searchArchivePlaceholder,
        footerLeadLine: SAMPLE_SITE_SETTINGS.footerLeadLine,
        workPageEyebrow: SAMPLE_SITE_SETTINGS.workPageEyebrow || null,
        workPageHeroTitle: SAMPLE_SITE_SETTINGS.workPageHeroTitle,
        workPageHeroDescription: SAMPLE_SITE_SETTINGS.workPageHeroDescription,
        servicesPageEyebrow: SAMPLE_SITE_SETTINGS.servicesPageEyebrow,
        servicesPageHeroTitle: SAMPLE_SITE_SETTINGS.servicesPageHeroTitle,
        servicesPageHeroDescription:
          SAMPLE_SITE_SETTINGS.servicesPageHeroDescription || null,
        projectRelatedEyebrow: SAMPLE_SITE_SETTINGS.projectRelatedEyebrow,
        projectRelatedTitle: SAMPLE_SITE_SETTINGS.projectRelatedTitle,
        projectRelatedDescription:
          SAMPLE_SITE_SETTINGS.projectRelatedDescription,
        projectPlaybackNote: SAMPLE_SITE_SETTINGS.projectPlaybackNote,
        homeFeaturedWorkCtaLabel: SAMPLE_SITE_SETTINGS.homeFeaturedWorkCtaLabel,
        homeFeaturedWorkCtaHref: SAMPLE_SITE_SETTINGS.homeFeaturedWorkCtaHref,
      },
      create: {
        id: "site-settings",
        siteName: SITE_NAME,
        siteDescription: SAMPLE_SITE_SETTINGS.siteDescription,
        siteUrl,
        footerBlurb: SAMPLE_SITE_SETTINGS.footerBlurb,
        contactEmail: SAMPLE_SITE_SETTINGS.contactEmail,
        ogImage: SAMPLE_HOMEPAGE.heroPosterUrl,
        navCtaLabel: SAMPLE_SITE_SETTINGS.navCtaLabel,
        navCtaHref: SAMPLE_SITE_SETTINGS.navCtaHref,
        searchArchivePlaceholder: SAMPLE_SITE_SETTINGS.searchArchivePlaceholder,
        footerLeadLine: SAMPLE_SITE_SETTINGS.footerLeadLine,
        workPageEyebrow: SAMPLE_SITE_SETTINGS.workPageEyebrow || null,
        workPageHeroTitle: SAMPLE_SITE_SETTINGS.workPageHeroTitle,
        workPageHeroDescription: SAMPLE_SITE_SETTINGS.workPageHeroDescription,
        servicesPageEyebrow: SAMPLE_SITE_SETTINGS.servicesPageEyebrow,
        servicesPageHeroTitle: SAMPLE_SITE_SETTINGS.servicesPageHeroTitle,
        servicesPageHeroDescription:
          SAMPLE_SITE_SETTINGS.servicesPageHeroDescription || null,
        projectRelatedEyebrow: SAMPLE_SITE_SETTINGS.projectRelatedEyebrow,
        projectRelatedTitle: SAMPLE_SITE_SETTINGS.projectRelatedTitle,
        projectRelatedDescription:
          SAMPLE_SITE_SETTINGS.projectRelatedDescription,
        projectPlaybackNote: SAMPLE_SITE_SETTINGS.projectPlaybackNote,
        homeFeaturedWorkCtaLabel: SAMPLE_SITE_SETTINGS.homeFeaturedWorkCtaLabel,
        homeFeaturedWorkCtaHref: SAMPLE_SITE_SETTINGS.homeFeaturedWorkCtaHref,
      },
    })

    await tx.homepageContent.upsert({
      where: { id: "homepage" },
      update: {
        headline: SAMPLE_HOMEPAGE.headline,
        tagline: SAMPLE_HOMEPAGE.tagline,
        intro: SAMPLE_HOMEPAGE.intro,
        heroVideoUrl: "",
        heroPosterUrl: SAMPLE_HOMEPAGE.heroPosterUrl,
        primaryCtaLabel: SAMPLE_HOMEPAGE.primaryCtaLabel,
        primaryCtaHref: SAMPLE_HOMEPAGE.primaryCtaHref,
        secondaryCtaLabel: SAMPLE_HOMEPAGE.secondaryCtaLabel,
        secondaryCtaHref: SAMPLE_HOMEPAGE.secondaryCtaHref,
        heroEyebrow: SAMPLE_HOMEPAGE.heroEyebrow || null,
        heroAsideEyebrow: SAMPLE_HOMEPAGE.heroAsideEyebrow,
        heroAsideFocus: SAMPLE_HOMEPAGE.heroAsideFocus || null,
        featuredEyebrow: SAMPLE_HOMEPAGE.featuredEyebrow,
        featuredTitle: SAMPLE_HOMEPAGE.featuredTitle,
        featuredDescription: SAMPLE_HOMEPAGE.featuredDescription,
        servicesEyebrow: SAMPLE_HOMEPAGE.servicesEyebrow,
        servicesTitle: SAMPLE_HOMEPAGE.servicesTitle,
        servicesDescription: SAMPLE_HOMEPAGE.servicesDescription || null,
        approachEyebrow: SAMPLE_HOMEPAGE.approachEyebrow,
        approachTitle: SAMPLE_HOMEPAGE.approachTitle,
        approachDescription: SAMPLE_HOMEPAGE.approachDescription || null,
        approachBullets: SAMPLE_HOMEPAGE.approachBullets,
      },
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
        heroEyebrow: SAMPLE_HOMEPAGE.heroEyebrow || null,
        heroAsideEyebrow: SAMPLE_HOMEPAGE.heroAsideEyebrow,
        heroAsideFocus: SAMPLE_HOMEPAGE.heroAsideFocus || null,
        featuredEyebrow: SAMPLE_HOMEPAGE.featuredEyebrow,
        featuredTitle: SAMPLE_HOMEPAGE.featuredTitle,
        featuredDescription: SAMPLE_HOMEPAGE.featuredDescription,
        servicesEyebrow: SAMPLE_HOMEPAGE.servicesEyebrow,
        servicesTitle: SAMPLE_HOMEPAGE.servicesTitle,
        servicesDescription: SAMPLE_HOMEPAGE.servicesDescription || null,
        approachEyebrow: SAMPLE_HOMEPAGE.approachEyebrow,
        approachTitle: SAMPLE_HOMEPAGE.approachTitle,
        approachDescription: SAMPLE_HOMEPAGE.approachDescription || null,
        approachBullets: SAMPLE_HOMEPAGE.approachBullets,
      },
    })

    await tx.aboutContent.upsert({
      where: { id: "about" },
      update: {
        title: SAMPLE_ABOUT.title,
        story: SAMPLE_ABOUT.story,
        craftNotes: SAMPLE_ABOUT.craftNotes,
        portraitUrl: SAMPLE_ABOUT.portraitUrl,
        pageHeroEyebrow: SAMPLE_ABOUT.pageHeroEyebrow,
        pageHeroTitle: SAMPLE_ABOUT.pageHeroTitle || null,
        pageHeroDescription: SAMPLE_ABOUT.pageHeroDescription || null,
      },
      create: {
        id: "about",
        title: SAMPLE_ABOUT.title,
        story: SAMPLE_ABOUT.story,
        craftNotes: SAMPLE_ABOUT.craftNotes,
        portraitUrl: SAMPLE_ABOUT.portraitUrl,
        pageHeroEyebrow: SAMPLE_ABOUT.pageHeroEyebrow,
        pageHeroTitle: SAMPLE_ABOUT.pageHeroTitle || null,
        pageHeroDescription: SAMPLE_ABOUT.pageHeroDescription || null,
      },
    })

    await tx.contactContent.upsert({
      where: { id: "contact" },
      update: {
        title: SAMPLE_CONTACT.title,
        intro: SAMPLE_CONTACT.intro,
        email: SAMPLE_CONTACT.email,
        pageHeroEyebrow: SAMPLE_CONTACT.pageHeroEyebrow,
        pageHeroTitle: SAMPLE_CONTACT.pageHeroTitle,
        pageHeroDescription: SAMPLE_CONTACT.pageHeroDescription,
      },
      create: {
        id: "contact",
        title: SAMPLE_CONTACT.title,
        intro: SAMPLE_CONTACT.intro,
        email: SAMPLE_CONTACT.email,
        pageHeroEyebrow: SAMPLE_CONTACT.pageHeroEyebrow,
        pageHeroTitle: SAMPLE_CONTACT.pageHeroTitle,
        pageHeroDescription: SAMPLE_CONTACT.pageHeroDescription,
      },
    })

    await tx.socialLink.createMany({
      data: [...SAMPLE_SITE_LINKS, ...SAMPLE_CONTACT_LINKS],
    })
    await tx.navLink.createMany({ data: SAMPLE_NAV_LINKS })
    await tx.service.createMany({ data: SAMPLE_SERVICES })
    await tx.project.createMany({ data: SAMPLE_PROJECTS })
    await tx.contactSubmission.createMany({ data: SAMPLE_SUBMISSIONS })
    },
    { maxWait: 10_000, timeout: 120_000 }
  )
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
        navCtaLabel: SAMPLE_SITE_SETTINGS.navCtaLabel,
        navCtaHref: SAMPLE_SITE_SETTINGS.navCtaHref,
        searchArchivePlaceholder: SAMPLE_SITE_SETTINGS.searchArchivePlaceholder,
        footerLeadLine: SAMPLE_SITE_SETTINGS.footerLeadLine,
        workPageEyebrow: SAMPLE_SITE_SETTINGS.workPageEyebrow || null,
        workPageHeroTitle: SAMPLE_SITE_SETTINGS.workPageHeroTitle,
        workPageHeroDescription: SAMPLE_SITE_SETTINGS.workPageHeroDescription,
        servicesPageEyebrow: SAMPLE_SITE_SETTINGS.servicesPageEyebrow,
        servicesPageHeroTitle: SAMPLE_SITE_SETTINGS.servicesPageHeroTitle,
        servicesPageHeroDescription:
          SAMPLE_SITE_SETTINGS.servicesPageHeroDescription,
        projectRelatedEyebrow: SAMPLE_SITE_SETTINGS.projectRelatedEyebrow,
        projectRelatedTitle: SAMPLE_SITE_SETTINGS.projectRelatedTitle,
        projectRelatedDescription:
          SAMPLE_SITE_SETTINGS.projectRelatedDescription,
        projectPlaybackNote: SAMPLE_SITE_SETTINGS.projectPlaybackNote,
        homeFeaturedWorkCtaLabel: SAMPLE_SITE_SETTINGS.homeFeaturedWorkCtaLabel,
        homeFeaturedWorkCtaHref: SAMPLE_SITE_SETTINGS.homeFeaturedWorkCtaHref,
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

    const siteAfterLegacy = await prisma.siteSettings.findUniqueOrThrow({
      where: { id: "site-settings" },
    })
    const siteUiFill: Record<string, string> = {}
    if (isBlank(siteAfterLegacy.navCtaLabel)) {
      siteUiFill.navCtaLabel = SAMPLE_SITE_SETTINGS.navCtaLabel
    }
    if (isBlank(siteAfterLegacy.navCtaHref)) {
      siteUiFill.navCtaHref = SAMPLE_SITE_SETTINGS.navCtaHref
    }
    if (isBlank(siteAfterLegacy.searchArchivePlaceholder)) {
      siteUiFill.searchArchivePlaceholder =
        SAMPLE_SITE_SETTINGS.searchArchivePlaceholder
    }
    if (isBlank(siteAfterLegacy.footerLeadLine)) {
      siteUiFill.footerLeadLine = SAMPLE_SITE_SETTINGS.footerLeadLine
    }
    if (isBlank(siteAfterLegacy.workPageHeroTitle)) {
      siteUiFill.workPageHeroTitle = SAMPLE_SITE_SETTINGS.workPageHeroTitle
    }
    if (isBlank(siteAfterLegacy.workPageHeroDescription)) {
      siteUiFill.workPageHeroDescription =
        SAMPLE_SITE_SETTINGS.workPageHeroDescription
    }
    if (isBlank(siteAfterLegacy.servicesPageEyebrow)) {
      siteUiFill.servicesPageEyebrow = SAMPLE_SITE_SETTINGS.servicesPageEyebrow
    }
    if (isBlank(siteAfterLegacy.servicesPageHeroTitle)) {
      siteUiFill.servicesPageHeroTitle =
        SAMPLE_SITE_SETTINGS.servicesPageHeroTitle
    }
    if (isBlank(siteAfterLegacy.servicesPageHeroDescription)) {
      siteUiFill.servicesPageHeroDescription =
        SAMPLE_SITE_SETTINGS.servicesPageHeroDescription
    }
    if (isBlank(siteAfterLegacy.projectRelatedEyebrow)) {
      siteUiFill.projectRelatedEyebrow =
        SAMPLE_SITE_SETTINGS.projectRelatedEyebrow
    }
    if (isBlank(siteAfterLegacy.projectRelatedTitle)) {
      siteUiFill.projectRelatedTitle = SAMPLE_SITE_SETTINGS.projectRelatedTitle
    }
    if (isBlank(siteAfterLegacy.projectRelatedDescription)) {
      siteUiFill.projectRelatedDescription =
        SAMPLE_SITE_SETTINGS.projectRelatedDescription
    }
    if (isBlank(siteAfterLegacy.projectPlaybackNote)) {
      siteUiFill.projectPlaybackNote = SAMPLE_SITE_SETTINGS.projectPlaybackNote
    }
    if (isBlank(siteAfterLegacy.homeFeaturedWorkCtaLabel)) {
      siteUiFill.homeFeaturedWorkCtaLabel =
        SAMPLE_SITE_SETTINGS.homeFeaturedWorkCtaLabel
    }
    if (isBlank(siteAfterLegacy.homeFeaturedWorkCtaHref)) {
      siteUiFill.homeFeaturedWorkCtaHref =
        SAMPLE_SITE_SETTINGS.homeFeaturedWorkCtaHref
    }
    if (Object.keys(siteUiFill).length > 0) {
      await prisma.siteSettings.update({
        where: { id: "site-settings" },
        data: siteUiFill,
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
        heroEyebrow: SAMPLE_HOMEPAGE.heroEyebrow || null,
        heroAsideEyebrow: SAMPLE_HOMEPAGE.heroAsideEyebrow,
        heroAsideFocus: SAMPLE_HOMEPAGE.heroAsideFocus || null,
        featuredEyebrow: SAMPLE_HOMEPAGE.featuredEyebrow,
        featuredTitle: SAMPLE_HOMEPAGE.featuredTitle,
        featuredDescription: SAMPLE_HOMEPAGE.featuredDescription,
        servicesEyebrow: SAMPLE_HOMEPAGE.servicesEyebrow,
        servicesTitle: SAMPLE_HOMEPAGE.servicesTitle,
        servicesDescription: SAMPLE_HOMEPAGE.servicesDescription || null,
        approachEyebrow: SAMPLE_HOMEPAGE.approachEyebrow,
        approachTitle: SAMPLE_HOMEPAGE.approachTitle,
        approachDescription: SAMPLE_HOMEPAGE.approachDescription || null,
        approachBullets: SAMPLE_HOMEPAGE.approachBullets,
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
          heroAsideEyebrow: SAMPLE_HOMEPAGE.heroAsideEyebrow,
          heroEyebrow: SAMPLE_HOMEPAGE.heroEyebrow || null,
          heroAsideFocus: SAMPLE_HOMEPAGE.heroAsideFocus || null,
          featuredEyebrow: SAMPLE_HOMEPAGE.featuredEyebrow,
          featuredTitle: SAMPLE_HOMEPAGE.featuredTitle,
          featuredDescription: SAMPLE_HOMEPAGE.featuredDescription,
          servicesEyebrow: SAMPLE_HOMEPAGE.servicesEyebrow,
          servicesTitle: SAMPLE_HOMEPAGE.servicesTitle,
          servicesDescription: SAMPLE_HOMEPAGE.servicesDescription || null,
          approachEyebrow: SAMPLE_HOMEPAGE.approachEyebrow,
          approachTitle: SAMPLE_HOMEPAGE.approachTitle,
          approachDescription: SAMPLE_HOMEPAGE.approachDescription || null,
        },
      })
    }

    const homepageAfterLegacy = await prisma.homepageContent.findUniqueOrThrow({
      where: { id: "homepage" },
    })
    const homeSectionFill: Record<string, string> = {}
    if (isBlank(homepageAfterLegacy.heroAsideEyebrow)) {
      homeSectionFill.heroAsideEyebrow = SAMPLE_HOMEPAGE.heroAsideEyebrow
    }
    if (isBlank(homepageAfterLegacy.featuredEyebrow)) {
      homeSectionFill.featuredEyebrow = SAMPLE_HOMEPAGE.featuredEyebrow
    }
    if (isBlank(homepageAfterLegacy.featuredTitle)) {
      homeSectionFill.featuredTitle = SAMPLE_HOMEPAGE.featuredTitle
    }
    if (isBlank(homepageAfterLegacy.featuredDescription)) {
      homeSectionFill.featuredDescription = SAMPLE_HOMEPAGE.featuredDescription
    }
    if (isBlank(homepageAfterLegacy.servicesEyebrow)) {
      homeSectionFill.servicesEyebrow = SAMPLE_HOMEPAGE.servicesEyebrow
    }
    if (isBlank(homepageAfterLegacy.servicesTitle)) {
      homeSectionFill.servicesTitle = SAMPLE_HOMEPAGE.servicesTitle
    }
    if (isBlank(homepageAfterLegacy.approachEyebrow)) {
      homeSectionFill.approachEyebrow = SAMPLE_HOMEPAGE.approachEyebrow
    }
    if (isBlank(homepageAfterLegacy.approachTitle)) {
      homeSectionFill.approachTitle = SAMPLE_HOMEPAGE.approachTitle
    }
    if (isBlank(homepageAfterLegacy.servicesDescription)) {
      homeSectionFill.servicesDescription = SAMPLE_HOMEPAGE.servicesDescription
    }
    if (isBlank(homepageAfterLegacy.approachDescription)) {
      homeSectionFill.approachDescription = SAMPLE_HOMEPAGE.approachDescription
    }
    if (isBlank(homepageAfterLegacy.heroAsideEyebrow)) {
      homeSectionFill.heroAsideEyebrow = SAMPLE_HOMEPAGE.heroAsideEyebrow
    }
    if (Object.keys(homeSectionFill).length > 0) {
      await prisma.homepageContent.update({
        where: { id: "homepage" },
        data: homeSectionFill,
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
        pageHeroEyebrow: SAMPLE_ABOUT.pageHeroEyebrow,
        pageHeroTitle: SAMPLE_ABOUT.pageHeroTitle || null,
        pageHeroDescription: SAMPLE_ABOUT.pageHeroDescription || null,
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
          pageHeroEyebrow: isBlank(about.pageHeroEyebrow)
            ? SAMPLE_ABOUT.pageHeroEyebrow
            : about.pageHeroEyebrow,
          pageHeroTitle: isBlank(about.pageHeroTitle)
            ? SAMPLE_ABOUT.pageHeroTitle || null
            : about.pageHeroTitle,
          pageHeroDescription: isBlank(about.pageHeroDescription)
            ? SAMPLE_ABOUT.pageHeroDescription || null
            : about.pageHeroDescription,
        },
      })
    }

    const aboutAfterLegacy = await prisma.aboutContent.findUniqueOrThrow({
      where: { id: "about" },
    })
    const aboutHeroFill: Record<string, string> = {}
    if (isBlank(aboutAfterLegacy.pageHeroEyebrow)) {
      aboutHeroFill.pageHeroEyebrow = SAMPLE_ABOUT.pageHeroEyebrow
    }
    if (isBlank(aboutAfterLegacy.pageHeroTitle)) {
      const fallback = SAMPLE_ABOUT.pageHeroTitle?.trim()
      if (fallback) {
        aboutHeroFill.pageHeroTitle = fallback
      }
    }
    if (isBlank(aboutAfterLegacy.pageHeroDescription)) {
      const fallback = SAMPLE_ABOUT.pageHeroDescription?.trim()
      if (fallback) {
        aboutHeroFill.pageHeroDescription = fallback
      }
    }
    if (Object.keys(aboutHeroFill).length > 0) {
      await prisma.aboutContent.update({
        where: { id: "about" },
        data: aboutHeroFill,
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
        pageHeroEyebrow: SAMPLE_CONTACT.pageHeroEyebrow,
        pageHeroTitle: SAMPLE_CONTACT.pageHeroTitle,
        pageHeroDescription: SAMPLE_CONTACT.pageHeroDescription,
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
          pageHeroEyebrow: isBlank(contact.pageHeroEyebrow)
            ? SAMPLE_CONTACT.pageHeroEyebrow
            : contact.pageHeroEyebrow,
          pageHeroTitle: isBlank(contact.pageHeroTitle)
            ? SAMPLE_CONTACT.pageHeroTitle
            : contact.pageHeroTitle,
          pageHeroDescription: isBlank(contact.pageHeroDescription)
            ? SAMPLE_CONTACT.pageHeroDescription
            : contact.pageHeroDescription,
        },
      })
    }

    const contactAfterLegacy = await prisma.contactContent.findUniqueOrThrow({
      where: { id: "contact" },
    })
    const contactHeroFill: Record<string, string> = {}
    if (isBlank(contactAfterLegacy.pageHeroEyebrow)) {
      contactHeroFill.pageHeroEyebrow = SAMPLE_CONTACT.pageHeroEyebrow
    }
    if (isBlank(contactAfterLegacy.pageHeroTitle)) {
      contactHeroFill.pageHeroTitle = SAMPLE_CONTACT.pageHeroTitle
    }
    if (isBlank(contactAfterLegacy.pageHeroDescription)) {
      contactHeroFill.pageHeroDescription = SAMPLE_CONTACT.pageHeroDescription
    }
    if (Object.keys(contactHeroFill).length > 0) {
      await prisma.contactContent.update({
        where: { id: "contact" },
        data: contactHeroFill,
      })
    }

    const [
      siteLinkCount,
      contactLinkCount,
      navLinkCount,
      projectCount,
      serviceCount,
      submissionCount,
    ] = await Promise.all([
      prisma.socialLink.count({ where: { section: "SITE" } }),
      prisma.socialLink.count({ where: { section: "CONTACT" } }),
      prisma.navLink.count(),
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

    if (navLinkCount === 0) {
      await prisma.navLink.createMany({ data: SAMPLE_NAV_LINKS })
    }

    if (projectCount > 0) {
      await prisma.project.deleteMany({
        where: { slug: { in: LEGACY_PROJECT_SLUGS } },
      })
    }

    const seededProjects = await prisma.project.findMany({
      where: { slug: { in: SAMPLE_PROJECTS.map((project) => project.slug) } },
      select: { slug: true },
    })
    const seededProjectSlugs = new Set(
      seededProjects.map((project) => project.slug)
    )
    const missingProjects = SAMPLE_PROJECTS.filter(
      (project) => !seededProjectSlugs.has(project.slug)
    )

    if (missingProjects.length > 0) {
      await prisma.project.createMany({ data: missingProjects })
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
