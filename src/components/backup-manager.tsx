"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboard } from "@/contexts/dashboard-context";
import { useToast } from "@/hooks/use-toast";
import { BackupService } from "@/lib/backup-service";
import { ExcelBackupService } from "@/lib/excel-backup-service";
import { CollaboratorDataService } from "@/lib/collaborator-data-service";
import { i18n } from "@/lib/i18n";
import {
  FileSpreadsheet, FileJson, RefreshCw, Shield, Download,
  CheckCircle2, Cloud, CloudOff,
  Upload, HardDrive
} from "lucide-react";

import type { AppData } from "@/lib/types";
import { initialAppData } from "@/lib/data";

import { DataMigrationService } from '@/lib/data-migration';
import { useAuth } from '@/hooks/useAuth';

type BackupFormat = "json" | "excel";

export function BackupManager() {
  const dashboard = useDashboard();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const [backups, setBackups] = useState<any[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('replace');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore report dialog state
  const [showRestoreReport, setShowRestoreReport] = useState(false);
  const [restoreReport, setRestoreReport] = useState<{
    tasks: number;
    projects: number;
    quotes: number;
    clients: number;
    collaborators: number;
    notes: number;
    events: number;
    workSessions: number;
    expenses: number;
    fixedCosts: number;
    fileName: string;
  } | null>(null);

  const lang = (dashboard as any)?.appData?.appSettings?.language as keyof typeof i18n || 'en';
  const T = (i18n as any)[lang] || i18n.en;
  const { defaultExportFormat, setDefaultExportFormat } = dashboard;

  useEffect(() => {
    setBackups(BackupService.getBackups());
  }, []);

  const refreshBackups = () => setBackups(BackupService.getBackups());

  // Helpers
  const readLocalJson = (key: string) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : undefined; } catch { return undefined; }
  };

  function mergeById<T extends { id: string }>(existing: T[] = [], incoming: T[] = []): T[] {
    const map = new Map<string, T>();
    existing.forEach((x) => x?.id && map.set(x.id, x));
    incoming.forEach((x) => { if (x?.id && !map.has(x.id)) map.set(x.id, x); });
    return Array.from(map.values());
  }

  // Preserve existing IDs, only generate new ones for items without ID
  function ensureIds<T extends { id?: string }>(arr: T[] | undefined, prefix: string): (T & { id: string })[] {
    const now = Date.now();
    return (arr || []).map((item, idx) => {
      const raw = (item?.id ?? '').toString().trim();
      // IMPORTANT: Preserve existing IDs to maintain quote-task relationships
      const id = raw || `${prefix}-${now}-${Math.random().toString(36).slice(2, 8)}-${idx}`;
      return { ...(item as any), id } as T & { id: string };
    });
  }

  const importFromFile = async (file: File): Promise<Partial<AppData>> => {
    if (file.name.toLowerCase().endsWith('.xlsx')) {
      const validation = await ExcelBackupService.validateExcelBackup?.(file as any);
      if (validation && !validation.valid) throw new Error(validation.message || 'Invalid Excel file');
      const result = await ExcelBackupService.importFromExcel?.(file as any) || {};
      return result;
    }
    return JSON.parse(await file.text());
  };

  // Restore from file
  const onRestoreFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);

    try {
      let imported = await importFromFile(file);

      // Check for legacy format and migrate
      if (DataMigrationService.isLegacyFormat(imported)) {
        toast({ title: 'Migrating Legacy Data', description: 'Converting to new format...' });
        imported = DataMigrationService.migrateLegacyData(imported);
      } else if (DataMigrationService.needsProjectsMigration(imported)) {
        imported = DataMigrationService.migrateToCurrentFormat(imported);
      }

      // Ensure IDs
      const collections = ['tasks', 'projects', 'quotes', 'collaboratorQuotes', 'clients',
        'collaborators', 'quoteTemplates', 'categories', 'notes', 'events', 'workSessions',
        'expenses', 'fixedCosts'];
      collections.forEach(col => {
        (imported as any)[col] = ensureIds((imported as any)[col], col.slice(0, 3));
      });

      // Restore AI data to localStorage
      const aiPairs = [
        ['aiPersistentData', 'freelance-flow-ai-persistent-data'],
        ['aiWritingPresets', 'ai-writing-presets'],
        ['aiWritingHistory', 'ai-writing-history'],
        ['aiWritingVersions', 'ai-writing-versions'],
        ['filterPresets', 'freelance-flow-filter-presets'],
      ];
      aiPairs.forEach(([k, ls]) => {
        const v = (imported as any)[k];
        if (v !== undefined) localStorage.setItem(ls, JSON.stringify(v));
      });

      const saveAppData = (dashboard as any).saveAppData;
      const restoreAppData = (dashboard as any).restoreAppData;
      if (!saveAppData && !restoreAppData) throw new Error('Not logged in. Please sign in to restore data.');

      const buildData = (base: any = {}) => ({
        tasks: base.tasks || [],
        projects: base.projects || [],
        quotes: base.quotes || [],
        collaboratorQuotes: base.collaboratorQuotes || [],
        clients: base.clients || [],
        collaborators: base.collaborators || [],
        quoteTemplates: base.quoteTemplates || [],
        categories: base.categories || [],
        appSettings: base.appSettings || initialAppData.appSettings,
        notes: base.notes || [],
        events: base.events || [],
        workSessions: base.workSessions || [],
        expenses: base.expenses || [],
        fixedCosts: base.fixedCosts || [],
        aiAnalyses: base.aiAnalyses || [],
        aiProductivityAnalyses: base.aiProductivityAnalyses || [],
      });

      let finalData: any;
      if (restoreMode === 'replace') {
        const data = buildData(imported);
        finalData = CollaboratorDataService.processImportedData(data as any);

        // DEBUG: Log quote data before save
        console.log('📊 [Restore Debug] Quotes to save:', finalData?.quotes?.map((q: any) => ({
          id: q.id,
          sectionsCount: q.sections?.length,
          status: q.status,
          total: q.total,
        })));
        console.log('📊 [Restore Debug] Tasks with quoteId:', finalData?.tasks?.filter((t: any) => t.quoteId).map((t: any) => ({
          taskId: t.id,
          quoteId: t.quoteId,
        })));

        // Use restoreAppData for replace mode - clears and remaps IDs
        if (restoreAppData) {
          await restoreAppData(finalData);
        } else {
          await saveAppData(finalData);
        }
      } else {
        const current = (dashboard as any).appData || {};
        const merged = {
          ...buildData(current),
          tasks: mergeById(current.tasks, (imported as any).tasks),
          projects: mergeById(current.projects, (imported as any).projects),
          quotes: mergeById(current.quotes, (imported as any).quotes),
          clients: mergeById(current.clients, (imported as any).clients),
          collaborators: mergeById(current.collaborators, (imported as any).collaborators),
          categories: mergeById(current.categories, (imported as any).categories),
        };
        finalData = CollaboratorDataService.syncCollaboratorData(merged as any, true);
        // Use saveAppData for merge mode - normal save without clearing
        await saveAppData(finalData);
      }

      // Build restore report
      const report = {
        tasks: finalData?.tasks?.length || 0,
        projects: finalData?.projects?.length || 0,
        quotes: finalData?.quotes?.length || 0,
        clients: finalData?.clients?.length || 0,
        collaborators: finalData?.collaborators?.length || 0,
        notes: finalData?.notes?.length || 0,
        events: finalData?.events?.length || 0,
        workSessions: finalData?.workSessions?.length || 0,
        expenses: finalData?.expenses?.length || 0,
        fixedCosts: finalData?.fixedCosts?.length || 0,
        fileName: file.name,
      };
      setRestoreReport(report);
      setShowRestoreReport(true);

      toast({ title: 'Restore Successful', description: `${file.name} restored (${restoreMode})` });
      console.log('✅ Backup restore complete - manual reload required to see changes');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Restore Failed', description: err?.message || 'Invalid backup file' });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Create backup
  const handleCreateBackup = async (format: BackupFormat = defaultExportFormat) => {
    const current = (dashboard as any).appData || {};
    const appData = {
      tasks: current.tasks || [],
      projects: current.projects || [],
      quotes: current.quotes || [],
      collaboratorQuotes: current.collaboratorQuotes || [],
      clients: current.clients || [],
      collaborators: current.collaborators || [],
      quoteTemplates: current.quoteTemplates || [],
      categories: current.categories || [],
      appSettings: current.appSettings || {},
      notes: current.notes || [],
      events: current.events || [],
      workSessions: current.workSessions || [],
      expenses: current.expenses || [],
      fixedCosts: current.fixedCosts || [],
      aiAnalyses: current.aiAnalyses || [],
      aiProductivityAnalyses: current.aiProductivityAnalyses || [],
      // Local AI data
      aiPersistentData: readLocalJson('freelance-flow-ai-persistent-data'),
      aiWritingPresets: readLocalJson('ai-writing-presets'),
      aiWritingHistory: readLocalJson('ai-writing-history'),
      aiWritingVersions: readLocalJson('ai-writing-versions'),
      filterPresets: readLocalJson('freelance-flow-filter-presets'),
    };

    try {
      const date = new Date().toISOString().split('T')[0];

      if (format === 'excel') {
        const { blob, filename } = await ExcelBackupService.createManualBackup(appData);
        downloadBlob(blob, filename);
      } else {
        const jsonString = JSON.stringify(appData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const filename = `freelance-flow-backup-${date}.json`;
        downloadBlob(blob, filename);
      }

      toast({ title: 'Backup Created', description: `${format.toUpperCase()} backup saved successfully` });
    } catch {
      toast({ variant: 'destructive', title: 'Backup Failed', description: 'Could not create backup' });
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Sync status
  const syncStatus = isAuthenticated ? 'cloud' : 'offline';

  return (
    <div className="space-y-4">
      {/* Sync Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${syncStatus === 'cloud' ? 'bg-green-100 dark:bg-green-900' :
                'bg-gray-100 dark:bg-gray-800'
                }`}>
                {syncStatus === 'cloud' ? (
                  <Cloud className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <CloudOff className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {syncStatus === 'cloud' ? 'Synced with Supabase' :
                    'Not Connected'}
                  {syncStatus === 'cloud' && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Live
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {syncStatus === 'cloud'
                    ? `Data synced to cloud for ${user?.email}`
                    : 'Sign in to sync your data across devices'}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Backup & Restore Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" /> Backup & Restore
              </CardTitle>
              <CardDescription>Export and import your data</CardDescription>
            </div>
            {/* Format Toggle */}
            <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
              <Button
                size="sm"
                variant={defaultExportFormat === 'json' ? 'default' : 'ghost'}
                onClick={() => setDefaultExportFormat('json')}
                className="gap-1"
              >
                <FileJson className="w-4 h-4" /> JSON
              </Button>
              <Button
                size="sm"
                variant={defaultExportFormat === 'excel' ? 'default' : 'ghost'}
                onClick={() => setDefaultExportFormat('excel')}
                className="gap-1"
              >
                <FileSpreadsheet className="w-4 h-4" /> Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Section */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Export Backup</p>
                  <p className="text-sm text-muted-foreground">
                    Download your data as {defaultExportFormat.toUpperCase()} file
                  </p>
                </div>
              </div>
              <Button onClick={() => handleCreateBackup(defaultExportFormat)}>
                {defaultExportFormat === 'excel' ? <FileSpreadsheet className="w-4 h-4 mr-2" /> : <FileJson className="w-4 h-4 mr-2" />}
                Export {defaultExportFormat.toUpperCase()}
              </Button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium">Import Backup</p>
                  <p className="text-sm text-muted-foreground">
                    Restore from JSON or Excel file
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    size="sm"
                    variant={restoreMode === 'replace' ? 'default' : 'ghost'}
                    onClick={() => setRestoreMode('replace')}
                    className="rounded-none"
                  >
                    Replace
                  </Button>
                  <Button
                    size="sm"
                    variant={restoreMode === 'merge' ? 'default' : 'ghost'}
                    onClick={() => setRestoreMode('merge')}
                    className="rounded-none"
                  >
                    Merge
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.xlsx"
                  className="hidden"
                  onChange={onRestoreFileChange}
                  aria-label="Select backup file to restore"
                  title="Select backup file to restore"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
                  {isImporting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Select File
                </Button>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Restore Report Dialog */}
      <Dialog open={showRestoreReport} onOpenChange={setShowRestoreReport}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              {T.restoreComplete || 'Restore Complete'}
            </DialogTitle>
            <DialogDescription>
              {restoreReport?.fileName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              {restoreReport && (
                <>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tasks:</span><span className="font-medium">{restoreReport.tasks}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Projects:</span><span className="font-medium">{restoreReport.projects}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Quotes:</span><span className="font-medium">{restoreReport.quotes}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Clients:</span><span className="font-medium">{restoreReport.clients}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Collaborators:</span><span className="font-medium">{restoreReport.collaborators}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Notes:</span><span className="font-medium">{restoreReport.notes}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Events:</span><span className="font-medium">{restoreReport.events}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Work Sessions:</span><span className="font-medium">{restoreReport.workSessions}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Expenses:</span><span className="font-medium">{restoreReport.expenses}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Fixed Costs:</span><span className="font-medium">{restoreReport.fixedCosts}</span></div>
                </>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRestoreReport(false)}>
              {T.close || 'Close'}
            </Button>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {T.reloadPage || 'Reload Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
