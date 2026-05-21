import { spawnSync } from "node:child_process"

const args = new Set(process.argv.slice(2))
const required = args.has("--required")
const dryRun = args.has("--dry-run")
const autoApplySetting = process.env.AUTO_APPLY_MIGRATIONS
const isVercelBuild = process.env.VERCEL === "1"
const autoApply =
  autoApplySetting === "true" || (isVercelBuild && autoApplySetting !== "false")
const dbUrl =
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL

if (!required && !autoApply) {
  console.log(
    "Supabase migrations skipped. Set AUTO_APPLY_MIGRATIONS=true to run outside Vercel."
  )
  process.exit(0)
}

if (!dbUrl) {
  const message =
    "Missing SUPABASE_DB_URL. Set it to your Supabase Postgres connection string to apply migrations."

  if (required || autoApply) {
    console.error(message)
    process.exit(1)
  }

  console.log(`${message} Skipping migrations.`)
  process.exit(0)
}

const commandArgs = [
  "supabase",
  "db",
  "push",
  "--db-url",
  dbUrl,
  "--include-all",
  "--yes",
]

if (dryRun) {
  commandArgs.push("--dry-run")
}

console.log(`Running Supabase migrations${dryRun ? " dry run" : ""}...`)

const result = spawnSync("npx", commandArgs, {
  stdio: "inherit",
  shell: false,
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
