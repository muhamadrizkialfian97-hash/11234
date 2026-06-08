import { 
  Truck, Ship, Vendor, PurchaseOrder, FinancialRecord, TrackingInfo, QueueItem, 
  ScheduleItem, WhatsAppLog, DelayRecord, MasterKilometer, UangJalanSchema, 
  Driver, BillingRecord, OperationalCost, MasterPrice, ARCollection, 
  RecruitmentLeadtime, PeopleDev, KYCRecord 
} from '../types';

export const TRUCK_TYPES = [
  'Blind Van', 'Pick Up Box', 'Pick Up Bak', 'CDE Box', 'CDE Bak', 
  'CDD Box', 'CDD Bak', 'Fuso Box', 'Fuso Bak', 'Tronton Box', 
  'Tronton Bak', 'Wingbox', 'Trailer 20ft', 'Trailer 40ft'
];

export const SHIP_TYPES = [
  'Kapal Kontainer', 'Kapal Curah', 'Kapal Tanker', 'RoRo', 
  'Tongkang', 'Kapal Tunda', 'Kargo Umum', 'Kapal Pendingin'
];

export const VENDORS: Vendor[] = [
  { id: 'V001', name: 'Pancaran Logistik Utama', category: 'Truk', rating: 4.8, contact: '08123456789', email: 'ops@pancaran.com', activeContracts: 145, onTimeDelivery: 98 },
  { id: 'V002', name: 'Samudera Indonesia', category: 'Pelayaran', rating: 4.5, contact: '08123456790', email: 'info@samudera.id', activeContracts: 88, onTimeDelivery: 92 },
  { id: 'V003', name: 'Indo Truck Jaya', category: 'Truk', rating: 4.2, contact: '08123456791', email: 'sales@indotruck.com', activeContracts: 65, onTimeDelivery: 85 },
  { id: 'V004', name: 'Marine Service Asia', category: 'Pemeliharaan', rating: 4.7, contact: '08123456792', email: 'service@marineservice.com', activeContracts: 12, onTimeDelivery: 95 },
  { id: 'V005', name: 'Global Transindo', category: 'Truk', rating: 4.0, contact: '08123456793', email: 'ops@globaltrans.com', activeContracts: 135, onTimeDelivery: 88 },
  { id: 'V006', name: 'Nusantara Shipping', category: 'Pelayaran', rating: 4.6, contact: '08123456794', email: 'hello@nusantara.com', activeContracts: 72, onTimeDelivery: 94 },
  { id: 'V007', name: 'Bengkel Maju Jaya', category: 'Pemeliharaan', rating: 4.4, contact: '08123456795', email: 'maju@jaya.com', activeContracts: 8, onTimeDelivery: 90 },
  { id: 'V008', name: 'Express Logistics', category: 'Layanan', rating: 4.9, contact: '08123456796', email: 'cs@express.com', activeContracts: 260, onTimeDelivery: 99 },
  { id: 'V009', name: 'Trans Jaya Abadi', category: 'Truk', rating: 3.8, contact: '08123456797', email: 'admin@transjaya.com', activeContracts: 40, onTimeDelivery: 80 },
  { id: 'V10', name: 'Oceanic Blue', category: 'Pelayaran', rating: 4.3, contact: '08123456798', email: 'ops@oceanic.com', activeContracts: 58, onTimeDelivery: 91 },
];

export const TRUCKS: Truck[] = Array.from({ length: 200 }).map((_, i) => ({
  id: `T${String(i + 1).padStart(3, '0')}`,
  type: TRUCK_TYPES[i % TRUCK_TYPES.length],
  plateNumber: `B ${Math.floor(1000 + Math.random() * 8999)} ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}`,
  vendor: VENDORS[i % 5].name,
  status: i % 25 === 0 ? 'Repair' : i % 8 === 0 ? 'On-going' : i % 30 === 0 ? 'Idle' : 'Ready',
  lastMaintenance: '2024-02-15',
  nextMaintenance: '2024-08-15',
  capacity: `${Math.floor(2 + Math.random() * 20)} Ton`,
  year: 2016 + (i % 8),
  fuelConsumption: 10 + Math.random() * 10
}));

