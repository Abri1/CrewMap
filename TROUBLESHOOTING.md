# Crew Map - Troubleshooting Guide

## Common Issues and Solutions

### 1. "Infinite recursion detected in policy for relation 'members'"

**Problem:** This error occurs when Row Level Security (RLS) policies create circular references.

**Solution:** Run the fix SQL script in your Supabase SQL Editor:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy and paste the contents of `fix-rls-policies.sql`
5. Click **Run**

The script will:
- Drop all existing problematic policies
- Create new, simple non-recursive policies
- Grant proper permissions to anonymous users
- Fix the infinite recursion error

### 2. "500 Internal Server Error" when creating a crew

**Problem:** Anonymous authentication is not enabled.

**Solution:**
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Anonymous Sign-Ins**
3. Save changes

### 3. Text input shows white text on white background

**Status:** ✅ FIXED in latest version

### 4. PWA icons not loading

**Status:** ✅ FIXED in latest version

### 5. Service Worker registration fails

**Status:** ✅ FIXED in latest version

## Debug Tool

Access the debug tool at: https://your-app.vercel.app/debug.html

This tool will:
- Check database connection
- Verify tables exist
- Test anonymous authentication
- Validate RLS policies
- Show specific error messages with solutions

## Quick Setup Checklist

1. ✅ Database tables created (crews, members)
2. ✅ Anonymous authentication enabled
3. ✅ RLS policies configured (use fix-rls-policies.sql)
4. ✅ Environment variables set in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MAPBOX_ACCESS_TOKEN`

## Need More Help?

1. Check the browser console (F12) for detailed error messages
2. Run the debug tool at `/debug.html`
3. Review the SQL migrations in `fix-rls-policies.sql`
4. Ensure all environment variables are properly set