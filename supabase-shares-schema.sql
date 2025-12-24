-- Shares table for Supabase
CREATE TABLE IF NOT EXISTS public.shares (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    type TEXT NOT NULL, -- 'quote', 'task', 'combined'
    data JSONB NOT NULL,
    expires_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for shares
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own shares
CREATE POLICY "Users can view own shares" ON public.shares
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own shares
CREATE POLICY "Users can insert own shares" ON public.shares
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own shares
CREATE POLICY "Users can update own shares" ON public.shares
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own shares
CREATE POLICY "Users can delete own shares" ON public.shares
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: Public can view active, non-expired shares (for share links)
CREATE POLICY "Public can view active shares" ON public.shares
    FOR SELECT USING (
        status = 'active' 
        AND (expires_at IS NULL OR expires_at > NOW())
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON public.shares(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_status ON public.shares(status);
CREATE INDEX IF NOT EXISTS idx_shares_expires_at ON public.shares(expires_at);
CREATE INDEX IF NOT EXISTS idx_shares_created_at ON public.shares(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_shares_updated_at
    BEFORE UPDATE ON public.shares
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();