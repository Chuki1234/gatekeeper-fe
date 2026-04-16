-- Make scans table standalone (no auth dependency)
-- Drop FK to auth.users, make user_id nullable, drop RLS policies

ALTER TABLE public.scans DROP CONSTRAINT IF EXISTS scans_user_id_fkey;
ALTER TABLE public.scans ALTER COLUMN user_id DROP NOT NULL;

DROP POLICY IF EXISTS "Users can only see their own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can insert their own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can update their own scans" ON public.scans;

ALTER TABLE public.scans DISABLE ROW LEVEL SECURITY;
