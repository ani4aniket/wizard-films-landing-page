"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"

import { VideoCard } from "@/components/site/video-card"
import type { PortfolioProject } from "@/lib/types"
import { cn } from "@/lib/utils"

const ALL_CATEGORY = "All"

export function ProjectGallery({
  projects,
  initialQuery = "",
}: {
  projects: PortfolioProject[]
  initialQuery?: string
}) {
  const categories = useMemo(
    () => [
      ALL_CATEGORY,
      ...new Set(projects.map((project) => project.category)),
    ],
    [projects]
  )
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY)
  const normalizedInitialQuery = initialQuery.trim().toLowerCase()

  const filteredProjects = useMemo(() => {
    const categoryFiltered =
      activeCategory === ALL_CATEGORY
        ? projects
        : projects.filter((project) => project.category === activeCategory)

    if (!normalizedInitialQuery) {
      return categoryFiltered
    }

    return categoryFiltered.filter((project) => {
      const searchableText = [
        project.title,
        project.description,
        project.category,
        project.role ?? "",
        project.credits ?? "",
      ]
        .join(" ")
        .toLowerCase()

      return searchableText.includes(normalizedInitialQuery)
    })
  }, [activeCategory, normalizedInitialQuery, projects])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = category === activeCategory

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "pill-feedback rounded-full border px-4 py-2 text-sm transition-all",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-secondary"
              )}
            >
              {category}
            </button>
          )
        })}
      </div>
      <motion.div
        layout
        className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
            >
              <VideoCard project={project} priority={index < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {!filteredProjects.length && normalizedInitialQuery ? (
        <p className="text-sm text-muted-foreground">
          No projects found for &quot;{initialQuery}&quot;.
        </p>
      ) : null}
    </div>
  )
}
