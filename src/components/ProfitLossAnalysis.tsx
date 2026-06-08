import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  PieChart as PieIcon,
  ArrowRight,
  Info
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

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ProfitLossAnalysis() {
  const { financials, pos, vendors, trucks, ships } = useData();

  const analysisData = useMemo(() => {
    const latest = financials[financials.length - 1] || {
      revenue: 0,
      serviceCost: 0,
      fuelCost: 0,
      driverCost: 0,
      tollCost: 0,
      maintenanceCost: 0,
      insuranceCost: 0,
      taxAmount: 0,
      profit: 0
    };

    const cogs = latest.serviceCost + latest.fuelCost + latest.driverCost + latest.tollCost;
    const grossProfit = latest.revenue - cogs;
    const operatingExpenses = latest.maintenanceCost + latest.insuranceCost;
    const operatingProfit = grossProfit - operatingExpenses;
    const netProfit = latest.profit;

    const marginData = [
      { name: 'HPP (COGS)', value: cogs, color: '#ef4444' },
      { name: 'Biaya Operasional', value: operatingExpenses, color: '#f59e0b' },
      { name: 'Pajak', value: latest.taxAmount, color: '#64748b' },
      { name: 'Laba Bersih', value: netProfit, color: '#10b981' },
    ];

    const profitTypes = [
      { 
        title: 'Laba Kotor (Gross Profit)', 
        value: grossProfit, 
        margin: (grossProfit / latest.revenue) * 100,
        desc: 'Pendapatan dikurangi biaya langsung (BBM, Driver, Tol).',
        status: grossProfit > 0 ? 'healthy' : 'critical'
      },
      { 
        title: 'Laba Operasional', 
        value: operatingProfit, 
        margin: (operatingProfit / latest.revenue) * 100,
        desc: 'Laba kotor dikurangi biaya pemeliharaan dan asuransi.',
        status: operatingProfit > latest.revenue * 0.1 ? 'healthy' : 'warning'
      },
      { 
        title: 'Laba Bersih (Net Profit)', 
        value: netProfit, 
        margin: (netProfit / latest.revenue) * 100,
        desc: 'Hasil akhir setelah semua biaya dan pajak dikurangi.',
        status: netProfit > latest.revenue * 0.05 ? 'healthy' : 'warning'
      }
    ];

    return { latest, cogs, grossProfit, operatingExpenses, operatingProfit, netProfit, marginData, profitTypes };
  }, [financials]);

  // Identify "Loss" or "Low Margin" areas
  const lowMarginVendors = useMemo(() => {
    return vendors.map(v => {
      const vendorPOs = pos.filter(p => p.vendor === v.name && p.status === 'Completed');
      const revenue = vendorPOs.reduce((sum, p) => sum + p.totalAmount, 0);
      const estCost = revenue * 0.88; // Mock high cost for analysis
      const margin = revenue > 0 ? ((revenue - estCost) / revenue) * 100 : 0;
      return { ...v, revenue, margin };
    }).filter(v => v.revenue > 0 && v.margin < 15).sort((a, b) => a.margin - b.margin);
  }, [vendors, pos]);

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Analisis Laba, Margin & Potensi Kerugian</h2>
        <p className="text-slate-500">
          Tinjauan mendalam tentang struktur keuntungan perusahaan, identifikasi inefisiensi biaya, dan pemetaan margin berdasarkan jenis laba.
        </p>
      </div>

      {/* Profit Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analysisData.profitTypes.map((type, i) => (
          <motion.div 
            key={type.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{type.title}</h4>
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase",
                type.status === 'healthy' ? "bg-emerald-50 text-emerald-600" : 
                type.status === 'warning' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
              )}>
                {type.status}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{formatCurrency(type.value)}</div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-sm font-bold text-blue-600">{type.margin.toFixed(1)}% Margin</div>
              <div className="text-[10px] text-slate-400">dari total pendapatan</div>
            </div>
            <p className="text-xs text-slate-500 mt-auto">{type.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Structure Breakdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900">
            <PieIcon className="w-5 h-5 text-blue-600" /> Struktur Pengikisan Pendapatan
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analysisData.marginData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analysisData.marginData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                HPP (COGS) merupakan komponen pengeluaran terbesar ({(analysisData.cogs / analysisData.latest.revenue * 100).toFixed(1)}%). 
                Optimalisasi rute dan konsumsi BBM adalah kunci untuk meningkatkan Laba Kotor.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loss/Risk Identification */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900">
            <AlertTriangle className="w-5 h-5 text-red-600" /> Identifikasi Margin Rendah & Risiko
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> Vendor dengan Margin Kritis (&lt;15%)
              </h4>
              <div className="space-y-3">
                {lowMarginVendors.slice(0, 3).map(v => (
                  <div key={v.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{v.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{formatCurrency(v.revenue)}</span>
                      <span className="font-bold text-red-600">{v.margin.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <h4 className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> Aset dengan Biaya Maint. Tinggi
              </h4>
              <div className="space-y-2 text-xs text-slate-600">
                <p>• 4 Truk memiliki jadwal perbaikan berdekatan (Potensi Downtime).</p>
                <p>• Kapal MV Pancaran 02 menunjukkan kenaikan biaya BBM 12% di rute Timur.</p>
              </div>
            </div>

            <button className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-100 border-dashed">
              Lihat Laporan Mitigasi Risiko Lengkap <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Detailed Margin Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Tabel Perbandingan Jenis Laba (Bulanan)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Periode</th>
                <th className="px-6 py-4 font-medium text-right">Pendapatan</th>
                <th className="px-6 py-4 font-medium text-right">Laba Kotor</th>
                <th className="px-6 py-4 font-medium text-right">Laba Ops</th>
                <th className="px-6 py-4 font-medium text-right">Laba Bersih</th>
                <th className="px-6 py-4 font-medium text-right">Net Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financials.map((f) => {
                const cogs = f.serviceCost + f.fuelCost + f.driverCost + f.tollCost;
                const gross = f.revenue - cogs;
                const ops = gross - (f.maintenanceCost + f.insuranceCost);
                const netMargin = (f.profit / f.revenue) * 100;
                
                return (
                  <tr key={f.month} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{f.month}</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-600">{formatCurrency(f.revenue)}</td>
                    <td className="px-6 py-4 text-sm text-right text-emerald-600 font-medium">{formatCurrency(gross)}</td>
                    <td className="px-6 py-4 text-sm text-right text-blue-600 font-medium">{formatCurrency(ops)}</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-900 font-bold">{formatCurrency(f.profit)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-xs font-bold",
                        netMargin > 15 ? "text-emerald-600" : "text-amber-600"
                      )}>
                        {netMargin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
