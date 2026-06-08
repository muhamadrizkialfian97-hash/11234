export type AssetStatus = 'Ready' | 'On-going' | 'Repair' | 'Idle';

export interface Truck {
  id: string;
  type: string;
  plateNumber: string;
  vendor: string;
  status: AssetStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  capacity: string;
  year: number;
  fuelConsumption: number; // liters per 100km
}

export interface Ship {
  id: string;
  name: string;
  type: string;
  vendor: string;
  status: AssetStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  capacity: string;
  year: number;
  deadweight: number; // DWT
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Truk' | 'Pelayaran' | 'Pemeliharaan' | 'Layanan';
  rating: number;
  contact: string;
  email: string;
  activeContracts: number;
  onTimeDelivery: number; // percentage
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  customer: string;
  date: string;
  status: 'Draft' | 'Approved' | 'In Progress' | 'Completed' | 'Cancelled';
  totalAmount: number;
  serviceType: string;
  vendor: string;
  assetId?: string;
}

export interface FinancialRecord {
  month: string;
  revenue: number;
  serviceCost: number;
  maintenanceCost: number;
  fuelCost: number;
  driverCost: number;
  tollCost: number;
  insuranceCost: number;
  taxAmount: number;
  totalPayment: number;
  grossProfit: number;
  profit: number; // Net Profit
}

export interface TrackingInfo {
  id: string;
  containerCode: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  status: 'In Transit' | 'At Port' | 'Delivered' | 'Delayed' | 'Maintenance';
  eta: string;
  lastUpdate: string;
}

export interface QueueItem {
  id: string;
  truckId: string;
  plateNumber: string;
  entryTime: string;
  exitTime?: string;
  status: 'Waiting' | 'Loading' | 'Unloading' | 'Completed';
  gate: string;
}

export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  activity: string;
  assetId: string;
  vendor: string;
}

export interface WhatsAppLog {
  id: string;
  recipient: string;
  message: string;
  status: 'Sent' | 'Failed' | 'Pending';
  timestamp: string;
}

export interface DelayRecord {
  id: string;
  poNumber: string;
  expectedArrival: string;
  actualArrival?: string;
  delayHours: number;
  reason: string;
  lossAmount: number;
}

export interface MasterKilometer {
  id: string;
  route: string;
  distance: number;
  standardFuel: number;
}

export interface UangJalanSchema {
  id: string;
  route: string;
  truckType: string;
  amount: number;
}

export interface Driver {
  id: string;
  name: string;
  status: 'Active' | 'Resigned' | 'Training' | 'On Leave';
  joinDate: string;
  performance: number;
  licenseNumber: string;
}

export interface BillingRecord {
  id: string;
  poNumber: string;
  amount: number;
  status: 'Unbilled' | 'Billed' | 'Paid';
  dueDate: string;
  customer: string;
}

export interface OperationalCost {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface MasterPrice {
  id: string;
  serviceName: string;
  basePrice: number;
  unit: string;
  category: 'Darat' | 'Laut' | 'Layanan';
}

export interface ARCollection {
  id: string;
  customerName: string;
  totalAR: number;
  overdue: number;
  lastPaymentDate: string;
  status: 'Good' | 'Warning' | 'Critical';
}

export interface RecruitmentLeadtime {
  id: string;
  position: string;
  avgDays: number;
  openPositions: number;
  status: 'On Track' | 'Delayed';
}

export interface PeopleDev {
  id: string;
  driverName: string;
  trainingType: string;
  date: string;
  score: number;
  status: 'Passed' | 'Failed' | 'Scheduled';
}

export interface KYCRecord {
  id: string;
  entityName: string;
  type: 'Vendor' | 'Customer' | 'Driver';
  status: 'Verified' | 'Pending' | 'Rejected';
  lastChecked: string;
}
