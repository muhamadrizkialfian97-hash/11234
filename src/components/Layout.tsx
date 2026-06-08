import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Truck as TruckIcon, 
  Ship as ShipIcon, 
  Users, 
  ClipboardList, 
  BarChart3, 
  TrendingUp,
  Download,
  Plus,
  Menu,
  X,
  ChevronRight,
  LogOut,
  MapPin,
  Clock,
  Calendar,
  MessageSquare,
  Bot,
  AlertTriangle,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg group",
      active 
        ? "bg-blue-600 text-white" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
    <span>{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto" />}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'full-dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Dashboard Aset', icon: TruckIcon },
    { id: 'availability', label: 'Kontrol Ketersediaan', icon: TruckIcon },
    { id: 'financial', label: 'Analitik Finansial', icon: BarChart3 },
    { id: 'loss-analysis', label: 'Analisa Laba Rugi', icon: AlertTriangle },
    { id: 'vendor-pl', label: 'P&L per Vendor', icon: Users },
    { id: 'tracking', label: 'Pelacakan Kontainer', icon: MapPin },
    { id: 'queue', label: 'Antrian & Gate', icon: Clock },
    { id: 'scheduling', label: 'Penjadwalan', icon: Calendar },
    { id: 'orders', label: 'Manajemen Order', icon: ClipboardList },
    { id: 'master-ops', label: 'Master & Operasional', icon: Database },
    { id: 'whatsapp', label: 'WhatsApp Blasting', icon: MessageSquare },
    { id: 'ai-chat', label: 'AI Assistant', icon: Bot },
    { id: 'entry', label: 'Entry Data', icon: Plus },
    { id: 'export', label: 'Tarik Data', icon: Download },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 transform bg-white border-r border-slate-200",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className={cn("flex items-center gap-3", !isSidebarOpen && "lg:hidden")}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">P</div>
            <span className="text-lg font-bold tracking-tight text-slate-900">PANCARAN</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-slate-100 lg:hidden text-slate-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className={cn(!isSidebarOpen && "lg:hidden")}>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-slate-100 hidden lg:block text-slate-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-slate-900">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-slate-900">Admin Pancaran</span>
              <span className="text-xs text-slate-500">Admin Utama</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
