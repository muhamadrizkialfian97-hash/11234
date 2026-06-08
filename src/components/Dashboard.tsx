import React from 'react';
import { useData } from '../context/DataContext';
import { TRUCK_TYPES, SHIP_TYPES } from '../data/mockData';
import { Truck as TruckIcon, Ship as ShipIcon, Users, Package, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '../lib/utils';

const StatCard = ({ label, value, icon: Icon, color, subValue }: any) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden group shadow-sm">
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-24 h-24" />
    </div>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
    </div>
  </div>
);

export default function Dashboard() {
  const { trucks, ships, vendors, pos } = useData();

  const vendorPerformance = vendors.map(v => ({
    name: v.name.split(' ')[0],
    rating: v.rating,
    delivery: v.onTimeDelivery
  })).sort((a, b) => b.rating - a.rating).slice(0, 6);

  const assetAgeData = [
    { range: '2010-2014', count: [...trucks, ...ships].filter(a => a.year < 2015).length },
    { range: '2015-2019', count: [...trucks, ...ships].filter(a => a.year >= 2015 && a.year < 2020).length },
    { range: '2020-2024', count: [...trucks, ...ships].filter(a => a.year >= 2020).length },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Armada" value={trucks.length + ships.length} icon={Package} color="bg-blue-500" subValue={`${trucks.length} Truk / ${ships.length} Kapal`} />
        <StatCard label="Vendor Aktif" value={vendors.length} icon={Users} color="bg-emerald-500" subValue="Di 4 Kategori" />
        <StatCard label="Rata-rata Pengiriman" value={`${(vendors.reduce((a, b) => a + b.onTimeDelivery, 0) / vendors.length).toFixed(1)}%`} icon={TrendingUp} color="bg-amber-500" />
        <StatCard label="Dalam Perbaikan" value={trucks.filter(t => t.status === 'Repair').length + ships.filter(s => s.status === 'Repair').length} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vendor Performance Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Performa Vendor Terbaik (Rating)</h3>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorPerformance}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                />
                <Bar dataKey="rating" radius={[6, 6, 0, 0]}>
                  {vendorPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#f1f5f9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Asset Age Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-900">Distribusi Umur Aset</h3>
          <div className="space-y-6">
            {assetAgeData.map((item, i) => (
              <div key={item.range} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{item.range}</span>
                  <span className="font-bold text-slate-900">{item.count} Aset</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / (trucks.length + ships.length)) * 100}%` }}
                    className={cn(
                      "h-full rounded-full",
                      i === 0 ? "bg-red-500" : i === 1 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fleet Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Rincian Armada Truk</h3>
            <TruckIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Tipe</th>
                  <th className="px-6 py-3 font-medium">Unit</th>
                  <th className="px-6 py-3 font-medium">Rata-rata BBM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TRUCK_TYPES.map(type => {
                  const filtered = trucks.filter(t => t.type === type);
                  if (filtered.length === 0) return null;
                  return (
                    <tr key={type} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{type}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{filtered.length}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {(filtered.reduce((a, b) => a + b.fuelConsumption, 0) / filtered.length).toFixed(1)} L/100km
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Rincian Armada Kapal</h3>
            <ShipIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Tipe Kapal</th>
                  <th className="px-6 py-3 font-medium">Unit</th>
                  <th className="px-6 py-3 font-medium">Rata-rata DWT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SHIP_TYPES.map(type => {
                  const filtered = ships.filter(s => s.type === type);
                  if (filtered.length === 0) return null;
                  return (
                    <tr key={type} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{type}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{filtered.length}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {(filtered.reduce((a, b) => a + b.deadweight, 0) / filtered.length / 1000).toFixed(1)}k
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
