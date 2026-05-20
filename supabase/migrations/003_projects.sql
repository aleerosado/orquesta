-- Agrega soporte multi-proyecto.

create table if not exists public.projects (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users not null,
  name        text not null,
  description text,
  color       text not null default '#7C3AED',
  order_index integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.projects enable row level security;

drop policy if exists "users can manage own projects" on public.projects;
create policy "users can manage own projects"
  on public.projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists projects_user_id_idx on public.projects(user_id);

alter table public.tasks
  add column if not exists project_id uuid references public.projects(id) on delete cascade;

insert into public.projects (user_id, name, description, color, order_index)
select distinct
  tasks.user_id,
  'Tesis y concursos',
  'Investigación, paper, tesis, concursos y startup de salud.',
  '#7C3AED',
  0
from public.tasks
where not exists (
  select 1 from public.projects where projects.user_id = tasks.user_id
);

update public.tasks
set project_id = projects.id
from public.projects
where tasks.project_id is null
  and projects.user_id = tasks.user_id
  and projects.order_index = 0;

alter table public.tasks
  alter column project_id set not null;

create index if not exists tasks_project_id_idx on public.tasks(project_id);

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  default_project_id uuid;
begin
  insert into public.projects (user_id, name, description, color, order_index)
  values (
    new.id,
    'Tesis y concursos',
    'Investigación, paper, tesis, concursos y startup de salud.',
    '#7C3AED',
    0
  )
  returning id into default_project_id;

  insert into public.tasks (user_id, project_id, title, phase, status, tags, order_index) values
    (new.id, default_project_id, 'Crear perfil en CTI Vitae (CONCYTEC)', 'Fase 0', 'pendiente', array['urgente']::text[], 1),
    (new.id, default_project_id, 'Postular a PROCIENCIA Tesis Posgrado 2026', 'Fase 0', 'pendiente', array['urgente','concurso']::text[], 2),
    (new.id, default_project_id, 'Leer los 5 papers base: SIPaKMeD, Herlev, CHIEF', 'Fase 0', 'pendiente', array['paper']::text[], 3),
    (new.id, default_project_id, 'Entrevistar al contacto médico sobre flujo actual del PAP', 'Fase 0', 'pendiente', array['urgente']::text[], 4),
    (new.id, default_project_id, 'Definir nombre del producto / startup', 'Fase 0', 'pendiente', array['negocio']::text[], 5),
    (new.id, default_project_id, 'Buscar asesor con perfil IA + salud en la universidad', 'Fase 0', 'pendiente', array['urgente']::text[], 6),
    (new.id, default_project_id, 'Revisión sistemática de literatura (20+ papers)', 'Fase 1', 'pendiente', array['paper']::text[], 1),
    (new.id, default_project_id, 'Matriz comparativa de modelos CNN para citología cervical', 'Fase 1', 'pendiente', array['tecnico','paper']::text[], 2),
    (new.id, default_project_id, 'Protocolo de investigación formal aprobado por asesor', 'Fase 1', 'pendiente', array['paper']::text[], 3),
    (new.id, default_project_id, 'Primer borrador del Lean Canvas del startup', 'Fase 1', 'pendiente', array['negocio']::text[], 4),
    (new.id, default_project_id, 'Descargar y explorar dataset SIPaKMeD', 'Fase 2', 'pendiente', array['tecnico']::text[], 1),
    (new.id, default_project_id, 'Descargar y explorar dataset Herlev', 'Fase 2', 'pendiente', array['tecnico']::text[], 2),
    (new.id, default_project_id, 'Pipeline de preprocesamiento: normalización y augmentation', 'Fase 2', 'pendiente', array['tecnico']::text[], 3),
    (new.id, default_project_id, 'Protocolo de anonimización según Ley 29733', 'Fase 2', 'pendiente', array['negocio']::text[], 4),
    (new.id, default_project_id, 'Entrenar baseline con EfficientNet-B0', 'Fase 3', 'pendiente', array['tecnico']::text[], 1),
    (new.id, default_project_id, 'Fine-tuning y optimización de hiperparámetros', 'Fase 3', 'pendiente', array['tecnico']::text[], 2),
    (new.id, default_project_id, 'Implementar Grad-CAM para mapas de calor (XAI)', 'Fase 3', 'pendiente', array['tecnico']::text[], 3),
    (new.id, default_project_id, 'Alcanzar sensibilidad >= 85% en validación', 'Fase 3', 'pendiente', array['tecnico']::text[], 4),
    (new.id, default_project_id, 'API REST con FastAPI: endpoint de análisis de imagen', 'Fase 4', 'pendiente', array['tecnico']::text[], 1),
    (new.id, default_project_id, 'Interfaz web para personal de salud', 'Fase 4', 'pendiente', array['tecnico']::text[], 2),
    (new.id, default_project_id, 'Módulo de evaluación de riesgo personal', 'Fase 4', 'pendiente', array['tecnico']::text[], 3),
    (new.id, default_project_id, 'Generación de reporte PDF por caso', 'Fase 4', 'pendiente', array['tecnico']::text[], 4),
    (new.id, default_project_id, 'Sistema de recordatorios vía WhatsApp Business API', 'Fase 4', 'pendiente', array['tecnico','negocio']::text[], 5),
    (new.id, default_project_id, 'Convenio formal con centro de salud colaborador', 'Fase 5', 'pendiente', array['negocio','urgente']::text[], 1),
    (new.id, default_project_id, 'Prueba piloto: 50-100 casos reales', 'Fase 5', 'pendiente', array['tecnico','paper']::text[], 2),
    (new.id, default_project_id, 'Encuesta de usabilidad SUS al personal de salud', 'Fase 5', 'pendiente', array['paper']::text[], 3),
    (new.id, default_project_id, 'Redactar paper completo para revista Scopus', 'Fase 6', 'pendiente', array['paper']::text[], 1),
    (new.id, default_project_id, 'Seleccionar revista indexada y enviar a revisión', 'Fase 6', 'pendiente', array['paper']::text[], 2),
    (new.id, default_project_id, 'Redactar y defender tesis', 'Fase 6', 'pendiente', array['paper']::text[], 3),
    (new.id, default_project_id, 'MIT Solve Global Health Challenge — sep 2026', 'Concursos', 'pendiente', array['concurso']::text[], 1),
    (new.id, default_project_id, 'MIT Solve AI for Humanity Prize — sep 2026', 'Concursos', 'pendiente', array['concurso']::text[], 2),
    (new.id, default_project_id, 'Future Health Challenge (MIT + Abu Dhabi) — 2027', 'Concursos', 'pendiente', array['concurso']::text[], 3),
    (new.id, default_project_id, 'Preparar pitch deck en inglés (10 slides)', 'Concursos', 'pendiente', array['negocio','concurso']::text[], 4),
    (new.id, default_project_id, 'One-pager ejecutivo bilingüe ES + EN', 'Concursos', 'pendiente', array['negocio','concurso']::text[], 5),
    (new.id, default_project_id, 'Modelo de negocio: pricing para centros de salud', 'Fase 7', 'pendiente', array['negocio']::text[], 1),
    (new.id, default_project_id, 'Adaptar plataforma para segundo país piloto', 'Fase 7', 'pendiente', array['negocio']::text[], 2),
    (new.id, default_project_id, 'Registro de propiedad intelectual del software', 'Fase 7', 'pendiente', array['negocio']::text[], 3);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
