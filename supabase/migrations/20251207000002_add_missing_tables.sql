-- Migration: Add missing tables for full backup restore support
-- Run this in Supabase SQL Editor or via CLI

-- =====================
-- COLLABORATORS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.collaborators (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  rate NUMERIC,
  notes TEXT,
  collaborator_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own collaborators" ON public.collaborators FOR ALL USING (auth.uid() = user_id);

-- =====================
-- COLLABORATOR QUOTES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.collaborator_quotes (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collaborator_id TEXT,
  task_id TEXT,
  status TEXT DEFAULT 'draft',
  total_amount NUMERIC DEFAULT 0,
  quote_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.collaborator_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own collaborator_quotes" ON public.collaborator_quotes FOR ALL USING (auth.uid() = user_id);

-- =====================
-- CATEGORIES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  category_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own categories" ON public.categories FOR ALL USING (auth.uid() = user_id);

-- =====================
-- QUOTE TEMPLATES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.quote_templates (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quote_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own quote_templates" ON public.quote_templates FOR ALL USING (auth.uid() = user_id);

-- =====================
-- NOTES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  color TEXT,
  position JSONB,
  note_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notes" ON public.notes FOR ALL USING (auth.uid() = user_id);

-- =====================
-- EVENTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  task_ids TEXT[],
  color TEXT,
  icon TEXT,
  notes TEXT,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own events" ON public.events FOR ALL USING (auth.uid() = user_id);

-- =====================
-- FIXED COSTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.fixed_costs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  frequency TEXT DEFAULT 'monthly',
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  cost_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fixed_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own fixed_costs" ON public.fixed_costs FOR ALL USING (auth.uid() = user_id);

-- =====================
-- EXPENSES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  date TIMESTAMPTZ,
  category TEXT,
  project_id TEXT,
  task_id TEXT,
  notes TEXT,
  expense_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own expenses" ON public.expenses FOR ALL USING (auth.uid() = user_id);

-- =====================
-- AI ANALYSES TABLE (stores AI analysis results)
-- =====================
CREATE TABLE IF NOT EXISTS public.ai_analyses (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT,
  result JSONB,
  analysis_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own ai_analyses" ON public.ai_analyses FOR ALL USING (auth.uid() = user_id);

-- =====================
-- AI PRODUCTIVITY ANALYSES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.ai_productivity_analyses (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT,
  result JSONB,
  analysis_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_productivity_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own ai_productivity_analyses" ON public.ai_productivity_analyses FOR ALL USING (auth.uid() = user_id);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON public.collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborator_quotes_user_id ON public.collaborator_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_templates_user_id ON public.quote_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_fixed_costs_user_id ON public.fixed_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_user_id ON public.ai_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_productivity_analyses_user_id ON public.ai_productivity_analyses(user_id);

-- Apply updated_at triggers
CREATE TRIGGER update_collaborators_updated_at BEFORE UPDATE ON public.collaborators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collaborator_quotes_updated_at BEFORE UPDATE ON public.collaborator_quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_templates_updated_at BEFORE UPDATE ON public.quote_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fixed_costs_updated_at BEFORE UPDATE ON public.fixed_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
