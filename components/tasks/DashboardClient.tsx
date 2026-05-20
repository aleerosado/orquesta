"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { FolderKanban, LayoutGrid, List, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TopBar } from "@/components/layout/TopBar"
import { KanbanBoard } from "@/components/tasks/KanbanBoard"
import { TaskFilters, TaskFilterState } from "@/components/tasks/TaskFilters"
import { TaskList } from "@/components/tasks/TaskList"
import { TaskModal } from "@/components/tasks/TaskModal"
import { createTask, deleteTask, updateTask, updateTaskStatus } from "@/lib/actions/tasks"
import { createProject } from "@/lib/actions/projects"
import { Project, Task, TaskFormData, TaskStatus } from "@/lib/types"

type ViewMode = "kanban" | "list"

export function DashboardClient({
  initialTasks,
  initialProjects,
  initialProjectId,
}: {
  initialTasks: Task[]
  initialProjects: Project[]
  initialProjectId: string
}) {
  const [tasks, setTasks] = useState(initialTasks)
  const [projects, setProjects] = useState(initialProjects)
  const [activeProjectId, setActiveProjectId] = useState(initialProjectId)
  const [newProjectName, setNewProjectName] = useState("")
  const [view, setView] = useState<ViewMode>("kanban")
  const [filters, setFilters] = useState<TaskFilterState>({ query: "", phase: "all", tag: "all" })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [, startTransition] = useTransition()
  const router = useRouter()
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0]

  useEffect(() => {
    const stored = window.localStorage.getItem("orquesta:view")
    if (stored === "kanban" || stored === "list") setView(stored)
  }, [])

  useEffect(() => {
    setTasks(initialTasks)
    setProjects(initialProjects)
    setActiveProjectId(initialProjectId)
  }, [initialProjectId, initialProjects, initialTasks])

  function changeView(nextView: ViewMode) {
    setView(nextView)
    window.localStorage.setItem("orquesta:view", nextView)
  }

  function changeProject(projectId: string) {
    setActiveProjectId(projectId)
    setTasks([])
    router.push(`/dashboard?project=${projectId}`)
  }

  function submitProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = newProjectName.trim()
    if (!name) return

    startTransition(async () => {
      try {
        const created = await createProject({ name })
        setProjects((current) => [...current, created])
        setNewProjectName("")
        toast.success("Proyecto creado")
        changeProject(created.id)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "No se pudo crear el proyecto")
      }
    })
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

    if (!activeProject) throw new Error("Selecciona un proyecto")

    const created = await createTask(form, activeProject.id)
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
      <TopBar tasks={tasks} project={activeProject} />
      <main className="space-y-4 px-4 py-4 lg:px-8">
        <section className="grid gap-3 rounded-lg border bg-card p-3 lg:grid-cols-[minmax(240px,340px)_1fr] lg:items-end">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FolderKanban className="size-4 text-muted-foreground" />
              Proyecto activo
            </label>
            <select
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={activeProject?.id ?? ""}
              onChange={(event) => changeProject(event.target.value)}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <form className="flex gap-2" onSubmit={submitProject}>
            <Input
              value={newProjectName}
              onChange={(event) => setNewProjectName(event.target.value)}
              placeholder="Nuevo proyecto: agenda personal, producto, investigación..."
            />
            <Button type="submit" className="shrink-0">
              <Plus className="size-4" />
              Crear proyecto
            </Button>
          </form>
        </section>

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

        {activeProject ? (
          <>
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
          </>
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Crea un proyecto para empezar a organizar tus tareas.
          </div>
        )}
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
