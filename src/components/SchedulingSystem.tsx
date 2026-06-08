import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { Calendar, Clock, Plus, Filter, ChevronRight, Truck, Ship } from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from './Modal';

export default function SchedulingSystem() {
  const { schedules, trucks, ships, vendors, addSchedule } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newSchedule = {
      id: `SCH-${Date.now()}`,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      activity: formData.get('activity') as string,
      assetId: formData.get('assetId') as string,
      vendor: formData.get('vendor') as string,
    };

    addSchedule(newSchedule);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sistem Penjadwalan Otomatis</h2>
          <p className="text-slate-500">Kelola jadwal keberangkatan, pemuatan, dan pemeliharaan aset secara terpusat.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md"
        >
          <Plus className="w-5 h-5" /> Tambah Jadwal Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar View (Mock) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">April 2024</h3>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-slate-100 rounded">&lt;</button>
                <button className="p-1 hover:bg-slate-100 rounded">&gt;</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "aspect-square flex items-center justify-center text-xs rounded-lg transition-colors",
                    i + 1 === 8 ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-50 text-slate-600"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Filter Aset</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                Semua Truk
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                Semua Kapal
              </label>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Jadwal Mendatang</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">Hari Ini</button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">Minggu Ini</button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {schedules.map((sch) => (
                <div key={sch.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{sch.date.split('-')[1]}</span>
                      <span className="text-xl font-bold text-blue-700">{sch.date.split('-')[2]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{sch.activity}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {sch.time}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          {sch.assetId.startsWith('T') ? <Truck className="w-3 h-3" /> : <Ship className="w-3 h-3" />}
                          {sch.assetId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Vendor</p>
                      <p className="text-sm font-medium text-slate-700">{sch.vendor}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Jadwal Baru">
        <form onSubmit={handleAddSchedule} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tanggal</label>
              <input name="date" type="date" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Waktu</label>
              <input name="time" type="time" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Aktivitas / Keterangan</label>
            <input name="activity" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="misal: Pengiriman Kontainer ke Pelabuhan" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Pilih Aset</label>
            <select name="assetId" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
              <optgroup label="Truk">
                {trucks.slice(0, 10).map(t => (
                  <option key={t.id} value={t.id}>{t.plateNumber} ({t.id})</option>
                ))}
              </optgroup>
              <optgroup label="Kapal">
                {ships.slice(0, 5).map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Vendor</label>
            <select name="vendor" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
              {vendors.map(v => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-4">
            Simpan Jadwal
          </button>
        </form>
      </Modal>
    </div>
  );
}
