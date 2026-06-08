import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Truck, Ship, Vendor, PurchaseOrder, FinancialRecord, TrackingInfo, QueueItem, 
  ScheduleItem, WhatsAppLog, DelayRecord, MasterKilometer, UangJalanSchema, 
  Driver, BillingRecord, OperationalCost, MasterPrice, ARCollection, 
  RecruitmentLeadtime, PeopleDev, KYCRecord 
} from '../types';
import { 
  TRUCKS, SHIPS, VENDORS, PURCHASE_ORDERS, FINANCIAL_DATA, TRACKING_DATA, 
  QUEUE_DATA, SCHEDULE_DATA, WHATSAPP_LOGS, DELAY_DATA, MASTER_KILOMETER, 
  UANG_JALAN_SCHEMA, DRIVERS, BILLING_DATA, OPERATIONAL_COSTS, MASTER_PRICES, 
  AR_COLLECTIONS, RECRUITMENT_DATA, PEOPLE_DEV_DATA, KYC_DATA 
} from '../data/mockData';

interface DataContextType {
  trucks: Truck[];
  ships: Ship[];
  vendors: Vendor[];
  pos: PurchaseOrder[];
  financials: FinancialRecord[];
  tracking: TrackingInfo[];
  queue: QueueItem[];
  schedules: ScheduleItem[];
  waLogs: WhatsAppLog[];
  delays: DelayRecord[];
  masterKilometer: MasterKilometer[];
  uangJalan: UangJalanSchema[];
  drivers: Driver[];
  billing: BillingRecord[];
  operationalCosts: OperationalCost[];
  masterPrices: MasterPrice[];
  arCollections: ARCollection[];
  recruitment: RecruitmentLeadtime[];
  peopleDev: PeopleDev[];
  kyc: KYCRecord[];
  addTruck: (truck: Truck) => void;
  addShip: (ship: Ship) => void;
  addVendor: (vendor: Vendor) => void;
  addPO: (po: PurchaseOrder) => void;
  addQueue: (item: QueueItem) => void;
  addSchedule: (item: ScheduleItem) => void;
  addWaLog: (log: WhatsAppLog) => void;
  addDelay: (delay: DelayRecord) => void;
  addDriver: (driver: Driver) => void;
  addOperationalCost: (cost: OperationalCost) => void;
  updatePOStatus: (id: string, status: PurchaseOrder['status']) => void;
  updateQueueStatus: (id: string, status: QueueItem['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [trucks, setTrucks] = useState<Truck[]>(TRUCKS);
  const [ships, setShips] = useState<Ship[]>(SHIPS);
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS);
  const [pos, setPos] = useState<PurchaseOrder[]>(PURCHASE_ORDERS);
  const [financials] = useState<FinancialRecord[]>(FINANCIAL_DATA);
  const [tracking] = useState<TrackingInfo[]>(TRACKING_DATA);
  const [queue, setQueue] = useState<QueueItem[]>(QUEUE_DATA);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(SCHEDULE_DATA);
  const [waLogs, setWaLogs] = useState<WhatsAppLog[]>(WHATSAPP_LOGS);
  const [delays, setDelays] = useState<DelayRecord[]>(DELAY_DATA);
  const [masterKilometer] = useState<MasterKilometer[]>(MASTER_KILOMETER);
  const [uangJalan] = useState<UangJalanSchema[]>(UANG_JALAN_SCHEMA);
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS);
  const [billing] = useState<BillingRecord[]>(BILLING_DATA);
  const [operationalCosts, setOperationalCosts] = useState<OperationalCost[]>(OPERATIONAL_COSTS);
  const [masterPrices] = useState<MasterPrice[]>(MASTER_PRICES);
  const [arCollections] = useState<ARCollection[]>(AR_COLLECTIONS);
  const [recruitment] = useState<RecruitmentLeadtime[]>(RECRUITMENT_DATA);
  const [peopleDev] = useState<PeopleDev[]>(PEOPLE_DEV_DATA);
  const [kyc] = useState<KYCRecord[]>(KYC_DATA);

  const addTruck = (truck: Truck) => setTrucks(prev => [truck, ...prev]);
  const addShip = (ship: Ship) => setShips(prev => [ship, ...prev]);
  const addVendor = (vendor: Vendor) => setVendors(prev => [vendor, ...prev]);
  const addPO = (po: PurchaseOrder) => setPos(prev => [po, ...prev]);
  const addQueue = (item: QueueItem) => setQueue(prev => [item, ...prev]);
  const addSchedule = (item: ScheduleItem) => setSchedules(prev => [item, ...prev]);
  const addWaLog = (log: WhatsAppLog) => setWaLogs(prev => [log, ...prev]);
  const addDelay = (delay: DelayRecord) => setDelays(prev => [delay, ...prev]);
  const addDriver = (driver: Driver) => setDrivers(prev => [driver, ...prev]);
  const addOperationalCost = (cost: OperationalCost) => setOperationalCosts(prev => [cost, ...prev]);
  
  const updatePOStatus = (id: string, status: PurchaseOrder['status']) => {
    setPos(prev => prev.map(po => po.id === id ? { ...po, status } : po));
  };

  const updateQueueStatus = (id: string, status: QueueItem['status']) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  return (
    <DataContext.Provider value={{ 
      trucks, ships, vendors, pos, financials, tracking, queue, schedules, waLogs, delays,
      masterKilometer, uangJalan, drivers, billing, operationalCosts,
      masterPrices, arCollections, recruitment, peopleDev, kyc,
      addTruck, addShip, addVendor, addPO, addQueue, addSchedule, addWaLog, addDelay, addDriver, addOperationalCost,
      updatePOStatus, updateQueueStatus 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
