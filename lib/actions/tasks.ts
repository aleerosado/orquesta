"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Task, TaskFormData } from "@/lib/types"

export async function getTasks(projectId?: string): Promise<Task[]> {
  const supabase = createServerClient()
  let query = supabase
    .from("tasks")
    .select("*")
    .order("phase")
    .order("order_index")

  if (projectId) {
    query = query.eq("project_id", projectId)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createTask(form: TaskFormData, projectId: string): Promise<Task> {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...form, project_id: projectId, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  revalidatePath("/dashboard")
  return data
}

export async function updateTask(id: string, form: Partial<TaskFormData>): Promise<Task> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("tasks")
    .update(form)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  revalidatePath("/dashboard")
  return data
}

export async function deleteTask(id: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase.from("tasks").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/dashboard")
}

export async function updateTaskStatus(id: string, status: Task["status"]): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
  if (error) throw error
  revalidatePath("/dashboard")
}
