import { DashboardClient } from "@/components/tasks/DashboardClient"
import { getTasks } from "@/lib/actions/tasks"
import { getProjectsState } from "@/lib/actions/projects"
import { Project, Task } from "@/lib/types"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { project?: string }
}) {
  let projects: Project[] = []
  let schemaReady = true
  let schemaError: string | undefined

  try {
    const state = await getProjectsState()
    projects = state.projects
    schemaReady = state.schemaReady
    schemaError = state.error
  } catch (error) {
    schemaReady = false
    schemaError =
      error instanceof Error
        ? error.message
        : "No se pudo cargar la configuración de proyectos."
  }

  const activeProject =
    projects.find((project) => project.id === searchParams?.project) ?? projects[0]
  let tasks: Task[] = []
  let dashboardSchemaReady = schemaReady
  let dashboardSchemaError = schemaError

  if (schemaReady && activeProject) {
    try {
      tasks = await getTasks(activeProject.id)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const missingProjectColumn =
        message.includes("project_id") ||
        message.includes("schema cache") ||
        message.includes("Could not find")

      dashboardSchemaReady = false
      dashboardSchemaError =
        missingProjectColumn
          ? "Falta completar la migración supabase/migrations/003_projects.sql en Supabase."
          : message
    }
  }

  return (
    <DashboardClient
      initialTasks={tasks}
      initialProjects={projects}
      initialProjectId={activeProject?.id ?? ""}
      projectsSchemaReady={dashboardSchemaReady}
      projectsSchemaError={dashboardSchemaError}
    />
  )
}
