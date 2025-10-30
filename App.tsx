
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useCrew from './hooks/useCrew';
import useGeolocation from './hooks/useGeolocation';
// FIX: Removed unused 'Login' import that caused a module resolution error.
import MapView from './components/MapView';
import CrewPanel from './components/CrewPanel';
import CrewSetup from './components/CrewSetup';
import { joinCrew, createCrew, leaveCrew } from './services/crewService';
import { CrewMember } from './types';
import DesktopWarning from './components/DesktopWarning';
import Toast from './components/Toast';
import InfoModal from './components/InfoModal';
import PWAInstallManager from './components/PWAInstallManager';
import StatusIndicator from './components/StatusIndicator';
import { supabase } from './services/supabase';
// FIX: Replaced direct User import with Session to be compatible with Supabase JS v1,
// which appears to be the installed version based on the compilation errors.
import { Session } from '@supabase/supabase-js';
import { SpinnerIcon } from './components/Icons';

// Self-contained hook to manage screen wake lock.
const useWakeLock = () => {
    const [isLocked, setIsLocked] = useState(false);
    const wakeLock = useRef<WakeLockSentinel | null>(null);
    const isSupported = typeof window !== 'undefined' && 'wakeLock' in navigator;
  
    const request = useCallback(async () => {
      if (!isSupported) return;
      try {
        wakeLock.current = await navigator.wakeLock.request('screen');
        setIsLocked(true);
        wakeLock.current.addEventListener('release', () => setIsLocked(false));
      } catch (err: any) { console.error(`Wake Lock error: ${err.name}, ${err.message}`); }
    }, [isSupported]);
  
    const release = useCallback(async () => {
      if (!isSupported || !wakeLock.current) return;
      await wakeLock.current.release();
      wakeLock.current = null;
    }, [isSupported]);
    
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (wakeLock.current && document.visibilityState === 'visible') request();
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [request, release]);
  
    return { isSupported, isLocked, request, release };
};

