import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { CrewMember } from '../types';
import { DotMarkerIcon } from './Icons';

// Load Mapbox token from environment variables
const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';
if (!mapboxToken) {
  console.error('Missing Mapbox access token. Please check your environment variables.');
}
mapboxgl.accessToken = mapboxToken;

interface MapViewProps {
  crew: CrewMember[];
  center: { lat: number, lng: number } | null;
  selectedMemberId: string | null;
  onMemberSelect: (memberId: string | null) => void;
}

const MapView: React.FC<MapViewProps> = ({ crew, center, selectedMemberId, onMemberSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center ? [center.lng, center.lat] : [-118.2437, 34.0522],
      zoom: 14,
    });

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  // Pan to center when it changes
  useEffect(() => {
    if (mapInstance.current && center) {
      mapInstance.current.flyTo({
        center: [center.lng, center.lat],
        essential: true,
      });
    }
  }, [center]);

  // Update markers
  useEffect(() => {
    if (!mapInstance.current) return;

    const currentMarkerIds = Object.keys(markers.current);
    const crewMemberIds = crew.map(m => m.id);

    // Remove markers for members who are no longer in the crew
    currentMarkerIds.forEach(id => {
      if (!crewMemberIds.includes(id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });

    // Add/update markers for each crew member
    crew.forEach(member => {
      if (!member.currentLocation || (member.currentLocation.lat === 0 && member.currentLocation.lng === 0)) return;

      const isSelected = member.id === selectedMemberId;

      if (markers.current[member.id]) {
        // Update existing marker
        markers.current[member.id].setLngLat([member.currentLocation.lng, member.currentLocation.lat]);
        const element = markers.current[member.id].getElement();
        element.innerHTML = DotMarkerIcon(member.color, isSelected);
      } else {
        // Create new marker
        const markerElement = document.createElement('div');
        markerElement.innerHTML = DotMarkerIcon(member.color, isSelected);
        markerElement.style.cursor = 'pointer';
        markerElement.addEventListener('click', () => {
          onMemberSelect(member.id);
        });

        const marker = new mapboxgl.Marker({
          element: markerElement,
        })
          .setLngLat([member.currentLocation.lng, member.currentLocation.lat])
          .addTo(mapInstance.current!);

        markers.current[member.id] = marker;
      }
    });

  }, [crew, selectedMemberId, onMemberSelect]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
};

export default MapView;
