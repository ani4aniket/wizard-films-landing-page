"use client"

import { UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useMemo, useRef, useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ProjectOrderItem = {
  id: string
  title: string
  category: string
}

const DND_TYPE = "PROJECT_ORDER_ITEM"

function moveItem<T>(items: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items
  }

  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

function OrderRow({
  project,
  index,
  total,
  moveProject,
  onMoveUp,
  onMoveDown,
}: {
  project: ProjectOrderItem
  index: number
  total: number
  moveProject: (fromIndex: number, toIndex: number) => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DND_TYPE,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index]
  )

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DND_TYPE,
      hover: (item: { index: number }, monitor) => {
        if (!ref.current || item.index === index) return
        const hoverBoundingRect = ref.current.getBoundingClientRect()
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        const clientOffset = monitor.getClientOffset()
        if (!clientOffset) return

        const hoverClientY = clientOffset.y - hoverBoundingRect.top
        if (item.index < index && hoverClientY < hoverMiddleY) return
        if (item.index > index && hoverClientY > hoverMiddleY) return

        moveProject(item.index, index)
        item.index = index
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    }),
    [index, moveProject]
  )

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-3 border border-border bg-secondary/40 px-3 py-2 text-sm transition-all duration-200",
        isOver && "border-primary/60 bg-primary/5",
        isDragging && "scale-[0.99] opacity-55 shadow-sm"
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div className="text-muted-foreground" aria-hidden>
          <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={1.8} className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">
            {index + 1}. {project.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">{project.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onMoveUp} disabled={index === 0}>
          Up
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onMoveDown}
          disabled={index === total - 1}
        >
          Down
        </Button>
      </div>
    </div>
  )
}

export function ProjectOrderEditor({
  projects,
  action,
}: {
  projects: ProjectOrderItem[]
  action: (formData: FormData) => Promise<void>
}) {
  const [orderedProjects, setOrderedProjects] = useState(projects)

  const orderedIds = useMemo(
    () => orderedProjects.map((project) => project.id).join(","),
    [orderedProjects]
  )

  const moveProject = useCallback((fromIndex: number, toIndex: number) => {
    setOrderedProjects((current) => {
      return moveItem(current, fromIndex, toIndex)
    })
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <form action={action} className="grid gap-4 border border-border bg-background p-5">
        <input type="hidden" name="orderedIds" value={orderedIds} />
        <div id="project-order" className="space-y-2">
          {orderedProjects.map((project, index) => (
            <OrderRow
              key={project.id}
              project={project}
              index={index}
              total={orderedProjects.length}
              moveProject={moveProject}
              onMoveUp={() =>
                setOrderedProjects((current) => moveItem(current, index, index - 1))
              }
              onMoveDown={() =>
                setOrderedProjects((current) => moveItem(current, index, index + 1))
              }
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Drag using the handle icon to reorder. Then save once to apply this sequence.
          </p>
          <Button type="submit" size="sm">
            Save work order
          </Button>
        </div>
      </form>
    </DndProvider>
  )
}
