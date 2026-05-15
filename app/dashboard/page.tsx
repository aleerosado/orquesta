import { DashboardClient } from "@/components/tasks/DashboardClient"
import { getTasks } from "@/lib/actions/tasks"

export default async function DashboardPage() {
  const tasks = await getTasks()

  return <DashboardClient initialTasks={tasks} />
}
