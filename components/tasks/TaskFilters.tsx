"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PHASES, TAG_LABELS, TaskTag } from "@/lib/types"

export interface TaskFilterState {
  query: string
  phase: string
  tag: string
}

export function TaskFilters({
  filters,
  onFiltersChange,
}: {
  filters: TaskFilterState
  onFiltersChange: (filters: TaskFilterState) => void
}) {
  return (
    <div className="grid gap-2 lg:grid-cols-[1fr_180px_180px]">
      <label className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar tarea"
          value={filters.query}
          onChange={(event) => onFiltersChange({ ...filters, query: event.target.value })}
        />
      </label>
      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        value={filters.phase}
        onChange={(event) => onFiltersChange({ ...filters, phase: event.target.value })}
      >
        <option value="all">Todas las fases</option>
        {PHASES.map((phase) => (
          <option key={phase} value={phase}>
            {phase}
          </option>
        ))}
      </select>
      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        value={filters.tag}
        onChange={(event) => onFiltersChange({ ...filters, tag: event.target.value })}
      >
        <option value="all">Todas las etiquetas</option>
        {(Object.keys(TAG_LABELS) as TaskTag[]).map((tag) => (
          <option key={tag} value={tag}>
            {TAG_LABELS[tag]}
          </option>
        ))}
      </select>
    </div>
  )
}
