import { HugeiconsIcon } from "@hugeicons/react"

import { getSocialLinkIcon } from "@/lib/social-link-icon"
import type { SocialLink } from "@/lib/types"
import { cn } from "@/lib/utils"

export function SocialGlyph({
  link,
  className,
}: {
  link: SocialLink
  className?: string
}) {
  return (
    <HugeiconsIcon
      icon={getSocialLinkIcon(link)}
      strokeWidth={2}
      className={cn("size-4 shrink-0", className)}
      aria-hidden
    />
  )
}
