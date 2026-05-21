import { spawnSync } from "node:child_process"

const args = new Set(process.argv.slice(2))
const required =
  args.has("--required") ||
  process.env.REQUIRE_SUPABASE_MIGRATIONS === "true" ||
  process.env.AUTO_APPLY_MIGRATIONS === "required"
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

  if (required) {
    console.error(message)
    process.exit(1)
  }

  console.warn(`${message} Skipping migrations.`)
  process.exit(0)
}

let dbHostname = ""
let dbPort = ""

try {
  const parsedDbUrl = new URL(dbUrl)
  dbHostname = parsedDbUrl.hostname
  dbPort = parsedDbUrl.port
} catch {
  const message = "SUPABASE_DB_URL is not a valid Postgres URL."
  if (required) {
    console.error(message)
    process.exit(1)
  }

  console.warn(`${message} Skipping migrations.`)
  process.exit(0)
}

if (dbHostname.startsWith("db.") && dbHostname.endsWith(".supabase.co") && dbPort === "5432") {
  const message = [
    "SUPABASE_DB_URL is using Supabase Direct connection, which often fails from Vercel because it requires IPv6.",
    "Use the Supabase Session pooler URI instead:",
    "postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require",
  ].join("\n")

  if (required) {
    console.error(message)
    process.exit(1)
  }

  console.warn(`${message}\nSkipping migrations.`)
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
  if (required) {
    console.error(result.error.message)
    process.exit(1)
  }

  console.warn(`${result.error.message}. Continuing build without applying migrations.`)
  process.exit(0)
}

const status = result.status ?? 1

if (status !== 0 && !required) {
  console.warn(
    `Supabase migrations failed with exit code ${status}. Continuing build without applying migrations.`
  )
  process.exit(0)
}

process.exit(status)
