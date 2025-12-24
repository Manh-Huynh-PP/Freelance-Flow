/**
 * Excel Backup Service - Export/Import data as Excel files
 * Using ExcelJS as safe alternative to xlsx (which has security vulnerabilities)
 */

import type { AppData, Task, Client, Quote, Collaborator, Category } from './types';
import { initialAppData } from './data';
import ExcelJS from 'exceljs';

export class ExcelBackupService {
  private static readonly VERSION = '1.2';

  /**
   * Export app data to Excel format
   */
  static async exportToExcel(data: AppData): Promise<{ blob: Blob; filename: string }> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Freelance Flow';
    workbook.created = new Date();

    // Add Info sheet
    const infoSheet = workbook.addWorksheet('Info');
    infoSheet.addRows([
      ['Freelance Flow Data Export'],
      ['Export Date', new Date().toISOString()],
      ['Version', this.VERSION],
      ['Format', 'Excel Workbook (.xlsx)'],
      [''],
      ['Sheet Contents:'],
      ['Tasks', 'All project tasks with details'],
      ['Clients', 'Client contact information'],
      ['Quotes', 'Quote summary'],
      ['Quotes_Sections', 'Quote sections'],
      ['Quotes_Items', 'Quote items'],
      ['Quotes_Payments', 'Payment entries'],
      ['Collaborators', 'Team members'],
      ['Categories', 'Project categories'],
      ['Settings', 'Application settings'],
    ]);

    // Tasks sheet
    if (data.tasks?.length) {
      const tasksSheet = workbook.addWorksheet('Tasks');
      tasksSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Start Date', key: 'startDate', width: 15 },
        { header: 'Deadline', key: 'deadline', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Client ID', key: 'clientId', width: 20 },
        { header: 'Category ID', key: 'categoryId', width: 20 },
        { header: 'Quote ID', key: 'quoteId', width: 20 },
        { header: 'Collaborator IDs', key: 'collaboratorIds', width: 30 },
        { header: 'Collaborator Quotes Mapping', key: 'collaboratorQuotes', width: 50 },
        { header: 'Brief Links', key: 'briefLink', width: 40 },
        { header: 'Drive Links', key: 'driveLink', width: 40 },
        { header: 'Created At', key: 'createdAt', width: 20 },
        { header: 'Progress', key: 'progress', width: 10 },
      ];
      data.tasks.forEach((task: Task) => {
        tasksSheet.addRow({
          id: task.id,
          name: task.name,
          description: task.description || '',
          startDate: task.startDate || '',
          deadline: task.deadline || '',
          status: task.status,
          clientId: task.clientId || '',
          categoryId: task.categoryId || '',
          quoteId: task.quoteId || '',
          collaboratorIds: Array.isArray(task.collaboratorIds) ? task.collaboratorIds.join(', ') : '',
          collaboratorQuotes: (task as any).collaboratorQuotes ? JSON.stringify((task as any).collaboratorQuotes) : '',
          briefLink: Array.isArray(task.briefLink) ? task.briefLink.join(', ') : '',
          driveLink: Array.isArray(task.driveLink) ? task.driveLink.join(', ') : '',
          createdAt: task.createdAt || '',
          progress: task.progress || 0,
        });
      });
    }

