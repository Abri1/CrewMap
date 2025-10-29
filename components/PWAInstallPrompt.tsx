import React, { useState, useEffect } from 'react';
import { HarvesterIcon, CloseIcon } from './Icons';

// The BeforeInstallPromptEvent is not part of the standard DOM event types
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!localStorage.getItem('pwaInstallDismissed')) {
         setIsVisible(true);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setIsVisible(false);
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };
  
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwaInstallDismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[2000] w-[calc(100%-1rem)] max-w-md">
      <div className="bg-gray-800 text-white rounded-xl shadow-2xl p-4 flex items-center space-x-4 animate-fade-in-down">
        <HarvesterIcon className="w-10 h-10 text-yellow-400 flex-shrink-0" />
        <div className="flex-grow">
          <p className="font-bold">Install Crew Map</p>
          <p className="text-xs text-gray-300">Add to Home Screen for a better experience.</p>
        </div>
        <button
          onClick={handleInstallClick}
          className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-md text-sm whitespace-nowrap"
        >
          Install
        </button>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
       <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PWAInstallPrompt;
