import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useData } from '../context/DataContext';
import L from 'leaflet';

// Fix for default marker icon using CDN URLs to avoid build issues
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function FleetMap() {
  const { tracking } = useData();
  
  // Default center (Jakarta)
  const center: [number, number] = [-6.2088, 106.8456];

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-0">
      <MapContainer 
        center={center} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tracking.map((item) => (
          <Marker key={item.id} position={[item.location.lat, item.location.lng]}>
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-blue-600">{item.containerCode}</p>
                <p className="font-medium">{item.location.name}</p>
                <p className="text-slate-500">Status: {item.status}</p>
                <p className="text-slate-500">ETA: {item.eta}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
