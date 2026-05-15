"use client"

import { CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PHASE_COLORS, PHASE_LABELS, TAG_COLORS, TAG_LABELS, Task } from "@/lib/types"

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border bg-card p-3 text-left shadow-sm transition hover:border-foreground/30 hover:bg-muted/30"
    >
      <p className="text-sm font-medium leading-5">{task.title}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: PHASE_COLORS[task.phase] ?? "#888780" }}
        />
        {task.phase} · {PHASE_LABELS[task.phase] ?? task.phase}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {task.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            style={{ backgroundColor: TAG_COLORS[tag].bg, color: TAG_COLORS[tag].text }}
          >
            {TAG_LABELS[tag]}
          </Badge>
        ))}
      </div>
      {task.due_date && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {task.due_date}
        </div>
      )}
    </button>
  )
}