type AuthState = 'authenticating' | 'authenticated' | 'unauthenticated';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('authenticating');
  // FIX: User state is now typed using Session['user'] for Supabase JS v1 compatibility.
  const [user, setUser] = useState<Session['user'] | null>(null);
  const [session, setSession] = useState<{ crewId: string; member: CrewMember } | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [toast, setToast] = useState<{ message: string, type: 'info' | 'error' } | null>(null);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { isSupported, isLocked, request, release } = useWakeLock();
  const { crew, error: crewError, updateMyLocation, isConnected, lastUpdateSuccess } = useCrew(session?.crewId ?? null, user?.id ?? null);
  const { location: myLocation, error: geoError, errorType, isLoading: geoLoading } = useGeolocation();

  // Initialize authentication with Supabase v2 API
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setAuthState('authenticated');
        } else {
          // Perform anonymous sign-in for new users
          const { data, error } = await supabase.auth.signInAnonymously();
          if (!error && data?.user) {
            setUser(data.user);
            setAuthState('authenticated');
          } else {
            console.error('Anonymous sign-in failed:', error);
            setToast({ message: 'Authentication failed. Please enable anonymous sign-in in Supabase.', type: 'error' });
            setAuthState('unauthenticated');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState('unauthenticated');
      }
    };

    initAuth();
  }, []);

  // Improve session persistence with validation
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('crew-session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        // Validate session has required fields
        if (parsed.crewId && parsed.memberId) {
          setSession(parsed);
        } else {
          console.warn("Invalid session data, clearing");
          localStorage.removeItem('crew-session');
        }
      }
    } catch (e) {
      console.error("Failed to load session", e);
      localStorage.removeItem('crew-session');
      setToast({ message: 'Previous session could not be restored', type: 'info' });
    }
  }, []);

  // Fix race condition and optimize location update frequency
  useEffect(() => {
    if (!myLocation || !session?.crewId || !user?.id) return;

    // Update immediately when location is first available
    const updateLocationWithFeedback = async () => {
      const success = await updateMyLocation();
      if (!success && lastUpdateSuccess === false) {
        // Only show error after multiple failures
        setToast({ message: 'Unable to share your location. Check your connection.', type: 'error' });
      }
    };

    // Initial update
    updateLocationWithFeedback();

    // Set up interval - 15 seconds is better for battery life
    const interval = setInterval(updateLocationWithFeedback, 15000);

    return () => clearInterval(interval);
  }, [session?.crewId, user?.id]); // Remove myLocation from deps to avoid recreating interval

  // Separate effect for immediate location updates on significant movement
  useEffect(() => {
    if (myLocation && session?.crewId && user?.id) {
      updateMyLocation();
    }
  }, [myLocation?.coords.latitude, myLocation?.coords.longitude]);

  const handleJoinCrew = async (crewId: string, memberName: string) => {
    if (!user) {
      showToast('Authentication required. Please refresh the page.', 'error');
      return;
    }
    setLoading(true);
    try {
      const member = await joinCrew(crewId, user.id, memberName);
      if (member) {
        const newSession = { crewId, member };
        setSession(newSession);
        localStorage.setItem('crew-session', JSON.stringify(newSession));
      } else {
        showToast('Crew not found.', 'error');
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateCrew = async (memberName: string, color: string) => {
    if (!user) {
      showToast('Authentication required. Please refresh the page.', 'error');
      return;
    }
    setLoading(true);
    try {
      const { crewId, member } = await createCrew(user.id, memberName, color);
      const newSession = { crewId, member };
      setSession(newSession);
      localStorage.setItem('crew-session', JSON.stringify(newSession));
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (session && user) {
        await leaveCrew(session.crewId, user.id);
    }
    localStorage.removeItem('crew-session');
    setSession(null);
    setSelectedMemberId(null);
    if(isLocked) release();
  };
  
  const handleRecenter = () => setSelectedMemberId(user?.id ?? null);
  const handleToggleKeepAwake = () => isLocked ? release() : request();
  const showToast = (message: string, type: 'info' | 'error' = 'info') => {
    setToast({ message, type });
  };
  
  useEffect(() => {
    if (geoError) showToast(geoError, 'error');
    if (crewError) showToast(crewError, 'error');
  }, [geoError, crewError]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCenter = useCallback(() => {
    const selectedMember = crew.find(m => m.id === selectedMemberId);
    if (selectedMember?.currentLocation?.lat && selectedMember?.currentLocation?.lng) {
      return selectedMember.currentLocation;
    }
    if (myLocation) {
      return { lat: myLocation.coords.latitude, lng: myLocation.coords.longitude };
    }
    const firstMember = crew.find(m => m.currentLocation?.lat && m.currentLocation?.lng);
    if (firstMember) {
      return firstMember.currentLocation;
    }
    // Default fallback to avoid null - LA coordinates
    return { lat: 34.0522, lng: -118.2437 };
  }, [crew, myLocation, selectedMemberId]);

  if (isDesktop) return <DesktopWarning />;

  if (authState === 'authenticating') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <SpinnerIcon className="w-12 h-12 text-yellow-400 animate-spin" />
        <p className="text-white mt-4">Connecting to service...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (session) {
      return (
        <>
          <MapView
            crew={crew}
            center={getCenter()}
            selectedMemberId={selectedMemberId}
            onMemberSelect={setSelectedMemberId}
          />
          <StatusIndicator
            isConnected={isConnected}
            lastUpdateSuccess={lastUpdateSuccess}
            locationError={errorType === 'permission-denied'}
          />
          <CrewPanel
            crew={crew}
            crewId={session.crewId}
            selectedMemberId={selectedMemberId}
            onMemberSelect={setSelectedMemberId}
            onLogout={handleLogout}
            onRecenter={handleRecenter}
            onToggleKeepAwake={handleToggleKeepAwake}
            isKeepingAwake={isLocked}
            onShowInfo={() => setInfoModalVisible(true)}
          />
        </>
      );
    }
    return <CrewSetup onCreateCrew={handleCreateCrew} onJoinCrew={handleJoinCrew} loading={loading} />;
  };

  return (
    <div className="w-screen h-screen bg-gray-700">
      <Toast
        message={toast?.message}
        type={toast?.type}
        isVisible={!!toast}
        onHide={() => setToast(null)}
      />
      <InfoModal isVisible={isInfoModalVisible} onClose={() => setInfoModalVisible(false)} />
      <PWAInstallManager />
      {renderContent()}
    </div>
  );
};

export default App;
