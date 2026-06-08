import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { MessageSquare, Send, Users, History, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function WhatsAppBlasting() {
  const { waLogs, vendors, addWaLog } = useData();
  const [message, setMessage] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message || selectedVendors.length === 0) return;
    
    setIsSending(true);
    
    // Simulate sending
    for (const vendorName of selectedVendors) {
      const vendor = vendors.find(v => v.name === vendorName);
      if (vendor) {
        const newLog = {
          id: `WA-${Date.now()}-${Math.random()}`,
          recipient: vendor.contact,
          message: message,
          status: 'Sent' as const,
          timestamp: new Date().toLocaleString('id-ID'),
        };
        addWaLog(newLog);
      }
    }

    setTimeout(() => {
      setIsSending(false);
      setMessage('');
      setSelectedVendors([]);
      alert('Pesan berhasil dikirim ke semua vendor terpilih!');
    }, 1500);
  };

  const toggleVendor = (name: string) => {
    setSelectedVendors(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pusat Notifikasi & WhatsApp Blasting</h2>
        <p className="text-slate-500">
          Kirim pesan massal ke vendor atau pelanggan untuk update status pengiriman, jadwal, atau informasi penting lainnya secara otomatis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compose Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Buat Pesan Baru</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Pilih Penerima (Vendor)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
                  {vendors.map(v => (
                    <label key={v.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                      <input 
                        type="checkbox" 
                        checked={selectedVendors.includes(v.name)}
                        onChange={() => toggleVendor(v.name)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" 
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{v.name}</span>
                        <span className="text-[10px] text-slate-500">{v.contact}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Isi Pesan</label>
                <textarea 
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 text-sm"
                  placeholder="Tulis pesan Anda di sini... Gunakan {nama} untuk personalisasi (fitur segera hadir)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button 
                onClick={handleSend}
                disabled={isSending || !message || selectedVendors.length === 0}
                className={cn(
                  "w-full py-4 flex items-center justify-center gap-2 text-white font-bold rounded-xl transition-all shadow-md",
                  isSending || !message || selectedVendors.length === 0 
                    ? "bg-slate-300 cursor-not-allowed" 
                    : "bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95"
                )}
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSending ? 'Mengirim...' : `Kirim Pesan ke ${selectedVendors.length} Penerima`}
              </button>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" /> Riwayat Blasting
              </h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {waLogs.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">Belum ada riwayat pengiriman.</div>
              ) : (
                waLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900">{log.recipient}</span>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">{log.message}</p>
                    <div className="flex items-center gap-1">
                      {log.status === 'Sent' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        log.status === 'Sent' ? "text-emerald-600" : "text-red-600"
                      )}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
