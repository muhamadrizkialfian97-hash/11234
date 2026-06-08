import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { AlertTriangle, Clock, DollarSign, TrendingDown, BarChart3, Info } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function DelayDashboard() {
  const { delays } = useData();

  const totalLoss = delays.reduce((sum, d) => sum + d.lossAmount, 0);
  const avgDelay = delays.reduce((sum, d) => sum + d.delayHours, 0) / delays.length;

  const delayReasons = [
    { name: 'Kemacetan', value: delays.filter(d => d.reason.includes('Kemacetan')).length },
    { name: 'Cuaca', value: delays.filter(d => d.reason.includes('Cuaca')).length },
    { name: 'Teknis', value: delays.filter(d => d.reason.includes('Teknis')).length },
    { name: 'Lainnya', value: delays.filter(d => !d.reason.includes('Kemacetan') && !d.reason.includes('Cuaca') && !d.reason.includes('Teknis')).length },
  ];

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Analisa Keterlambatan & Loss Margin</h2>
        <p className="text-slate-500">
          Identifikasi penyebab keterlambatan pengiriman dan dampak finansial langsung terhadap margin keuntungan perusahaan.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Kerugian (Loss)</p>
              <h3 className="text-xl font-bold text-slate-900">{formatCurrency(totalLoss)}</h3>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Akumulasi kerugian akibat keterlambatan operasional.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rata-rata Delay</p>
              <h3 className="text-xl font-bold text-slate-900">{avgDelay.toFixed(1)} Jam</h3>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Durasi rata-rata keterlambatan per pengiriman.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Insiden Delay</p>
              <h3 className="text-xl font-bold text-slate-900">{delays.length} Kasus</h3>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Jumlah total kasus keterlambatan yang tercatat.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reasons Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Penyebab Utama Keterlambatan
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayReasons}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {delayReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#ef4444', '#3b82f6', '#f59e0b', '#64748b'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Delay Log */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" /> Log Keterlambatan Terkini
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {delays.map((delay) => (
              <div key={delay.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">{delay.poNumber}</h4>
                    <p className="text-xs text-slate-500">{delay.reason}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">-{formatCurrency(delay.lossAmount)}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  <span>Exp: {delay.expectedArrival}</span>
                  <span className="text-amber-600">Delay: {delay.delayHours} Jam</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
        <Info className="w-6 h-6 text-blue-600 mt-1" />
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Rekomendasi Mitigasi</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Berdasarkan data di atas, kemacetan rute darat menyumbang 60% dari total kerugian. 
            Disarankan untuk melakukan penjadwalan ulang keberangkatan di luar jam sibuk atau menggunakan rute alternatif yang terintegrasi dengan data trafik real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
