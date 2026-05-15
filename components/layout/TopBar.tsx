import { CheckCircle2, Circle, Flame, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Task } from "@/lib/types"

export function TopBar({ tasks }: { tasks: Task[] }) {
  const total = tasks.length
  const done = tasks.filter((task) => task.status === "listo").length
  const urgent = tasks.filter(
    (task) => task.status !== "listo" && task.tags.includes("urgente")
  ).length
  const progress = total ? Math.round((done / total) * 100) : 0

  const stats = [
    { label: "Total", value: total, icon: Circle },
    { label: "Completadas", value: done, icon: CheckCircle2 },
    { label: "Progreso", value: `${progress}%`, icon: TrendingUp },
    { label: "Urgentes", value: urgent, icon: Flame },
  ]

  return (
    <header className="border-b bg-background/95 px-4 py-4 lg:px-8">
      <div className="mb-4 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Prioridades de tesis, producto, validación clínica y concursos.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-3">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <stat.icon className="size-4" />
              {stat.label}
            </div>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="w-12 text-right text-sm font-medium">{progress}%</span>
      </div>
    </header>
  )
}
