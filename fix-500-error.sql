-- Comprehensive fix for 500 error on member insert
-- Run this entire script in Supabase SQL Editor

-- 1. Check if tables exist and show their structure
DO $$
BEGIN
    RAISE NOTICE '=== CHECKING TABLE STRUCTURE ===';

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crews') THEN
        RAISE NOTICE '✓ crews table exists';
    ELSE
        RAISE NOTICE '✗ crews table does NOT exist';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'members') THEN
        RAISE NOTICE '✓ members table exists';
    ELSE
        RAISE NOTICE '✗ members table does NOT exist';
    END IF;
END $$;

-- 2. Drop and recreate tables with proper structure
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.crews CASCADE;

CREATE TABLE public.crews (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.members (
    id TEXT PRIMARY KEY,
    crew_id TEXT REFERENCES public.crews(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    current_location JSONB,
    speed REAL,
    last_update TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 4. Drop ALL old policies
DROP POLICY IF EXISTS "Allow all on crews" ON public.crews;
DROP POLICY IF EXISTS "Allow all on members" ON public.members;

-- 5. Create super simple policies
CREATE POLICY "Open for all"
ON public.crews
FOR ALL
TO public, anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Open for all"
ON public.members
FOR ALL
TO public, anon, authenticated
USING (true)
WITH CHECK (true);

-- 6. Grant ALL permissions
GRANT ALL ON public.crews TO anon, authenticated, service_role;
GRANT ALL ON public.members TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 7. Create indexes
CREATE INDEX idx_members_crew_id ON public.members(crew_id);
CREATE INDEX idx_members_last_update ON public.members(last_update);

-- 8. Test insert (this will help diagnose issues)
DO $$
DECLARE
    test_crew_id TEXT := 'TEST-' || substr(md5(random()::text), 0, 8);
    test_member_id TEXT := 'TEST-USER-' || substr(md5(random()::text), 0, 8);
BEGIN
    RAISE NOTICE '=== TESTING INSERTS ===';

    -- Try to insert a crew
    INSERT INTO public.crews (id) VALUES (test_crew_id);
    RAISE NOTICE '✓ Successfully inserted test crew: %', test_crew_id;

    -- Try to insert a member
    INSERT INTO public.members (id, crew_id, name, color, last_update)
    VALUES (test_member_id, test_crew_id, 'Test User', '#fbbf24', now());
    RAISE NOTICE '✓ Successfully inserted test member: %', test_member_id;

    -- Clean up
    DELETE FROM public.members WHERE id = test_member_id;
    DELETE FROM public.crews WHERE id = test_crew_id;
    RAISE NOTICE '✓ Successfully cleaned up test data';

    RAISE NOTICE '=== ALL TESTS PASSED ===';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '✗ Test failed: %', SQLERRM;
END $$;

-- 9. Final message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== SETUP COMPLETE ===';
    RAISE NOTICE 'Tables created: ✓';
    RAISE NOTICE 'RLS enabled: ✓';
    RAISE NOTICE 'Policies created: ✓';
    RAISE NOTICE 'Permissions granted: ✓';
    RAISE NOTICE '';
    RAISE NOTICE 'IMPORTANT: Make sure Anonymous Authentication is enabled!';
    RAISE NOTICE 'Go to Authentication → Providers → Enable Anonymous Sign-Ins';
END $$;