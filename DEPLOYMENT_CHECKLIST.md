# Deployment Checklist for Crew Map

## ✅ Fixed Issues (just pushed to GitHub)

1. **Text Input Visibility**
   - Added explicit white text color
   - Added placeholder color styling
   - Added inline CSS as fallback
   - Inputs should now show white text on dark background

2. **Create Crew Button**
   - Added authentication error handling
   - Added user feedback for auth failures
   - Added debug logging to console

## 🔴 CRITICAL: Anonymous Authentication

**The Create Crew button will NOT work unless you enable Anonymous Authentication in Supabase!**

### Steps to Enable:

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard/project/vhlsirvyerzbhyfwsyoj

2. **Navigate to Authentication**
   - Click "Authentication" in the left sidebar

3. **Go to Providers**
   - Click "Providers" tab

4. **Enable Anonymous Sign-Ins**
   - Find "Anonymous" in the list
   - Toggle it ON
   - Save changes

5. **Verify in Settings**
   - Go to "Settings" tab
   - Make sure "Enable anonymous sign-ins" is checked

## 🔍 Debugging Steps

If the Create Crew button still doesn't work:

1. **Open Browser Console** (F12)
   - Look for any error messages
   - You should see "Create button clicked" when you click the button
   - Check for "Anonymous sign-in failed" error

2. **Check Network Tab**
   - Look for failed requests to Supabase
   - Check the response for error details

3. **Common Issues:**
   - Anonymous auth not enabled → Enable it in Supabase
   - Wrong Supabase credentials → Check .env variables
   - Browser blocking cookies → Allow third-party cookies for Supabase

## 📱 Test the App

After enabling anonymous auth:

1. **Hard refresh the page** (Cmd+Shift+R or Ctrl+Shift+R)
2. **Enter your name** (you should see white text)
3. **Select a color**
4. **Click "Create New Crew"**
5. **You should see the map view**

## 🚀 Vercel Auto-Deploy

Your changes will auto-deploy to Vercel if you've connected the repository. If not:

1. Go to your Vercel project
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment

## 📝 Console Logs to Check

Open the browser console and look for:
```
Create button clicked {memberName: "...", selectedColor: "..."}
Validation passed, calling onCreateCrew
```

If you see "Authentication required" instead, anonymous auth is not working.

## Need Help?

- Check Supabase logs: Dashboard → Logs → Auth
- Check browser console for errors
- Verify environment variables in Vercel match your .env file