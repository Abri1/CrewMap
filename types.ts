export interface Location {
  lat: number;
  lng: number;
}

export interface CrewMember {
  id: string; // User UUID from Supabase Auth
  name?: string;
  color: string;
  currentLocation: Location;
  path: Location[];
  speed: number; // in m/s
  lastUpdate: string; // ISO timestamp string
}
