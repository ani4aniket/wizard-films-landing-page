"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"

import { VideoCard } from "@/components/site/video-card"
import type { PortfolioProject } from "@/lib/types"
import { cn } from "@/lib/utils"

const ALL_CATEGORY = "All"

export function ProjectGallery({ projects }: { projects: PortfolioProject[] }) {
  const categories = useMemo(
    () => [ALL_CATEGORY, ...new Set(projects.map((project) => project.category))],
    [projects],
  )
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY)

  const filteredProjects = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) {
      return projects
    }

    return projects.filter((project) => project.category === activeCategory)
  }, [activeCategory, projects])

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
                "rounded-full border px-4 py-2 text-xs tracking-[0.28em] uppercase transition-all",
                isActive
                  ? "border-primary/60 bg-primary text-primary-foreground"
                  : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {category}
            </button>
          )
        })}
      </div>
      <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className={cn(index % 3 === 1 ? "xl:translate-y-12" : "")}
            >
              <VideoCard project={project} priority={index < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
