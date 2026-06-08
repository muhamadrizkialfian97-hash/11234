import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from './Modal';
import { PurchaseOrder } from '../types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function OrderMonitoring() {
  const { pos, addPO, updatePOStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPO, setNewPO] = useState<Partial<PurchaseOrder>>({
    poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Draft',
    totalAmount: 0,
    customer: '',
    vendor: '',
    serviceType: 'Logistik Darat'
  });

  const filteredPOs = pos.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         po.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Draf', count: pos.filter(p => p.status === 'Draft').length, icon: Clock, color: 'text-slate-400' },
    { label: 'Disetujui', count: pos.filter(p => p.status === 'Approved').length, icon: ArrowUpRight, color: 'text-amber-400' },
    { label: 'Berjalan', count: pos.filter(p => p.status === 'In Progress').length, icon: Activity, color: 'text-blue-400' },
    { label: 'Selesai', count: pos.filter(p => p.status === 'Completed').length, icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  const handleAddPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPO.customer && newPO.totalAmount && newPO.vendor) {
      addPO(newPO as PurchaseOrder);
      setIsAddModalOpen(false);
      setNewPO({
        poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Draft',
        totalAmount: 0,
        customer: '',
        vendor: '',
        serviceType: 'Logistik Darat'
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari Nomor PO, Pelanggan, atau Vendor..." 
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-900 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 shadow-sm"
          >
            <option value="All">Semua Status</option>
            <option value="Draft">Draf</option>
            <option value="Approved">Disetujui</option>
            <option value="In Progress">Berjalan</option>
            <option value="Completed">Selesai</option>
            <option value="Cancelled">Dibatalkan</option>
          </select>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold whitespace-nowrap shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Buat PO</span>
          </button>
        </div>
      </div>

      {/* PO Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((status) => (
          <div key={status.label} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
            <div className={cn("p-2 rounded-lg bg-slate-50", status.color)}>
              <status.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">{status.label}</div>
              <div className="text-xl font-bold text-slate-900">{status.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed PO Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Kontrol Monitoring PO (CS ke Final)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Nomor PO</th>
                <th className="px-6 py-3 font-medium">Pelanggan</th>
                <th className="px-6 py-3 font-medium">Vendor</th>
                <th className="px-6 py-3 font-medium">Tipe Layanan</th>
                <th className="px-6 py-3 font-medium">Jumlah</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPOs.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-blue-600">{po.poNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{po.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{po.vendor}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{po.serviceType}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatCurrency(po.totalAmount)}</td>
                  <td className="px-6 py-4 text-sm">
                    <select 
                      value={po.status}
                      onChange={(e) => updatePOStatus(po.id, e.target.value as any)}
                      className={cn(
                        "bg-transparent border-none focus:ring-0 text-xs font-bold cursor-pointer",
                        po.status === 'Completed' && "text-emerald-600",
                        po.status === 'In Progress' && "text-blue-600",
                        po.status === 'Draft' && "text-slate-500",
                        po.status === 'Approved' && "text-amber-600",
                        po.status === 'Cancelled' && "text-red-600",
                      )}
                    >
                      <option value="Draft">Draf</option>
                      <option value="Approved">Disetujui</option>
                      <option value="In Progress">Berjalan</option>
                      <option value="Completed">Selesai</option>
                      <option value="Cancelled">Dibatalkan</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">Lihat Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add PO Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Buat Purchase Order Baru"
      >
        <form onSubmit={handleAddPO} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Nomor PO</label>
              <input 
                type="text" 
                readOnly
                value={newPO.poNumber}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Tanggal</label>
              <input 
                type="date" 
                required
                value={newPO.date}
                onChange={(e) => setNewPO({ ...newPO, date: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Nama Pelanggan</label>
            <input 
              type="text" 
              required
              placeholder="Masukkan nama pelanggan"
              value={newPO.customer}
              onChange={(e) => setNewPO({ ...newPO, customer: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Nama Vendor</label>
            <input 
              type="text" 
              required
              placeholder="Masukkan nama vendor"
              value={newPO.vendor}
              onChange={(e) => setNewPO({ ...newPO, vendor: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Total Jumlah (IDR)</label>
              <input 
                type="number" 
                required
                placeholder="0"
                value={newPO.totalAmount || ''}
                onChange={(e) => setNewPO({ ...newPO, totalAmount: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Tipe Layanan</label>
              <select 
                value={newPO.serviceType}
                onChange={(e) => setNewPO({ ...newPO, serviceType: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="Logistik Darat">Logistik Darat</option>
                <option value="Logistik Laut">Logistik Laut</option>
                <option value="Pemeliharaan">Pemeliharaan</option>
                <option value="Bahan Bakar">Bahan Bakar</option>
                <option value="Suku Cadang">Suku Cadang</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex space-x-3">
            <button 
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Buat PO
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
