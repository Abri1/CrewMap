import React, { useState } from 'react';
import { CrewMember } from '../types';
import { ChevronDownIcon, ChevronUpIcon, HarvesterIcon, LogoutIcon, RecenterIcon, SunIcon, UsersIcon, InfoIcon } from './Icons';

interface CrewPanelProps {
  crew: CrewMember[];
  crewId: string;
  selectedMemberId: string | null;
  onMemberSelect: (memberId: string | null) => void;
  onLogout: () => void;
  onRecenter: () => void;
  onToggleKeepAwake: () => void;
  isKeepingAwake: boolean;
  onShowInfo: () => void;
}

const CrewPanel: React.FC<CrewPanelProps> = ({
  crew,
  crewId,
  selectedMemberId,
  onMemberSelect,
  onLogout,
  onRecenter,
  onToggleKeepAwake,
  isKeepingAwake,
  onShowInfo
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatSpeed = (speed: number | null): string => {
    if (speed === null || speed < 0) return 'N/A';
    const mph = speed * 2.23694; // Convert m/s to mph
    return `${mph.toFixed(1)} mph`;
  }

  const formatLastUpdate = (timestamp: string): string => {
    if (!timestamp) return 'N/A';
    const now = new Date();
    const date = new Date(timestamp);
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 5) return 'just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.round(diffSeconds / 60);
    return `${diffMinutes}m ago`;
  }
  
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] p-2">
      <div className="bg-gray-800/90 backdrop-blur-sm text-white rounded-2xl shadow-2xl overflow-hidden max-w-lg mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center space-x-3">
            <HarvesterIcon className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="font-bold text-lg leading-tight">Crew: {crewId}</h2>
              <p className="text-xs text-gray-400">{crew.length} members online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={(e) => { e.stopPropagation(); onShowInfo(); }} className="p-2 rounded-full hover:bg-gray-700"><InfoIcon className="w-6 h-6" /></button>
            {isExpanded ? <ChevronDownIcon className="w-6 h-6" /> : <ChevronUpIcon className="w-6 h-6" />}
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="border-t border-gray-700">
            {/* Action Buttons */}
            <div className="flex justify-around p-2 bg-gray-900/50">
                <button onClick={onRecenter} className="flex flex-col items-center space-y-1 text-gray-300 hover:text-yellow-400 p-2">
                    <RecenterIcon className="w-6 h-6" />
                    <span className="text-xs font-semibold">Recenter</span>
                </button>
                <button onClick={onToggleKeepAwake} className={`flex flex-col items-center space-y-1 ${isKeepingAwake ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 p-2`}>
                    <SunIcon className="w-6 h-6" />
                    <span className="text-xs font-semibold">Keep Awake</span>
                </button>
                 <button onClick={() => onMemberSelect(null)} className="flex flex-col items-center space-y-1 text-gray-300 hover:text-yellow-400 p-2">
                    <UsersIcon className="w-6 h-6" />
                    <span className="text-xs font-semibold">Crew View</span>
                </button>
                <button onClick={onLogout} className="flex flex-col items-center space-y-1 text-red-400 hover:text-red-300 p-2">
                    <LogoutIcon className="w-6 h-6" />
                    <span className="text-xs font-semibold">Logout</span>
                </button>
            </div>

            {/* Member List */}
            <div className="p-2 max-h-48 overflow-y-auto">
              <ul className="space-y-2">
                {crew.sort((a,b) => (a.name || '').localeCompare(b.name || '')).map(member => (
                  <li
                    key={member.id}
                    onClick={() => onMemberSelect(member.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedMemberId === member.id ? 'bg-yellow-400/20' : 'hover:bg-gray-700/80'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: member.color, boxShadow: `0 0 8px ${member.color}` }}></div>
                      <span className="font-semibold">{member.name || '...'}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono">{formatSpeed(member.speed)}</p>
                      <p className="text-xs text-gray-400">{formatLastUpdate(member.lastUpdate)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrewPanel;
