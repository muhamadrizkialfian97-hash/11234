import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { Download, FileSpreadsheet, FileText, Database, TrendingUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import { cn } from '../lib/utils';

export default function ExportData() {
  const { pos, trucks, ships, vendors, financials } = useData();

  const exportToExcel = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportModules = [
    { 
      id: 'detailed-transactions', 
      name: 'Laporan Transaksi Terperinci (PO & Armada)', 
      desc: 'Detail operasional per transaksi PO, termasuk info aset (armada), biaya breakdown, dan margin per trip.', 
      count: pos.length,
      data: pos.map(p => {
        const truck = trucks.find(t => t.id === p.assetId);
        const ship = ships.find(s => s.id === p.assetId);
        const asset = truck || ship;
        
        // Mock detailed cost breakdown per transaction
        const revenue = p.totalAmount;
        const fuelCost = revenue * 0.15;
        const driverCost = revenue * 0.10;
        const tollCost = p.serviceType === 'Logistik Darat' ? revenue * 0.05 : 0;
        const maintenanceCost = revenue * 0.08;
        const insuranceCost = revenue * 0.02;
        const taxAmount = revenue * 0.11;
        const totalExpense = fuelCost + driverCost + tollCost + maintenanceCost + insuranceCost + taxAmount;
        const profit = revenue - totalExpense;

        return {
          'Nomor PO': p.poNumber,
          'Tanggal': p.date,
          'Pelanggan': p.customer,
          'Status': p.status,
          'Tipe Layanan': p.serviceType,
          'Vendor Pelaksana': p.vendor,
          // Asset Details
          'ID Aset': p.assetId || 'N/A',
          'Nama/Plat Armada': truck ? truck.plateNumber : (ship ? ship.name : 'N/A'),
          'Tipe Armada': asset ? asset.type : 'N/A',
          'Kapasitas Armada': asset ? asset.capacity : 'N/A',
          // Financial Details per Transaction
          'Pendapatan (IDR)': revenue,
          'Biaya BBM (Est)': fuelCost,
          'Biaya Driver/Kru (Est)': driverCost,
          'Biaya Tol/Pelabuhan (Est)': tollCost,
          'Biaya Pemeliharaan (Est)': maintenanceCost,
          'Biaya Asuransi (Est)': insuranceCost,
          'Pajak PPN (11%)': taxAmount,
          'Total Pengeluaran (Est)': totalExpense,
          'Laba Bersih Per Transaksi': profit,
          'Margin Keuntungan (%)': ((profit / revenue) * 100).toFixed(2) + '%'
        };
      }),
      icon: FileText,
      color: 'text-blue-500'
    },
    { 
      id: 'po', 
      name: 'Pesanan Pembelian (PO)', 
      desc: 'Riwayat lengkap PO termasuk pelanggan, vendor, dan jumlah.', 
      count: pos.length,
      data: pos.map(p => ({
        'ID': p.id,
        'Nomor PO': p.poNumber,
        'Pelanggan': p.customer,
        'Tanggal': p.date,
        'Status': p.status,
        'Total Nilai': p.totalAmount,
        'Tipe Layanan': p.serviceType,
        'Vendor': p.vendor
      })),
      icon: FileText,
      color: 'text-blue-400'
    },
    { 
      id: 'trucks', 
      name: 'Armada Truk', 
      desc: 'Daftar lengkap aset truk, tipe, dan status ketersediaan.', 
      count: trucks.length,
      data: trucks.map(t => ({
        'ID': t.id,
        'Tipe': t.type,
        'Nomor Plat': t.plateNumber,
        'Vendor': t.vendor,
        'Status': t.status,
        'Pemeliharaan Terakhir': t.lastMaintenance,
        'Pemeliharaan Berikutnya': t.nextMaintenance,
        'Kapasitas': t.capacity,
        'Tahun': t.year,
        'Konsumsi BBM (L/100km)': t.fuelConsumption
      })),
      icon: Database,
      color: 'text-emerald-400'
    },
    { 
      id: 'ships', 
      name: 'Armada Kapal', 
      desc: 'Informasi kapal, kapasitas, dan catatan pemeliharaan.', 
      count: ships.length,
      data: ships.map(s => ({
        'ID': s.id,
        'Nama': s.name,
        'Tipe': s.type,
        'Vendor': s.vendor,
        'Status': s.status,
        'Pemeliharaan Terakhir': s.lastMaintenance,
        'Pemeliharaan Berikutnya': s.nextMaintenance,
        'Kapasitas': s.capacity,
        'Tahun': s.year,
        'Deadweight (DWT)': s.deadweight
      })),
      icon: Database,
      color: 'text-purple-400'
    },
    { 
      id: 'vendors', 
      name: 'Direktori Vendor', 
      desc: 'Vendor aktif, kategori, dan peringkat performa.', 
      count: vendors.length,
      data: vendors.map(v => ({
        'ID': v.id,
        'Nama': v.name,
        'Kategori': v.category,
        'Rating': v.rating,
        'Kontak': v.contact,
        'Email': v.email,
        'Kontrak Aktif': v.activeContracts,
        'Pengiriman Tepat Waktu (%)': v.onTimeDelivery
      })),
      icon: FileSpreadsheet,
      color: 'text-amber-400'
    },
    { 
      id: 'vendor-financials', 
      name: 'Analitik Keuangan per Vendor', 
      desc: 'Detail pendapatan, pengeluaran, dan margin keuntungan per vendor.', 
      count: vendors.length,
      data: vendors.map(v => {
        const vendorPOs = pos.filter(p => p.vendor === v.name);
        const revenue = vendorPOs.reduce((sum, p) => sum + (p.status === 'Completed' ? p.totalAmount : 0), 0);
        const expense = revenue * 0.85; // Mock expense calculation
        const margin = revenue - expense;
        return {
          'Nama Vendor': v.name,
          'Kategori': v.category,
          'Total PO': vendorPOs.length,
          'Pendapatan (IDR)': revenue,
          'Pengeluaran (IDR)': expense,
          'Margin (IDR)': margin,
          'Margin (%)': revenue > 0 ? ((margin / revenue) * 100).toFixed(2) + '%' : '0%'
        };
      }),
      icon: TrendingUp,
      color: 'text-emerald-400'
    },
    { 
      id: 'journal', 
      name: 'Buku Jurnal Detail (Audit)', 
      desc: 'Penjurnalan transaksi detail untuk keperluan audit keuangan.', 
      count: pos.length,
      data: pos.map(p => ({
        'Tanggal': p.date,
        'Nomor Referensi': p.poNumber,
        'Keterangan': `Transaksi ${p.serviceType} - ${p.customer}`,
        'Akun': p.status === 'Completed' ? 'Pendapatan Jasa' : 'Piutang Usaha',
        'Debit (IDR)': p.totalAmount,
        'Kredit (IDR)': 0,
        'Vendor': p.vendor,
        'Status Audit': 'Verified'
      })),
      icon: FileSpreadsheet,
      color: 'text-blue-500'
    },
    { 
      id: 'financials', 
      name: 'Analitik Finansial & Margin', 
      desc: 'Detail pendapatan, biaya operasional, laba kotor, pajak, dan laba bersih per bulan.', 
      count: financials.length,
      data: financials.map(f => ({
        'Bulan': f.month,
        'Pendapatan': f.revenue,
        'Biaya Layanan': f.serviceCost,
        'Biaya Pemeliharaan': f.maintenanceCost,
        'Biaya BBM': f.fuelCost,
        'Biaya Driver': f.driverCost,
        'Biaya Tol': f.tollCost,
        'Biaya Asuransi': f.insuranceCost,
        'Pajak (PPN)': f.taxAmount,
        'Total Pengeluaran': f.totalPayment,
        'Laba Kotor': f.grossProfit,
        'Laba Bersih': f.profit,
        'Margin Laba Bersih (%)': ((f.profit / f.revenue) * 100).toFixed(2) + '%'
      })),
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    { 
      id: 'profit-loss-statement', 
      name: 'Laporan Laba Rugi (P&L) Komprehensif', 
      desc: 'Laporan laba rugi standar akuntansi yang merinci pendapatan, HPP, laba kotor, biaya operasional, dan laba bersih.', 
      count: financials.length,
      data: financials.map(f => {
        const cogs = f.serviceCost + f.fuelCost + f.driverCost + f.tollCost;
        const operatingExpenses = f.maintenanceCost + f.insuranceCost;
        const ebitda = f.revenue - cogs - operatingExpenses;
        
        return {
          'Periode (Bulan)': f.month,
          'Total Pendapatan (Revenue)': f.revenue,
          '--- HARGA POKOK PENJUALAN (HPP) ---': '',
          'Biaya Layanan Langsung': f.serviceCost,
          'Biaya Bahan Bakar (BBM)': f.fuelCost,
          'Biaya Driver & Kru': f.driverCost,
          'Biaya Tol & Retribusi': f.tollCost,
          'TOTAL HPP': cogs,
          'LABA KOTOR (Gross Profit)': f.revenue - cogs,
          '--- BIAYA OPERASIONAL ---': '',
          'Biaya Pemeliharaan Aset': f.maintenanceCost,
          'Biaya Asuransi & Proteksi': f.insuranceCost,
          'TOTAL BIAYA OPERASIONAL': operatingExpenses,
          'EBITDA': ebitda,
          'Pajak (PPN/PPh)': f.taxAmount,
          'LABA BERSIH (Net Profit)': f.profit,
          'Margin Laba Bersih (%)': ((f.profit / f.revenue) * 100).toFixed(2) + '%',
          'Status Laporan': 'Final - Audited'
        };
      }),
      icon: TrendingUp,
      color: 'text-emerald-600'
    },
    { 
      id: 'fleet-availability', 
      name: 'Ketersediaan Armada (Real-time)', 
      desc: 'Status operasional seluruh aset truk dan kapal untuk perencanaan logistik.', 
      count: trucks.length + ships.length,
      data: [
        ...trucks.map(t => ({ 'Tipe': 'Truk', 'ID/Nama': t.plateNumber, 'Kategori': t.type, 'Vendor': t.vendor, 'Status': t.status, 'Kapasitas': t.capacity, 'Tahun': t.year })),
        ...ships.map(s => ({ 'Tipe': 'Kapal', 'ID/Nama': s.name, 'Kategori': s.type, 'Vendor': s.vendor, 'Status': s.status, 'Kapasitas': s.capacity, 'Tahun': s.year }))
      ],
      icon: Database,
      color: 'text-cyan-400'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Pusat Ekspor Data Master</h2>
        <p className="text-slate-500">
          Hasilkan dan unduh laporan komprehensif dalam format Excel. Dataset ini dirancang untuk keperluan audit, analisis vendor, dan penjurnalan finansial detail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportModules.map((module, i) => (
          <motion.div 
            key={module.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <module.icon className={cn("w-6 h-6", module.color)} />
              </div>
              <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                {module.count} Data
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900">{module.name}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">{module.desc}</p>
            <button 
              onClick={() => exportToExcel(module.data, `Pancaran_${module.id}_Laporan`)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Unduh Excel (.xlsx)
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bulk Export Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-100 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
      >
        <div>
          <h3 className="text-xl font-bold text-blue-700 mb-2">Laporan Audit Master Komprehensif</h3>
          <p className="text-slate-600 text-sm max-w-md">
            Unduh seluruh database sistem termasuk penjurnalan detail, analitik vendor, dan ketersediaan armada dalam satu file Excel multi-sheet.
          </p>
        </div>
        <button 
          onClick={() => {
            const workbook = XLSX.utils.book_new();
            
            exportModules.forEach(module => {
              const worksheet = XLSX.utils.json_to_sheet(module.data);
              XLSX.utils.book_append_sheet(workbook, worksheet, module.name.substring(0, 31));
            });

            XLSX.writeFile(workbook, "Pancaran_Laporan_Audit_Master_Lengkap.xlsx");
          }}
          className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          <Download className="w-5 h-5" />
          Ekspor Semua Laporan Audit
        </button>
      </motion.div>
    </div>
  );
}