export const SHIPS: Ship[] = Array.from({ length: 60 }).map((_, i) => ({
  id: `S${String(i + 1).padStart(3, '0')}`,
  name: `MV Pancaran ${['Ocean', 'Star', 'Galaxy', 'Spirit', 'Pride', 'Hope', 'Victory', 'Legacy'][i % 8]} ${i + 1}`,
  type: SHIP_TYPES[i % SHIP_TYPES.length],
  vendor: VENDORS[(i % 2 === 0 ? 1 : 5)].name,
  status: i % 15 === 0 ? 'Repair' : i % 6 === 0 ? 'On-going' : 'Ready',
  lastMaintenance: '2024-01-20',
  nextMaintenance: '2024-07-20',
  capacity: `${Math.floor(1000 + Math.random() * 10000)} TEU`,
  year: 2012 + (i % 12),
  deadweight: 10000 + Math.random() * 50000
}));

export const PURCHASE_ORDERS: PurchaseOrder[] = Array.from({ length: 800 }).map((_, i) => ({
  id: `PO-${2024000 + i}`,
  poNumber: `PO/2024/IV/${String(i + 1).padStart(4, '0')}`,
  customer: ['Unilever Indonesia', 'Indofood CBP', 'Astra International', 'Telkom Indonesia', 'Pertamina Patra Niaga', 'Nestle Indonesia', 'Wings Group', 'Mayora Indah', 'Sinar Mas', 'Gudang Garam'][i % 10],
  date: `2024-04-${String((i % 7) + 1).padStart(2, '0')}`,
  status: i % 15 === 0 ? 'Cancelled' : i % 10 === 0 ? 'Draft' : i % 8 === 0 ? 'Approved' : i % 4 === 0 ? 'In Progress' : 'Completed',
  totalAmount: Math.floor(25000000 + Math.random() * 250000000),
  serviceType: i % 3 === 0 ? 'Logistik Darat' : i % 3 === 1 ? 'Logistik Laut' : 'Multimodal',
  vendor: VENDORS[i % VENDORS.length].name,
  assetId: i % 2 === 0 ? TRUCKS[i % TRUCKS.length].id : SHIPS[i % SHIPS.length].id
}));

