import Link from "next/link"

import type { SiteSettings, SocialLink } from "@/lib/types"

function SocialList({ socialLinks }: { socialLinks: SocialLink[] }) {
  if (!socialLinks.length) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-4">
      {socialLinks.map((item) => (
        <Link
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs tracking-[0.28em] text-muted-foreground uppercase transition-colors hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-border/70 bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.5fr_1fr] md:px-10">
        <div>
          <p className="font-heading text-3xl text-foreground">{settings.siteName}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            {settings.footerBlurb ||
              "Cinematic editing, color, sound, and production work shaped for brands, artists, and stories that need atmosphere."}
          </p>
        </div>
        <div className="space-y-4 md:justify-self-end">
          {settings.contactEmail ? (
            <Link
              href={`mailto:${settings.contactEmail}`}
              className="block text-sm text-foreground transition-colors hover:text-primary"
            >
              {settings.contactEmail}
            </Link>
          ) : null}
          <SocialList socialLinks={settings.socialLinks} />
        </div>
      </div>
    </footer>
  )
}
