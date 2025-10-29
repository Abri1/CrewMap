# Crew Map 📍

A real-time location tracking Progressive Web App (PWA) built with React, TypeScript, Mapbox, and Supabase. Track your crew's locations on a live map with optimized battery usage and offline support.

![Crew Map](https://img.shields.io/badge/PWA-Ready-brightgreen) ![React](https://img.shields.io/badge/React-19.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Mapbox](https://img.shields.io/badge/Mapbox-GL-orange) ![Supabase](https://img.shields.io/badge/Supabase-Realtime-green)

## ✨ Features

- **Real-time Location Tracking**: See crew members' positions update live on the map
- **Optimized Battery Usage**: Smart 15-second update intervals with cached GPS positions
- **PWA Support**: Install as native app on iOS and Android
- **Offline Capable**: Works without internet connection using cached data
- **Platform-Specific Guides**: Step-by-step installation instructions for iOS and Android
- **Anonymous Authentication**: No sign-up required, just join a crew
- **Custom Markers**: Color-coded crew members with status indicators
- **Connection Monitoring**: Visual feedback for location sharing and network status
- **Mobile-First Design**: Optimized for mobile devices with dark theme

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Mapbox account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abri1/CrewMap.git
   cd CrewMap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
   ```

4. **Set up Supabase database**

   Go to your Supabase project → SQL Editor and run:
   ```sql
   -- Create the 'crews' table
   CREATE TABLE public.crews (
     id TEXT PRIMARY KEY,
     created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
   );

   -- Create the 'members' table
   CREATE TABLE public.members (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     crew_id TEXT NOT NULL REFERENCES public.crews(id) ON DELETE CASCADE,
     name TEXT,
     color TEXT DEFAULT '#F59E0B' NOT NULL,
     current_location JSONB,
     path JSONB[] DEFAULT '{}'::JSONB[],
     speed REAL DEFAULT 0,
     last_update TIMESTAMPTZ DEFAULT NOW() NOT NULL
   );

   -- Enable Realtime updates
   ALTER TABLE public.members REPLICA IDENTITY FULL;
   DROP PUBLICATION IF EXISTS supabase_realtime;
   CREATE PUBLICATION supabase_realtime FOR TABLE public.members;

   -- Enable RLS
   ALTER TABLE public.crews ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Allow authenticated users to read crew data"
   ON public.crews FOR SELECT TO authenticated USING (true);

   CREATE POLICY "Allow authenticated users to create crews"
   ON public.crews FOR INSERT TO authenticated WITH CHECK (true);

   CREATE POLICY "Allow members to see each other in the same crew"
   ON public.members FOR SELECT TO authenticated
   USING (crew_id IN (SELECT crew_id FROM public.members WHERE id = auth.uid()));

   CREATE POLICY "Allow users to create their own member entry"
   ON public.members FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

   CREATE POLICY "Allow users to update their own member entry"
   ON public.members FOR UPDATE TO authenticated
   USING (id = auth.uid()) WITH CHECK (id = auth.uid());

   CREATE POLICY "Allow users to delete their own member entry"
   ON public.members FOR DELETE TO authenticated USING (id = auth.uid());
   ```

5. **Enable Anonymous Sign-in in Supabase**

   Go to Authentication → Providers → Enable "Anonymous Sign-Ins"

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📱 Deploying to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Abri1/CrewMap&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,VITE_MAPBOX_ACCESS_TOKEN)

### Manual Deploy

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MAPBOX_ACCESS_TOKEN`
5. Deploy!

### Environment Variables for Production

In Vercel Dashboard → Settings → Environment Variables, add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

## 🔧 Configuration

### Location Update Frequency

Default is 15 seconds. To change, edit `App.tsx:124`:
```typescript
const interval = setInterval(updateLocationWithFeedback, 15000); // milliseconds
```

### GPS Accuracy Settings

Configure in `hooks/useGeolocation.ts:80-84`:
```typescript
{
  enableHighAccuracy: true,
  timeout: 15000, // 15 seconds for initial position
  maximumAge: 30000, // Allow 30-second cached position
}
```

### Map Style

Change Mapbox style in `components/MapView.tsx:26`:
```typescript
style: 'mapbox://styles/mapbox/dark-v11', // or 'streets-v12', 'satellite-v9', etc.
```

## 🏗️ Project Structure

```
crew-map/
├── components/          # React components
│   ├── CrewPanel.tsx   # Crew member list and controls
│   ├── MapView.tsx     # Mapbox map component
│   ├── PWAInstallManager.tsx  # Install prompts
│   └── StatusIndicator.tsx    # Connection status
├── hooks/              # Custom React hooks
│   ├── useCrew.ts     # Crew data and realtime updates
│   └── useGeolocation.ts  # GPS location tracking
├── services/           # API and service layer
│   ├── crewService.ts # Crew CRUD operations
│   └── supabase.ts    # Supabase client
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── App.tsx            # Main application
```

## 🔐 Security

- **Environment Variables**: All sensitive keys are stored in environment variables
- **Row Level Security**: Supabase RLS policies ensure users only see their crew
- **Anonymous Auth**: No personal data collected
- **.env in .gitignore**: Credentials never committed to repository

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Safari 14+ (iOS 14+)
- ✅ Firefox 88+
- ✅ Samsung Internet 14+

## 📊 Performance Optimizations

- **15-second location updates** (vs typical 5-second) = 66% fewer requests
- **30-second GPS cache** reduces constant GPS polling
- **Service Worker caching** for offline support
- **Network-first API strategy** with cache fallback
- **Optimized bundle size** with tree-shaking
- **Lazy loading** for non-critical components

## 🐛 Troubleshooting

### Location not updating
- Check browser permissions for location access
- Ensure you're on HTTPS (required for geolocation)
- Check the status indicator at the top of the map

### PWA not installing
- **iOS**: Must use Safari browser
- **Android**: Ensure HTTPS and valid manifest
- Clear browser cache and reload

### Real-time updates not working
- Verify Supabase Realtime is enabled
- Check that the publication was created correctly
- Look for connection status indicator

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs) for maps
- [Supabase](https://supabase.com) for backend and realtime
- [Vite](https://vitejs.dev) for blazing fast builds
- [Tailwind CSS](https://tailwindcss.com) for styling

## 📧 Support

For issues and questions, please [open an issue](https://github.com/Abri1/CrewMap/issues) on GitHub.

---

Built with ❤️ using React, TypeScript, and modern web technologies