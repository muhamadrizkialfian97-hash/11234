import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Search
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '../lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function VendorPL() {
  const { pos, vendors } = useData();
  const [searchTerm, setSearchTerm] = React.useState('');

  const vendorPerformance = useMemo(() => {
    return vendors.map(vendor => {
      const vendorPOs = pos.filter(p => p.vendor === vendor.name && p.status === 'Completed');
      const revenue = vendorPOs.reduce((sum, p) => sum + p.totalAmount, 0);
      
      // Mock cost calculation: 
      // Different categories have different cost structures
      let costPercentage = 0.82; // Default 82% cost
      if (vendor.category === 'Truk') costPercentage = 0.78;
      if (vendor.category === 'Pelayaran') costPercentage = 0.85;
      
      const estimatedCost = revenue * costPercentage;
      const profit = revenue - estimatedCost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        name: vendor.name,
        category: vendor.category,
        poCount: vendorPOs.length,
        revenue,
        cost: estimatedCost,
        profit,
        margin
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [pos, vendors]);

  const filteredVendors = vendorPerformance.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = vendorPerformance.reduce((sum, v) => sum + v.revenue, 0);
  const totalProfit = vendorPerformance.reduce((sum, v) => sum + v.profit, 0);
  const overallMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analisis Laba Rugi per Vendor</h2>
          <p className="text-slate-500">Evaluasi performa finansial dan efisiensi biaya berdasarkan vendor pelaksana.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari vendor..."
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm w-64 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pendapatan Vendor</p>
              <h3 className="text-xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>8.4% dari target</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Laba Bersih</p>
              <h3 className="text-xl font-bold text-slate-900">{formatCurrency(totalProfit)}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>12.1% efisiensi vendor</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rata-rata Margin Vendor</p>
              <h3 className="text-xl font-bold text-slate-900">{overallMargin.toFixed(2)}%</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Berdasarkan {vendors.length} vendor aktif</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Vendor Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-900">Pendapatan per Vendor (Top 7)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorPerformance.slice(0, 7)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={120} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {vendorPerformance.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Profit Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-900">Kontribusi Laba per Vendor</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendorPerformance.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="profit"
                  nameKey="name"
                >
                  {vendorPerformance.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Detailed Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Rincian Laba Rugi per Vendor</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Vendor</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium text-right">Total PO</th>
                <th className="px-6 py-4 font-medium text-right">Pendapatan</th>
                <th className="px-6 py-4 font-medium text-right">Estimasi Biaya</th>
                <th className="px-6 py-4 font-medium text-right">Laba Bersih</th>
                <th className="px-6 py-4 font-medium text-right">Margin (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.map((v, i) => (
                <tr key={v.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{v.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                      v.category === 'Truk' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                      {v.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600 font-medium">{v.poCount}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">{formatCurrency(v.revenue)}</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-500">{formatCurrency(v.cost)}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">{formatCurrency(v.profit)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${Math.min(v.margin * 4, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{v.margin.toFixed(1)}%</span>
                    </div>
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
