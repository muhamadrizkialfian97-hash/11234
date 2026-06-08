import { useState } from 'react';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FullAnalysisDashboard from './components/FullAnalysisDashboard';
import Availability from './components/Availability';
import Financials from './components/Financials';
import ProfitLossAnalysis from './components/ProfitLossAnalysis';
import DelayDashboard from './components/DelayDashboard';
import VendorPL from './components/VendorPL';
import OrderManagement from './components/OrderManagement';
import TrackingSystem from './components/TrackingSystem';
import QueueManagement from './components/QueueManagement';
import SchedulingSystem from './components/SchedulingSystem';
import MasterOperations from './components/MasterOperations';
import WhatsAppBlasting from './components/WhatsAppBlasting';
import AIChat from './components/AIChat';
import ExportData from './components/ExportData';
import DataEntry from './components/DataEntry';

export default function App() {
  const [activeTab, setActiveTab] = useState('full-dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'full-dashboard':
        return <FullAnalysisDashboard />;
      case 'dashboard':
        return <Dashboard />;
      case 'availability':
        return <Availability />;
      case 'financial':
        return <Financials />;
      case 'loss-analysis':
        return <DelayDashboard />;
      case 'vendor-pl':
        return <VendorPL />;
      case 'tracking':
        return <TrackingSystem />;
      case 'queue':
        return <QueueManagement />;
      case 'scheduling':
        return <SchedulingSystem />;
      case 'orders':
        return <OrderManagement />;
      case 'master-ops':
        return <MasterOperations />;
      case 'whatsapp':
        return <WhatsAppBlasting />;
      case 'ai-chat':
        return <AIChat />;
      case 'entry':
        return <DataEntry />;
      case 'export':
        return <ExportData />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </DataProvider>
  );
}
