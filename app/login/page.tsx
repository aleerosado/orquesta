import { LoginForm } from "@/components/auth/LoginForm"
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-foreground text-lg font-semibold text-background">
            O
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Orquesta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gestiona tu tesis, producto y startup desde un tablero privado.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
