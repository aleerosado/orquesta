export type TaskStatus = "pendiente" | "en progreso" | "listo"
export type TaskTag = "urgente" | "tecnico" | "paper" | "negocio" | "concurso"

export interface Task {
  id: string
  user_id: string
  title: string
  notes?: string
  phase: string
  status: TaskStatus
  tags: TaskTag[]
  due_date?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface TaskFormData {
  title: string
  notes?: string
  phase: string
  status: TaskStatus
  tags: TaskTag[]
  due_date?: string
}

export const PHASES = [
  "Fase 0", "Fase 1", "Fase 2", "Fase 3",
  "Fase 4", "Fase 5", "Fase 6", "Concursos", "Fase 7"
] as const

export const PHASE_LABELS: Record<string, string> = {
  "Fase 0": "Preparación",
  "Fase 1": "Estado del arte",
  "Fase 2": "Datos",
  "Fase 3": "Modelo IA",
  "Fase 4": "Producto",
  "Fase 5": "Validación clínica",
  "Fase 6": "Paper y tesis",
  Concursos: "Concursos",
  "Fase 7": "Startup",
}

export const PHASE_COLORS: Record<string, string> = {
  "Fase 0": "#1D9E75",
  "Fase 1": "#378ADD",
  "Fase 2": "#BA7517",
  "Fase 3": "#534AB7",
  "Fase 4": "#D85A30",
  "Fase 5": "#0F6E56",
  "Fase 6": "#639922",
  Concursos: "#993556",
  "Fase 7": "#888780",
}

export const TAG_LABELS: Record<TaskTag, string> = {
  urgente: "Urgente",
  tecnico: "Técnico",
  paper: "Paper",
  negocio: "Negocio",
  concurso: "Concurso",
}

export const TAG_COLORS: Record<TaskTag, { bg: string; text: string }> = {
  urgente: { bg: "#FCEBEB", text: "#A32D2D" },
  tecnico: { bg: "#E6F1FB", text: "#0C447C" },
  paper: { bg: "#EAF3DE", text: "#27500A" },
  negocio: { bg: "#FAEEDA", text: "#633806" },
  concurso: { bg: "#EEEDFE", text: "#3C3489" },
}

export const STATUSES: TaskStatus[] = ["pendiente", "en progreso", "listo"]

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  "en progreso": "En progreso",
  listo: "Listo",
}