export const FINANCIAL_DATA: FinancialRecord[] = [
  { month: 'Jul 23', revenue: 1450000000, serviceCost: 700000000, maintenanceCost: 120000000, fuelCost: 180000000, driverCost: 90000000, tollCost: 45000000, insuranceCost: 15000000, taxAmount: 145000000, totalPayment: 1295000000, grossProfit: 750000000, profit: 155000000 },
  { month: 'Aug 23', revenue: 1520000000, serviceCost: 750000000, maintenanceCost: 130000000, fuelCost: 190000000, driverCost: 95000000, tollCost: 48000000, insuranceCost: 15000000, taxAmount: 152000000, totalPayment: 1380000000, grossProfit: 770000000, profit: 140000000 },
  { month: 'Sep 23', revenue: 1580000000, serviceCost: 780000000, maintenanceCost: 140000000, fuelCost: 200000000, driverCost: 98000000, tollCost: 50000000, insuranceCost: 18000000, taxAmount: 158000000, totalPayment: 1444000000, grossProfit: 800000000, profit: 136000000 },
  { month: 'Oct 23', revenue: 1650000000, serviceCost: 820000000, maintenanceCost: 150000000, fuelCost: 210000000, driverCost: 102000000, tollCost: 52000000, insuranceCost: 18000000, taxAmount: 165000000, totalPayment: 1517000000, grossProfit: 830000000, profit: 133000000 },
  { month: 'Nov 23', revenue: 1720000000, serviceCost: 850000000, maintenanceCost: 160000000, fuelCost: 220000000, driverCost: 105000000, tollCost: 55000000, insuranceCost: 20000000, taxAmount: 172000000, totalPayment: 1582000000, grossProfit: 870000000, profit: 138000000 },
  { month: 'Dec 23', revenue: 2100000000, serviceCost: 1050000000, maintenanceCost: 200000000, fuelCost: 280000000, driverCost: 130000000, tollCost: 65000000, insuranceCost: 25000000, taxAmount: 210000000, totalPayment: 1960000000, grossProfit: 1050000000, profit: 140000000 },
  { month: 'Jan 24', revenue: 1800000000, serviceCost: 900000000, maintenanceCost: 150000000, fuelCost: 240000000, driverCost: 110000000, tollCost: 55000000, insuranceCost: 20000000, taxAmount: 180000000, totalPayment: 1655000000, grossProfit: 900000000, profit: 145000000 },
  { month: 'Feb 24', revenue: 1950000000, serviceCost: 950000000, maintenanceCost: 180000000, fuelCost: 260000000, driverCost: 120000000, tollCost: 60000000, insuranceCost: 22000000, taxAmount: 195000000, totalPayment: 1787000000, grossProfit: 1000000000, profit: 163000000 },
  { month: 'Mar 24', revenue: 2350000000, serviceCost: 1150000000, maintenanceCost: 220000000, fuelCost: 310000000, driverCost: 140000000, tollCost: 70000000, insuranceCost: 28000000, taxAmount: 235000000, totalPayment: 2153000000, grossProfit: 1200000000, profit: 197000000 },
  { month: 'Apr 24', revenue: 2600000000, serviceCost: 1250000000, maintenanceCost: 250000000, fuelCost: 350000000, driverCost: 160000000, tollCost: 80000000, insuranceCost: 32000000, taxAmount: 260000000, totalPayment: 2382000000, grossProfit: 1350000000, profit: 218000000 },
];

export const TRACKING_DATA: TrackingInfo[] = [
  { id: 'TRK001', containerCode: 'CONT-A101', location: { lat: -6.1214, lng: 106.7741, name: 'Tanjung Priok Port' }, status: 'At Port', eta: '2024-04-10 14:00', lastUpdate: '2024-04-08 09:00' },
  { id: 'TRK002', containerCode: 'CONT-B202', location: { lat: -6.2088, lng: 106.8456, name: 'Jakarta Central' }, status: 'In Transit', eta: '2024-04-08 16:30', lastUpdate: '2024-04-08 10:15' },
  { id: 'TRK003', containerCode: 'CONT-C303', location: { lat: -7.2575, lng: 112.7521, name: 'Surabaya Terminal' }, status: 'Delayed', eta: '2024-04-12 08:00', lastUpdate: '2024-04-08 08:45' },
  { id: 'TRK004', containerCode: 'CONT-D404', location: { lat: -6.9667, lng: 110.4167, name: 'Semarang Port' }, status: 'In Transit', eta: '2024-04-09 10:00', lastUpdate: '2024-04-08 11:30' },
  { id: 'TRK005', containerCode: 'CONT-E505', location: { lat: -5.1333, lng: 119.4167, name: 'Makassar Port' }, status: 'At Port', eta: '2024-04-15 12:00', lastUpdate: '2024-04-08 07:00' },
  { id: 'TRK006', containerCode: 'CONT-F606', location: { lat: 1.2902, lng: 103.8519, name: 'Singapore Strait' }, status: 'In Transit', eta: '2024-04-11 22:00', lastUpdate: '2024-04-08 12:00' },
];

