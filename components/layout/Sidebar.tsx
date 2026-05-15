"use client"

import { BarChart3, LogOut, Medal, Siren } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

export function Sidebar({ email, urgentCount }: { email: string; urgentCount: number }) {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    router.replace("/login")
    router.refresh()
  }

  return (
    <aside className="border-b bg-card/70 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-4 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-foreground font-semibold text-background">
            O
          </div>
          <div>
            <p className="font-semibold">Orquesta</p>
            <p className="text-xs text-muted-foreground">Tesis + Startup</p>
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible">
        <Button variant="secondary" className="justify-start lg:w-full">
          <BarChart3 className="size-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="justify-start lg:w-full">
          <Siren className="size-4" />
          Urgentes
          {urgentCount > 0 && <Badge className="ml-auto">{urgentCount}</Badge>}
        </Button>
        <Button variant="ghost" className="justify-start lg:w-full">
          <Medal className="size-4" />
          Concursos
        </Button>
      </nav>
      <div className="mt-auto hidden p-4 lg:block">
        <Separator className="mb-4" />
        <div className="mb-3 flex min-w-0 items-center gap-3">
          <Avatar>
            <AvatarFallback>{email.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
        </div>
        <Button className="w-full justify-start" variant="outline" onClick={signOut}>
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
