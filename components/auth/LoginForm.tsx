"use client"

import { useState, useTransition } from "react"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  function redirectTo() {
    return `${window.location.origin}/api/auth/callback`
  }

  function signInWithGoogle() {
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectTo() },
      })
      if (error) toast.error(error.message)
    })
  }

  function signInWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo() },
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Revisa tu correo para entrar a Orquesta.")
    })
  }

  return (
    <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
      <Button className="w-full" onClick={signInWithGoogle} disabled={isPending}>
        Continuar con Google
      </Button>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" />
        <span>Email sin contraseña</span>
        <Separator className="flex-1" />
      </div>
      <form className="space-y-3" onSubmit={signInWithEmail}>
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <Button className="w-full" type="submit" variant="outline" disabled={isPending}>
          <Mail className="size-4" />
          Enviar magic link
        </Button>
      </form>
    </div>
  )
}
