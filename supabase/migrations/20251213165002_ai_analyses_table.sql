-- Create table for storing AI analyses (Caching)
create table if not exists ai_analyses (
  id uuid primary key,
  user_id uuid references auth.users(id) not null,
  timestamp text,
  analysis jsonb,
  created_at timestamp with time zone default now()
);

-- Index for sorting
create index if not exists idx_ai_analyses_user_created on ai_analyses(user_id, created_at desc);

-- RLS Policies
alter table ai_analyses enable row level security;

create policy "Users can view own analyses"
  on ai_analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on ai_analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on ai_analyses for delete
  using (auth.uid() = user_id);

-- Trigger Function to limit rows per user to 10
create or replace function public.maintain_ai_analysis_limit() returns trigger 
language plpgsql 
security definer
set search_path = ''
as $$
begin
  -- Delete oldest records if count > 10
  delete from public.ai_analyses
  where id in (
    select id from public.ai_analyses
    where user_id = NEW.user_id
    order by created_at desc
    offset 10
  );
  return NEW;
end;
$$;

-- Drop trigger if exists to allow cleaner re-runs
drop trigger if exists enforce_analysis_limit on public.ai_analyses;

create trigger enforce_analysis_limit
after insert on public.ai_analyses
for each row execute function public.maintain_ai_analysis_limit();
