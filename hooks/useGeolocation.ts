
import { useState, useEffect } from 'react';

export type GeolocationErrorType = 'permission-denied' | 'position-unavailable' | 'timeout' | 'unsupported' | 'unknown';

interface GeolocationState {
  location: GeolocationPosition | null;
  error: string | null;
  errorType: GeolocationErrorType | null;
  isLoading: boolean;
}

const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    errorType: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: 'Location services are not supported by your browser. Please use a modern browser.',
        errorType: 'unsupported',
        isLoading: false,
      });
      return;
    }

    let watcherId: number | null = null;
    let isFirstPosition = true;

    const startWatching = () => {
      watcherId = navigator.geolocation.watchPosition(
        (position) => {
          setState({
            location: position,
            error: null,
            errorType: null,
            isLoading: false
          });
          isFirstPosition = false;
        },
        (error) => {
          let errorMessage: string;
          let errorType: GeolocationErrorType;

          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings to use this app.';
              errorType = 'permission-denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Unable to determine your location. Please check your device settings.';
              errorType = 'position-unavailable';
              break;
            case error.TIMEOUT:
              if (isFirstPosition) {
                // More forgiving on first attempt
                errorMessage = 'Getting your location is taking longer than expected. Please ensure you have a clear view of the sky or strong signal.';
              } else {
                errorMessage = 'Location request timed out. Your location may be updating slowly.';
              }
              errorType = 'timeout';
              break;
            default:
              errorMessage = `Location error: ${error.message}`;
              errorType = 'unknown';
          }

          setState(prevState => ({
            ...prevState,
            error: errorMessage,
            errorType,
            isLoading: false
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: isFirstPosition ? 15000 : 10000, // More time for initial position
          maximumAge: 30000, // Allow 30-second old position to reduce battery drain
        }
      );
    };

    startWatching();

    return () => {
      if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId);
      }
    };
  }, []);

  return state;
};

export default useGeolocation;
