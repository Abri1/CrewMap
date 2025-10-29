import { CrewMember, Location } from '../types';

let mockCrew: CrewMember[] = [
  // FIX: Changed lastUpdate from Date.now() (number) to new Date().toISOString() (string) to match the CrewMember type definition.
  { id: 'john-doe', name: 'John Doe', color: '#EF4444', currentLocation: { lat: 34.0522, lng: -118.2437 }, path: [], speed: 5, lastUpdate: new Date().toISOString() },
  // FIX: Changed lastUpdate from Date.now() (number) to new Date().toISOString() (string) to match the CrewMember type definition.
  { id: 'jane-smith', name: 'Jane Smith', color: '#3B82F6', currentLocation: { lat: 34.055, lng: -118.245 }, path: [], speed: 3, lastUpdate: new Date().toISOString() },
  // FIX: Changed lastUpdate from Date.now() (number) to new Date().toISOString() (string) to match the CrewMember type definition.
  { id: 'bob-johnson', name: 'Bob Johnson', color: '#22C55E', currentLocation: { lat: 34.050, lng: -118.250 }, path: [], speed: 0, lastUpdate: new Date().toISOString() },
];

// FIX: Changed NodeJS.Timeout to number for browser compatibility.
let intervalId: number | null = null;

const moveCrew = () => {
  mockCrew = mockCrew.map(member => {
    const newLat = member.currentLocation.lat + (Math.random() - 0.5) * 0.0005;
    const newLng = member.currentLocation.lng + (Math.random() - 0.5) * 0.0005;
    return {
      ...member,
      currentLocation: { lat: newLat, lng: newLng },
      speed: Math.random() * 15,
      // FIX: Changed lastUpdate from Date.now() (number) to new Date().toISOString() (string) to match the CrewMember type definition.
      lastUpdate: new Date().toISOString(),
    };
  });
};

export const subscribeToCrew = (crewId: string, callback: (crew: CrewMember[]) => void): (() => void) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  callback(mockCrew); // Initial call
  
  intervalId = setInterval(() => {
    moveCrew();
    callback([...mockCrew]);
  }, 3000);

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};

export const updateCrewMemberLocation = (crewId: string, memberId: string, location: Location, speed: number | null) => {
  mockCrew = mockCrew.map(member => 
    // FIX: Changed lastUpdate from Date.now() (number) to new Date().toISOString() (string) to match the CrewMember type definition.
    member.id === memberId ? { ...member, currentLocation: location, speed: speed ?? member.speed, lastUpdate: new Date().toISOString() } : member
  );
};


export const createOrJoinCrew = async (crewId: string, memberName: string, color: string): Promise<CrewMember> => {
    const memberId = memberName.toLowerCase().replace(/\s+/g, '-');
    const existing = mockCrew.find(m => m.id === memberId);
    if(existing) {
        existing.color = color;
        return existing;
    }

    const newMember: CrewMember = {
        id: memberId,
        name: memberName,
        color,
        currentLocation: { lat: 34.05, lng: -118.24 }, // Starting location
        path: [],
        speed: 0,
        // FIX: Changed lastUpdate from Date.now() (number) to new Date().toISOString() (string) to match the CrewMember type definition.
        lastUpdate: new Date().toISOString(),
    };
    mockCrew.push(newMember);
    return newMember;
};
