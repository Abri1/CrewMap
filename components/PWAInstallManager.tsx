import React, { useState, useEffect } from 'react';
import { HarvesterIcon, CloseIcon } from './Icons';

// Platform detection utilities
const getPlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }

  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  // Windows Phone detection
  if (/windows phone/i.test(userAgent)) {
    return 'windows';
  }

  return 'desktop';
};

const isInstalled = () => {
  // Check if app is running in standalone mode
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
};

// The BeforeInstallPromptEvent is not part of the standard DOM event types
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface IOSInstallInstructionsProps {
  onClose: () => void;
}

const IOSInstallInstructions: React.FC<IOSInstallInstructionsProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/80 z-[3000] flex items-end">
      <div className="bg-gray-900 text-white w-full max-w-lg mx-auto rounded-t-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">📲</span>
            Install Crew Map
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {step === 1 && (
          <>
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-200">
                Installing Crew Map as an app gives you the best tracking experience with:
              </p>
              <ul className="text-xs text-blue-200 mt-2 space-y-1">
                <li>• Full-screen experience without browser UI</li>
                <li>• Better GPS accuracy and background tracking</li>
                <li>• Quick access from your home screen</li>
                <li>• Works offline once installed</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="bg-amber-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="font-semibold">Tap the Share button</p>
                  <p className="text-sm text-gray-400">Look for <span className="inline-block bg-blue-600 px-2 py-1 rounded text-xs">⬆️ Share</span> at the bottom of Safari</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-amber-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="font-semibold">Scroll down and tap "Add to Home Screen"</p>
                  <p className="text-sm text-gray-400">You'll see <span className="inline-block bg-gray-700 px-2 py-1 rounded text-xs">➕ Add to Home Screen</span></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-amber-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="font-semibold">Tap "Add"</p>
                  <p className="text-sm text-gray-400">The app will be added to your home screen</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-lg"
              >
                Show Visual Guide
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg"
              >
                I'll Do It Later
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-center mb-4">⬇️ Tap the Share button below ⬇️</p>
              <div className="bg-gray-700 rounded-lg p-4 relative">
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
                  <div className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                    <span>⬆️</span>
                    <span className="text-sm">Share</span>
                  </div>
                </div>
                <div className="h-32"></div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400 mb-4">
              Then scroll and find "Add to Home Screen"
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg"
              >
                Back to Instructions
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-lg"
              >
                Got It!
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

interface AndroidInstallPromptProps {
  onInstall: () => void;
  onClose: () => void;
}

const AndroidInstallPrompt: React.FC<AndroidInstallPromptProps> = ({ onInstall, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-2xl p-6 max-w-sm w-full animate-scale-in">
        <div className="flex justify-center mb-4">
          <div className="bg-amber-500 rounded-2xl p-4">
            <HarvesterIcon className="w-16 h-16 text-gray-900" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Install Crew Map</h2>
        <p className="text-center text-gray-400 mb-6">
          Get the best tracking experience with our app
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            <span className="text-sm">Quick access from home screen</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            <span className="text-sm">Better GPS accuracy</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            <span className="text-sm">Works offline</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            <span className="text-sm">Full-screen experience</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg"
          >
            Not Now
          </button>
          <button
            onClick={onInstall}
            className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-lg"
          >
            Install App
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const PWAInstallManager: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [platform, setPlatform] = useState<string>('');

  useEffect(() => {
    const detectedPlatform = getPlatform();
    setPlatform(detectedPlatform);

    // Check if already installed
    if (isInstalled()) {
      return;
    }

    // Check if user has dismissed the prompt recently
    const dismissedTime = localStorage.getItem('pwaInstallDismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show for a week after dismissal
      }
    }

    // For iOS, show instructions after a delay if in Safari
    if (detectedPlatform === 'ios') {
      const isInSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
      if (isInSafari) {
        const hasSeenInstructions = localStorage.getItem('iosInstructionsSeen');
        if (!hasSeenInstructions) {
          setTimeout(() => {
            setShowIOSInstructions(true);
          }, 5000); // Show after 5 seconds
        }
      }
    }

    // For Android/Chrome, handle the install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after a delay
      setTimeout(() => {
        setShowAndroidPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setDeferredPrompt(null);
      setShowAndroidPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;

    setShowAndroidPrompt(false);
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    if (outcome === 'dismissed') {
      localStorage.setItem('pwaInstallDismissed', Date.now().toString());
    }

    setDeferredPrompt(null);
  };

  const handleIOSClose = () => {
    setShowIOSInstructions(false);
    localStorage.setItem('iosInstructionsSeen', 'true');
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  };

  const handleAndroidClose = () => {
    setShowAndroidPrompt(false);
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  };

  // Don't show anything if already installed
  if (isInstalled()) {
    return null;
  }

  return (
    <>
      {showIOSInstructions && platform === 'ios' && (
        <IOSInstallInstructions onClose={handleIOSClose} />
      )}

      {showAndroidPrompt && deferredPrompt && (
        <AndroidInstallPrompt
          onInstall={handleAndroidInstall}
          onClose={handleAndroidClose}
        />
      )}

      {/* Mini banner for returning users */}
      {!showIOSInstructions && !showAndroidPrompt && platform === 'ios' && (
        <button
          onClick={() => setShowIOSInstructions(true)}
          className="fixed top-2 right-2 z-[1500] bg-amber-500 text-black px-3 py-1 rounded-lg text-xs font-bold shadow-lg"
        >
          📲 Install App
        </button>
      )}
    </>
  );
};

export default PWAInstallManager;