export const QUEUE_DATA: QueueItem[] = [
  { id: 'Q001', truckId: 'T001', plateNumber: 'B 1234 AB', entryTime: '2024-04-08 08:00', status: 'Loading', gate: 'Gate 1 - Loading Dock A' },
  { id: 'Q002', truckId: 'T005', plateNumber: 'B 5678 CD', entryTime: '2024-04-08 08:15', status: 'Waiting', gate: 'Gate 2 - Loading Dock B' },
  { id: 'Q003', truckId: 'T010', plateNumber: 'B 9012 EF', entryTime: '2024-04-08 07:30', exitTime: '2024-04-08 09:00', status: 'Completed', gate: 'Gate 1 - Loading Dock A' },
  { id: 'Q004', truckId: 'T022', plateNumber: 'B 3456 GH', entryTime: '2024-04-08 09:30', status: 'Unloading', gate: 'Gate 3 - Unloading Area' },
  { id: 'Q005', truckId: 'T045', plateNumber: 'B 7890 IJ', entryTime: '2024-04-08 10:00', status: 'Waiting', gate: 'Gate 4 - Container Yard' },
];

export const SCHEDULE_DATA: ScheduleItem[] = [
  { id: 'SCH001', date: '2024-04-09', time: '09:00', activity: 'Pengiriman Unilever - Jakarta ke Surabaya', assetId: 'T001', vendor: 'Pancaran Logistik Utama' },
  { id: 'SCH002', date: '2024-04-09', time: '13:00', activity: 'Muat Indofood - Jakarta ke Bandung', assetId: 'T002', vendor: 'Pancaran Logistik Utama' },
  { id: 'SCH003', date: '2024-04-10', time: '08:00', activity: 'Pengiriman Astra - Jakarta ke Semarang', assetId: 'T003', vendor: 'Pancaran Logistik Utama' },
  { id: 'SCH004', date: '2024-04-10', time: '10:00', activity: 'Muat Telkom - Jakarta ke Medan', assetId: 'T004', vendor: 'Pancaran Logistik Utama' },
  { id: 'SCH005', date: '2024-04-11', time: '07:00', activity: 'Pengiriman Pertamina - Jakarta ke Bali', assetId: 'T005', vendor: 'Pancaran Logistik Utama' },
];

export const WHATSAPP_LOGS: WhatsAppLog[] = [
  { id: 'WA001', recipient: '08123456789', message: 'Order PO/2024/IV/0001 telah disetujui.', status: 'Sent', timestamp: '2024-04-08 10:00' },
  { id: 'WA002', recipient: '08123456790', message: 'Truk B 1234 AB sedang dalam perjalanan.', status: 'Sent', timestamp: '2024-04-08 10:30' },
  { id: 'WA003', recipient: '08123456791', message: 'Antrian Anda di Gate 1 telah dimulai.', status: 'Sent', timestamp: '2024-04-08 11:00' },
  { id: 'WA004', recipient: '08123456792', message: 'Peringatan: Pengiriman PO/2024/IV/0005 mengalami delay.', status: 'Sent', timestamp: '2024-04-08 11:45' },
];

export const DELAY_DATA: DelayRecord[] = [
  { id: 'DEL001', poNumber: 'PO/2024/IV/0005', expectedArrival: '2024-04-07 10:00', actualArrival: '2024-04-07 14:00', delayHours: 4, reason: 'Kemacetan Tol Cikampek', lossAmount: 5000000 },
  { id: 'DEL002', poNumber: 'PO/2024/IV/0012', expectedArrival: '2024-04-08 08:00', delayHours: 2, reason: 'Cuaca Buruk di Pelabuhan', lossAmount: 2500000 },
  { id: 'DEL003', poNumber: 'PO/2024/IV/0025', expectedArrival: '2024-04-08 13:00', delayHours: 3, reason: 'Kendala Teknis Mesin', lossAmount: 3500000 },
  { id: 'DEL004', poNumber: 'PO/2024/IV/0040', expectedArrival: '2024-04-08 15:00', delayHours: 5, reason: 'Antrian Bongkar Muat Padat', lossAmount: 6000000 },
];

