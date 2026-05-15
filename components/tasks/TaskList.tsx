"use client"

import { Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  PHASE_COLORS,
  PHASE_LABELS,
  PHASES,
  TAG_COLORS,
  TAG_LABELS,
  Task,
  TaskStatus,
} from "@/lib/types"

const statusCycle: TaskStatus[] = ["pendiente", "en progreso", "listo"]

export function TaskList({
  tasks,
  onEdit,
  onStatusChange,
}: {
  tasks: Task[]
  onEdit: (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
}) {
  return (
    <div className="space-y-4">
      {PHASES.map((phase) => {
        const phaseTasks = tasks.filter((task) => task.phase === phase)
        if (!phaseTasks.length) return null
        return (
          <section key={phase} className="overflow-hidden rounded-lg border bg-card">
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: PHASE_COLORS[phase] }}
              />
              <h2 className="font-medium">
                {phase} · {PHASE_LABELS[phase]}
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">{phaseTasks.length}</span>
            </div>
            <div className="divide-y">
              {phaseTasks.map((task) => {
                const nextStatus =
                  statusCycle[(statusCycle.indexOf(task.status) + 1) % statusCycle.length]
                return (
                  <div key={task.id} className="grid gap-3 px-4 py-3 md:grid-cols-[1fr_auto]">
                    <div className="flex min-w-0 gap-3">
                      <Checkbox
                        checked={task.status === "listo"}
                        onCheckedChange={() => onStatusChange(task, nextStatus)}
                        aria-label={`Cambiar estado de ${task.title}`}
                      />
                      <div className="min-w-0">
                        <p className="font-medium leading-5">{task.title}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {task.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              style={{
                                backgroundColor: TAG_COLORS[tag].bg,
                                color: TAG_COLORS[tag].text,
                              }}
                            >
                              {TAG_LABELS[tag]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                      <Edit3 className="size-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
