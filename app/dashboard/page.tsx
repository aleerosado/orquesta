import { DashboardClient } from "@/components/tasks/DashboardClient"
import { getTasks } from "@/lib/actions/tasks"
import { getProjects } from "@/lib/actions/projects"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { project?: string }
}) {
  const projects = await getProjects()
  const activeProject =
    projects.find((project) => project.id === searchParams?.project) ?? projects[0]
  const tasks = activeProject ? await getTasks(activeProject.id) : []

  return (
    <DashboardClient
      initialTasks={tasks}
      initialProjects={projects}
      initialProjectId={activeProject?.id ?? ""}
    />
  )
}
