"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { LayoutGrid, List, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { TopBar } from "@/components/layout/TopBar"
import { KanbanBoard } from "@/components/tasks/KanbanBoard"
import { TaskFilters, TaskFilterState } from "@/components/tasks/TaskFilters"
import { TaskList } from "@/components/tasks/TaskList"
import { TaskModal } from "@/components/tasks/TaskModal"
import { createTask, deleteTask, updateTask, updateTaskStatus } from "@/lib/actions/tasks"
import { Task, TaskFormData, TaskStatus } from "@/lib/types"

type ViewMode = "kanban" | "list"

export function DashboardClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [view, setView] = useState<ViewMode>("kanban")
  const [filters, setFilters] = useState<TaskFilterState>({ query: "", phase: "all", tag: "all" })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    const stored = window.localStorage.getItem("orquesta:view")
    if (stored === "kanban" || stored === "list") setView(stored)
  }, [])

  function changeView(nextView: ViewMode) {
    setView(nextView)
    window.localStorage.setItem("orquesta:view", nextView)
  }

  const filteredTasks = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesQuery =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.notes ?? "").toLowerCase().includes(query)
      const matchesPhase = filters.phase === "all" || task.phase === filters.phase
      const matchesTag = filters.tag === "all" || task.tags.includes(filters.tag as never)
      return matchesQuery && matchesPhase && matchesTag
    })
  }, [filters, tasks])

  function openCreate() {
    setSelectedTask(null)
    setModalOpen(true)
  }

  function openEdit(task: Task) {
    setSelectedTask(task)
    setModalOpen(true)
  }

  async function saveTask(form: TaskFormData, task?: Task) {
    if (task) {
      const updated = await updateTask(task.id, form)
      setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)))
      toast.success("Tarea actualizada")
      return
    }

    const created = await createTask(form)
    setTasks((current) => [...current, created])
    toast.success("Tarea creada")
  }

  async function removeTask(task: Task) {
    await deleteTask(task.id)
    setTasks((current) => current.filter((item) => item.id !== task.id))
    toast.success("Tarea eliminada")
  }

  function changeStatus(task: Task, status: TaskStatus) {
    const previous = tasks
    setTasks((current) =>
      current.map((item) => (item.id === task.id ? { ...item, status } : item))
    )

    startTransition(async () => {
      try {
        await updateTaskStatus(task.id, status)
      } catch (error) {
        setTasks(previous)
        toast.error(error instanceof Error ? error.message : "No se pudo actualizar")
      }
    })
  }

  return (
    <>
      <TopBar tasks={tasks} />
      <main className="space-y-4 px-4 py-4 lg:px-8">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <TaskFilters filters={filters} onFiltersChange={setFilters} />
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden rounded-lg border p-1 md:flex">
              <Button
                variant={view === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => changeView("kanban")}
              >
                <LayoutGrid className="size-4" />
                Kanban
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => changeView("list")}
              >
                <List className="size-4" />
                Lista
              </Button>
            </div>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Nueva tarea
            </Button>
          </div>
        </div>

        <div className="hidden md:block">
          {view === "kanban" ? (
            <KanbanBoard tasks={filteredTasks} onEdit={openEdit} />
          ) : (
            <TaskList tasks={filteredTasks} onEdit={openEdit} onStatusChange={changeStatus} />
          )}
        </div>
        <div className="md:hidden">
          <TaskList tasks={filteredTasks} onEdit={openEdit} onStatusChange={changeStatus} />
        </div>
      </main>
      <TaskModal
        open={modalOpen}
        task={selectedTask}
        onOpenChange={setModalOpen}
        onSave={saveTask}
        onDelete={removeTask}
      />
    </>
  )
}
