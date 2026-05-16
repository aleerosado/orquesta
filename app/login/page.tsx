import { AuthPage } from "@/components/auth/AuthPage"
import { createServerClient } from "@/lib/supabase/server"
import { hasSupabaseConfig } from "@/lib/supabase/config"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  if (hasSupabaseConfig()) {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) redirect("/dashboard")
  }

  return <AuthPage />
}
