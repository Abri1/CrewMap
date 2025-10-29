import React from 'react';
import { CloseIcon, ShareIosIcon } from './Icons';

interface InstallInstructionsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const InstallInstructionsModal: React.FC<InstallInstructionsModalProps> = ({ isVisible, onClose }) => {
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
          <h2 className="text-2xl font-bold text-yellow-400">Install App</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 text-gray-300">
          <p>For the best experience, install Crew Map to your Home Screen. This allows for improved background tracking and easy access.</p>
          
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <p className="font-semibold">On iOS (Safari):</p>
            <p className="text-sm mt-2">
              Tap the <ShareIosIcon className="w-5 h-5 inline-block mx-1" /> icon in the browser toolbar, then scroll down and tap 'Add to Home Screen'.
            </p>
          </div>

          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <p className="font-semibold">On Android (Chrome):</p>
             <p className="text-sm mt-2">
              Tap the three dots in the top right corner, then select 'Install app' or 'Add to Home screen'.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Done
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

export default InstallInstructionsModal;
