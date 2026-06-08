import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { TRUCK_TYPES, SHIP_TYPES } from '../data/mockData';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Truck as TruckIcon, Ship as ShipIcon } from 'lucide-react';
import Modal from './Modal';
import { cn } from '../lib/utils';

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#64748b'];

export default function Availability() {
  const { trucks, ships, vendors, addTruck, addShip } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetType, setAssetType] = useState<'truck' | 'ship'>('truck');

  const truckStats = {
    ready: trucks.filter(t => t.status === 'Ready').length,
    ongoing: trucks.filter(t => t.status === 'On-going').length,
    repair: trucks.filter(t => t.status === 'Repair').length,
    idle: trucks.filter(t => t.status === 'Idle').length,
  };

  const shipStats = {
    ready: ships.filter(s => s.status === 'Ready').length,
    ongoing: ships.filter(s => s.status === 'On-going').length,
    repair: ships.filter(s => s.status === 'Repair').length,
    idle: ships.filter(s => s.status === 'Idle').length,
  };

  const truckData = [
    { name: 'Siap', value: truckStats.ready },
    { name: 'Berjalan', value: truckStats.ongoing },
    { name: 'Perbaikan', value: truckStats.repair },
    { name: 'Menganggur', value: truckStats.idle },
  ];

  const shipData = [
    { name: 'Siap', value: shipStats.ready },
    { name: 'Berjalan', value: shipStats.ongoing },
    { name: 'Perbaikan', value: shipStats.repair },
    { name: 'Menganggur', value: shipStats.idle },
  ];

  const handleAddAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (assetType === 'truck') {
      addTruck({
        id: `T${String(trucks.length + 1).padStart(3, '0')}`,
        type: formData.get('type') as string,
        plateNumber: formData.get('plate') as string,
        vendor: formData.get('vendor') as string,
        status: 'Ready',
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        capacity: formData.get('capacity') as string,
        year: parseInt(formData.get('year') as string),
        fuelConsumption: 15
      });
    } else {
      addShip({
        id: `S${String(ships.length + 1).padStart(3, '0')}`,
        name: formData.get('name') as string,
        type: formData.get('type') as string,
        vendor: formData.get('vendor') as string,
        status: 'Ready',
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        capacity: formData.get('capacity') as string,
        year: parseInt(formData.get('year') as string),
        deadweight: 15000
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ketersediaan Armada</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => { setAssetType('truck'); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Truk
          </button>
          <button 
            onClick={() => { setAssetType('ship'); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Kapal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Truck Availability Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900">
            <TruckIcon className="w-5 h-5 text-blue-600" /> Status Armada Truk
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={truckData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {truckData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Ship Availability Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900">
            <ShipIcon className="w-5 h-5 text-emerald-600" /> Status Armada Kapal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shipData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {shipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Detailed Status Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Monitor Status Aset</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
              {truckStats.repair + shipStats.repair} Aset dalam Perbaikan
            </span>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0">
              <tr>
                <th className="px-6 py-3 font-medium">ID Aset</th>
                <th className="px-6 py-3 font-medium">Tipe</th>
                <th className="px-6 py-3 font-medium">Nama/Plat</th>
                <th className="px-6 py-3 font-medium">Vendor</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Maint. Berikutnya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...trucks, ...ships].slice(0, 50).map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-blue-600">{asset.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{asset.type}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{'plateNumber' in asset ? asset.plateNumber : asset.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{asset.vendor}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-bold",
                      asset.status === 'Ready' && "bg-emerald-50 text-emerald-600",
                      asset.status === 'On-going' && "bg-blue-50 text-blue-600",
                      asset.status === 'Repair' && "bg-red-50 text-red-600",
                      asset.status === 'Idle' && "bg-slate-100 text-slate-600",
                    )}>
                      {asset.status === 'Ready' ? 'Siap' : 
                       asset.status === 'On-going' ? 'Berjalan' : 
                       asset.status === 'Repair' ? 'Perbaikan' : 'Menganggur'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{asset.nextMaintenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Asset Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Tambah ${assetType === 'truck' ? 'Truk' : 'Kapal'} Baru`}
      >
        <form onSubmit={handleAddAsset} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Tipe Aset</label>
            <select name="type" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900">
              {(assetType === 'truck' ? TRUCK_TYPES : SHIP_TYPES).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">
              {assetType === 'truck' ? 'Nomor Plat' : 'Nama Kapal'}
            </label>
            <input 
              name={assetType === 'truck' ? 'plate' : 'name'} 
              required 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900" 
              placeholder={assetType === 'truck' ? 'B 1234 ABC' : 'MV Pancaran X'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Kapasitas</label>
              <input name="capacity" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900" placeholder="misal: 10 Ton" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Tahun</label>
              <input name="year" type="number" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900" defaultValue="2024" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Vendor</label>
            <select name="vendor" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900">
              {vendors.map(v => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-4">
            Daftarkan Aset
          </button>
        </form>
      </Modal>
    </div>
  );
}
