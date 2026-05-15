-- Tabla de fases del proyecto
create table phases (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users not null,
  name        text not null,
  color       text not null default '#888780',
  order_index integer not null default 0,
  created_at  timestamptz default now()
);

-- Tabla principal de tareas
create table tasks (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users not null,
  title       text not null,
  notes       text,
  phase       text not null,
  status      text not null default 'pendiente'
                check (status in ('pendiente', 'en progreso', 'listo')),
  tags        text[] not null default '{}',
  due_date    date,
  order_index integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Índices para performance
create index tasks_user_id_idx on tasks(user_id);
create index tasks_status_idx on tasks(status);
create index tasks_phase_idx on tasks(phase);

-- Row Level Security: cada usuario solo ve y edita sus propias tareas
alter table tasks enable row level security;
alter table phases enable row level security;

create policy "users can manage own tasks"
  on tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can manage own phases"
  on phases for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();

-- Función para insertar tareas iniciales cuando un usuario se registra
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into tasks (user_id, title, phase, status, tags, order_index) values
    (new.id, 'Crear perfil en CTI Vitae (CONCYTEC)', 'Fase 0', 'pendiente', array['urgente'], 1),
    (new.id, 'Postular a PROCIENCIA Tesis Posgrado 2026', 'Fase 0', 'pendiente', array['urgente','concurso'], 2),
    (new.id, 'Leer los 5 papers base: SIPaKMeD, Herlev, CHIEF', 'Fase 0', 'pendiente', array['paper'], 3),
    (new.id, 'Entrevistar al contacto médico sobre flujo actual del PAP', 'Fase 0', 'pendiente', array['urgente'], 4),
    (new.id, 'Definir nombre del producto / startup', 'Fase 0', 'pendiente', array['negocio'], 5),
    (new.id, 'Buscar asesor con perfil IA + salud en la universidad', 'Fase 0', 'pendiente', array['urgente'], 6),
    (new.id, 'Revisión sistemática de literatura (20+ papers)', 'Fase 1', 'pendiente', array['paper'], 1),
    (new.id, 'Matriz comparativa de modelos CNN para citología cervical', 'Fase 1', 'pendiente', array['tecnico','paper'], 2),
    (new.id, 'Protocolo de investigación formal aprobado por asesor', 'Fase 1', 'pendiente', array['paper'], 3),
    (new.id, 'Primer borrador del Lean Canvas del startup', 'Fase 1', 'pendiente', array['negocio'], 4),
    (new.id, 'Descargar y explorar dataset SIPaKMeD', 'Fase 2', 'pendiente', array['tecnico'], 1),
    (new.id, 'Descargar y explorar dataset Herlev', 'Fase 2', 'pendiente', array['tecnico'], 2),
    (new.id, 'Pipeline de preprocesamiento: normalización y augmentation', 'Fase 2', 'pendiente', array['tecnico'], 3),
    (new.id, 'Protocolo de anonimización según Ley 29733', 'Fase 2', 'pendiente', array['negocio'], 4),
    (new.id, 'Entrenar baseline con EfficientNet-B0', 'Fase 3', 'pendiente', array['tecnico'], 1),
    (new.id, 'Fine-tuning y optimización de hiperparámetros', 'Fase 3', 'pendiente', array['tecnico'], 2),
    (new.id, 'Implementar Grad-CAM para mapas de calor (XAI)', 'Fase 3', 'pendiente', array['tecnico'], 3),
    (new.id, 'Alcanzar sensibilidad >= 85% en validación', 'Fase 3', 'pendiente', array['tecnico'], 4),
    (new.id, 'API REST con FastAPI: endpoint de análisis de imagen', 'Fase 4', 'pendiente', array['tecnico'], 1),
    (new.id, 'Interfaz web para personal de salud', 'Fase 4', 'pendiente', array['tecnico'], 2),
    (new.id, 'Módulo de evaluación de riesgo personal', 'Fase 4', 'pendiente', array['tecnico'], 3),
    (new.id, 'Generación de reporte PDF por caso', 'Fase 4', 'pendiente', array['tecnico'], 4),
    (new.id, 'Sistema de recordatorios vía WhatsApp Business API', 'Fase 4', 'pendiente', array['tecnico','negocio'], 5),
    (new.id, 'Convenio formal con centro de salud colaborador', 'Fase 5', 'pendiente', array['negocio','urgente'], 1),
    (new.id, 'Prueba piloto: 50-100 casos reales', 'Fase 5', 'pendiente', array['tecnico','paper'], 2),
    (new.id, 'Encuesta de usabilidad SUS al personal de salud', 'Fase 5', 'pendiente', array['paper'], 3),
    (new.id, 'Redactar paper completo para revista Scopus', 'Fase 6', 'pendiente', array['paper'], 1),
    (new.id, 'Seleccionar revista indexada y enviar a revisión', 'Fase 6', 'pendiente', array['paper'], 2),
    (new.id, 'Redactar y defender tesis', 'Fase 6', 'pendiente', array['paper'], 3),
    (new.id, 'MIT Solve Global Health Challenge — sep 2026', 'Concursos', 'pendiente', array['concurso'], 1),
    (new.id, 'MIT Solve AI for Humanity Prize — sep 2026', 'Concursos', 'pendiente', array['concurso'], 2),
    (new.id, 'Future Health Challenge (MIT + Abu Dhabi) — 2027', 'Concursos', 'pendiente', array['concurso'], 3),
    (new.id, 'Preparar pitch deck en inglés (10 slides)', 'Concursos', 'pendiente', array['negocio','concurso'], 4),
    (new.id, 'One-pager ejecutivo bilingüe ES + EN', 'Concursos', 'pendiente', array['negocio','concurso'], 5),
    (new.id, 'Modelo de negocio: pricing para centros de salud', 'Fase 7', 'pendiente', array['negocio'], 1),
    (new.id, 'Adaptar plataforma para segundo país piloto', 'Fase 7', 'pendiente', array['negocio'], 2),
    (new.id, 'Registro de propiedad intelectual del software', 'Fase 7', 'pendiente', array['negocio'], 3);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: ejecutar al crear nuevo usuario
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
