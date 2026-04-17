-- ============================================================
-- Gatekeeper: scans table + RLS policies
-- Linked to CafeToolbox auth via auth.users
-- ============================================================

CREATE TABLE IF NOT EXISTS public.scans (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type   TEXT NOT NULL CHECK (target_type IN ('file', 'url')),
  target_name   TEXT NOT NULL,
  target_hash   TEXT,
  stats         JSONB,
  verdict       TEXT NOT NULL DEFAULT 'scanning'
                  CHECK (verdict IN ('clean', 'suspicious', 'malicious', 'scanning')),
  analysis_id   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans(created_at DESC);

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Users can only read their own scans
CREATE POLICY "Users can only see their own scans"
  ON public.scans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own scans
CREATE POLICY "Users can insert their own scans"
  ON public.scans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own scans (for verdict updates after polling)
CREATE POLICY "Users can update their own scans"
  ON public.scans
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role bypasses RLS, so the Express backend (using service_role key)
-- can read/write all rows for admin operations.
