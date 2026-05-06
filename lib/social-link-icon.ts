import {
  DiscordIcon,
  Facebook01Icon,
  GithubIcon,
  InstagramIcon,
  Link01Icon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
  Share02Icon,
  SpotifyIcon,
  TiktokIcon,
  TwitchIcon,
  VimeoIcon,
  YoutubeIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import type { SocialLink } from "@/lib/types"

function parseHttpUrl(raw: string): URL | null {
  const trimmed = raw.trim()
  if (!trimmed || trimmed.toLowerCase().startsWith("mailto:")) {
    return null
  }
  try {
    return new URL(trimmed)
  } catch {
    try {
      return new URL(`https://${trimmed}`)
    } catch {
      return null
    }
  }
}

function iconFromPlatformHint(platform: string): IconSvgElement | null {
  const p = platform.toLowerCase()
  if (!p) return null
  if (p.includes("instagram") || /\binsta\b/.test(p)) return InstagramIcon
  if (p.includes("facebook") || /\bfb\b/.test(p)) return Facebook01Icon
  if (p.includes("twitter") || /\bx\b/.test(p)) return NewTwitterIcon
  if (p.includes("linkedin")) return Linkedin01Icon
  if (p.includes("youtube") || p.includes("youtu")) return YoutubeIcon
  if (p.includes("tiktok")) return TiktokIcon
  if (p.includes("github")) return GithubIcon
  if (p.includes("discord")) return DiscordIcon
  if (p.includes("twitch")) return TwitchIcon
  if (p.includes("vimeo")) return VimeoIcon
  if (p.includes("spotify")) return SpotifyIcon
  if (p.includes("threads")) return Share02Icon
  if (p.includes("whatsapp")) return WhatsappIcon
  return null
}

function iconFromHost(host: string): IconSvgElement | null {
  const h = host.replace(/^www\./, "").toLowerCase()

  if (h === "youtu.be") return YoutubeIcon
  if (h === "youtube.com" || h.endsWith(".youtube.com")) return YoutubeIcon

  if (h === "instagram.com" || h.endsWith(".instagram.com")) {
    return InstagramIcon
  }

  if (h === "facebook.com" || h.endsWith(".facebook.com") || h === "fb.com") {
    return Facebook01Icon
  }

  if (
    h === "twitter.com" ||
    h.endsWith(".twitter.com") ||
    h === "x.com" ||
    h === "mobile.x.com"
  ) {
    return NewTwitterIcon
  }

  if (h === "linkedin.com" || h.endsWith(".linkedin.com")) {
    return Linkedin01Icon
  }

  if (h === "tiktok.com" || h.endsWith(".tiktok.com")) return TiktokIcon

  if (h === "github.com" || h.endsWith(".github.com")) return GithubIcon

  if (h === "discord.com" || h.endsWith(".discord.com") || h === "discord.gg") {
    return DiscordIcon
  }

  if (h === "twitch.tv" || h.endsWith(".twitch.tv")) return TwitchIcon

  if (h === "vimeo.com" || h.endsWith(".vimeo.com")) return VimeoIcon

  if (
    h === "spotify.com" ||
    h.endsWith(".spotify.com") ||
    h === "open.spotify.com"
  ) {
    return SpotifyIcon
  }

  if (h === "threads.net" || h.endsWith(".threads.net")) return Share02Icon

  return null
}

/** Picks a Hugeicons glyph from the URL hostname/path and optional CRM `platform` hint. */
export function getSocialLinkIcon(link: SocialLink): IconSvgElement {
  const raw = link.url.trim()
  const lower = raw.toLowerCase()
  if (lower.startsWith("mailto:")) {
    return Mail01Icon
  }

  const parsed = parseHttpUrl(raw)
  if (parsed) {
    const fromHost = iconFromHost(parsed.hostname)
    if (fromHost) return fromHost
  }

  const fromHint = iconFromPlatformHint(link.platform)
  if (fromHint) return fromHint

  return Link01Icon
}
