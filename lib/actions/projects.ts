"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { Project, ProjectFormData } from "@/lib/types"

const DEFAULT_PROJECT = {
  name: "Tesis y concursos",
  description: "Investigación, paper, tesis, concursos y startup de salud.",
  color: "#7C3AED",
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order_index")
    .order("created_at")

  if (error) throw error
  if (data?.length) return data

  const created = await createProject(DEFAULT_PROJECT)
  return [created]
}

export async function createProject(form: ProjectFormData): Promise<Project> {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const name = form.name.trim()
  if (!name) throw new Error("El nombre del proyecto es requerido")

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      description: form.description?.trim() || null,
      color: form.color ?? "#7C3AED",
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath("/dashboard")
  return data
}
