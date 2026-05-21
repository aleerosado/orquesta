"use client"

import { useEffect } from "react"
import { Button, buttonVariants } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="text-xl font-semibold">No se pudo cargar el dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La sesión existe, por eso la app entra a `/dashboard`, pero ocurrió un error cargando los
          datos del proyecto. Si acabas de activar multi-proyecto, revisa que la migración
          `003_projects.sql` esté aplicada en Supabase.
        </p>
        {error.digest && (
          <p className="mt-4 rounded-md bg-muted px-3 py-2 font-mono text-xs">
            Digest: {error.digest}
          </p>
        )}
        <div className="mt-5 flex gap-2">
          <Button onClick={reset}>Reintentar</Button>
          <a className={buttonVariants({ variant: "outline" })} href="/logout">
            Cerrar sesión
          </a>
        </div>
      </div>
    </main>
  )
}
