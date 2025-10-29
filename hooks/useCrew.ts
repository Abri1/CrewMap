import { useState, useEffect, useCallback } from 'react';
import { CrewMember, Location } from '../types';
import { subscribeToCrew, updateCrewMemberLocation } from '../services/crewService';
import useGeolocation from './useGeolocation';

interface CrewState {
  crew: CrewMember[];
  loading: boolean;
  error: string | null;
  updateMyLocation: () => Promise<boolean>;
  isConnected: boolean;
  lastUpdateSuccess: boolean | null;
}

const useCrew = (crewId: string | null, memberId: string | null): CrewState => {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastUpdateSuccess, setLastUpdateSuccess] = useState<boolean | null>(null);
  const { location: myLocation, error: geoError, errorType } = useGeolocation();

  useEffect(() => {
    // Only show persistent geolocation errors for critical issues
    if (geoError && errorType === 'permission-denied') {
      setError(geoError);
    } else if (geoError && errorType === 'unsupported') {
      setError(geoError);
    }
    // For timeout and position unavailable, we'll handle them more gracefully
  }, [geoError, errorType]);

  useEffect(() => {
    if (!crewId) {
      setCrew([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setIsConnected(true);
    let unsubscribe: (() => void) | null = null;
    let connectionTimeout: NodeJS.Timeout;

    try {
      // Set a timeout to detect if subscription fails
      connectionTimeout = setTimeout(() => {
        setIsConnected(false);
        setError('Connection to crew updates lost. Your location is still being shared but you may not see others.');
      }, 10000);

      unsubscribe = subscribeToCrew(
        crewId,
        (crewData) => {
          clearTimeout(connectionTimeout);
          setCrew(crewData);
          setLoading(false);
          setIsConnected(true);
          setError(null); // Clear any connection errors
        },
        (error) => {
          // New error callback for subscription failures
          clearTimeout(connectionTimeout);
          setIsConnected(false);
          setError(`Crew updates unavailable: ${error}. Your location is still being shared.`);
          setLoading(false);
        }
      );
    } catch (e: any) {
      clearTimeout(connectionTimeout!);
      setError(`Failed to join crew: ${e.message}`);
      setLoading(false);
      setIsConnected(false);
    }

    return () => {
      if (connectionTimeout) clearTimeout(connectionTimeout);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [crewId]);

  const updateMyLocation = useCallback(async (): Promise<boolean> => {
    if (crewId && memberId && myLocation) {
      const { latitude, longitude, speed } = myLocation.coords;
      const currentLocation: Location = { lat: latitude, lng: longitude };

      try {
        await updateCrewMemberLocation(crewId, memberId, currentLocation, speed);
        setLastUpdateSuccess(true);
        return true;
      } catch (error) {
        console.error('Failed to update location:', error);
        setLastUpdateSuccess(false);
        return false;
      }
    }
    return false;
  }, [crewId, memberId, myLocation]);

  return { crew, loading, error, updateMyLocation, isConnected, lastUpdateSuccess };
};

export default useCrew;
