import React, { useEffect, useState } from 'react';
import { InfoIcon } from './Icons';

interface ToastProps {
  message?: string;
  type?: 'info' | 'error';
  isVisible: boolean;
  duration?: number;
  onHide?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  isVisible,
  duration = 3500,
  onHide
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible && message) {
      // Small delay to ensure animation triggers
      const showTimer = setTimeout(() => setShow(true), 10);

      // Hide after duration
      const hideTimer = setTimeout(() => {
        setShow(false);
        // Notify parent after animation completes
        setTimeout(() => onHide?.(), 300);
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShow(false);
    }
  }, [isVisible, message, duration, onHide]);

  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  const icon = type === 'error' ? '⚠️' : 'ℹ️';

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[2000] max-w-sm mx-4 transition-all duration-300 ease-in-out
        ${show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}
    >
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg`}>
        <div className="flex items-start space-x-3">
          <span className="text-xl" aria-label={type}>{icon}</span>
          <span className="font-medium text-sm leading-tight">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Toast;
