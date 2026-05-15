"use client"

import { STATUS_LABELS, STATUSES, Task, TaskStatus } from "@/lib/types"
import { TaskCard } from "@/components/tasks/TaskCard"

export function KanbanBoard({
  tasks,
  onEdit,
}: {
  tasks: Task[]
  onEdit: (task: Task) => void
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {STATUSES.map((status: TaskStatus) => {
        const columnTasks = tasks.filter((task) => task.status === status)
        return (
          <section key={status} className="min-h-96 rounded-lg border bg-muted/25">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="font-medium">{STATUS_LABELS[status]}</h2>
              <span className="rounded-full bg-background px-2 py-1 text-xs text-muted-foreground">
                {columnTasks.length}
              </span>
            </div>
            <div className="space-y-3 p-3">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => onEdit(task)} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
