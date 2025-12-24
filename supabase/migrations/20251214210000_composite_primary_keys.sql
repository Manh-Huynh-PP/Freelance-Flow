-- Migration: Convert primary keys to composite (user_id, id) for better data isolation
-- This allows each user to have records with the same ID without conflicts
-- Run this migration ONLY on production database after backing up!

-- =====================
-- STEP 1: Drop existing foreign key constraints that reference these tables
-- =====================

-- projects -> clients
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_client_id_fkey;

-- quote_items -> quotes  
ALTER TABLE public.quote_items DROP CONSTRAINT IF EXISTS quote_items_quote_id_fkey;

-- =====================
-- STEP 2: Drop existing primary key constraints
-- =====================
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_pkey;
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_pkey;
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_pkey;
ALTER TABLE public.quotes DROP CONSTRAINT IF EXISTS quotes_pkey;
ALTER TABLE public.quote_items DROP CONSTRAINT IF EXISTS quote_items_pkey;
ALTER TABLE public.work_sessions DROP CONSTRAINT IF EXISTS work_sessions_pkey;
ALTER TABLE public.collaborators DROP CONSTRAINT IF EXISTS collaborators_pkey;
ALTER TABLE public.collaborator_quotes DROP CONSTRAINT IF EXISTS collaborator_quotes_pkey;
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE public.quote_templates DROP CONSTRAINT IF EXISTS quote_templates_pkey;
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_pkey;
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_pkey;
ALTER TABLE public.fixed_costs DROP CONSTRAINT IF EXISTS fixed_costs_pkey;
ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS expenses_pkey;
ALTER TABLE public.ai_analyses DROP CONSTRAINT IF EXISTS ai_analyses_pkey;
ALTER TABLE public.ai_productivity_analyses DROP CONSTRAINT IF EXISTS ai_productivity_analyses_pkey;

-- =====================
-- STEP 3: Add new composite primary keys (user_id, id)
-- =====================
ALTER TABLE public.clients ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.projects ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.tasks ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.quotes ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.quote_items ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.work_sessions ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.collaborators ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.collaborator_quotes ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.categories ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.quote_templates ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.notes ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.events ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.fixed_costs ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.expenses ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.ai_analyses ADD PRIMARY KEY (user_id, id);
ALTER TABLE public.ai_productivity_analyses ADD PRIMARY KEY (user_id, id);

-- =====================
-- STEP 4: Add unique constraint on id for backward compatibility (optional but recommended)
-- This ensures IDs are still unique WITHIN each user's data
-- =====================
-- Note: We don't add unique on id alone because we WANT to allow same id across users

-- =====================
-- STEP 5: Create indexes for performance (id lookups)
-- =====================
CREATE INDEX IF NOT EXISTS idx_clients_id ON public.clients(id);
CREATE INDEX IF NOT EXISTS idx_projects_id ON public.projects(id);
CREATE INDEX IF NOT EXISTS idx_tasks_id ON public.tasks(id);
CREATE INDEX IF NOT EXISTS idx_quotes_id ON public.quotes(id);
CREATE INDEX IF NOT EXISTS idx_quote_items_id ON public.quote_items(id);
CREATE INDEX IF NOT EXISTS idx_work_sessions_id ON public.work_sessions(id);
CREATE INDEX IF NOT EXISTS idx_collaborators_id ON public.collaborators(id);
CREATE INDEX IF NOT EXISTS idx_collaborator_quotes_id ON public.collaborator_quotes(id);
CREATE INDEX IF NOT EXISTS idx_categories_id ON public.categories(id);
CREATE INDEX IF NOT EXISTS idx_quote_templates_id ON public.quote_templates(id);
CREATE INDEX IF NOT EXISTS idx_notes_id ON public.notes(id);
CREATE INDEX IF NOT EXISTS idx_events_id ON public.events(id);
CREATE INDEX IF NOT EXISTS idx_fixed_costs_id ON public.fixed_costs(id);
CREATE INDEX IF NOT EXISTS idx_expenses_id ON public.expenses(id);

-- =====================
-- MIGRATION COMPLETE
-- =====================
-- Each table now uses (user_id, id) as composite primary key
-- This allows:
-- 1. Same ID to exist for different users (no RLS conflicts on restore)
-- 2. Each user's data is completely isolated
-- 3. Restore operations can keep original IDs from backup
