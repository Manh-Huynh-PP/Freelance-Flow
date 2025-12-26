-- Create table for tracking AI usage quota
create table if not exists ai_usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  model text not null,
  tokens_in integer default 0,
  tokens_out integer default 0,
  created_at timestamp with time zone default now()
);

-- Index for fast daily quota counting
create index if not exists idx_ai_usage_user_date on ai_usage_logs(user_id, created_at);

-- RLS Policies (Security)
alter table ai_usage_logs enable row level security;

-- Users can view their own usage (for UI count)
create policy "Users can view own usage"
  on ai_usage_logs for select
  using (auth.uid() = user_id);

-- Only service role can insert (via API Route)
-- or allow users to insert if we log from client (NOT RECOMMENDED)
-- We will insert from server-side Route Handler which uses Service Key (bypassing RLS)
-- So no INSERT policy needed for public.

-- Function to cleanup old logs (Retention Policy: 7 days)
create or replace function public.cleanup_old_ai_logs()
returns void 
language plpgsql 
security definer
set search_path = ''
as $$
begin
  delete from public.ai_usage_logs
  where created_at < now() - interval '7 days';
end;
$$;
