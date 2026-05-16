"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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

function validateForm(form: AuthFormState, mode: AuthMode): FieldErrors {
  const errors: FieldErrors = {}
  const email = form.email.trim()

  if (!email) {
    errors.email = "El correo es requerido."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresa un correo válido."
  }

  if (!form.password) {
    errors.password = "La contraseña es requerida."
  } else if (mode === "signup" && form.password.length < 8) {
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
  const [rememberMe, setRememberMe] = useState(true)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  function updateField(field: keyof AuthFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateForm(form, mode)
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

  function signInWithGoogle() {
    startTransition(async () => {
      if (!hasSupabaseConfig()) {
        setErrors({
          form: "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local.",
        })
        return
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
        },
      })

      if (error) {
        setErrors(mapAuthError(error.message, mode))
      }
    })
  }

  function switchMode(nextMode: string) {
    setMode(nextMode as AuthMode)
    setErrors({})
    setForm(initialState)
  }

  return (
    <div className="rounded-[2rem] border border-white/90 bg-white px-10 py-10 text-[#111827] shadow-2xl shadow-violet-950/10 sm:px-12 sm:py-12">
      <div className="mb-9 text-center">
        <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-[1.25rem] bg-[#111827] text-3xl font-semibold text-white shadow-xl shadow-violet-900/20">
          O
        </div>
        <h2 className="text-[32px] font-semibold tracking-[-0.03em]">Orquesta</h2>
        <p className="mx-auto mt-5 max-w-[390px] text-xl leading-9 text-[#6B7280]">
          Gestiona tu tesis, producto y startup de salud desde un tablero privado.
        </p>
      </div>

      <Tabs value={mode} onValueChange={switchMode} className="flex flex-col gap-0">
        <TabsList variant="line" className="mb-8 grid h-11 w-full grid-cols-2 border-b border-[#E5E7EB] p-0">
          <TabsTrigger
            value="login"
            className="rounded-none pb-4 text-lg data-active:text-[#111827] after:bg-[#7C3AED]"
          >
            Iniciar sesión
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="rounded-none pb-4 text-lg data-active:text-[#111827] after:bg-[#7C3AED]"
          >
            Registrarse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <AuthFields
            mode={mode}
            form={form}
            errors={errors}
            isPending={isPending}
            rememberMe={rememberMe}
            showPassword={showPassword}
            submitLabel="Ingresar"
            onSubmit={submit}
            onGoogle={signInWithGoogle}
            onFieldChange={updateField}
            onModeChange={switchMode}
            onRememberChange={setRememberMe}
            onTogglePassword={() => setShowPassword((value) => !value)}
          />
        </TabsContent>
        <TabsContent value="signup">
          <AuthFields
            mode={mode}
            form={form}
            errors={errors}
            isPending={isPending}
            rememberMe={rememberMe}
            showPassword={showPassword}
            submitLabel="Crear cuenta"
            onSubmit={submit}
            onGoogle={signInWithGoogle}
            onFieldChange={updateField}
            onModeChange={switchMode}
            onRememberChange={setRememberMe}
            onTogglePassword={() => setShowPassword((value) => !value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AuthFields({
  mode,
  form,
  errors,
  isPending,
  rememberMe,
  showPassword,
  submitLabel,
  onSubmit,
  onGoogle,
  onFieldChange,
  onModeChange,
  onRememberChange,
  onTogglePassword,
}: {
  mode: AuthMode
  form: AuthFormState
  errors: FieldErrors
  isPending: boolean
  rememberMe: boolean
  showPassword: boolean
  submitLabel: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onGoogle: () => void
  onFieldChange: (field: keyof AuthFormState, value: string) => void
  onModeChange: (mode: AuthMode) => void
  onRememberChange: (checked: boolean) => void
  onTogglePassword: () => void
}) {
  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      {errors.form && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.form}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor={`${mode}-email`} className="text-lg font-medium text-[#374151]">
          Correo
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#9CA3AF]" />
          <Input
            id={`${mode}-email`}
            className="h-16 rounded-[1.25rem] border-[#E5E7EB] bg-[#FAFAFA] pl-14 text-xl focus-visible:border-[#8B5CF6] focus-visible:ring-[#8B5CF6]/20"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(event) => onFieldChange("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
        </div>
        {errors.email && <p className="text-base text-red-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${mode}-password`} className="text-lg font-medium text-[#374151]">
          Contraseña
        </Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#9CA3AF]" />
          <Input
            id={`${mode}-password`}
            className="h-16 rounded-[1.25rem] border-[#E5E7EB] bg-[#FAFAFA] px-14 text-xl focus-visible:border-[#8B5CF6] focus-visible:ring-[#8B5CF6]/20"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={(event) => onFieldChange("password", event.target.value)}
            aria-invalid={Boolean(errors.password)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:bg-[#F5F3FF] hover:text-[#6D28D9]"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
        {errors.password && <p className="text-base text-red-600">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-between gap-4 text-lg">
        <label className="flex cursor-pointer items-center gap-2 text-[#4B5563]">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(checked) => onRememberChange(Boolean(checked))}
            className="size-6 rounded-md data-checked:border-[#7C3AED] data-checked:bg-[#7C3AED]"
          />
          Recordarme
        </label>
        <button type="button" className="font-medium text-[#6D28D9] hover:text-[#5B21B6]">
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button
        className="h-16 w-full rounded-[1.25rem] bg-[#7C3AED] text-xl font-semibold text-white shadow-xl shadow-violet-700/25 hover:bg-[#6D28D9]"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Procesando..." : submitLabel}
      </Button>

      <div className="flex items-center gap-3 text-lg text-[#9CA3AF]">
        <Separator className="flex-1 bg-[#E5E7EB]" />
        <span>o continúa con</span>
        <Separator className="flex-1 bg-[#E5E7EB]" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-16 w-full rounded-[1.25rem] border-[#E5E7EB] bg-white text-xl font-medium text-[#111827] hover:bg-[#F5F3FF]"
        disabled={isPending}
        onClick={onGoogle}
      >
        <span className="flex size-8 items-center justify-center rounded-full border text-base font-semibold text-[#6D28D9]">
          G
        </span>
        Continuar con Google
      </Button>

      <p className="text-center text-lg text-[#6B7280]">
        {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button
          type="button"
          className="font-semibold text-[#6D28D9] hover:text-[#5B21B6]"
          onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Regístrate" : "Inicia sesión"}
        </button>
      </p>
    </form>
  )
}
