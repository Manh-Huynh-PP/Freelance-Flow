import type { AppData } from './types';
import ExcelJS from 'exceljs';
import {
  calculateFinancialSummary,
  calculateTaskDetails,
  calculateAdditionalFinancials,
  calculateAdditionalTaskDetails,
  calculateFixedCostDetails
} from '@/ai/analytics/business-intelligence-helpers';
import { format } from 'date-fns';

export async function exportFinancialReportToExcel(
  appData: AppData,
  dateRange: { from?: Date; to?: Date },
  currency: string = 'USD'
): Promise<void> {
  // 1. Calculate data
  const summary = calculateFinancialSummary(appData, dateRange);
  const taskDetails = calculateTaskDetails(appData, dateRange);
  const additionalFinancials = calculateAdditionalFinancials(appData, dateRange);
  const additionalTaskDetails = calculateAdditionalTaskDetails(appData, dateRange);
  const fixedCostDetails = calculateFixedCostDetails(appData, dateRange);
  const fixedCostsArray = Array.isArray(fixedCostDetails) ? fixedCostDetails : (fixedCostDetails.fixedCostItems || []);
  const totalFixedCosts = fixedCostsArray.reduce((sum, item) => sum + item.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  // 2. Create Workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Freelance Flow';
  workbook.created = new Date();

  // --- SHEET 1: Summary ---
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Value', key: 'value', width: 25 },
  ];
  
  const periodText = (dateRange.from && dateRange.to) 
    ? `${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}` 
    : 'All Time';

  summarySheet.addRows([
    { metric: 'Report Period', value: periodText },
    { metric: '', value: '' }, // empty row
    { metric: 'Total Revenue', value: formatCurrency(summary.revenue) },
    { metric: 'Total Costs', value: formatCurrency(summary.costs) },
    { metric: '  - Fixed Costs', value: formatCurrency(totalFixedCosts) },
    { metric: '  - Collaborator Costs', value: formatCurrency(summary.costs - totalFixedCosts) },
    { metric: 'Net Profit', value: formatCurrency(summary.profit) },
    { metric: '', value: '' },
    { metric: 'Future Revenue', value: formatCurrency(additionalFinancials.futureRevenue) },
    { metric: 'Lost Revenue', value: formatCurrency(additionalFinancials.lostRevenue) },
  ]);

  // Styling Summary Sheet
  summarySheet.getRow(1).font = { bold: true };
  summarySheet.getRow(4).font = { bold: true };
  summarySheet.getRow(5).font = { bold: true };
  summarySheet.getRow(8).font = { bold: true };

  // --- SHEET 2: Revenue Items ---
  if (taskDetails.revenueItems.length > 0) {
    const revSheet = workbook.addWorksheet('Revenue Items');
    revSheet.columns = [
      { header: 'Task Name', key: 'name', width: 40 },
      { header: 'Client', key: 'client', width: 30 },
      { header: 'Amount', key: 'amount', width: 20 },
    ];
    revSheet.getRow(1).font = { bold: true };
    
    taskDetails.revenueItems.forEach((item: any) => {
      revSheet.addRow({
        name: item.name,
        client: item.clientName,
        amount: item.amount
      });
    });
  }

  // --- SHEET 3: Cost Items ---
  // Combine Collaborator costs + explicit expenses if any exist
  const collabCosts = taskDetails.costItems.filter((i: any) => !String(i.id).startsWith('expense-'));
  if (collabCosts.length > 0 || fixedCostsArray.length > 0) {
    const costSheet = workbook.addWorksheet('Cost Items');
    costSheet.columns = [
      { header: 'Type', key: 'type', width: 20 },
      { header: 'Item Name', key: 'name', width: 40 },
      { header: 'Client/Frequency', key: 'detail', width: 30 },
      { header: 'Amount', key: 'amount', width: 20 },
    ];
    costSheet.getRow(1).font = { bold: true };

    // Fixed Costs
    fixedCostsArray.forEach((item: any) => {
      costSheet.addRow({
        type: 'Fixed Cost',
        name: item.name,
        detail: item.frequency === 'once' ? 'One time' : item.frequency,
        amount: item.amount
      });
    });

    // Collaborator Costs
    collabCosts.forEach((item: any) => {
      costSheet.addRow({
        type: 'Collaborator Cost',
        name: item.name,
        detail: item.clientName,
        amount: item.amount
      });
    });
  }

  // --- SHEET 4: Future & Lost Revenue ---
  if (additionalTaskDetails.futureRevenueItems.length > 0 || additionalTaskDetails.lostRevenueItems.length > 0) {
    const futureSheet = workbook.addWorksheet('Future & Lost Revenue');
    futureSheet.columns = [
      { header: 'Type', key: 'type', width: 20 },
      { header: 'Task Name', key: 'name', width: 40 },
      { header: 'Client', key: 'client', width: 30 },
      { header: 'Amount', key: 'amount', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];
    futureSheet.getRow(1).font = { bold: true };

    additionalTaskDetails.futureRevenueItems.forEach((item: any) => {
      futureSheet.addRow({
        type: 'Future Revenue',
        name: item.name,
        client: item.clientName,
        amount: item.amount,
        status: item.status || 'N/A'
      });
    });

    additionalTaskDetails.lostRevenueItems.forEach((item: any) => {
      futureSheet.addRow({
        type: 'Lost Revenue',
        name: item.name,
        client: item.clientName,
        amount: item.amount,
        status: item.status || 'N/A'
      });
    });
  }

  // 3. Generate and Download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
  const filename = `financial-report-${timestamp}.xlsx`;

  // Create link and trigger download
  if (typeof window !== 'undefined') {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}
