import { Reveal } from "@/components/site/reveal"
import type { ServiceItem } from "@/lib/types"
import { cn } from "@/lib/utils"

function ServiceIcon({ name }: { name: string }) {
  const iconName = name.toLowerCase()

  if (iconName.includes("color")) {
    return (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3c4.97 0 9 3.582 9 8 0 4.1-3.467 7-7.2 7H12a3 3 0 0 1 0-6h1a2 2 0 0 0 0-4 5 5 0 0 0-5 5c0 4.418 3.582 8 8 8" />
        <circle cx="7.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="10.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (iconName.includes("audio") || iconName.includes("sound")) {
    return (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 13h2m4-4v8m4-12v16m4-10v4m4-8v12" strokeLinecap="round" />
      </svg>
    )
  }

  if (iconName.includes("shoot") || iconName.includes("production")) {
    return (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 9h11a3 3 0 0 1 3 3v3H7a3 3 0 0 1-3-3V9Z" />
        <path d="m18 11 3-2v6l-3-2" />
        <path d="M8 9 6 5m7 4 2-4" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
      <path d="M9 3h6l1 4H8l1-4Z" />
      <path d="M10 11h4m-4 4h4" strokeLinecap="round" />
    </svg>
  )
}

export function ServiceGrid({
  services,
  compact = false,
}: {
  services: ServiceItem[]
  compact?: boolean
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {services.map((service, index) => (
        <Reveal key={service.id} delay={index * 0.08}>
          <article className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/65 p-6 backdrop-blur">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex size-12 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-primary">
                  <ServiceIcon name={service.icon || service.title} />
                </div>
                <div>
                  <h3 className="font-heading text-3xl text-foreground">{service.title}</h3>
                  <p className={cn("mt-3 max-w-xl text-muted-foreground", compact ? "line-clamp-3" : "leading-7")}>
                    {service.description}
                  </p>
                </div>
              </div>
              <p className="text-[11px] tracking-[0.32em] text-primary uppercase">
                {String(index + 1).padStart(2, "0")}
              </p>
            </div>
            {service.demoClipUrl ? (
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-border/60">
                <video
                  className="aspect-video w-full object-cover"
                  src={service.demoClipUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            ) : null}
          </article>
        </Reveal>
      ))}
    </div>
  )
}
