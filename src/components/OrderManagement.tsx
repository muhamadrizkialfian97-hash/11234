import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { ClipboardList, Plus, Search, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from './Modal';

export default function OrderManagement() {
  const { pos, vendors, addPO } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPO = {
      id: `PO-${Date.now()}`,
      poNumber: formData.get('poNumber') as string,
      customer: formData.get('customer') as string,
      date: new Date().toISOString().split('T')[0],
      status: 'Draft' as const,
      totalAmount: parseInt(formData.get('amount') as string),
      serviceType: formData.get('serviceType') as string,
      vendor: formData.get('vendor') as string,
    };

    addPO(newPO);
    setIsModalOpen(false);
  };

  const filteredOrders = pos.filter(po => 
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manajemen Order Satu Pintu</h2>
          <p className="text-slate-500">Input dan monitoring seluruh pesanan (PO) dalam satu sistem terintegrasi.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:scale-105"
        >
          <Plus className="w-5 h-5" /> Buat Order Baru
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari Nomor PO atau Pelanggan..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <Filter className="w-4 h-4" /> Filter Status
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Nomor PO</th>
                <th className="px-6 py-4 font-medium">Pelanggan</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Layanan</th>
                <th className="px-6 py-4 font-medium">Vendor</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.slice(0, 20).map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-blue-600 font-bold">{po.poNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{po.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{po.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{po.serviceType}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{po.vendor}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit",
                      po.status === 'Completed' && "bg-emerald-50 text-emerald-600",
                      po.status === 'In Progress' && "bg-blue-50 text-blue-600",
                      po.status === 'Draft' && "bg-slate-100 text-slate-600",
                      po.status === 'Approved' && "bg-amber-50 text-amber-600",
                      po.status === 'Cancelled' && "bg-red-50 text-red-600",
                    )}>
                      {po.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : 
                       po.status === 'In Progress' ? <Clock className="w-3 h-3" /> : 
                       <AlertCircle className="w-3 h-3" />}
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(po.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Order PO Baru">
        <form onSubmit={handleAddOrder} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nomor PO</label>
            <input name="poNumber" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="PO/2024/IV/0001" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nama Pelanggan</label>
            <input name="customer" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="PT. Nama Pelanggan" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tipe Layanan</label>
              <select name="serviceType" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="Logistik Darat">Logistik Darat</option>
                <option value="Logistik Laut">Logistik Laut</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Total Nilai (IDR)</label>
              <input name="amount" type="number" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="10000000" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Vendor Pelaksana</label>
            <select name="vendor" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
              {vendors.map(v => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Kode Kontainer</label>
              <input name="containerCode" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="CONT-XXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Keterangan PDT/Vendor</label>
              <input name="remarks" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Masuk PDT / Vendor" />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-4">
            Simpan & Proses Order
          </button>
        </form>
      </Modal>
    </div>
  );
}
