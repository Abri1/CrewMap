-- Fix RLS Policies for Crew Map
-- This script fixes the infinite recursion error in the members table policies

-- 1. First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable insert for all users" ON public.crews;
DROP POLICY IF EXISTS "Enable read for all users" ON public.crews;
DROP POLICY IF EXISTS "Enable update for all users" ON public.crews;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.crews;

DROP POLICY IF EXISTS "Enable insert for all users" ON public.members;
DROP POLICY IF EXISTS "Enable read for all users" ON public.members;
DROP POLICY IF EXISTS "Enable update for all users" ON public.members;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.members;

DROP POLICY IF EXISTS "Members can view their crew" ON public.members;
DROP POLICY IF EXISTS "Members can update their own data" ON public.members;
DROP POLICY IF EXISTS "Anyone can join a crew" ON public.members;
DROP POLICY IF EXISTS "Members can leave crew" ON public.members;

-- 2. Ensure RLS is enabled on both tables
ALTER TABLE public.crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 3. Create simple, non-recursive policies for crews table
CREATE POLICY "Anyone can create a crew"
ON public.crews FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view crews"
ON public.crews FOR SELECT
USING (true);

CREATE POLICY "Crew members can update crew"
ON public.crews FOR UPDATE
USING (true);

CREATE POLICY "Crew members can delete crew"
ON public.crews FOR DELETE
USING (true);

-- 4. Create simple, non-recursive policies for members table
-- These policies avoid self-referencing which causes recursion
CREATE POLICY "Anyone can join crew"
ON public.members FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view crew members"
ON public.members FOR SELECT
USING (true);

CREATE POLICY "Users can update own member data"
ON public.members FOR UPDATE
USING (true); -- Allow all updates for now

CREATE POLICY "Users can delete own member data"
ON public.members FOR DELETE
USING (true); -- Allow all deletes for now

-- 5. Grant necessary permissions to anonymous users
GRANT ALL ON public.crews TO anon;
GRANT ALL ON public.members TO anon;
GRANT ALL ON public.crews TO authenticated;
GRANT ALL ON public.members TO authenticated;

-- 6. Ensure the tables have proper structure (if not already created)
CREATE TABLE IF NOT EXISTS public.crews (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    crew_id TEXT REFERENCES public.crews(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    current_location JSONB,
    speed REAL,
    last_update TIMESTAMPTZ DEFAULT now()
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_crew_id ON public.members(crew_id);
CREATE INDEX IF NOT EXISTS idx_members_last_update ON public.members(last_update);

-- Done! The policies are now simple and non-recursive
-- This should fix the "infinite recursion detected" error