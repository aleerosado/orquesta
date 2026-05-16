import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LineChart,
  PanelLeft,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react"
import type { ComponentType } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: LayoutDashboard,
    title: "Tableros Kanban intuitivos",
    description: "Visualiza tu trabajo y avanza sin perder el foco.",
  },
  {
    icon: ClipboardList,
    title: "Tesis y startup, en orden",
    description: "Estructura tu investigación, hipótesis y entregables.",
  },
  {
    icon: Users,
    title: "Colaboración en equipo",
    description: "Asigna tareas, comenta y comparte archivos.",
  },
  {
    icon: LineChart,
    title: "Seguimiento y métricas",
    description: "Monitorea tu progreso y toma mejores decisiones.",
  },
]

const stats = [
  "120+ Tesis organizadas",
  "85+ Startups impulsadas",
  "300+ Equipos activos",
  "25k+ Tareas completadas",
]

export function AuthPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F7FF] text-[#111827]">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_9%,rgba(196,181,253,0.58)_0,transparent_31%),radial-gradient(circle_at_56%_22%,rgba(255,255,255,0.88)_0,transparent_32%),radial-gradient(circle_at_86%_14%,rgba(219,234,254,0.62)_0,transparent_34%),linear-gradient(135deg,#F5F3FF_0%,#FFFFFF_48%,#EEF2FF_100%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-white/55 blur-3xl" />

        <div className="relative mx-auto grid min-h-screen w-full max-w-[1880px] items-center gap-x-14 gap-y-10 px-5 py-10 sm:px-8 lg:px-14 xl:grid-cols-[minmax(0,1120px)_500px] xl:px-[70px] 2xl:gap-x-20">
          <div className="min-w-0">
            <div className="grid items-center gap-x-12 gap-y-8 xl:grid-cols-[480px_620px]">
              <HeroCopy />
              <div className="hidden min-w-0 lg:block">
                <KanbanPreview />
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat} label={stat} />
              ))}
            </div>
          </div>
          <section className="flex justify-center">
            <div className="w-full max-w-[500px]">
              <LoginForm />
              <div className="mt-8 text-center text-lg leading-8 text-[#4B5563]">
                <p className="font-semibold text-[#111827]">Tu información está protegida.</p>
                <p className="mt-2">Hecho con ❤️ para investigadores y emprendedores de salud.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function HeroCopy() {
  return (
    <section className="min-w-0 xl:self-center">
      <div className="mb-7 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[#111827] text-base font-semibold text-white shadow-lg shadow-violet-900/15">
          O
        </div>
        <p className="text-base font-semibold tracking-tight">Orquesta</p>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-3.5 py-2 text-sm font-medium text-[#6D28D9] shadow-sm backdrop-blur">
        <Sparkles className="size-4" />
        Tu espacio privado de productividad
      </div>

      <h1 className="mt-7 max-w-[500px] text-[50px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#111827] sm:text-[58px]">
        Gestiona tu tesis y tu startup de salud con{" "}
        <span className="text-[#7C3AED]">claridad.</span>
      </h1>
      <p className="mt-6 max-w-[470px] text-lg leading-8 text-[#4B5563]">
        Organiza tareas, investigaciones y entregables en un solo lugar. Colabora con tu equipo y
        avanza hacia tus objetivos.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {features.map((feature) => (
          <FeatureItem key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  )
}

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="min-h-[150px] rounded-2xl border border-white/75 bg-white/75 p-5 shadow-sm shadow-violet-900/5 backdrop-blur">
      <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#6D28D9]">
        <Icon className="size-5" />
      </div>
      <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
      <p className="mt-2 text-base leading-7 text-[#4B5563]">{description}</p>
    </div>
  )
}

function StatCard({ label }: { label: string }) {
  const [value, ...rest] = label.split(" ")

  return (
    <div className="rounded-2xl border border-white/75 bg-white/75 px-5 py-4 shadow-sm shadow-violet-900/5 backdrop-blur">
      <p className="text-2xl font-semibold leading-none text-[#6D28D9]">{value}</p>
      <p className="mt-1 text-base text-[#4B5563]">{rest.join(" ")}</p>
    </div>
  )
}

function KanbanPreview() {
  const navItems = [
    { label: "Resumen", icon: PanelLeft },
    { label: "Tablero", icon: LayoutDashboard, active: true },
    { label: "Tareas", icon: CheckCircle2 },
    { label: "Investigación", icon: Search },
    { label: "Documentos", icon: FileText },
    { label: "Equipo", icon: Users },
    { label: "Calendario", icon: CalendarDays },
    { label: "Analíticas", icon: BarChart3 },
    { label: "Ajustes", icon: Settings },
  ]

  const columns = [
    {
      title: "Por hacer",
      cards: [
        ["Revisión de literatura sobre IA en salud", "Tesis"],
        ["Definir hipótesis y objetivos", "Investigación"],
        ["Benchmark de startups en LATAM", "Startup"],
      ],
    },
    {
      title: "En progreso",
      cards: [
        ["Diseño metodológico de la investigación", "Tesis"],
        ["Desarrollo del MVP versión 0.1", "Startup"],
        ["Encuestas a usuarios piloto", "Investigación"],
      ],
    },
    {
      title: "En revisión",
      cards: [
        ["Marco teórico completo", "Tesis"],
        ["Propuesta de valor y validación", "Startup"],
        ["Presentación de avances #1", "Investigación"],
      ],
    },
  ]

  return (
    <div className="rounded-[1.9rem] border border-white/80 bg-white/75 p-3 shadow-2xl shadow-violet-950/10 backdrop-blur">
      <div className="grid h-[580px] overflow-hidden rounded-[1.45rem] border border-violet-100 bg-[#F8FAFC] lg:grid-cols-[170px_1fr]">
        <aside className="border-r border-violet-100 bg-white/90 p-4">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#111827] text-sm font-semibold text-white">
              O
            </div>
            <span className="text-sm font-semibold">Orquesta</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-[#6B7280]",
                  item.active && "bg-[#F5F3FF] text-[#6D28D9]"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </div>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Tablero de proyecto</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Maestría en Salud Pública + Startup</p>
            </div>
            <div className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#6D28D9]">
              72% avance
            </div>
          </div>

          <div className="grid h-[450px] gap-3 xl:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="rounded-2xl border border-violet-100 bg-white/80 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{column.title}</h3>
                  <span className="rounded-full bg-[#F5F3FF] px-2 py-0.5 text-xs text-[#7C3AED]">
                    {column.cards.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {column.cards.map(([title, tag]) => (
                    <div
                      key={title}
                      className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm shadow-violet-950/5"
                    >
                      <p className="text-sm font-medium leading-5 text-[#111827]">{title}</p>
                      <div className="mt-3">
                        <span className="rounded-full bg-[#EEF2FF] px-2 py-1 text-[11px] font-medium text-[#6D28D9]">
                          {tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
