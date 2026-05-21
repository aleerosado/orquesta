import { Sidebar } from "@/components/layout/Sidebar"
import { createServerClient } from "@/lib/supabase/server"
import { hasSupabaseConfig } from "@/lib/supabase/config"
import { getTasks } from "@/lib/actions/tasks"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!hasSupabaseConfig()) redirect("/login")

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  let urgentPending = 0

  try {
    const tasks = await getTasks()
    urgentPending = tasks.filter(
      (task) => task.status !== "listo" && task.tags.includes("urgente")
    ).length
  } catch {
    urgentPending = 0
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <Sidebar email={user.email ?? "Usuario"} urgentCount={urgentPending} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
