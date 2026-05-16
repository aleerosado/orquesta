-- Repara el trigger de alta de usuarios para que funcione desde auth.users.
-- El error visible en Supabase Auth suele ser:
-- "Failed to create user: Database error creating new user".

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.tasks (user_id, title, phase, status, tags, order_index) values
    (new.id, 'Crear perfil en CTI Vitae (CONCYTEC)', 'Fase 0', 'pendiente', array['urgente']::text[], 1),
    (new.id, 'Postular a PROCIENCIA Tesis Posgrado 2026', 'Fase 0', 'pendiente', array['urgente','concurso']::text[], 2),
    (new.id, 'Leer los 5 papers base: SIPaKMeD, Herlev, CHIEF', 'Fase 0', 'pendiente', array['paper']::text[], 3),
    (new.id, 'Entrevistar al contacto médico sobre flujo actual del PAP', 'Fase 0', 'pendiente', array['urgente']::text[], 4),
    (new.id, 'Definir nombre del producto / startup', 'Fase 0', 'pendiente', array['negocio']::text[], 5),
    (new.id, 'Buscar asesor con perfil IA + salud en la universidad', 'Fase 0', 'pendiente', array['urgente']::text[], 6),
    (new.id, 'Revisión sistemática de literatura (20+ papers)', 'Fase 1', 'pendiente', array['paper']::text[], 1),
    (new.id, 'Matriz comparativa de modelos CNN para citología cervical', 'Fase 1', 'pendiente', array['tecnico','paper']::text[], 2),
    (new.id, 'Protocolo de investigación formal aprobado por asesor', 'Fase 1', 'pendiente', array['paper']::text[], 3),
    (new.id, 'Primer borrador del Lean Canvas del startup', 'Fase 1', 'pendiente', array['negocio']::text[], 4),
    (new.id, 'Descargar y explorar dataset SIPaKMeD', 'Fase 2', 'pendiente', array['tecnico']::text[], 1),
    (new.id, 'Descargar y explorar dataset Herlev', 'Fase 2', 'pendiente', array['tecnico']::text[], 2),
    (new.id, 'Pipeline de preprocesamiento: normalización y augmentation', 'Fase 2', 'pendiente', array['tecnico']::text[], 3),
    (new.id, 'Protocolo de anonimización según Ley 29733', 'Fase 2', 'pendiente', array['negocio']::text[], 4),
    (new.id, 'Entrenar baseline con EfficientNet-B0', 'Fase 3', 'pendiente', array['tecnico']::text[], 1),
    (new.id, 'Fine-tuning y optimización de hiperparámetros', 'Fase 3', 'pendiente', array['tecnico']::text[], 2),
    (new.id, 'Implementar Grad-CAM para mapas de calor (XAI)', 'Fase 3', 'pendiente', array['tecnico']::text[], 3),
    (new.id, 'Alcanzar sensibilidad >= 85% en validación', 'Fase 3', 'pendiente', array['tecnico']::text[], 4),
    (new.id, 'API REST con FastAPI: endpoint de análisis de imagen', 'Fase 4', 'pendiente', array['tecnico']::text[], 1),
    (new.id, 'Interfaz web para personal de salud', 'Fase 4', 'pendiente', array['tecnico']::text[], 2),
    (new.id, 'Módulo de evaluación de riesgo personal', 'Fase 4', 'pendiente', array['tecnico']::text[], 3),
    (new.id, 'Generación de reporte PDF por caso', 'Fase 4', 'pendiente', array['tecnico']::text[], 4),
    (new.id, 'Sistema de recordatorios vía WhatsApp Business API', 'Fase 4', 'pendiente', array['tecnico','negocio']::text[], 5),
    (new.id, 'Convenio formal con centro de salud colaborador', 'Fase 5', 'pendiente', array['negocio','urgente']::text[], 1),
    (new.id, 'Prueba piloto: 50-100 casos reales', 'Fase 5', 'pendiente', array['tecnico','paper']::text[], 2),
    (new.id, 'Encuesta de usabilidad SUS al personal de salud', 'Fase 5', 'pendiente', array['paper']::text[], 3),
    (new.id, 'Redactar paper completo para revista Scopus', 'Fase 6', 'pendiente', array['paper']::text[], 1),
    (new.id, 'Seleccionar revista indexada y enviar a revisión', 'Fase 6', 'pendiente', array['paper']::text[], 2),
    (new.id, 'Redactar y defender tesis', 'Fase 6', 'pendiente', array['paper']::text[], 3),
    (new.id, 'MIT Solve Global Health Challenge — sep 2026', 'Concursos', 'pendiente', array['concurso']::text[], 1),
    (new.id, 'MIT Solve AI for Humanity Prize — sep 2026', 'Concursos', 'pendiente', array['concurso']::text[], 2),
    (new.id, 'Future Health Challenge (MIT + Abu Dhabi) — 2027', 'Concursos', 'pendiente', array['concurso']::text[], 3),
    (new.id, 'Preparar pitch deck en inglés (10 slides)', 'Concursos', 'pendiente', array['negocio','concurso']::text[], 4),
    (new.id, 'One-pager ejecutivo bilingüe ES + EN', 'Concursos', 'pendiente', array['negocio','concurso']::text[], 5),
    (new.id, 'Modelo de negocio: pricing para centros de salud', 'Fase 7', 'pendiente', array['negocio']::text[], 1),
    (new.id, 'Adaptar plataforma para segundo país piloto', 'Fase 7', 'pendiente', array['negocio']::text[], 2),
    (new.id, 'Registro de propiedad intelectual del software', 'Fase 7', 'pendiente', array['negocio']::text[], 3);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