export const MASTER_KILOMETER: MasterKilometer[] = [
  { id: 'MK001', route: 'Jakarta - Surabaya', distance: 780, standardFuel: 250 },
  { id: 'MK002', route: 'Jakarta - Bandung', distance: 150, standardFuel: 50 },
  { id: 'MK003', route: 'Surabaya - Semarang', distance: 350, standardFuel: 110 },
  { id: 'MK004', route: 'Jakarta - Semarang', distance: 450, standardFuel: 140 },
  { id: 'MK005', route: 'Semarang - Surabaya', distance: 330, standardFuel: 100 },
  { id: 'MK006', route: 'Jakarta - Medan', distance: 1900, standardFuel: 600 },
  { id: 'MK007', route: 'Jakarta - Palembang', distance: 600, standardFuel: 190 },
  { id: 'MK008', route: 'Surabaya - Malang', distance: 95, standardFuel: 30 },
];

export const UANG_JALAN_SCHEMA: UangJalanSchema[] = [
  { id: 'UJ001', route: 'Jakarta - Surabaya', truckType: 'Trailer 40ft', amount: 3500000 },
  { id: 'UJ002', route: 'Jakarta - Bandung', truckType: 'CDE Box', amount: 800000 },
  { id: 'UJ003', route: 'Jakarta - Semarang', truckType: 'Wingbox', amount: 2200000 },
  { id: 'UJ004', route: 'Jakarta - Medan', truckType: 'Trailer 40ft', amount: 12000000 },
  { id: 'UJ005', route: 'Jakarta - Palembang', truckType: 'Tronton Box', amount: 4500000 },
];

export const DRIVERS: Driver[] = [
  { id: 'D001', name: 'Budi Santoso', status: 'Active', joinDate: '2022-01-15', performance: 95, licenseNumber: '1234-5678-9012' },
  { id: 'D002', name: 'Agus Setiawan', status: 'Active', joinDate: '2021-05-20', performance: 88, licenseNumber: '2345-6789-0123' },
  { id: 'D003', name: 'Iwan Fals', status: 'Training', joinDate: '2024-03-01', performance: 0, licenseNumber: '3456-7890-1234' },
  { id: 'D004', name: 'Slamet Raharjo', status: 'Active', joinDate: '2020-11-10', performance: 92, licenseNumber: '4567-8901-2345' },
  { id: 'D005', name: 'Joko Widodo', status: 'Active', joinDate: '2019-08-05', performance: 97, licenseNumber: '5678-9012-3456' },
  { id: 'D006', name: 'Prabowo Subianto', status: 'On Leave', joinDate: '2021-02-14', performance: 85, licenseNumber: '6789-0123-4567' },
  { id: 'D007', name: 'Ganjar Pranowo', status: 'Active', joinDate: '2023-06-20', performance: 90, licenseNumber: '7890-1234-5678' },
  { id: 'D008', name: 'Anies Baswedan', status: 'Active', joinDate: '2022-12-12', performance: 94, licenseNumber: '8901-2345-6789' },
];

export const BILLING_DATA: BillingRecord[] = [
  { id: 'BIL001', poNumber: 'PO/2024/IV/0001', amount: 25000000, status: 'Paid', dueDate: '2024-04-15', customer: 'Unilever Indonesia' },
  { id: 'BIL002', poNumber: 'PO/2024/IV/0002', amount: 15000000, status: 'Billed', dueDate: '2024-04-20', customer: 'Indofood CBP' },
  { id: 'BIL003', poNumber: 'PO/2024/IV/0003', amount: 45000000, status: 'Unbilled', dueDate: '2024-04-25', customer: 'Astra International' },
  { id: 'BIL004', poNumber: 'PO/2024/IV/0004', amount: 32000000, status: 'Paid', dueDate: '2024-04-10', customer: 'Telkom Indonesia' },
  { id: 'BIL005', poNumber: 'PO/2024/IV/0005', amount: 68000000, status: 'Billed', dueDate: '2024-04-30', customer: 'Pertamina Patra Niaga' },
];

