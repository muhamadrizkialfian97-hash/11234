import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  Search, 
  Plus,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Clock,
  CreditCard,
  UserPlus,
  UserMinus,
  GraduationCap,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

type SubMenu = 
  | 'master-km' | 'skema-uj' | 'add-cost' | 'leadtime-rec' | 'master-price' 
  | 'kyc' | 'turnover-driver' | 'ar-collection' | 'billing' | 'pp-to-gr' 
  | 'people-dev' | 'mitigasi-laka' | 'control-monitoring' | 'jmp' 
  | 'eod-report' | 'driver-automation';

export default function MasterOperations() {
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenu>('master-km');
  const { 
    masterKilometer, uangJalan, drivers, billing, operationalCosts, 
    masterPrices, arCollections, recruitment, peopleDev, kyc 
  } = useData();

  const subMenuItems = [
    { id: 'master-km', label: 'Master Kilometer', icon: MapPin, category: 'Master Data' },
    { id: 'skema-uj', label: 'Skema Uang Jalan', icon: DollarSign, category: 'Master Data' },
    { id: 'master-price', label: 'Master Standar Price', icon: TrendingUp, category: 'Master Data' },
    
    { id: 'ar-collection', label: 'AR Collection', icon: CreditCard, category: 'Finance' },
    { id: 'billing', label: 'Billing', icon: FileText, category: 'Finance' },
    { id: 'pp-to-gr', label: 'PP TO GR', icon: Zap, category: 'Finance' },
    { id: 'add-cost', label: 'Add Cost', icon: Plus, category: 'Finance' },
    
    { id: 'leadtime-rec', label: 'Leadtime Recruitment', icon: UserPlus, category: 'HR & Driver' },
    { id: 'turnover-driver', label: 'Turn Over Driver', icon: UserMinus, category: 'HR & Driver' },
    { id: 'people-dev', label: 'People Development', icon: GraduationCap, category: 'HR & Driver' },
    { id: 'driver-automation', label: 'Driver Management Automation', icon: Activity, category: 'HR & Driver' },
    
    { id: 'kyc', label: 'KYC', icon: ShieldCheck, category: 'Compliance' },
    { id: 'mitigasi-laka', label: 'Mitigasi & Evaluasi Laka', icon: AlertTriangle, category: 'Compliance' },
    { id: 'control-monitoring', label: 'Control Monitoring', icon: Activity, category: 'Compliance' },
    { id: 'jmp', label: 'jmp', icon: Zap, category: 'Compliance' },
    
    { id: 'eod-report', label: 'End of Day Report', icon: FileText, category: 'Reporting' },
  ];

  const categories = Array.from(new Set(subMenuItems.map(item => item.category)));

  const renderContent = () => {
    switch (activeSubMenu) {
      case 'master-price':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Master Standar Price</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Harga
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Layanan</th>
                    <th className="px-6 py-4 font-medium">Kategori</th>
                    <th className="px-6 py-4 font-medium">Unit</th>
                    <th className="px-6 py-4 font-medium text-right">Harga Dasar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {masterPrices.map(price => (
                    <tr key={price.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{price.serviceName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{price.category}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{price.unit}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price.basePrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'ar-collection':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">AR Collection Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Piutang</p>
                <h4 className="text-2xl font-bold text-slate-900">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(arCollections.reduce((s, a) => s + a.totalAR, 0))}
                </h4>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Overdue Amount</p>
                <h4 className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(arCollections.reduce((s, a) => s + a.overdue, 0))}
                </h4>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Collection Rate</p>
                <h4 className="text-2xl font-bold text-emerald-600">82%</h4>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Total AR</th>
                    <th className="px-6 py-4 font-medium">Overdue</th>
                    <th className="px-6 py-4 font-medium">Last Payment</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {arCollections.map(ar => (
                    <tr key={ar.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{ar.customerName}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-bold">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(ar.totalAR)}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 font-bold">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(ar.overdue)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{ar.lastPaymentDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          ar.status === 'Good' ? "bg-emerald-50 text-emerald-600" : 
                          ar.status === 'Warning' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                        )}>
                          {ar.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'leadtime-rec':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Leadtime Recruitment</h3>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Posisi</th>
                    <th className="px-6 py-4 font-medium">Avg Leadtime (Hari)</th>
                    <th className="px-6 py-4 font-medium">Lowongan Aktif</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recruitment.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{rec.position}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{rec.avgDays} Hari</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{rec.openPositions}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          rec.status === 'On Track' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'people-dev':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">People Development & Training</h3>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama Driver</th>
                    <th className="px-6 py-4 font-medium">Jenis Training</th>
                    <th className="px-6 py-4 font-medium">Tanggal</th>
                    <th className="px-6 py-4 font-medium">Skor</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {peopleDev.map(pd => (
                    <tr key={pd.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{pd.driverName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{pd.trainingType}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{pd.date}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{pd.score}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          pd.status === 'Passed' ? "bg-emerald-50 text-emerald-600" : 
                          pd.status === 'Failed' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {pd.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'kyc':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">KYC (Know Your Customer/Vendor)</h3>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama Entitas</th>
                    <th className="px-6 py-4 font-medium">Tipe</th>
                    <th className="px-6 py-4 font-medium">Status Verifikasi</th>
                    <th className="px-6 py-4 font-medium">Terakhir Dicek</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kyc.map(k => (
                    <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{k.entityName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{k.type}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          k.status === 'Verified' ? "bg-emerald-50 text-emerald-600" : 
                          k.status === 'Pending' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                        )}>
                          {k.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{k.lastChecked}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'master-km':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Master Kilometer Rute</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Rute
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Rute</th>
                    <th className="px-6 py-4 font-medium">Jarak (KM)</th>
                    <th className="px-6 py-4 font-medium">Standar BBM (L)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {masterKilometer.map(km => (
                    <tr key={km.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-blue-600">{km.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{km.route}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{km.distance} KM</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{km.standardFuel} L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'skema-uj':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Skema Uang Jalan</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Skema
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Rute</th>
                    <th className="px-6 py-4 font-medium">Tipe Truk</th>
                    <th className="px-6 py-4 font-medium">Total Uang Jalan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {uangJalan.map(uj => (
                    <tr key={uj.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{uj.route}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{uj.truckType}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(uj.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Manajemen Billing</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold">Export PDF</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">Generate Invoice</button>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">PO Number</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Due Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billing.map(bil => (
                    <tr key={bil.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-blue-600">{bil.poNumber}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{bil.customer}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(bil.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{bil.dueDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          bil.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {bil.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'turnover-driver':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Analisa Turn Over Driver</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Driver Aktif</p>
                <h4 className="text-2xl font-bold text-slate-900">{drivers.filter(d => d.status === 'Active').length}</h4>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Resigned (Bulan Ini)</p>
                <h4 className="text-2xl font-bold text-red-600">4</h4>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Turnover Rate</p>
                <h4 className="text-2xl font-bold text-amber-600">2.4%</h4>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200">
                <h4 className="font-bold text-slate-900">Daftar Driver</h4>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama</th>
                    <th className="px-6 py-4 font-medium">SIM Number</th>
                    <th className="px-6 py-4 font-medium">Join Date</th>
                    <th className="px-6 py-4 font-medium">Performance</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {drivers.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{d.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{d.licenseNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{d.joinDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: `${d.performance}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{d.performance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          d.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                        )}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'add-cost':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Pengajuan Add Cost</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Input Add Cost
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tanggal</th>
                    <th className="px-6 py-4 font-medium">Kategori</th>
                    <th className="px-6 py-4 font-medium">Keterangan</th>
                    <th className="px-6 py-4 font-medium text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {operationalCosts.filter(c => c.category === 'Add Cost').map(cost => (
                    <tr key={cost.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600">{cost.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{cost.category}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{cost.description}</td>
                      <td className="px-6 py-4 text-sm font-bold text-red-600 text-right">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cost.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4">
            <Database className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium italic">Modul "{subMenuItems.find(i => i.id === activeSubMenu)?.label}" sedang dalam pengembangan data.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-8">
      {/* Sub Sidebar */}
      <div className="w-72 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" /> Master & Ops
          </h2>
          <p className="text-xs text-slate-500 mt-1">Kelola data master dan operasional.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {categories.map(category => (
            <div key={category} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{category}</h4>
              {subMenuItems.filter(item => item.category === category).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSubMenu(item.id as SubMenu)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    activeSubMenu === item.id 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", activeSubMenu === item.id ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                  <span>{item.label}</span>
                  {activeSubMenu === item.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
              {subMenuItems.find(i => i.id === activeSubMenu)?.icon && React.createElement(subMenuItems.find(i => i.id === activeSubMenu)!.icon, { className: "w-5 h-5 text-blue-600" })}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{subMenuItems.find(i => i.id === activeSubMenu)?.label}</h2>
              <p className="text-xs text-slate-500">Manajemen data {subMenuItems.find(i => i.id === activeSubMenu)?.label.toLowerCase()}.</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari data..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-64 shadow-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubMenu}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
