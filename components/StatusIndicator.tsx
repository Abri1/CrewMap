import React from 'react';

interface StatusIndicatorProps {
  isConnected: boolean;
  lastUpdateSuccess: boolean | null;
  locationError: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isConnected,
  lastUpdateSuccess,
  locationError
}) => {
  // Only show if there's an issue
  if (isConnected && lastUpdateSuccess !== false && !locationError) {
    return null;
  }

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center space-y-2">
      {!isConnected && (
        <div className="bg-yellow-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
          ⚠️ Connection issues - updates may be delayed
        </div>
      )}
      {lastUpdateSuccess === false && (
        <div className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
          📍 Location sharing interrupted
        </div>
      )}
      {locationError && (
        <div className="bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
          📍 Location access needed
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;