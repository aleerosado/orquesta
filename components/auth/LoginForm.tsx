"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { hasSupabaseConfig } from "@/lib/supabase/config"

type AuthMode = "login" | "signup"
type FieldErrors = Partial<Record<"email" | "password" | "form", string>>

interface AuthFormState {
  email: string
  password: string
}

const initialState: AuthFormState = {
  email: "",
  password: "",
}

function validateForm(form: AuthFormState): FieldErrors {
  const errors: FieldErrors = {}
  const email = form.email.trim()

  if (!email) {
    errors.email = "El correo es requerido."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresa un correo válido."
  }

  if (!form.password) {
    errors.password = "La contraseña es requerida."
  } else if (form.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres."
  }

  return errors
}

function mapAuthError(message: string, mode: AuthMode): FieldErrors {
  const normalized = message.toLowerCase()

  if (normalized.includes("invalid login") || normalized.includes("invalid credentials")) {
    return { form: "Correo o contraseña incorrectos." }
  }

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return { email: "Este correo ya está registrado. Inicia sesión." }
  }

  if (normalized.includes("password")) {
    return { password: "Revisa la contraseña e intenta nuevamente." }
  }

  if (normalized.includes("email")) {
    return { email: "Revisa el correo e intenta nuevamente." }
  }

  return {
    form:
      mode === "login"
        ? "No se pudo iniciar sesión. Verifica tus credenciales."
        : "No se pudo crear la cuenta. Intenta nuevamente.",
  }
}

export function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [form, setForm] = useState<AuthFormState>(initialState)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  function updateField(field: keyof AuthFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    startTransition(async () => {
      if (!hasSupabaseConfig()) {
        setErrors({
          form: "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local.",
        })
        return
      }

      const email = form.email.trim()
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password: form.password })
          : await supabase.auth.signUp({ email, password: form.password })

      if (result.error) {
        setErrors(mapAuthError(result.error.message, mode))
        return
      }

      if (mode === "signup" && result.data.user?.identities?.length === 0) {
        setErrors({ email: "Este correo ya está registrado. Inicia sesión." })
        return
      }

      if (mode === "signup" && !result.data.session) {
        toast.success("Cuenta creada. Revisa tu correo para confirmar la cuenta.")
        setMode("login")
        setForm({ email, password: "" })
        return
      }

      toast.success(mode === "login" ? "Sesión iniciada" : "Cuenta creada")
      router.replace("/dashboard")
      router.refresh()
    })
  }

  function switchMode(nextMode: string) {
    setMode(nextMode as AuthMode)
    setErrors({})
    setForm(initialState)
  }

  return (
    <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
      <Tabs value={mode} onValueChange={switchMode}>
        <TabsList className="mb-5 grid w-full grid-cols-2">
          <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
          <TabsTrigger value="signup">Registrarse</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <AuthFields
            form={form}
            errors={errors}
            isPending={isPending}
            showPassword={showPassword}
            submitLabel="Entrar"
            onSubmit={submit}
            onFieldChange={updateField}
            onTogglePassword={() => setShowPassword((value) => !value)}
          />
        </TabsContent>
        <TabsContent value="signup">
          <AuthFields
            form={form}
            errors={errors}
            isPending={isPending}
            showPassword={showPassword}
            submitLabel="Crear cuenta"
            onSubmit={submit}
            onFieldChange={updateField}
            onTogglePassword={() => setShowPassword((value) => !value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AuthFields({
  form,
  errors,
  isPending,
  showPassword,
  submitLabel,
  onSubmit,
  onFieldChange,
  onTogglePassword,
}: {
  form: AuthFormState
  errors: FieldErrors
  isPending: boolean
  showPassword: boolean
  submitLabel: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof AuthFormState, value: string) => void
  onTogglePassword: () => void
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {errors.form && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.form}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor={`${submitLabel}-email`}>Correo</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={`${submitLabel}-email`}
            className="pl-8"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(event) => onFieldChange("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${submitLabel}-password`}>Contraseña</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={`${submitLabel}-password`}
            className="px-8"
            type={showPassword ? "text" : "password"}
            autoComplete={submitLabel === "Entrar" ? "current-password" : "new-password"}
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={(event) => onFieldChange("password", event.target.value)}
            aria-invalid={Boolean(errors.password)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-0.5 top-1/2 -translate-y-1/2"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Procesando..." : submitLabel}
      </Button>
    </form>
  )
}
