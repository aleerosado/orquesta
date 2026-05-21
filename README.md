# Orquesta

Gestor kanban para organizar el desarrollo de una tesis de maestría y startup de salud.

## Stack

- Next.js 14 App Router
- TypeScript
- Supabase Auth + PostgreSQL
- Tailwind CSS
- shadcn/ui
- lucide-react
- sonner

## Configuración local

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

3. Completa las variables de Supabase en `.env.local`.

4. Ejecuta la migración SQL en Supabase:

```bash
supabase/migrations/001_initial.sql
```

Puedes pegarla en el SQL editor de Supabase o usar Supabase CLI si el proyecto está enlazado.

Si Supabase muestra `Database error creating new user` al crear un usuario, aplica también:

```bash
supabase/migrations/002_fix_auth_user_trigger.sql
```

Ese script recrea el trigger de alta de usuarios con referencias explícitas a `public.tasks`.

Para habilitar varios proyectos por usuario, aplica:

```bash
npm run db:migrate
```

Ese comando ejecuta las migraciones de `supabase/migrations` con Supabase CLI. Requiere
`SUPABASE_DB_URL` en `.env.local` o en variables del entorno. La migración `003_projects.sql`
crea `projects`, relaciona cada tarea con un proyecto, migra las tareas existentes a
`Tesis y concursos` y actualiza el trigger de nuevos usuarios.

Para automatizarlo en Vercel:

```bash
SUPABASE_DB_URL=postgresql://...
```

En Vercel no uses la URL directa `db.<project-ref>.supabase.co:5432`, porque puede
fallar por IPv6. Usa la URL de **Session pooler** de Supabase. Para este proyecto
debería tener este formato:

```bash
SUPABASE_DB_URL=postgresql://postgres.hylylxjrhcwkpcjzjdlk:TU_PASSWORD@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require
```

El script `prebuild` detecta Vercel e intenta aplicar las migraciones antes de
`next build`. Si Supabase rechaza la conexión desde Vercel, el build continúa y
el dashboard mostrará el aviso de migración pendiente.

Si quieres que el deploy falle cuando no pueda migrar, agrega:

```bash
REQUIRE_SUPABASE_MIGRATIONS=true
```

Si el pooler sigue fallando, aplica la migración una vez desde Supabase:

1. Supabase → SQL Editor.
2. Abre `supabase/migrations/003_projects.sql`.
3. Pega todo el contenido y ejecútalo.

Fuera de Vercel, puedes forzar el mismo comportamiento con:

```bash
AUTO_APPLY_MIGRATIONS=true
```

5. En Supabase Auth, habilita autenticación por email y contraseña.

No se usa Google OAuth, GitHub OAuth ni magic link.

6. Levanta el servidor:

```bash
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Flujo esperado

- `/` redirige a `/login` o `/dashboard` según sesión.
- `/dashboard` está protegido por middleware.
- `/login` permite iniciar sesión o registrarse con email y contraseña.
- Un nuevo usuario recibe automáticamente las tareas iniciales mediante el trigger `handle_new_user`.
- Las mutaciones usan Server Actions y revalidan `/dashboard`.
