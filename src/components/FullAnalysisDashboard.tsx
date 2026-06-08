import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  DollarSign, 
  Truck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Calendar,
  MessageSquare,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

import FleetMap from './FleetMap';

export default function FullAnalysisDashboard() {
  const { trucks, ships, vendors, pos, financials, tracking, queue, schedules, waLogs, delays } = useData();

  // Financial Summary
  const latestFinancial = financials[financials.length - 1];
  const totalRevenue = financials.reduce((sum, f) => sum + f.revenue, 0);
  const totalNetProfit = financials.reduce((sum, f) => sum + f.profit, 0);
  const avgMargin = (totalNetProfit / totalRevenue) * 100;

  // Loss Summary
  const totalLoss = delays.reduce((sum, d) => sum + d.lossAmount, 0);
  const totalDelayHours = delays.reduce((sum, d) => sum + d.delayHours, 0);

  // Operational Summary
  const activeShipments = tracking.filter(t => t.status === 'In Transit').length;
  const pendingOrders = pos.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled').length;
  const currentQueue = queue.filter(q => q.status !== 'Completed').length;

  const orderStatusData = [
    { name: 'Completed', value: pos.filter(p => p.status === 'Completed').length },
    { name: 'In Progress', value: pos.filter(p => p.status === 'In Progress').length },
    { name: 'Approved', value: pos.filter(p => p.status === 'Approved').length },
    { name: 'Draft', value: pos.filter(p => p.status === 'Draft').length },
    { name: 'Cancelled', value: pos.filter(p => p.status === 'Cancelled').length },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Analisa Eksekutif</h2>
          <p className="text-slate-500">Ringkasan performa seluruh modul operasional dan finansial.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-slate-700">Data per: {new Date().toLocaleDateString('id-ID')}</span>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Revenue YTD</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</h3>
          <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-bold">
            <TrendingUp className="w-3 h-3" /> +12.5% vs Last Year
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Net Profit Margin</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{avgMargin.toFixed(1)}%</h3>
          <p className="text-xs text-slate-500 mt-2">Target: 15.0%</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg"><TrendingDown className="w-5 h-5 text-red-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Loss (Delays)</span>
          </div>
          <h3 className="text-2xl font-bold text-red-600">{formatCurrency(totalLoss)}</h3>
          <div className="mt-2 flex items-center gap-1 text-red-600 text-xs font-bold">
            <AlertTriangle className="w-3 h-3" /> {delays.length} Insiden Delay
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><Clock className="w-5 h-5 text-amber-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Delay Time</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{(totalDelayHours / delays.length).toFixed(1)} Jam</h3>
          <p className="text-xs text-slate-500 mt-2">Menurun 0.5 jam dari bulan lalu</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue vs Profit Trend */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Tren Finansial & Margin
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financials}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} name="Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProf)" strokeWidth={3} name="Net Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Operational Status Pie */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" /> Status Order (PO)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {orderStatusData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] text-slate-500 font-medium uppercase">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Real-time Operational Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl"><MapPin className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Shipments Aktif</p>
            <h4 className="text-xl font-bold text-slate-900">{activeShipments} Unit</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl"><Clock className="w-6 h-6 text-amber-600" /></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Antrian Gate</p>
            <h4 className="text-xl font-bold text-slate-900">{currentQueue} Truk</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl"><Calendar className="w-6 h-6 text-purple-600" /></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Jadwal Besok</p>
            <h4 className="text-xl font-bold text-slate-900">{schedules.length} Kegiatan</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl"><MessageSquare className="w-6 h-6 text-emerald-600" /></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">WA Terkirim</p>
            <h4 className="text-xl font-bold text-slate-900">{waLogs.length} Pesan</h4>
          </div>
        </div>
      </div>

      {/* Live Fleet Map */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Peta Armada Real-time
          </h3>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 animate-pulse">
            LIVE MONITORING
          </span>
        </div>
        <div className="h-[400px]">
          <FleetMap />
        </div>
      </motion.div>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Aktivitas Antrian Terkini</h3>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="divide-y divide-slate-100">
            {queue.slice(0, 5).map((q) => (
              <div key={q.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{q.plateNumber}</p>
                    <p className="text-[10px] text-slate-500">{q.gate}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase",
                  q.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Keterlambatan Kritikal</h3>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="divide-y divide-slate-100">
            {delays.slice(0, 5).map((d) => (
              <div key={d.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">{d.poNumber}</p>
                  <p className="text-[10px] text-slate-500">{d.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">-{formatCurrency(d.lossAmount)}</p>
                  <p className="text-[10px] text-slate-400">{d.delayHours} Jam Delay</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
