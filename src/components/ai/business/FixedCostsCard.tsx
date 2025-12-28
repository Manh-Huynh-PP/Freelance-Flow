"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Settings,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
  HelpCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { useDashboard } from '@/contexts/dashboard-context';
import { i18n } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import type { FixedCost } from '@/lib/types';
import { format } from 'date-fns';

interface FixedCostsCardProps {
  dateRange: { from?: Date; to?: Date };
  currency?: string;
  locale?: string;
  // When true, render the management UI directly (no internal Dialog)
  embedded?: boolean;
  // When true, hide the clickable summary card block
  hideSummary?: boolean;
  // If provided and not embedded, open the internal Dialog by default
  defaultOpen?: boolean;
  // External dialog control (optional)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FixedCostsCard({ dateRange, currency = 'USD', locale, embedded = false, hideSummary = false, defaultOpen = false, open, onOpenChange }: FixedCostsCardProps) {
  const { appData, setAppData } = useDashboard();
  const T = i18n[(appData?.appSettings?.language || 'en') as 'en' | 'vi'];
  const { toast } = useToast();

  // Use external control if provided, otherwise use internal state
  const [internalIsDialogOpen, setInternalIsDialogOpen] = useState(!!defaultOpen);
  const isDialogOpen = open !== undefined ? open : internalIsDialogOpen;
  const setIsDialogOpen = onOpenChange || setInternalIsDialogOpen;
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCost, setEditingCost] = useState<FixedCost | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as 'once' | 'weekly' | 'monthly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true
  });

  const fixedCosts: FixedCost[] = appData?.fixedCosts || [];

  // Calculate total fixed costs for the selected date range
  const totalFixedCosts = useMemo(() => {
    const now = new Date();
    const hasRange = !!(dateRange.from && dateRange.to);

    return fixedCosts.reduce((total: number, cost: FixedCost) => {
      if (!cost.isActive) return total;

      // Skip costs with invalid data
      if (!cost.startDate || typeof cost.amount !== 'number' || isNaN(cost.amount)) {
        return total;
      }

      const costStart = new Date(cost.startDate);
      const costEnd = cost.endDate ? new Date(cost.endDate) : now;

      // Validate dates - skip if invalid
      if (isNaN(costStart.getTime())) {
        return total;
      }

      // Handle bounded period (specific date range selected)
      if (hasRange) {
        const fromDate = new Date(dateRange.from!);
        const toDate = new Date(dateRange.to!);
        const rangeDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Check if cost applies to the selected range
        if (costStart > toDate || costEnd < fromDate) {
          return total;
        }

        let costForRange = 0;

        switch (cost.frequency) {
          case 'once':
            // NEW LOGIC: If endDate is defined, prorate over the period
            if (cost.endDate) {
              const costEndDate = new Date(cost.endDate);
              const costTotalDays = Math.ceil((costEndDate.getTime() - costStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              const dailyRate = cost.amount / costTotalDays;

              // Calculate overlap between cost period and selected range
              const overlapStart = new Date(Math.max(costStart.getTime(), fromDate.getTime()));
              const overlapEnd = new Date(Math.min(costEndDate.getTime(), toDate.getTime()));
              const overlapDays = Math.max(0, Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);

              costForRange = dailyRate * overlapDays;
            } else {
              // No endDate: only count if startDate is in range
              if (costStart >= fromDate && costStart <= toDate) {
                costForRange = cost.amount;
              }
            }
            break;
          case 'weekly':
            costForRange = (cost.amount / 7) * rangeDays;
            break;
          case 'monthly':
            costForRange = (cost.amount / 30.44) * rangeDays;
            break;
          case 'yearly':
            costForRange = (cost.amount / 365.25) * rangeDays;
            break;
        }

        return total + costForRange;
      }

      // Handle all-time (no date range selected) - calculate from cost start to now/costEnd
      let costForAllTime = 0;
      const totalDays = Math.ceil((costEnd.getTime() - costStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      switch (cost.frequency) {
        case 'once':
          costForAllTime = cost.amount;
          break;
        case 'weekly':
          costForAllTime = (cost.amount / 7) * totalDays;
          break;
        case 'monthly':
          costForAllTime = (cost.amount / 30.44) * totalDays;
          break;
        case 'yearly':
          costForAllTime = (cost.amount / 365.25) * totalDays;
          break;
      }

      return total + costForAllTime;
    }, 0);
  }, [fixedCosts, dateRange]);

  const resolvedLocale = locale || (currency === 'VND' ? 'vi-VN' : 'en-US');
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

  const frequencyLabels = {
    once: T.frequencyOnce || 'One time',
    weekly: T.frequencyWeekly || 'Weekly',
    monthly: T.frequencyMonthly || 'Monthly',
    yearly: T.frequencyYearly || 'Yearly'
  };

  const handleAddCost = () => {
    setEditingCost(null);
    setFormData({
      name: '',
      amount: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true
    });
    setIsFormDialogOpen(true);
  };

  const handleEditCost = (cost: FixedCost) => {
    setEditingCost(cost);
    setFormData({
      name: cost.name,
      amount: cost.amount.toString(),
      frequency: cost.frequency,
      startDate: cost.startDate ? (typeof cost.startDate === 'string' ? cost.startDate.split('T')[0] : new Date(cost.startDate).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      endDate: cost.endDate ? (typeof cost.endDate === 'string' ? cost.endDate.split('T')[0] : new Date(cost.endDate).toISOString().split('T')[0]) : '',
      isActive: cost.isActive ?? true
    });
    setIsFormDialogOpen(true);
  };

  const handleDeleteCost = (costId: string) => {
    const updatedCosts = fixedCosts.filter((cost: FixedCost) => cost.id !== costId);
    setAppData((prev: any) => ({ ...prev, fixedCosts: updatedCosts }));
    toast({
      title: T.success || 'Success',
      description: T.fixedCostDeleted || 'Fixed cost deleted successfully',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.amount.trim()) {
      toast({
        variant: "destructive",
        title: T.error || 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: T.error || 'Error',
        description: 'Please enter a valid amount',
      });
      return;
    }

    // Show loading state
    setIsSaving(true);

    const now = new Date().toISOString();
    const costData: FixedCost = {
      id: editingCost?.id || `fixed-cost-${Date.now()}`,
      name: formData.name.trim(),
      amount,
      frequency: formData.frequency,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      isActive: formData.isActive,
      createdAt: editingCost?.createdAt || now,
      updatedAt: now
    };

    let updatedCosts;
    if (editingCost) {
      updatedCosts = fixedCosts.map((cost: FixedCost) =>
        cost.id === editingCost.id ? costData : cost
      );
    } else {
      updatedCosts = [...fixedCosts, costData];
    }

    // Optimistic UI: Close dialog and show toast immediately
    setIsFormDialogOpen(false);
    setEditingCost(null);
    setIsSaving(false);

    // Update data (will trigger async save in background)
    setAppData((prev: any) => ({ ...prev, fixedCosts: updatedCosts }));

    toast({
      title: T.success || 'Success',
      description: editingCost
        ? (T.fixedCostUpdated || 'Fixed cost updated successfully')
        : (T.fixedCostAdded || 'Fixed cost added successfully'),
    });
  };

  const manageContent = (
    <div className="space-y-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {T.fixedCostsTooltip || 'Manage your recurring and one-time fixed costs'}
        </p>
        <Button onClick={handleAddCost} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          {T.addFixedCost || 'Add Fixed Cost'}
        </Button>
      </div>

      {/* Summary of All Fixed Costs */}
      {fixedCosts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              Fixed Costs Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Per Day</p>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {(() => {
                    const totalDaily = fixedCosts.filter((cost) => cost.isActive).reduce((total: number, cost: FixedCost) => {
                      let dailyRate = 0;
                      switch (cost.frequency) {
                        case 'once':
                          // If one-time cost has endDate, calculate daily rate over the period
                          if (cost.endDate && cost.startDate) {
                            const start = new Date(cost.startDate);
                            const end = new Date(cost.endDate);
                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                            dailyRate = days > 0 ? cost.amount / days : 0;
                          }
                          // If no endDate, one-time costs don't contribute to daily recurring
                          break;
                        case 'weekly':
                          dailyRate = cost.amount / 7;
                          break;
                        case 'monthly':
                          dailyRate = cost.amount / 30.44;
                          break;
                        case 'yearly':
                          dailyRate = cost.amount / 365.25;
                          break;
                      }
                      return total + dailyRate;
                    }, 0);
                    return formatCurrency(totalDaily);
                  })()}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">Total Per Month</p>
                <p className="text-lg font-bold text-green-800 dark:text-green-200">
                  {(() => {
                    const totalMonthly = fixedCosts.filter((cost) => cost.isActive).reduce((total: number, cost: FixedCost) => {
                      let monthlyRate = 0;
                      switch (cost.frequency) {
                        case 'once':
                          // If one-time cost has endDate, calculate monthly rate over the period
                          if (cost.endDate && cost.startDate) {
                            const start = new Date(cost.startDate);
                            const end = new Date(cost.endDate);
                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                            const dailyRate = days > 0 ? cost.amount / days : 0;
                            monthlyRate = dailyRate * 30.44;
                          }
                          // If no endDate, one-time costs don't contribute to monthly recurring
                          break;
                        case 'weekly':
                          monthlyRate = cost.amount * 4.33;
                          break;
                        case 'monthly':
                          monthlyRate = cost.amount;
                          break;
                        case 'yearly':
                          monthlyRate = cost.amount / 12;
                          break;
                      }
                      return total + monthlyRate;
                    }, 0);
                    return formatCurrency(totalMonthly);
                  })()}
                </p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Total Per Year</p>
                <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                  {(() => {
                    const totalYearly = fixedCosts.filter((cost) => cost.isActive).reduce((total: number, cost: FixedCost) => {
                      let yearlyRate = 0;
                      switch (cost.frequency) {
                        case 'once':
                          // If one-time cost has endDate, calculate yearly rate over the period
                          if (cost.endDate && cost.startDate) {
                            const start = new Date(cost.startDate);
                            const end = new Date(cost.endDate);
                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                            const dailyRate = days > 0 ? cost.amount / days : 0;
                            yearlyRate = dailyRate * 365.25;
                          }
                          // If no endDate, one-time costs don't contribute to yearly recurring
                          break;
                        case 'weekly':
                          yearlyRate = cost.amount * 52.14;
                          break;
                        case 'monthly':
                          yearlyRate = cost.amount * 12;
                          break;
                        case 'yearly':
                          yearlyRate = cost.amount;
                          break;
                      }
                      return total + yearlyRate;
                    }, 0);
                    return formatCurrency(totalYearly);
                  })()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fixed Costs Table */}
      {fixedCosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Fixed Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedCosts.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell className="font-medium">{cost.name}</TableCell>
                    <TableCell>{formatCurrency(cost.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {frequencyLabels[cost.frequency as keyof typeof frequencyLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        try {
                          const date = new Date(cost.startDate);
                          return isNaN(date.getTime()) ? '-' : format(date, 'MMM dd, yyyy');
                        } catch {
                          return '-';
                        }
                      })()}
                    </TableCell>
                    <TableCell>
                      {cost.endDate ? (() => {
                        try {
                          const date = new Date(cost.endDate);
                          return isNaN(date.getTime()) ? '-' : format(date, 'MMM dd, yyyy');
                        } catch {
                          return '-';
                        }
                      })() : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={cost.isActive ? 'default' : 'secondary'}>
                        {cost.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCost(cost)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCost(cost.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {fixedCosts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No fixed costs added yet</p>
          <Button onClick={handleAddCost} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add your first fixed cost
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      {!embedded && !hideSummary && (
        <Card className="bg-gradient-to-br from-background to-muted/30 border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Fixed Costs
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Chi phí cố định được tính theo thời gian đã chọn
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-lg transition-shadow group"
              onClick={() => setIsDialogOpen(true)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Total Fixed Costs
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Clock className="w-3 h-3 text-purple-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Tính toán cho khoảng thời gian đã chọn
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <Settings className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-purple-800 dark:text-purple-200 break-all">
                {formatCurrency(totalFixedCosts)}
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                {fixedCosts.length} {fixedCosts.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {embedded ? (
        manageContent
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                {T.fixedCostsManagement || 'Manage Fixed Costs'}
              </DialogTitle>
            </DialogHeader>
            {manageContent}
          </DialogContent>
        </Dialog>
      )}

      {/* Nested Add/Edit Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={(open) => {
        setIsFormDialogOpen(open);
        if (!open) setEditingCost(null);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              {editingCost ? (T.editFixedCost || 'Edit Fixed Cost') : (T.addFixedCost || 'Add Fixed Cost')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="form-name">{T.fixedCostName || 'Name'} *</Label>
                <Input
                  id="form-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter cost name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="form-amount">{T.fixedCostAmount || 'Amount'} ({currency}) *</Label>
                  <Input
                    id="form-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="form-frequency">{T.fixedCostFrequency || 'Frequency'}</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger id="form-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">{frequencyLabels.once}</SelectItem>
                      <SelectItem value="weekly">{frequencyLabels.weekly}</SelectItem>
                      <SelectItem value="monthly">{frequencyLabels.monthly}</SelectItem>
                      <SelectItem value="yearly">{frequencyLabels.yearly}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="form-startDate">{T.fixedCostStartDate || 'Start Date'} *</Label>
                  <Input
                    id="form-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="form-endDate">{T.fixedCostEndDate || 'End Date (Optional)'}</Label>
                  <Input
                    id="form-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="form-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                  aria-label="Mark cost as active"
                />
                <Label htmlFor="form-isActive">{T.fixedCostActive || 'Active'}</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFormDialogOpen(false);
                  setEditingCost(null);
                }}
              >
                {T.cancel || 'Cancel'}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {T.saving || 'Saving...'}
                  </>
                ) : (
                  editingCost ? (T.save || 'Update') : (T.add || 'Add')
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
