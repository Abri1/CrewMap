import React from 'react';
import { CloseIcon, SunIcon, HarvesterIcon } from './Icons';

interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md p-6 text-white animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Tracking Tips</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4 text-gray-300">
          <p>For the best real-time tracking, please keep Crew Map open on your screen. Here's how to get the best performance:</p>
          
          <div className="flex items-start space-x-4 p-3 bg-gray-700/50 rounded-lg">
            <SunIcon className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white">Use 'Keep Awake'</h3>
              <p className="text-sm">Tap the sun icon on the main panel. This prevents your screen from sleeping, guaranteeing the most accurate and frequent location updates.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-3 bg-gray-700/50 rounded-lg">
            <HarvesterIcon className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white">Install This App</h3>
              <p className="text-sm">Installing Crew Map to your Home Screen gives it higher priority on your device, making it less likely to be closed by the operating system.</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-1">Web App Limitations</h3>
            <p className="text-xs text-gray-400">Due to mobile OS privacy rules, location tracking may slow down or stop if the app is in the background or the screen is off. This is a limitation of all web-based GPS apps. Always use "Keep Awake" for critical tracking periods.</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Got It
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InfoModal;