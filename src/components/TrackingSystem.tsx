import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { MapPin, Search, Navigation, Clock, Package, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function TrackingSystem() {
  const { tracking, trucks } = useData();
  const [searchCode, setSearchCode] = useState('');
  const [activeTracking, setActiveTracking] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchCode.toLowerCase();
    
    // Search by container code
    let result = tracking.find(t => t.containerCode.toLowerCase() === query);
    
    // If not found, search by license plate (nomor plat)
    if (!result) {
      const truck = trucks.find(t => t.plateNumber.toLowerCase().replace(/\s/g, '') === query.replace(/\s/g, ''));
      if (truck) {
        // Map asset status to tracking status
        let trackingStatus: any = 'At Port';
        if (truck.status === 'On-going') trackingStatus = 'In Transit';
        if (truck.status === 'Repair') trackingStatus = 'Maintenance';
        if (truck.status === 'Idle') trackingStatus = 'At Port';

        result = {
          id: `TRK-TRUCK-${truck.id}`,
          containerCode: `Truk: ${truck.plateNumber}`,
          location: { 
            lat: truck.status === 'Repair' ? -6.1214 : -6.2088, 
            lng: truck.status === 'Repair' ? 106.7741 : 106.8456, 
            name: truck.status === 'Repair' ? 'Bengkel Pusat (Perbaikan)' : 'Lokasi Truk Terdeteksi' 
          },
          status: trackingStatus,
          eta: truck.status === 'Repair' ? 'N/A (Dalam Perbaikan)' : '2024-04-08 18:00',
          lastUpdate: 'Baru saja',
          isTruck: true,
          truckDetails: truck
        };
      }
    }
    
    setActiveTracking(result || 'not_found');
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sistem Pelacakan Terintegrasi</h2>
        <p className="text-slate-500">
          Lacak lokasi kontainer atau armada Anda secara real-time. Masukkan nomor kontainer atau nomor plat truk untuk melihat status pengiriman.
        </p>
      </div>

      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Nomor Kontainer atau Nomor Plat (B 1234 AB)..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" /> Lacak Sekarang
          </button>
        </form>
      </div>

      {activeTracking === 'not_found' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center"
        >
          <p className="text-red-600 font-bold">Nomor kontainer tidak ditemukan. Pastikan nomor yang Anda masukkan benar.</p>
        </motion.div>
      )}

      {activeTracking && activeTracking !== 'not_found' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden relative min-h-[400px] z-0"
          >
            <MapContainer 
              center={[activeTracking.location.lat, activeTracking.location.lng]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[activeTracking.location.lat, activeTracking.location.lng]}>
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold">{activeTracking.location.name}</p>
                    <p>{activeTracking.isTruck ? activeTracking.truckDetails.plateNumber : activeTracking.containerCode}</p>
                  </div>
                </Popup>
              </Marker>
              <RecenterMap center={[activeTracking.location.lat, activeTracking.location.lng]} />
            </MapContainer>

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-lg z-[1000]">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-3 h-3 text-blue-600" /> Lokasi Real-time Terdeteksi
              </p>
            </div>
          </motion.div>

          {/* Tracking Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Detail Pengiriman</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">{activeTracking.isTruck ? 'Nomor Plat' : 'Nomor Kontainer'}</span>
                  <span className="text-sm font-bold text-slate-900">{activeTracking.isTruck ? activeTracking.truckDetails.plateNumber : activeTracking.containerCode}</span>
                </div>
                {activeTracking.isTruck && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Tipe Truk</span>
                    <span className="text-sm font-bold text-slate-900">{activeTracking.truckDetails.type}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    activeTracking.status === 'In Transit' ? "bg-blue-50 text-blue-600" : 
                    activeTracking.status === 'At Port' ? "bg-emerald-50 text-emerald-600" : 
                    activeTracking.status === 'Maintenance' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {activeTracking.status === 'Maintenance' ? 'Perbaikan' : activeTracking.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Estimasi Tiba (ETA)</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" /> {activeTracking.eta}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500">Update Terakhir</span>
                  <span className="text-sm text-slate-400">{activeTracking.lastUpdate}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg">
              <h4 className="font-bold mb-2">Butuh Bantuan?</h4>
              <p className="text-xs text-blue-100 mb-4">Hubungi tim operasional kami jika ada kendala dalam pelacakan kontainer Anda.</p>
              <button className="w-full py-2 bg-white text-blue-600 font-bold rounded-lg text-sm transition-colors hover:bg-blue-50">
                Hubungi CS (WhatsApp)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
