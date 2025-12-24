/**
 * Excel Import Component - Allows users to import data from Excel files
 */

"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExcelBackupService } from '@/lib/excel-backup-service';
import { useDashboard } from '@/contexts/dashboard-context';
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { i18n } from '@/lib/i18n';

export function ExcelImportManager() {
  const dashboardContext = useDashboard();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);

  const T = dashboardContext?.appSettings?.language ? i18n[dashboardContext.appSettings.language as keyof typeof i18n] : i18n.en;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setValidationResult(null);
      return;
    }

    setSelectedFile(file);

    // Validate the selected file
    try {
      const validation = await ExcelBackupService.validateExcelBackup(file);
      setValidationResult(validation);
    } catch (error) {
      setValidationResult({ valid: false, message: 'Failed to validate file: ' + (error as Error).message });
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !dashboardContext || !validationResult?.valid) return;

    setIsImporting(true);
    try {
      const importedData = await ExcelBackupService.importFromExcel(selectedFile);

      // Use restoreAppData for full restore with ID remapping
      if (dashboardContext.restoreAppData) {
        await dashboardContext.restoreAppData(importedData as any);
      } else {
        throw new Error('Restore function not available');
      }

      toast({
        title: "Restore Successful",
        description: `Data restored successfully from ${selectedFile.name}`,
      });

      // Reset the form
      setSelectedFile(null);
      setValidationResult(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      console.log('✅ Excel restore complete');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Restore Failed",
        description: `Failed to restore data: ${(error as Error).message}`,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Restore from Excel Backup
        </CardTitle>
        <CardDescription>
          Restore your data from an Excel backup file. This will replace your current data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Selection */}
        <div className="space-y-2">
          <Label htmlFor="excel-file">Select Excel File (.xlsx)</Label>
          <div className="flex items-center gap-4">
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={isImporting}
              className="flex-1"
            />
          </div>
        </div>

        {/* File Info */}
        {selectedFile && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="font-medium">{selectedFile.name}</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Size: {formatFileSize(selectedFile.size)}</p>
              <p>Last Modified: {selectedFile.lastModified ? new Date(selectedFile.lastModified).toLocaleString() : 'Unknown'}</p>
            </div>
          </div>
        )}

        {/* Validation Result */}
        {validationResult && (
          <Alert variant={validationResult.valid ? "default" : "destructive"}>
            {validationResult.valid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {validationResult.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Import Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleImport}
            disabled={!selectedFile || !validationResult?.valid || isImporting}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? 'Restoring...' : 'Restore Data'}
          </Button>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">📋 Restore Instructions</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Select a valid Excel backup file (.xlsx)</li>
            <li>• <strong>Warning:</strong> This will replace all your current data</li>
            <li>• New IDs will be generated to ensure data integrity</li>
          </ul>
        </div>

        {/* Format Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-600">📊 Excel Format Guide</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-medium">Required Sheets:</p>
              <ul className="text-muted-foreground">
                <li>• Tasks</li>
                <li>• Clients</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Optional Sheets:</p>
              <ul className="text-muted-foreground">
                <li>• Collaborators</li>
                <li>• Categories</li>
                <li>• Settings</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ExcelImportManager;
