import { DashboardClient } from "@/components/tasks/DashboardClient"
import { getTasks } from "@/lib/actions/tasks"
import { getProjectsState } from "@/lib/actions/projects"
import { Task } from "@/lib/types"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { project?: string }
}) {
  const { projects, schemaReady, error } = await getProjectsState()
  const activeProject =
    projects.find((project) => project.id === searchParams?.project) ?? projects[0]
  let tasks: Task[] = []
  let dashboardSchemaReady = schemaReady
  let dashboardSchemaError = error

  if (schemaReady && activeProject) {
    try {
      tasks = await getTasks(activeProject.id)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const missingProjectColumn =
        message.includes("project_id") ||
        message.includes("schema cache") ||
        message.includes("Could not find")

      if (!missingProjectColumn) {
        throw error
      }

      dashboardSchemaReady = false
      dashboardSchemaError =
        "Falta completar la migración supabase/migrations/003_projects.sql en Supabase."
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
