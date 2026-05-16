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
