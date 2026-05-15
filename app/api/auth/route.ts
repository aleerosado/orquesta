import { createServerClient } from "@/lib/supabase/server"
import { hasSupabaseConfig } from "@/lib/supabase/config"
import { NextResponse } from "next/server"

export async function GET() {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      { user: null, error: "Supabase no está configurado." },
      { status: 503 }
    )
  }

  const supabase = createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
    },
  })
}
