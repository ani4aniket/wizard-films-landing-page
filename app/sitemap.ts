import type { MetadataRoute } from "next"

import { getProjects } from "@/lib/crm"
import { getBaseUrl } from "@/lib/metadata"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()
  const staticPages = ["", "/work", "/services", "/about", "/contact"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  )

  const projects = await getProjects().catch(() => [])

  return [
    ...staticPages,
    ...projects.map((project) => ({
      url: `${baseUrl}/work/${project.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]
}
