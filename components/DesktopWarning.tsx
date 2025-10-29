import React from 'react';
import { HarvesterIcon } from './Icons';

const DesktopWarning: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800 p-8 text-center">
      <HarvesterIcon className="w-32 h-32 text-yellow-400 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-white mb-4">
        Mobile Experience Recommended
      </h1>
      <p className="text-gray-300 text-lg max-w-md">
        Crew Map is designed for mobile use. For the best experience, please open this application on your smartphone.
      </p>
    </div>
  );
};

export default DesktopWarning;