export const OPERATIONAL_COSTS: OperationalCost[] = [
  { id: 'OC001', category: 'Add Cost', amount: 500000, date: '2024-04-08', description: 'Biaya Parkir Tambahan - Jakarta' },
  { id: 'OC002', category: 'Maintenance', amount: 2000000, date: '2024-04-07', description: 'Ganti Oli T001 - Bengkel Maju Jaya' },
  { id: 'OC003', category: 'Fuel', amount: 1500000, date: '2024-04-08', description: 'Isi BBM T005 - SPBU 31.123' },
  { id: 'OC004', category: 'Toll', amount: 350000, date: '2024-04-08', description: 'Biaya Tol Jakarta-Cikampek' },
  { id: 'OC005', category: 'Add Cost', amount: 1200000, date: '2024-04-06', description: 'Biaya Bongkar Muat Darurat' },
];

export const MASTER_PRICES: MasterPrice[] = [
  { id: 'MP001', serviceName: 'Sewa Trailer 40ft', basePrice: 15000000, unit: 'Trip', category: 'Darat' },
  { id: 'MP002', serviceName: 'Sewa Wingbox', basePrice: 8500000, unit: 'Trip', category: 'Darat' },
  { id: 'MP003', serviceName: 'Handling Container', basePrice: 1200000, unit: 'Box', category: 'Layanan' },
  { id: 'MP004', serviceName: 'Freight Jakarta-Surabaya', basePrice: 25000000, unit: 'Vessel', category: 'Laut' },
];

export const AR_COLLECTIONS: ARCollection[] = [
  { id: 'AR001', customerName: 'Unilever Indonesia', totalAR: 250000000, overdue: 0, lastPaymentDate: '2024-04-01', status: 'Good' },
  { id: 'AR002', customerName: 'Indofood CBP', totalAR: 180000000, overdue: 15000000, lastPaymentDate: '2024-03-15', status: 'Warning' },
  { id: 'AR003', customerName: 'Astra International', totalAR: 450000000, overdue: 120000000, lastPaymentDate: '2024-02-28', status: 'Critical' },
];

export const RECRUITMENT_DATA: RecruitmentLeadtime[] = [
  { id: 'REC001', position: 'Driver Trailer', avgDays: 14, openPositions: 5, status: 'On Track' },
  { id: 'REC002', position: 'Mekanik Senior', avgDays: 25, openPositions: 2, status: 'Delayed' },
  { id: 'REC003', position: 'Admin Operasional', avgDays: 10, openPositions: 3, status: 'On Track' },
];

export const PEOPLE_DEV_DATA: PeopleDev[] = [
  { id: 'PD001', driverName: 'Budi Santoso', trainingType: 'Safety Driving', date: '2024-03-15', score: 92, status: 'Passed' },
  { id: 'PD002', driverName: 'Agus Setiawan', trainingType: 'Eco Driving', date: '2024-03-20', score: 85, status: 'Passed' },
  { id: 'PD003', driverName: 'Iwan Fals', trainingType: 'Induction', date: '2024-04-05', score: 70, status: 'Passed' },
];

export const KYC_DATA: KYCRecord[] = [
  { id: 'KYC001', entityName: 'Pancaran Logistik Utama', type: 'Vendor', status: 'Verified', lastChecked: '2024-01-10' },
  { id: 'KYC002', entityName: 'Unilever Indonesia', type: 'Customer', status: 'Verified', lastChecked: '2024-02-15' },
  { id: 'KYC003', entityName: 'Budi Santoso', type: 'Driver', status: 'Verified', lastChecked: '2024-03-01' },
];
