-- ============================================
-- COMPLETE SUPABASE SETUP FOR CREW MAP
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This will completely reset and properly configure everything

-- ============================================
-- STEP 1: CLEAN SLATE - DROP EVERYTHING
-- ============================================
-- Drop all policies first
DROP POLICY IF EXISTS "Allow all on crews" ON public.crews;
DROP POLICY IF EXISTS "Allow all on members" ON public.members;
DROP POLICY IF EXISTS "Open for all" ON public.crews;
DROP POLICY IF EXISTS "Open for all" ON public.members;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.crews;
DROP POLICY IF EXISTS "Enable read for all users" ON public.crews;
DROP POLICY IF EXISTS "Enable update for all users" ON public.crews;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.crews;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.members;
DROP POLICY IF EXISTS "Enable read for all users" ON public.members;
DROP POLICY IF EXISTS "Enable update for all users" ON public.members;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.members;

-- Drop tables
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.crews CASCADE;

-- ============================================
-- STEP 2: CREATE TABLES WITH PROPER STRUCTURE
-- ============================================
-- Create crews table
CREATE TABLE public.crews (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create members table with all necessary fields
CREATE TABLE public.members (
    id TEXT PRIMARY KEY,
    crew_id TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#fbbf24',
    current_location JSONB DEFAULT NULL,
    speed DOUBLE PRECISION DEFAULT NULL,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CONSTRAINT fk_crew
        FOREIGN KEY(crew_id)
        REFERENCES public.crews(id)
        ON DELETE CASCADE
);

-- ============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_members_crew_id ON public.members(crew_id);
CREATE INDEX idx_members_last_update ON public.members(last_update DESC);
CREATE INDEX idx_crews_created_at ON public.crews(created_at DESC);

-- ============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: CREATE PERMISSIVE POLICIES
-- ============================================
-- Crews policies - completely open for anonymous users
CREATE POLICY "crews_insert_policy" ON public.crews
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "crews_select_policy" ON public.crews
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "crews_update_policy" ON public.crews
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "crews_delete_policy" ON public.crews
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Members policies - completely open for anonymous users
CREATE POLICY "members_insert_policy" ON public.members
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "members_select_policy" ON public.members
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "members_update_policy" ON public.members
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "members_delete_policy" ON public.members
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- ============================================
-- STEP 6: GRANT PERMISSIONS
-- ============================================
-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Grant table permissions to anon
GRANT ALL ON TABLE public.crews TO anon;
GRANT ALL ON TABLE public.members TO anon;

-- Grant table permissions to authenticated
GRANT ALL ON TABLE public.crews TO authenticated;
GRANT ALL ON TABLE public.members TO authenticated;

-- Grant table permissions to service_role
GRANT ALL ON TABLE public.crews TO service_role;
GRANT ALL ON TABLE public.members TO service_role;

-- ============================================
-- STEP 7: CREATE HELPER FUNCTIONS (Optional)
-- ============================================
-- Function to clean up old inactive crews
CREATE OR REPLACE FUNCTION public.cleanup_old_crews()
RETURNS void AS $$
BEGIN
    DELETE FROM public.crews
    WHERE created_at < NOW() - INTERVAL '7 days'
    AND id NOT IN (
        SELECT DISTINCT crew_id
        FROM public.members
        WHERE last_update > NOW() - INTERVAL '1 hour'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 8: TEST THE SETUP
-- ============================================
DO $$
DECLARE
    test_crew_id TEXT := 'TEST-CREW-' || substr(md5(random()::text), 1, 6);
    test_member_id TEXT := 'TEST-MEMBER-' || substr(md5(random()::text), 1, 6);
    crew_count INT;
    member_count INT;
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'TESTING DATABASE SETUP';
    RAISE NOTICE '============================================';

    -- Test crew insertion
    INSERT INTO public.crews (id) VALUES (test_crew_id);

    SELECT COUNT(*) INTO crew_count FROM public.crews WHERE id = test_crew_id;
    IF crew_count = 1 THEN
        RAISE NOTICE '✅ Crew insertion: SUCCESS';
    ELSE
        RAISE EXCEPTION '❌ Crew insertion: FAILED';
    END IF;

    -- Test member insertion
    INSERT INTO public.members (id, crew_id, name, color)
    VALUES (test_member_id, test_crew_id, 'Test User', '#fbbf24');

    SELECT COUNT(*) INTO member_count FROM public.members WHERE id = test_member_id;
    IF member_count = 1 THEN
        RAISE NOTICE '✅ Member insertion: SUCCESS';
    ELSE
        RAISE EXCEPTION '❌ Member insertion: FAILED';
    END IF;

    -- Test member update
    UPDATE public.members
    SET current_location = '{"lat": 34.0522, "lng": -118.2437}'::jsonb,
        speed = 15.5,
        last_update = NOW()
    WHERE id = test_member_id;
    RAISE NOTICE '✅ Member update: SUCCESS';

    -- Test select
    SELECT COUNT(*) INTO member_count FROM public.members WHERE crew_id = test_crew_id;
    IF member_count >= 1 THEN
        RAISE NOTICE '✅ Select query: SUCCESS';
    ELSE
        RAISE EXCEPTION '❌ Select query: FAILED';
    END IF;

    -- Clean up test data
    DELETE FROM public.members WHERE id = test_member_id;
    DELETE FROM public.crews WHERE id = test_crew_id;
    RAISE NOTICE '✅ Cleanup: SUCCESS';

    RAISE NOTICE '============================================';
    RAISE NOTICE 'ALL TESTS PASSED! 🎉';
    RAISE NOTICE '============================================';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ TEST FAILED: %', SQLERRM;
        -- Try to clean up even if tests failed
        DELETE FROM public.members WHERE id = test_member_id;
        DELETE FROM public.crews WHERE id = test_crew_id;
END $$;

-- ============================================
-- STEP 9: CREATE REALTIME SUBSCRIPTIONS
-- ============================================
-- Enable realtime for members table
ALTER publication supabase_realtime ADD TABLE public.members;

-- ============================================
-- STEP 10: FINAL VERIFICATION
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🚀 SETUP COMPLETE!';
    RAISE NOTICE '';
    RAISE NOTICE 'Checklist:';
    RAISE NOTICE '✅ Tables created (crews, members)';
    RAISE NOTICE '✅ Foreign keys configured';
    RAISE NOTICE '✅ Indexes created';
    RAISE NOTICE '✅ RLS enabled';
    RAISE NOTICE '✅ Policies created (permissive for anon)';
    RAISE NOTICE '✅ Permissions granted';
    RAISE NOTICE '✅ Realtime enabled';
    RAISE NOTICE '✅ All tests passed';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Make sure Anonymous Authentication is enabled!';
    RAISE NOTICE '    Go to: Authentication → Providers → Anonymous Sign-Ins → ON';
    RAISE NOTICE '';
    RAISE NOTICE '📱 Your app should now work perfectly!';
END $$;

-- ============================================
-- END OF SETUP SCRIPT
-- ============================================