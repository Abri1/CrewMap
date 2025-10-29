import React, { useState } from 'react';
import { HarvesterIcon, SpinnerIcon } from './Icons';

interface CrewSetupProps {
  onCreateCrew: (memberName: string, color: string) => void;
  onJoinCrew: (crewId: string, memberName: string) => void;
  loading: boolean;
}

const colors = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#14B8A6',
  '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E',
];

const CrewSetup: React.FC<CrewSetupProps> = ({ onCreateCrew, onJoinCrew, loading }) => {
  const [selectedColor, setSelectedColor] = useState(colors[Math.floor(Math.random() * colors.length)]);
  const [memberName, setMemberName] = useState('');
  const [crewId, setCrewId] = useState('');
  const [error, setError] = useState('');
  
  const validate = () => {
      if (!memberName.trim()) {
          setError('Your name is required.');
          return false;
      }
      setError('');
      return true;
  }

  const handleCreate = () => {
      if(validate()) {
          onCreateCrew(memberName.trim(), selectedColor);
      }
  }

  const handleJoin = () => {
    if(validate()) {
        if (!crewId.trim()) {
            setError('Crew ID is required to join.');
            return;
        }
        onJoinCrew(crewId.trim().toLowerCase(), memberName.trim());
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-6">
        <HarvesterIcon className="w-20 h-20 text-yellow-400 mx-auto" />
        <h1 className="text-4xl font-bold text-white">Crew Map</h1>
        <p className="text-gray-400">Live location tracking for your harvest crew.</p>
      </div>
      <div className="w-full max-w-sm bg-slate-800 p-6 rounded-lg shadow-lg">
        {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Your Name</label>
          <input
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            placeholder="e.g., John D."
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-3">Your Color</label>
          <div className="flex flex-wrap justify-center gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-slate-900/50 rounded-md">
            <label className="block text-gray-300 mb-2">Join Existing Crew</label>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={crewId}
                    onChange={(e) => setCrewId(e.target.value)}
                    className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="Enter Crew ID"
                    autoCapitalize="none"
                />
                <button onClick={handleJoin} disabled={loading} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 disabled:opacity-50">
                    Join
                </button>
            </div>
        </div>

        <div className="flex items-center my-4">
            <hr className="flex-grow border-slate-700"/>
            <span className="px-2 text-slate-500">OR</span>
            <hr className="flex-grow border-slate-700"/>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-500 transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {loading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : 'Create New Crew'}
        </button>
      </div>
    </div>
  );
};

export default CrewSetup;
