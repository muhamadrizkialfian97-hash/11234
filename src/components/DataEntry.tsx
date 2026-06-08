import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { 
  Plus, 
  Truck, 
  Ship, 
  Users, 
  ClipboardList, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TRUCK_TYPES, SHIP_TYPES } from '../data/mockData';

type EntryType = 'vendor' | 'po' | 'truck' | 'ship';

export default function DataEntry() {
  const { addVendor, addPO, addTruck, addShip, vendors } = useData();
  const [activeEntry, setActiveEntry] = useState<EntryType>('vendor');
  const [showSuccess, setShowSuccess] = useState(false);

  const tabs = [
    { id: 'vendor', label: 'Vendor Baru', icon: Users },
    { id: 'po', label: 'PO Baru', icon: ClipboardList },
    { id: 'truck', label: 'Truk Baru', icon: Truck },
    { id: 'ship', label: 'Kapal Baru', icon: Ship },
  ];

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Entry Data Sistem</h2>
          <p className="text-slate-400">Input data master baru ke dalam ekosistem Pancaran.</p>
        </div>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Data berhasil disimpan!</span>
          </motion.div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveEntry(tab.id as EntryType)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeEntry === tab.id 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Forms Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        {activeEntry === 'vendor' && <VendorForm onSubmit={(data) => { addVendor(data); handleSuccess(); }} />}
        {activeEntry === 'po' && <POForm onSubmit={(data) => { addPO(data); handleSuccess(); }} vendors={vendors} />}
        {activeEntry === 'truck' && <TruckForm onSubmit={(data) => { addTruck(data); handleSuccess(); }} vendors={vendors} />}
        {activeEntry === 'ship' && <ShipForm onSubmit={(data) => { addShip(data); handleSuccess(); }} vendors={vendors} />}
      </div>
    </div>
  );
}

function VendorForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      id: `V${Math.floor(Math.random() * 1000)}`,
      name: formData.get('name'),
      category: formData.get('category'),
      rating: 5.0,
      contact: formData.get('contact'),
      email: formData.get('email'),
      activeContracts: 0,
      onTimeDelivery: 100,
    });
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Nama Vendor</label>
        <input name="name" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Contoh: PT Logistik Jaya" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Kategori</label>
        <select name="category" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
          <option value="Truk">Truk</option>
          <option value="Pelayaran">Pelayaran</option>
          <option value="Pemeliharaan">Pemeliharaan</option>
          <option value="Layanan">Layanan</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Email Kontak</label>
        <input name="email" type="email" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="email@vendor.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Nomor Telepon</label>
        <input name="contact" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="0812..." />
      </div>
      <div className="md:col-span-2 pt-4">
        <button type="submit" className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
          <Plus className="w-5 h-5" />
          Simpan Vendor Baru
        </button>
      </div>
    </form>
  );
}

function POForm({ onSubmit, vendors }: { onSubmit: (data: any) => void, vendors: any[] }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      id: `PO-${Date.now()}`,
      poNumber: formData.get('poNumber'),
      customer: formData.get('customer'),
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      totalAmount: Number(formData.get('amount')),
      serviceType: formData.get('serviceType'),
      vendor: formData.get('vendor'),
    });
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Nomor PO</label>
        <input name="poNumber" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="PO/2024/..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Pelanggan (Customer)</label>
        <input name="customer" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Nama Perusahaan" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Vendor Pelaksana</label>
        <select name="vendor" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
          {vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Tipe Layanan</label>
        <select name="serviceType" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
          <option value="Logistik Darat">Logistik Darat</option>
          <option value="Logistik Laut">Logistik Laut</option>
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-400">Total Nilai (IDR)</label>
        <input name="amount" type="number" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="0" />
      </div>
      <div className="md:col-span-2 pt-4">
        <button type="submit" className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
          <Plus className="w-5 h-5" />
          Buat Draft PO
        </button>
      </div>
    </form>
  );
}

function TruckForm({ onSubmit, vendors }: { onSubmit: (data: any) => void, vendors: any[] }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      id: `T${Math.floor(Math.random() * 1000)}`,
      type: formData.get('type'),
      plateNumber: formData.get('plateNumber'),
      vendor: formData.get('vendor'),
      status: 'Ready',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      capacity: formData.get('capacity'),
      year: Number(formData.get('year')),
      fuelConsumption: 15,
    });
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Nomor Polisi</label>
        <input name="plateNumber" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="B 1234 ABC" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Tipe Truk</label>
        <select name="type" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
          {TRUCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Vendor Pemilik</label>
        <select name="vendor" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
          {vendors.filter(v => v.category === 'Truk').map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Kapasitas (Ton)</label>
        <input name="capacity" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Contoh: 20 Ton" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-400">Tahun Kendaraan</label>
        <input name="year" type="number" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="2024" />
      </div>
      <div className="md:col-span-2 pt-4">
        <button type="submit" className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
          <Plus className="w-5 h-5" />
          Daftarkan Truk
        </button>
      </div>
    </form>
  );
}

function ShipForm({ onSubmit, vendors }: { onSubmit: (data: any) => void, vendors: any[] }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      id: `S${Math.floor(Math.random() * 1000)}`,
      name: formData.get('name'),
      type: formData.get('type'),
      vendor: formData.get('vendor'),
      status: 'Ready',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      capacity: formData.get('capacity'),
      year: Number(formData.get('year')),
      deadweight: Number(formData.get('dwt')),
    });
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Nama Kapal</label>
        <input name="name" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="MV Pancaran ..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Tipe Kapal</label>
        <select name="type" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
          {SHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Vendor Pemilik</label>
        <select name="vendor" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
          {vendors.filter(v => v.category === 'Pelayaran').map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Kapasitas (TEU)</label>
        <input name="capacity" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Contoh: 1000 TEU" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Deadweight (DWT)</label>
        <input name="dwt" type="number" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Tahun Pembuatan</label>
        <input name="year" type="number" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="2024" />
      </div>
      <div className="md:col-span-2 pt-4">
        <button type="submit" className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
          <Plus className="w-5 h-5" />
          Daftarkan Kapal
        </button>
      </div>
    </form>
  );
}
