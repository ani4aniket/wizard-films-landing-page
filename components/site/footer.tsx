import Link from "next/link"

import type { SiteSettings, SocialLink } from "@/lib/types"

function SocialList({ socialLinks }: { socialLinks: SocialLink[] }) {
  if (!socialLinks.length) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-3">
      {socialLinks.map((item) => (
        <Link
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            {settings.siteName}
          </p>
          <p className="mt-4 max-w-xl text-3xl leading-tight text-foreground md:text-4xl">
            Music videos shaped through direction, editing, and rhythm-led
            storytelling.
          </p>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            {settings.footerBlurb ||
              "Wizard Films crafts cinematic visuals through music video direction, shoot execution, editing, and sound-aware pacing."}
          </p>
        </div>
        <div>
          <p className="text-base font-medium text-foreground">Browse</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <Link href="/" className="block hover:text-foreground">
              Home
            </Link>
            <Link href="/work" className="block hover:text-foreground">
              Work
            </Link>
            <Link href="/services" className="block hover:text-foreground">
              Services
            </Link>
            <Link href="/about" className="block hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="block hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-base font-medium text-foreground">Contact</p>
          {settings.contactEmail ? (
            <Link
              href={`mailto:${settings.contactEmail}`}
              className="block text-sm text-foreground transition-colors hover:text-muted-foreground"
            >
              {settings.contactEmail}
            </Link>
          ) : null}
          <SocialList socialLinks={settings.socialLinks} />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-4 text-[11px] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            © {new Date().getFullYear()} {settings.siteName}
          </p>
        </div>
      </div>
    </footer>
  )
}
