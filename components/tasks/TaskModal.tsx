"use client"

import { useEffect, useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  PHASES,
  STATUS_LABELS,
  STATUSES,
  TAG_COLORS,
  TAG_LABELS,
  Task,
  TaskFormData,
  TaskTag,
} from "@/lib/types"

const TAGS = Object.keys(TAG_LABELS) as TaskTag[]

const emptyForm: TaskFormData = {
  title: "",
  notes: "",
  phase: "Fase 0",
  status: "pendiente",
  tags: [],
  due_date: "",
}

export function TaskModal({
  open,
  task,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean
  task: Task | null
  onOpenChange: (open: boolean) => void
  onSave: (form: TaskFormData, task?: Task) => Promise<void>
  onDelete: (task: Task) => Promise<void>
}) {
  const [form, setForm] = useState<TaskFormData>(emptyForm)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    setForm(
      task
        ? {
            title: task.title,
            notes: task.notes ?? "",
            phase: task.phase,
            status: task.status,
            tags: task.tags,
            due_date: task.due_date ?? "",
          }
        : emptyForm
    )
  }, [open, task])

  function toggleTag(tag: TaskTag) {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }))
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    startTransition(async () => {
      try {
        await onSave(
          {
            ...form,
            title: form.title.trim(),
            notes: form.notes?.trim() || undefined,
            due_date: form.due_date || undefined,
          },
          task ?? undefined
        )
        onOpenChange(false)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "No se pudo guardar")
      }
    })
  }

  function removeTask() {
    if (!task || !window.confirm("¿Eliminar esta tarea?")) return
    startTransition(async () => {
      try {
        await onDelete(task)
        onOpenChange(false)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "No se pudo eliminar")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
          <DialogDescription>
            Define fase, estado, etiquetas y fecha límite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              rows={4}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phase">Fase</Label>
              <select
                id="phase"
                className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                value={form.phase}
                onChange={(event) => setForm({ ...form, phase: event.target.value })}
              >
                {PHASES.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value as TaskFormData["status"] })
                }
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Etiquetas</Label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <label
                  key={tag}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                  style={{
                    backgroundColor: form.tags.includes(tag) ? TAG_COLORS[tag].bg : undefined,
                    color: form.tags.includes(tag) ? TAG_COLORS[tag].text : undefined,
                  }}
                >
                  <Checkbox checked={form.tags.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                  {TAG_LABELS[tag]}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due-date">Fecha límite</Label>
            <Input
              id="due-date"
              type="date"
              value={form.due_date}
              onChange={(event) => setForm({ ...form, due_date: event.target.value })}
            />
          </div>
          <DialogFooter className="gap-2">
            {task && (
              <Button type="button" variant="destructive" onClick={removeTask} disabled={isPending}>
                <Trash2 className="size-4" />
                Eliminar
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
