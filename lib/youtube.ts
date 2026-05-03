function normalizeUrl(url: string) {
  return url.trim()
}

export function getYouTubeVideoId(url: string) {
  const normalizedUrl = normalizeUrl(url)

  if (!normalizedUrl) {
    return null
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(normalizedUrl)) {
    return normalizedUrl
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = normalizedUrl.match(pattern)

    if (match?.[1]) {
      return match[1]
    }
  }

  try {
    const parsedUrl = new URL(normalizedUrl)
    return parsedUrl.searchParams.get("v")
  } catch {
    return null
  }
}

export function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
}

export function getYouTubeThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
