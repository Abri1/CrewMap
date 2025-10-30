# 🚀 Supabase Setup Instructions for Crew Map

## Quick Setup (2 Minutes)

### Step 1: Enable Anonymous Authentication ⚠️ CRITICAL
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Anonymous Sign-Ins**
5. **Toggle it ON** (if it's off, this is why you get 500 errors!)
6. Click **Save**

### Step 2: Run the Complete Setup Script
1. Go to **SQL Editor** in Supabase
2. Click **New query**
3. Copy ALL contents from: `COMPLETE_SUPABASE_SETUP.sql`
4. Paste into the editor
5. Click **Run** (or press F5)

### Step 3: Verify Success
You should see output like:
```
✅ Crew insertion: SUCCESS
✅ Member insertion: SUCCESS
✅ Member update: SUCCESS
✅ Select query: SUCCESS
✅ Cleanup: SUCCESS
ALL TESTS PASSED! 🎉
```

### Step 4: Test Your App
1. Go to your app
2. Enter your name
3. Click "Create New Crew"
4. It should work! 🎉

---

## What the Script Does

1. **Drops everything** - Starts completely fresh
2. **Creates tables** - With proper structure and constraints
3. **Sets up indexes** - For fast queries
4. **Enables RLS** - Row Level Security
5. **Creates open policies** - Allows anonymous users full access
6. **Grants permissions** - To anon, authenticated, and service_role
7. **Runs tests** - Verifies everything works
8. **Enables realtime** - For live updates

---

## Troubleshooting

### Still getting 500 errors?
1. **Anonymous Auth is OFF** - Check Step 1 again!
2. **Script didn't run completely** - Run it again
3. **Check logs**: SQL Editor → Show output messages

### Want to verify everything manually?
Run this test query:
```sql
-- Test insert
INSERT INTO public.crews (id) VALUES ('TEST-123');
INSERT INTO public.members (id, crew_id, name, color)
VALUES ('USER-123', 'TEST-123', 'Test User', '#fbbf24');

-- Check it worked
SELECT * FROM public.members WHERE crew_id = 'TEST-123';

-- Clean up
DELETE FROM public.members WHERE crew_id = 'TEST-123';
DELETE FROM public.crews WHERE id = 'TEST-123';
```

### Need to start over?
Just run `COMPLETE_SUPABASE_SETUP.sql` again - it handles cleanup automatically!

---

## Environment Variables for Vercel

Make sure these are set in Vercel:
```
VITE_SUPABASE_URL=https://vhlsirvyerzbhyfwsyoj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYWJyaWIi...
```

---

## Success Checklist

- [x] Anonymous Authentication is ON
- [x] COMPLETE_SUPABASE_SETUP.sql ran successfully
- [x] All tests passed
- [x] Environment variables are set
- [x] App creates crews without errors

---

## Still Need Help?

1. Check browser console (F12) for errors
2. Visit `/debug.html` on your app
3. Review the test output in SQL Editor

The setup script is bulletproof - if it runs successfully and anonymous auth is on, your app WILL work!