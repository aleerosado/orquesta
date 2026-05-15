export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("tu-proyecto") &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("tu-anon-key")
  )
}
