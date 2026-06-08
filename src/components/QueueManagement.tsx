import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { Truck, LogIn, LogOut, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from './Modal';

export default function QueueManagement() {
  const { queue, trucks, addQueue, updateQueueStatus } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddQueue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const truckId = formData.get('truckId') as string;
    const truck = trucks.find(t => t.id === truckId);

    if (truck?.status === 'Repair') {
      alert(`Truk ${truck.plateNumber} sedang dalam perbaikan dan tidak dapat masuk antrian.`);
      return;
    }

    const newItem = {
      id: `Q-${Date.now()}`,
      truckId: truckId,
      plateNumber: truck ? truck.plateNumber : 'N/A',
      entryTime: new Date().toLocaleString('id-ID'),
      status: 'Waiting' as const,
      gate: formData.get('gate') as string,
    };

    addQueue(newItem);
    setIsModalOpen(false);
  };

  const activeQueue = queue.filter(q => q.status !== 'Completed');
  const completedQueue = queue.filter(q => q.status === 'Completed');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sistem Antrian & Kontrol Gate</h2>
          <p className="text-slate-500">Monitoring real-time alur keluar masuk truk di area operasional.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md"
        >
          <LogIn className="w-5 h-5" /> Registrasi Kedatangan Truk
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Queue List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> Antrian Aktif
              </h3>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                {activeQueue.length} Truk Menunggu/Proses
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {activeQueue.length === 0 ? (
                <div className="p-12 text-center text-slate-400">Tidak ada antrian aktif saat ini.</div>
              ) : (
                activeQueue.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <Truck className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.plateNumber}</h4>
                        <p className="text-xs text-slate-500">ID: {item.truckId} • {item.gate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Waktu Masuk</p>
                        <p className="text-sm font-medium text-slate-700">{item.entryTime}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select 
                          value={item.status}
                          onChange={(e) => updateQueueStatus(item.id, e.target.value as any)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none",
                            item.status === 'Waiting' && "bg-amber-50 text-amber-600 border-amber-100",
                            item.status === 'Loading' && "bg-blue-50 text-blue-600 border-blue-100",
                            item.status === 'Unloading' && "bg-purple-50 text-purple-600 border-purple-100"
                          )}
                        >
                          <option value="Waiting">Menunggu</option>
                          <option value="Loading">Loading</option>
                          <option value="Unloading">Unloading</option>
                          <option value="Completed">Selesai (Keluar)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Completed Log */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Log Selesai Hari Ini
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {completedQueue.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.plateNumber}</p>
                    <p className="text-[10px] text-slate-500">Keluar: {item.exitTime || 'N/A'}</p>
                  </div>
                  <LogOut className="w-4 h-4 text-emerald-600" />
                </div>
              ))}
              {completedQueue.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-4">Belum ada truk yang keluar hari ini.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrasi Kedatangan Truk">
        <form onSubmit={handleAddQueue} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Pilih Truk</label>
            <select name="truckId" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
              {trucks.filter(t => t.status !== 'Repair').map(t => (
                <option key={t.id} value={t.id}>{t.plateNumber} ({t.type})</option>
              ))}
            </select>
            {trucks.some(t => t.status === 'Repair') && (
              <p className="text-[10px] text-red-500 mt-1">* Truk dalam perbaikan tidak muncul di daftar.</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Pilih Gate / Lokasi</label>
            <select name="gate" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="Gate 1 - Loading Dock A">Gate 1 - Loading Dock A</option>
              <option value="Gate 2 - Loading Dock B">Gate 2 - Loading Dock B</option>
              <option value="Gate 3 - Unloading Area">Gate 3 - Unloading Area</option>
              <option value="Gate 4 - Container Yard">Gate 4 - Container Yard</option>
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-4">
            Daftarkan ke Antrian
          </button>
        </form>
      </Modal>
    </div>
  );
}
