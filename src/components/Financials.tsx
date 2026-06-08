import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { Wallet, TrendingUp, CreditCard, Activity, PieChart as PieIcon } from 'lucide-react';
import { cn } from '../lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {trend && <span className="text-[10px] text-emerald-600 font-bold">+{trend}% vs Bulan Lalu</span>}
      </div>
    </div>
    <div className="text-2xl font-bold truncate text-slate-900">{formatCurrency(value)}</div>
  </div>
);

export default function Financials() {
  const { financials, pos } = useData();

  const totalRevenue = financials.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalPayment = financials.reduce((acc, curr) => acc + curr.totalPayment, 0);
  const totalProfit = financials.reduce((acc, curr) => acc + curr.profit, 0);
  const avgMargin = (totalProfit / totalRevenue) * 100;

  return (
    <div className="space-y-8">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Pendapatan" value={totalRevenue} icon={TrendingUp} color="bg-emerald-500" trend="12.5" />
        <StatCard label="Total Pengeluaran" value={totalPayment} icon={Wallet} color="bg-blue-500" trend="8.2" />
        <StatCard label="Laba Bersih" value={totalProfit} icon={PieIcon} color="bg-purple-500" trend="15.1" />
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-center items-center shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Rata-rata Margin Laba</span>
          <div className="text-4xl font-bold text-emerald-600">{avgMargin.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue, Cost, Profit Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-900">Tren Performa Finansial</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financials}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" name="Pendapatan" />
                <Area type="monotone" dataKey="profit" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorProfit)" name="Laba Bersih" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Profit Margin Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-900">Stabilitas Margin Laba (%)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financials.map(f => ({ ...f, margin: (f.profit / f.revenue) * 100 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                />
                <Line type="monotone" dataKey="margin" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: '#f59e0b' }} name="Margin %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent PO Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Log Transaksi Finansial (PO)</h3>
          <span className="text-xs text-slate-500">Menampilkan 10 transaksi terakhir</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Nomor PO</th>
                <th className="px-6 py-3 font-medium">Pelanggan</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Jumlah</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pos.slice(0, 10).map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-blue-600">{po.poNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{po.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{po.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatCurrency(po.totalAmount)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-bold",
                      po.status === 'Completed' && "bg-emerald-50 text-emerald-600",
                      po.status === 'In Progress' && "bg-blue-50 text-blue-600",
                      po.status === 'Draft' && "bg-slate-100 text-slate-600",
                      po.status === 'Approved' && "bg-amber-50 text-amber-600",
                      po.status === 'Cancelled' && "bg-red-50 text-red-600",
                    )}>
                      {po.status === 'Completed' ? 'Selesai' : 
                       po.status === 'In Progress' ? 'Berjalan' : 
                       po.status === 'Draft' ? 'Draf' : 
                       po.status === 'Approved' ? 'Disetujui' : 'Dibatalkan'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