    // Clients sheet
    if (data.clients?.length) {
      const clientsSheet = workbook.addWorksheet('Clients');
      clientsSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 20 },
        { header: 'Tax Info', key: 'taxInfo', width: 30 },
        { header: 'Drive Links', key: 'driveLink', width: 40 },
      ];
      data.clients.forEach((client: Client) => {
        clientsSheet.addRow({
          id: client.id,
          name: client.name,
          type: client.type || '',
          email: Array.isArray(client.email) ? client.email.join(', ') : client.email || '',
          phone: Array.isArray(client.phone) ? client.phone.join(', ') : client.phone || '',
          taxInfo: Array.isArray(client.taxInfo) ? client.taxInfo.join(', ') : client.taxInfo || '',
          driveLink: Array.isArray(client.driveLink) ? client.driveLink.join(', ') : client.driveLink || '',
        });
      });
    }

    // Quotes sheet
    if (data.quotes?.length) {
      const quotesSheet = workbook.addWorksheet('Quotes');
      quotesSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Amount Paid', key: 'amountPaid', width: 15 },
        { header: 'Sections Count', key: 'sectionsCount', width: 15 },
        { header: 'Columns (JSON)', key: 'columns', width: 50 },
      ];
      data.quotes.forEach((quote: Quote) => {
        quotesSheet.addRow({
          id: quote.id,
          total: quote.total || 0,
          status: quote.status || '',
          amountPaid: quote.amountPaid || 0,
          sectionsCount: quote.sections?.length || 0,
          columns: (quote as any).columns ? JSON.stringify((quote as any).columns) : '',
        });
      });

      // Quotes_Sections sheet
      const sectionsSheet = workbook.addWorksheet('Quotes_Sections');
      sectionsSheet.columns = [
        { header: 'Quote ID', key: 'quoteId', width: 20 },
        { header: 'Section ID', key: 'sectionId', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Order', key: 'order', width: 10 },
      ];

      // Quotes_Items sheet
      const itemsSheet = workbook.addWorksheet('Quotes_Items');
      itemsSheet.columns = [
        { header: 'Quote ID', key: 'quoteId', width: 20 },
        { header: 'Section ID', key: 'sectionId', width: 20 },
        { header: 'Item ID', key: 'itemId', width: 20 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Unit Price', key: 'unitPrice', width: 15 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Custom Fields', key: 'customFields', width: 40 },
      ];

      // Quotes_Payments sheet
      const paymentsSheet = workbook.addWorksheet('Quotes_Payments');
      paymentsSheet.columns = [
        { header: 'Quote ID', key: 'quoteId', width: 20 },
        { header: 'Payment ID', key: 'paymentId', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Method', key: 'method', width: 15 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Amount Type', key: 'amountType', width: 15 },
        { header: 'Percent', key: 'percent', width: 10 },
        { header: 'Notes', key: 'notes', width: 30 },
      ];

      data.quotes.forEach((quote: Quote) => {
        quote.sections?.forEach((section, sIndex) => {
          sectionsSheet.addRow({
            quoteId: quote.id,
            sectionId: section.id,
            name: section.name,
            order: sIndex,
          });
          section.items?.forEach((item) => {
            itemsSheet.addRow({
              quoteId: quote.id,
              sectionId: section.id,
              itemId: item.id,
              description: item.description,
              unitPrice: item.unitPrice,
              quantity: item.quantity ?? 1,
              customFields: item.customFields ? JSON.stringify(item.customFields) : '',
            });
          });
        });
        quote.payments?.forEach((p) => {
          paymentsSheet.addRow({
            quoteId: quote.id,
            paymentId: p.id,
            status: p.status,
            date: p.date || '',
            method: p.method || '',
            amount: p.amount ?? '',
            amountType: p.amountType || '',
            percent: p.percent ?? '',
            notes: p.notes || '',
          });
        });
      });
    }

    // Collaborators sheet
    if (data.collaborators?.length) {
      const collabSheet = workbook.addWorksheet('Collaborators');
      collabSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 20 },
        { header: 'Specialty', key: 'specialty', width: 30 },
        { header: 'Facebook Link', key: 'facebookLink', width: 40 },
        { header: 'Notes', key: 'notes', width: 40 },
      ];
      data.collaborators.forEach((collab: Collaborator) => {
        collabSheet.addRow({
          id: collab.id,
          name: collab.name,
          email: collab.email || '',
          phone: collab.phone || '',
          specialty: collab.specialty || '',
          facebookLink: collab.facebookLink || '',
          notes: collab.notes || '',
        });
      });
    }

    // Categories sheet
    if (data.categories?.length) {
      const catSheet = workbook.addWorksheet('Categories');
      catSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
      ];
      data.categories.forEach((cat: Category) => {
        catSheet.addRow({
          id: cat.id,
          name: cat.name,
        });
      });
    }

    // Projects sheet
    if ((data as any).projects?.length) {
      const projectsSheet = workbook.addWorksheet('Projects');
      projectsSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Start Date', key: 'startDate', width: 15 },
        { header: 'End Date', key: 'endDate', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Client ID', key: 'clientId', width: 20 },
      ];
      (data as any).projects.forEach((p: any) => {
        projectsSheet.addRow({
          id: p.id,
          name: p.name,
          description: p.description || '',
          startDate: p.startDate || '',
          endDate: p.endDate || '',
          status: p.status || '',
          clientId: p.clientId || '',
        });
      });
    }

    // Quote Templates sheet
    if ((data as any).quoteTemplates?.length) {
      const templatesSheet = workbook.addWorksheet('QuoteTemplates');
      templatesSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Data (JSON)', key: 'data', width: 100 },
      ];
      (data as any).quoteTemplates.forEach((t: any) => {
        templatesSheet.addRow({
          id: t.id,
          name: t.name || '',
          data: JSON.stringify(t),
        });
      });
    }

    // Collaborator Quotes sheet
    if ((data as any).collaboratorQuotes?.length) {
      const collabQuotesSheet = workbook.addWorksheet('CollaboratorQuotes');
      collabQuotesSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Collaborator ID', key: 'collaboratorId', width: 20 },
        { header: 'Task ID', key: 'taskId', width: 20 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Data (JSON)', key: 'data', width: 100 },
      ];
      (data as any).collaboratorQuotes.forEach((cq: any) => {
        collabQuotesSheet.addRow({
          id: cq.id,
          collaboratorId: cq.collaboratorId || '',
          taskId: cq.taskId || '',
          total: cq.total || 0,
          status: cq.status || '',
          data: JSON.stringify(cq),
        });
      });
    }

    // Notes sheet
    if ((data as any).notes?.length) {
      const notesSheet = workbook.addWorksheet('Notes');
      notesSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Content', key: 'content', width: 60 },
        { header: 'Created At', key: 'createdAt', width: 20 },
        { header: 'Task ID', key: 'taskId', width: 20 },
      ];
      (data as any).notes.forEach((n: any) => {
        notesSheet.addRow({
          id: n.id,
          title: n.title || '',
          content: n.content || '',
          createdAt: n.createdAt || '',
          taskId: n.taskId || '',
        });
      });
    }

    // Events sheet
    if ((data as any).events?.length) {
      const eventsSheet = workbook.addWorksheet('Events');
      eventsSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Start', key: 'start', width: 20 },
        { header: 'End', key: 'end', width: 20 },
        { header: 'All Day', key: 'allDay', width: 10 },
        { header: 'Task ID', key: 'taskId', width: 20 },
        { header: 'Data (JSON)', key: 'data', width: 60 },
      ];
      (data as any).events.forEach((e: any) => {
        eventsSheet.addRow({
          id: e.id,
          title: e.title || '',
          start: e.start || '',
          end: e.end || '',
          allDay: e.allDay ? 'Yes' : 'No',
          taskId: e.taskId || '',
          data: JSON.stringify(e),
        });
      });
    }

    // Work Sessions sheet
    if ((data as any).workSessions?.length) {
      const sessionsSheet = workbook.addWorksheet('WorkSessions');
      sessionsSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Task ID', key: 'taskId', width: 20 },
        { header: 'Start Time', key: 'startTime', width: 20 },
        { header: 'End Time', key: 'endTime', width: 20 },
        { header: 'Duration (min)', key: 'duration', width: 15 },
        { header: 'Notes', key: 'notes', width: 40 },
      ];
      (data as any).workSessions.forEach((ws: any) => {
        sessionsSheet.addRow({
          id: ws.id,
          taskId: ws.taskId || '',
          startTime: ws.startTime || '',
          endTime: ws.endTime || '',
          duration: ws.duration || 0,
          notes: ws.notes || '',
        });
      });
    }

    // Fixed Costs sheet
    if ((data as any).fixedCosts?.length) {
      const fixedCostsSheet = workbook.addWorksheet('FixedCosts');
      fixedCostsSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Frequency', key: 'frequency', width: 15 },
        { header: 'Category', key: 'category', width: 20 },
      ];
      (data as any).fixedCosts.forEach((fc: any) => {
        fixedCostsSheet.addRow({
          id: fc.id,
          name: fc.name || '',
          amount: fc.amount || 0,
          frequency: fc.frequency || '',
          category: fc.category || '',
        });
      });
    }

    // Expenses sheet
    if ((data as any).expenses?.length) {
      const expensesSheet = workbook.addWorksheet('Expenses');
      expensesSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Task ID', key: 'taskId', width: 20 },
        { header: 'Notes', key: 'notes', width: 40 },
      ];
      (data as any).expenses.forEach((ex: any) => {
        expensesSheet.addRow({
          id: ex.id,
          name: ex.name || '',
          amount: ex.amount || 0,
          date: ex.date || '',
          category: ex.category || '',
          taskId: ex.taskId || '',
          notes: ex.notes || '',
        });
      });
    }

    // Settings sheet
    const settingsSheet = workbook.addWorksheet('Settings');
    settingsSheet.columns = [
      { header: 'Key', key: 'key', width: 30 },
      { header: 'Value', key: 'value', width: 80 },
    ];
    if (data.appSettings) {
      Object.entries(data.appSettings).forEach(([key, value]) => {
        settingsSheet.addRow({
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        });
      });
    }

    // AI Data sheet (store as JSON blobs)
    const aiDataSheet = workbook.addWorksheet('AI_Data');
    aiDataSheet.columns = [
      { header: 'Type', key: 'type', width: 30 },
      { header: 'Data (JSON)', key: 'data', width: 150 },
    ];
    const aiDataTypes = ['aiAnalyses', 'aiProductivityAnalyses', 'aiWritingPresets', 'aiWritingHistory', 'aiWritingVersions'];
    aiDataTypes.forEach(type => {
      const aiData = (data as any)[type];
      if (aiData !== undefined) {
        aiDataSheet.addRow({
          type,
          data: JSON.stringify(aiData),
        });
      }
    });

    // Generate blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const filename = `freelance-flow-backup-${new Date().toISOString().split('T')[0]}.xlsx`;

    return { blob, filename };
  }

  /**
   * Export all backups history to Excel
   */
  static async exportAllBackupsAsExcel(backups: any[]): Promise<{ blob: Blob; filename: string }> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Freelance Flow';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Backups History');
    sheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 20 },
      { header: 'Date', key: 'date', width: 25 },
      { header: 'Version', key: 'version', width: 10 },
      { header: 'Data Size (Approx)', key: 'size', width: 15 },
      { header: 'Data (JSON)', key: 'data', width: 100 }
    ];

    backups.forEach(backup => {
      sheet.addRow({
        timestamp: backup.timestamp,
        date: new Date(backup.timestamp).toLocaleString(),
        version: backup.version || '1.0',
        size: JSON.stringify(backup.data).length,
        data: JSON.stringify(backup.data)
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const filename = `freelance-flow-backups-history-${new Date().toISOString().split('T')[0]}.xlsx`;

    return { blob, filename };
  }


  /**
   * Import app data from Excel file
   */
  static async importFromExcel(file: File): Promise<Partial<AppData>> {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const result: Partial<AppData> = {
      tasks: [],
      clients: [],
      quotes: [],
      collaborators: [],
      categories: [],
      appSettings: { ...initialAppData.appSettings },
    };

    // Helper to get worksheet data as objects
    const getSheetData = (sheetName: string): Record<string, any>[] => {
      const sheet = workbook.getWorksheet(sheetName);
      if (!sheet) return [];

      const data: Record<string, any>[] = [];
      const headers: string[] = [];

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          row.eachCell((cell) => {
            headers.push(String(cell.value || ''));
          });
        } else {
          const rowData: Record<string, any> = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber - 1];
            if (header) {
              rowData[header] = cell.value;
            }
          });
          if (Object.keys(rowData).length > 0) {
            data.push(rowData);
          }
        }
      });

      return data;
    };

    // Import Tasks
    const tasksData = getSheetData('Tasks');
    result.tasks = tasksData.map((row) => ({
      id: String(row['ID'] || ''),
      name: String(row['Name'] || ''),
      description: String(row['Description'] || ''),
      startDate: row['Start Date'] ? String(row['Start Date']) : '',
      deadline: row['Deadline'] ? String(row['Deadline']) : '',
      status: (String(row['Status'] || 'backlog') as Task['status']),
      clientId: row['Client ID'] ? String(row['Client ID']) : undefined,
      categoryId: row['Category ID'] ? String(row['Category ID']) : undefined,
      quoteId: row['Quote ID'] ? String(row['Quote ID']) : undefined,
      collaboratorIds: row['Collaborator IDs'] ? String(row['Collaborator IDs']).split(',').map(s => s.trim()).filter(Boolean) : [],
      collaboratorQuotes: (() => {
        try {
          return row['Collaborator Quotes Mapping'] ? JSON.parse(String(row['Collaborator Quotes Mapping'])) : undefined;
        } catch {
          return undefined;
        }
      })(),
      briefLink: row['Brief Links'] ? String(row['Brief Links']).split(',').map(s => s.trim()).filter(Boolean) : [],
      driveLink: row['Drive Links'] ? String(row['Drive Links']).split(',').map(s => s.trim()).filter(Boolean) : [],
      createdAt: row['Created At'] ? String(row['Created At']) : new Date().toISOString(),
      progress: Number(row['Progress']) || 0,
    })) as Task[];

    // Import Clients
    const clientsData = getSheetData('Clients');
    result.clients = clientsData.map((row) => ({
      id: String(row['ID'] || ''),
      name: String(row['Name'] || ''),
      type: row['Type'] ? String(row['Type']) as Client['type'] : undefined,
      email: row['Email'] ? String(row['Email']).split(',').map(s => s.trim()).filter(Boolean) : [],
      phone: row['Phone'] ? String(row['Phone']).split(',').map(s => s.trim()).filter(Boolean) : [],
      taxInfo: row['Tax Info'] ? String(row['Tax Info']).split(',').map(s => s.trim()).filter(Boolean) : [],
      driveLink: row['Drive Links'] ? String(row['Drive Links']).split(',').map(s => s.trim()).filter(Boolean) : [],
    }));

    // Import Quotes (with sections, items, payments)
    const quotesData = getSheetData('Quotes');
    const sectionsData = getSheetData('Quotes_Sections');
    const itemsData = getSheetData('Quotes_Items');
    const paymentsData = getSheetData('Quotes_Payments');

    result.quotes = quotesData.map((row) => {
      const quoteId = String(row['ID'] || '');
      const sections = sectionsData
        .filter((s) => String(s['Quote ID']) === quoteId)
        .map((s) => {
          const sectionId = String(s['Section ID'] || '');
          const items = itemsData
            .filter((i) => String(i['Quote ID']) === quoteId && String(i['Section ID']) === sectionId)
            .map((i) => ({
              id: String(i['Item ID'] || ''),
              description: String(i['Description'] || ''),
              unitPrice: Number(i['Unit Price']) || 0,
              quantity: Number(i['Quantity']) || 1,
              customFields: i['Custom Fields'] ? JSON.parse(String(i['Custom Fields'])) : undefined,
            }));
          return {
            id: sectionId,
            name: String(s['Name'] || ''),
            items,
          };
        });
      const payments = paymentsData
        .filter((p) => String(p['Quote ID']) === quoteId)
        .map((p) => ({
          id: String(p['Payment ID'] || ''),
          status: String(p['Status'] || 'pending'),
          date: p['Date'] ? String(p['Date']) : undefined,
          method: p['Method'] ? String(p['Method']) : undefined,
          amount: p['Amount'] ? Number(p['Amount']) : undefined,
          amountType: p['Amount Type'] ? String(p['Amount Type']) : undefined,
          percent: p['Percent'] ? Number(p['Percent']) : undefined,
          notes: p['Notes'] ? String(p['Notes']) : undefined,
        }));
      // Parse columns if available
      let columns;
      try {
        columns = row['Columns (JSON)'] ? JSON.parse(String(row['Columns (JSON)'])) : undefined;
      } catch {
        columns = undefined;
      }

      return {
        id: quoteId,
        total: Number(row['Total']) || 0,
        status: (String(row['Status'] || 'draft') as Quote['status']),
        amountPaid: Number(row['Amount Paid']) || 0,
        sections,
        payments,
        columns,
      };
    }) as Quote[];

    // Import Collaborators
    const collabData = getSheetData('Collaborators');
    result.collaborators = collabData.map((row) => ({
      id: String(row['ID'] || ''),
      name: String(row['Name'] || ''),
      email: row['Email'] ? String(row['Email']) : undefined,
      phone: row['Phone'] ? String(row['Phone']) : undefined,
      specialty: row['Specialty'] ? String(row['Specialty']) : undefined,
      facebookLink: row['Facebook Link'] ? String(row['Facebook Link']) : undefined,
      notes: row['Notes'] ? String(row['Notes']) : undefined,
    }));

    // Import Categories
    const catData = getSheetData('Categories');
    result.categories = catData.map((row) => ({
      id: String(row['ID'] || ''),
      name: String(row['Name'] || ''),
    }));

    // Import Projects
    const projectsData = getSheetData('Projects');
    if (projectsData.length) {
      (result as any).projects = projectsData.map((row) => ({
        id: String(row['ID'] || ''),
        name: String(row['Name'] || ''),
        description: row['Description'] ? String(row['Description']) : undefined,
        startDate: row['Start Date'] ? String(row['Start Date']) : undefined,
        endDate: row['End Date'] ? String(row['End Date']) : undefined,
        status: String(row['Status'] || 'planning'),
        clientId: row['Client ID'] ? String(row['Client ID']) : undefined,
      }));
    }

    // Import Quote Templates (from JSON blob)
    const templatesData = getSheetData('QuoteTemplates');
    if (templatesData.length) {
      (result as any).quoteTemplates = templatesData.map((row) => {
        try {
          return JSON.parse(String(row['Data (JSON)'] || '{}'));
        } catch {
          return { id: String(row['ID'] || ''), name: String(row['Name'] || '') };
        }
      });
    }

    // Import Collaborator Quotes (from JSON blob)
    const collabQuotesData = getSheetData('CollaboratorQuotes');
    if (collabQuotesData.length) {
      (result as any).collaboratorQuotes = collabQuotesData.map((row) => {
        try {
          return JSON.parse(String(row['Data (JSON)'] || '{}'));
        } catch {
          return {
            id: String(row['ID'] || ''),
            collaboratorId: row['Collaborator ID'] ? String(row['Collaborator ID']) : undefined,
            taskId: row['Task ID'] ? String(row['Task ID']) : undefined,
            total: Number(row['Total']) || 0,
            status: String(row['Status'] || 'draft'),
          };
        }
      });
    }

    // Import Notes
    const notesData = getSheetData('Notes');
    if (notesData.length) {
      (result as any).notes = notesData.map((row) => ({
        id: String(row['ID'] || ''),
        title: row['Title'] ? String(row['Title']) : undefined,
        content: row['Content'] ? String(row['Content']) : undefined,
        createdAt: row['Created At'] ? String(row['Created At']) : undefined,
        taskId: row['Task ID'] ? String(row['Task ID']) : undefined,
      }));
    }

    // Import Events (from JSON blob for complex data)
    const eventsData = getSheetData('Events');
    if (eventsData.length) {
      (result as any).events = eventsData.map((row) => {
        try {
          const jsonData = row['Data (JSON)'] ? JSON.parse(String(row['Data (JSON)'])) : null;
          if (jsonData) return jsonData;
        } catch { }
        return {
          id: String(row['ID'] || ''),
          title: row['Title'] ? String(row['Title']) : undefined,
          start: row['Start'] ? String(row['Start']) : undefined,
          end: row['End'] ? String(row['End']) : undefined,
          allDay: row['All Day'] === 'Yes',
          taskId: row['Task ID'] ? String(row['Task ID']) : undefined,
        };
      });
    }

    // Import Work Sessions
    const sessionsData = getSheetData('WorkSessions');
    if (sessionsData.length) {
      (result as any).workSessions = sessionsData.map((row) => ({
        id: String(row['ID'] || ''),
        taskId: row['Task ID'] ? String(row['Task ID']) : undefined,
        startTime: row['Start Time'] ? String(row['Start Time']) : undefined,
        endTime: row['End Time'] ? String(row['End Time']) : undefined,
        duration: Number(row['Duration (min)']) || 0,
        notes: row['Notes'] ? String(row['Notes']) : undefined,
      }));
    }

    // Import Fixed Costs
    const fixedCostsData = getSheetData('FixedCosts');
    if (fixedCostsData.length) {
      (result as any).fixedCosts = fixedCostsData.map((row) => ({
        id: String(row['ID'] || ''),
        name: row['Name'] ? String(row['Name']) : undefined,
        amount: Number(row['Amount']) || 0,
        frequency: row['Frequency'] ? String(row['Frequency']) : undefined,
        category: row['Category'] ? String(row['Category']) : undefined,
      }));
    }

    // Import Expenses
    const expensesData = getSheetData('Expenses');
    if (expensesData.length) {
      (result as any).expenses = expensesData.map((row) => ({
        id: String(row['ID'] || ''),
        name: row['Name'] ? String(row['Name']) : undefined,
        amount: Number(row['Amount']) || 0,
        date: row['Date'] ? String(row['Date']) : undefined,
        category: row['Category'] ? String(row['Category']) : undefined,
        taskId: row['Task ID'] ? String(row['Task ID']) : undefined,
        notes: row['Notes'] ? String(row['Notes']) : undefined,
      }));
    }

    // Import Settings
    const settingsData = getSheetData('Settings');
    settingsData.forEach((row) => {
      const key = String(row['Key'] || '');
      const value = row['Value'];
      if (key && result.appSettings) {
        try {
          (result.appSettings as any)[key] = typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))
            ? JSON.parse(value)
            : value;
        } catch {
          (result.appSettings as any)[key] = value;
        }
      }
    });

    // Import AI Data (from JSON blobs)
    const aiDataRows = getSheetData('AI_Data');
    aiDataRows.forEach((row) => {
      const type = String(row['Type'] || '');
      const dataStr = String(row['Data (JSON)'] || '');
      if (type && dataStr) {
        try {
          (result as any)[type] = JSON.parse(dataStr);
        } catch { }
      }
    });

    return result;
  }

  /**
   * Create manual backup
   */
  static async createManualBackup(data: AppData): Promise<{ blob: Blob; filename: string }> {
    return this.exportToExcel(data);
  }

  /**
   * Check if file is Excel format
   */
  static isExcelFile(file: File): boolean {
    const excelMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    return excelMimeTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith('.xlsx') ||
      file.name.toLowerCase().endsWith('.xls');
  }

  /**
   * Validate Excel backup file structure
   */
  static async validateExcelBackup(file: File): Promise<{ valid: boolean; message: string }> {
    try {
      if (!this.isExcelFile(file)) {
        return { valid: false, message: 'File is not an Excel format (.xlsx/.xls)' };
      }

      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const sheetNames = workbook.worksheets.map(ws => ws.name);
      const requiredSheets = ['Tasks', 'Clients'];
      const hasRequired = requiredSheets.some(sheet => sheetNames.includes(sheet));

      if (!hasRequired) {
        return { valid: false, message: 'Excel file does not contain required data sheets (Tasks, Clients)' };
      }

      return { valid: true, message: 'Excel backup file is valid' };
    } catch (error) {
      return { valid: false, message: 'Failed to read Excel file: ' + (error as Error).message };
    }
  }
}
