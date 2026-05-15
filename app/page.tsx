import { createServerClient } from "@/lib/supabase/server"
import { hasSupabaseConfig } from "@/lib/supabase/config"
import { redirect } from "next/navigation"

export default async function HomePage() {
  if (!hasSupabaseConfig()) redirect("/login")

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  redirect(user ? "/dashboard" : "/login")
}
