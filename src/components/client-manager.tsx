
"use client";

import React, { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Client, Task, Quote, CollaboratorQuote } from "@/lib/types";
import { Pencil, PlusCircle, Trash2, Mail, Phone, Info, Link as LinkIcon, ClipboardCopy, TrendingUp, TrendingDown, DollarSign, Briefcase, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { i18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { computeQuoteTotalWithFormula } from "@/ai/analytics/business-intelligence-helpers";

type ClientManagerProps = {
  clients: Client[];
  tasks: Task[];
  quotes: Quote[];
  collaboratorQuotes: CollaboratorQuote[];
  onAddClient: (data: Omit<Client, 'id'>) => void;
  onEditClient: (id: string, data: Omit<Client, 'id'>) => void;
  onDeleteClient: (id: string) => void;
  language: 'en' | 'vi';
  currency: 'VND' | 'USD';
};

const defaultClientData = {
    name: "",
    email: [""],
    phone: [""],
    taxInfo: [""],
    type: "brand" as "agency" | "brand",
    driveLink: [""],
}

export function ClientManager({ 
    clients, 
    tasks, 
    quotes, 
    collaboratorQuotes, 
    onAddClient, 
    onEditClient, 
    onDeleteClient, 
    language, 
    currency 
}: ClientManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClientData, setNewClientData] = useState(defaultClientData);

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const T = i18n[language];

  const resetAddForm = () => {
    setNewClientData(defaultClientData);
  }

  const handleAddClient = () => {
    if (typeof newClientData.name === 'string' && newClientData.name.trim()) {
      onAddClient({
        name: newClientData.name.trim(),
        email: newClientData.email.map(e => e.trim()).filter(e => e),
        phone: newClientData.phone.map(e => e.trim()).filter(e => e),
        taxInfo: newClientData.taxInfo.map(e => e.trim()).filter(e => e),
        type: newClientData.type,
        driveLink: newClientData.driveLink.map(e => e.trim()).filter(e => e),
      });
      toast({ title: T.clientAdded, description: `"${newClientData.name.trim()}" ${T.clientAddedDesc}` });
      resetAddForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleStartEdit = (client: Client) => {
    setEditingClient(client);
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
  };

  const handleConfirmEdit = (editedData: Omit<Client, 'id'>) => {
    if (editingClient) {
      const safeName = typeof editedData.name === 'string' ? editedData.name : Array.isArray(editedData.name) ? editedData.name[0] : '';
      onEditClient(editingClient.id, { ...editedData, name: safeName });
      toast({ title: T.clientUpdated, description: `${T.client} "${safeName}" ${T.clientUpdatedDesc}` });
      handleCancelEdit();
    }
  };

  const confirmDeleteClient = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    const isClientInUse = tasks.some(task => task.clientId === clientId);
    if (isClientInUse) {
      toast({
        variant: "destructive",
        title: T.cannotDeleteClient,
        description: T.cannotDeleteClientDesc,
      });
    } else {
      const clientName = clients.find(c => c.id === clientId)?.name;
      onDeleteClient(clientId);
      toast({ title: T.clientDeleted, description: `"${clientName}" ${T.clientDeletedDesc}` });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-center">
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
              setIsAddDialogOpen(isOpen);
              if (!isOpen) resetAddForm();
          }}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> {T.addNewClient}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{T.addNewClient}</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <Input placeholder={T.clientNameRequired} value={newClientData.name} onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} />
                <Input placeholder={T.email} type="email" value={newClientData.email[0] || ""} onChange={(e) => setNewClientData({...newClientData, email: [e.target.value]})} />
                <Input placeholder={T.phone} type="tel" value={newClientData.phone[0] || ""} onChange={(e) => setNewClientData({...newClientData, phone: [e.target.value]})} />
                <Input placeholder={T.taxInfo} value={newClientData.taxInfo[0] || ""} onChange={(e) => setNewClientData({...newClientData, taxInfo: [e.target.value]})} />
                <Input placeholder={T.driveLink} type="url" value={newClientData.driveLink[0] || ""} onChange={(e) => setNewClientData({...newClientData, driveLink: [e.target.value]})} />
                <div>
                    <Label className="text-sm font-medium text-muted-foreground">{T.clientType}</Label>
                    <RadioGroup value={newClientData.type} onValueChange={(value: "agency" | "brand") => setNewClientData({...newClientData, type: value})} className="flex gap-4 pt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="brand" id="type-brand" /><Label htmlFor="type-brand" className="font-normal">{T.brand}</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="agency" id="type-agency" /><Label htmlFor="type-agency" className="font-normal">{T.agency}</Label></div>
                    </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost">{T.cancel}</Button></DialogClose>
                <Button onClick={handleAddClient} disabled={!newClientData.name.trim()}>{T.addClient}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
            <h4 className="font-medium">{T.existingClients}</h4>
            <div className="rounded-lg border max-h-80 overflow-y-auto">
              {clients.map((client) => {
                const taskCount = tasks.filter(task => task.clientId === client.id).length;
                return (
                <div key={client.id} className={cn("flex items-start justify-between p-3 border-b last:border-b-0 hover:bg-muted/50 odd:bg-muted/50 transition-colors pointer-events-auto cursor-pointer")} onClick={() => {
                  setViewingClient(client)
                }}>
                  <div className="flex-1 pr-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-primary hover:underline">{client.name}</p>
                      {taskCount > 0 && <Badge variant="outline">{taskCount}</Badge>}
                      {client.type && <Badge variant="secondary" className="capitalize">{client.type === 'brand' ? T.brand : T.agency}</Badge>}
                      {client.driveLink && <a href={Array.isArray(client.driveLink) ? client.driveLink[0] : client.driveLink} target="_blank" rel="noopener noreferrer" title={Array.isArray(client.driveLink) ? client.driveLink[0] : client.driveLink} onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-primary"><LinkIcon className="h-3 w-3" /></a>}
                    </div>
                    {(client.email && client.email.length > 0) && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" /><span>{Array.isArray(client.email) ? client.email[0] : client.email}</span></div>}
                    {(client.phone && client.phone.length > 0) && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3 w-3" /><span>{Array.isArray(client.phone) ? client.phone[0] : client.phone}</span></div>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleStartEdit(client); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{T.areYouSure}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {T.deletePermanently} {T.client.toLowerCase()} "{client.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{T.cancel}</AlertDialogCancel>
                          <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))} onClick={(e) => confirmDeleteClient(e, client.id)}>{T.delete}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )})}
              {clients.length === 0 && <p className="p-4 text-sm text-muted-foreground text-center">{T.noClientsFound}</p>}
            </div>
        </div>
      </div>
      
      <ViewClientDialog
        client={viewingClient}
        tasks={tasks}
        quotes={quotes}
        collaboratorQuotes={collaboratorQuotes}
        onClose={() => setViewingClient(null)}
        onEdit={(clientToEdit) => {
          setViewingClient(null);
          handleStartEdit(clientToEdit);
        }}
        language={language}
        currency={currency}
      />
      
      <EditClientDialog 
        client={editingClient}
        onClose={handleCancelEdit}
        onSave={handleConfirmEdit}
        language={language}
      />
    </>
  );
}

// View Client Dialog Component
function ViewClientDialog({ 
  client, 
  tasks, 
  quotes, 
  collaboratorQuotes, 
  onClose, 
  onEdit, 
  language,
  currency 
}: { 
  client: Client | null, 
  tasks: Task[], 
  quotes: Quote[],
  collaboratorQuotes: CollaboratorQuote[],
  onClose: () => void, 
  onEdit: (client: Client) => void, 
  language: 'en' | 'vi',
  currency: 'VND' | 'USD'
}) {
    const T = i18n[language];
    const { toast } = useToast();

    const clientTasks = React.useMemo(() => {
        if (!client) return [];
        return tasks.filter(t => t.clientId === client.id);
    }, [tasks, client?.id]);
    
    // Financial stats - Wrapped in useMemo to stabilize render for React 19/Next 16
    const { totalIncome, totalCosts, receivedAmount } = React.useMemo(() => {
        if (!client) return { totalIncome: 0, totalCosts: 0, receivedAmount: 0 };
        let income = 0;
        let costs = 0;
        let received = 0;

        clientTasks.forEach(task => {
            // Loại bỏ các task onhold hoặc archive khỏi tính toán (giống logic BI)
            if (task.status === 'onhold' || task.status === 'archived' || (task.status as string) === 'archive') return;

            let taskReceived = 0;
            let taskTotal = 0;
            
            // Income from main quote
            if (task.quoteId) {
                const quote = quotes.find(q => q.id === task.quoteId);
                if (quote) {
                    // Sử dụng helper tính tổng báo giá (có hỗ trợ công thức) - Logic đồng nhất với Business Analytics
                    taskTotal = computeQuoteTotalWithFormula(quote);
                    
                    // Tính số tiền thực nhận từ các đợt thanh toán (logic chuẩn từ BI helpers)
                    const payments = (quote as any).payments as any[] | undefined;
                    if (Array.isArray(payments) && payments.length > 0) {
                        taskReceived = payments.reduce((s, p) => {
                            if (!p || p.status !== 'paid') return s;
                            if (String(p.amountType || '') === 'percent') {
                                const pct = Math.max(0, Math.min(100, Number(p.percent || 0)));
                                return s + (taskTotal * pct / 100);
                            }
                            const amt = Number(p.amount || 0);
                            return s + (amt > 0 ? amt : 0);
                        }, 0);
                    } else {
                        taskReceived = quote.amountPaid || 0;
                    }

                    // Thực nhận (Received Amount): Cộng dồn tất cả các khoản đã thanh toán
                    received += taskReceived;

                    // Tổng doanh thu (Total Revenue): Quy tắc mới - Chỉ tính task "Done" và "Thanh toán 100%"
                    const isPaidFull = taskReceived >= (taskTotal - 0.01); // Sai số nhỏ
                    if (task.status === 'done' && isPaidFull) {
                        income += taskTotal;
                    }
                }
            }

            // Costs from collaborator quotes
            if (task.collaboratorQuotes && Array.isArray(task.collaboratorQuotes)) {
                task.collaboratorQuotes.forEach(cqMapping => {
                    const cq = collaboratorQuotes.find(q => q.id === cqMapping.quoteId);
                    if (cq) {
                        // Ưu tiên số tiền đã trả cho CTV, fallback về tổng quote (giống BI helpers)
                        const total = (cq as any).total || 0;
                        costs += typeof (cq as any).amountPaid === 'number' ? (cq as any).amountPaid : total;
                    }
                });
            }
        });

        return { totalIncome: income, totalCosts: costs, receivedAmount: received };
    }, [clientTasks, quotes, collaboratorQuotes, client?.id]);

    if (!client) return null;

    const netProfit = totalIncome - totalCosts;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleCopyData = async () => {
        const tsvHeader = `${T.clientName}\t${client.name}\n${T.email}\t${Array.isArray(client.email) ? client.email.join(', ') : client.email}\n${T.phone}\t${Array.isArray(client.phone) ? client.phone.join(', ') : client.phone}\n\n`;
        
        const statsHeader = `${T.financialOverview}\n${T.totalRevenue}\t${totalIncome}\n${T.totalCosts}\t${totalCosts}\n${T.netProfit}\t${netProfit}\n${T.receivedAmount}\t${receivedAmount}\n\n`;
        
        let tasksTable = `${T.tasksList}\n${T.taskName}\t${T.status}\t${T.deadline}\t${T.taskValue}\n`;
        
        clientTasks.forEach(task => {
            const quote = quotes.find(q => q.id === task.quoteId);
            const statusTranslated = T.statuses[task.status as keyof typeof T.statuses] || task.status;
            const deadlineFormatted = task.deadline ? new Date(task.deadline).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : '-';
            const value = computeQuoteTotalWithFormula(quote);
            
            tasksTable += `${task.name}\t${statusTranslated}\t${deadlineFormatted}\t${value}\n`;
        });

        const fullData = tsvHeader + statsHeader + tasksTable;

        try {
            await navigator.clipboard.writeText(fullData);
            toast({
                title: T.dataCopied,
                description: T.readyToPaste || 'Ready to paste into Excel/Sheets',
            });
        } catch (err) {
            console.error('Failed to copy data: ', err);
            toast({
                variant: 'destructive',
                title: 'Copy failed',
                description: 'Could not copy data to clipboard',
            });
        }
    };

    return (
        <Dialog open={!!client} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-2xl font-bold">{client.name}</DialogTitle>
                                {client.type && (
                                    <Badge variant="secondary" className="capitalize">
                                        {client.type === 'brand' ? T.brand : T.agency}
                                    </Badge>
                                )}
                            </div>
                            <DialogDescription className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                {clientTasks.length} {T.task.toLowerCase()}
                            </DialogDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleCopyData} className="gap-2">
                            <ClipboardCopy className="h-4 w-4" />
                            {T.copyData}
                        </Button>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
                    <div className="px-6 border-b">
                        <TabsList className="bg-transparent h-12 w-full justify-start gap-6 rounded-none p-0">
                            <TabsTrigger 
                                value="details" 
                                className="relative rounded-none border-b-2 border-transparent px-2 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                {T.viewClientDetails}
                            </TabsTrigger>
                            <TabsTrigger 
                                value="tasks" 
                                className="relative rounded-none border-b-2 border-transparent px-2 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                {T.tasksList}
                            </TabsTrigger>
                            <TabsTrigger 
                                value="stats" 
                                className="relative rounded-none border-b-2 border-transparent px-2 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                {T.financialOverview}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <TabsContent value="details" className="mt-0 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase">{T.email}</Label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{Array.isArray(client.email) ? client.email.join(', ') : client.email || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase">{T.phone}</Label>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{Array.isArray(client.phone) ? client.phone.join(', ') : client.phone || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase">{T.taxInfo}</Label>
                                        <div className="flex items-center gap-2">
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{Array.isArray(client.taxInfo) ? client.taxInfo.join(', ') : client.taxInfo || '-'}</span>
                                        </div>
                                    </div>
                                    {client.driveLink && (
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground uppercase">{T.driveLink}</Label>
                                            <div className="flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                                <a 
                                                    href={Array.isArray(client.driveLink) ? client.driveLink[0] : client.driveLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-sm font-medium text-primary hover:underline truncate max-w-[200px]"
                                                >
                                                    {T.openInNewTab}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="tasks" className="mt-0">
                            {clientTasks.length > 0 ? (
                                <div className="rounded-md border overflow-x-auto mt-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{T.taskName}</TableHead>
                                                <TableHead>{T.status}</TableHead>
                                                <TableHead className="text-right">{T.taskValue}</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {clientTasks.map(task => {
                                                const quote = quotes.find(q => q.id === task.quoteId);
                                                return (
                                                    <TableRow key={task.id}>
                                                        <TableCell className="font-medium">{task.name}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="text-[10px]">
                                                                {T.statuses[task.status as keyof typeof T.statuses] || task.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-xs">
                                                             {quote ? formatCurrency(computeQuoteTotalWithFormula(quote)) : '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground italic">
                                    {T.noTasksFound || 'No tasks assigned to this client.'}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="stats" className="mt-0 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-xl border bg-card p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider">{T.totalRevenue}</span>
                                    </div>
                                    <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
                                    <p className="text-[10px] text-muted-foreground">{T.receivedAmount}: <span className="font-medium text-emerald-600">{formatCurrency(receivedAmount)}</span></p>
                                </div>
                                <div className="rounded-xl border bg-card p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <TrendingDown className="h-4 w-4 text-rose-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider">{T.totalCosts}</span>
                                    </div>
                                    <div className="text-2xl font-bold">{formatCurrency(totalCosts)}</div>
                                    <p className="text-[10px] text-muted-foreground">{T.netProfit}: <span className={cn("font-medium", netProfit >= 0 ? "text-emerald-600" : "text-rose-600")}>{formatCurrency(netProfit)}</span></p>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-card p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                    <h5 className="font-semibold">{T.financialOverview}</h5>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{T.totalRevenue}</span>
                                        <span className="font-medium font-mono">{formatCurrency(totalIncome)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{T.totalCosts}</span>
                                        <span className="font-medium font-mono text-rose-500">-{formatCurrency(totalCosts)}</span>
                                    </div>
                                    <div className="h-px bg-border my-2" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">{T.netProfit}</span>
                                        <span className={cn("font-bold font-mono text-lg", netProfit >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                            {formatCurrency(netProfit)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                <DialogFooter className="p-6 pt-2 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>{T.cancel}</Button>
                    <Button onClick={() => onEdit(client)}>
                        <Pencil className="mr-2 h-4 w-4" /> {T.edit}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Separate component for the Edit Dialog for cleaner state management
type EditClientDialogProps = {
    client: Client | null;
    onClose: () => void;
    onSave: (data: Omit<Client, 'id'>) => void;
    language: 'en' | 'vi';
}

function EditClientDialog({ client, onClose, onSave, language }: EditClientDialogProps) {
    const [formData, setFormData] = useState<Omit<Client, 'id'>>({ name: '', email: [""], phone: [""], taxInfo: [""], type: 'brand', driveLink: [""] });
    const T = i18n[language];

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name,
                email: Array.isArray(client.email) ? client.email : typeof client.email === 'string' ? [client.email] : [""] ,
                phone: Array.isArray(client.phone) ? client.phone : typeof client.phone === 'string' ? [client.phone] : [""] ,
                taxInfo: Array.isArray(client.taxInfo) ? client.taxInfo : typeof client.taxInfo === 'string' ? [client.taxInfo] : [""] ,
                type: client.type || 'brand',
                driveLink: Array.isArray(client.driveLink) ? client.driveLink : typeof client.driveLink === 'string' ? [client.driveLink] : [""]
            });
        }
    }, [client]);

    const handleSave = () => {
        if (formData.name.trim()) {
            onSave({
              ...formData,
              name: formData.name.trim(),
              email: (formData.email ?? [""]).map((e: string) => e.trim()).filter(e => e),
              phone: (formData.phone ?? [""]).map((e: string) => e.trim()).filter(e => e),
              taxInfo: (formData.taxInfo ?? [""]).map((e: string) => e.trim()).filter(e => e),
              driveLink: (formData.driveLink ?? [""]).map((e: string) => e.trim()).filter(e => e),
            });
        }
    };

    if (!client) return null;

    return (
        <Dialog open={!!client} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{T.editClient}</DialogTitle>
                    <DialogDescription>{T.saveChanges} for "{client.name}".</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <Input placeholder={T.clientNameRequired} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <Input placeholder={T.email} type="email" value={(formData.email ?? [""])[0] || ""} onChange={(e) => setFormData({...formData, email: [e.target.value]})} />
                    <Input placeholder={T.phone} type="tel" value={(formData.phone ?? [""])[0] || ""} onChange={(e) => setFormData({...formData, phone: [e.target.value]})} />
                    <Input placeholder={T.taxInfo} value={(formData.taxInfo ?? [""])[0] || ""} onChange={(e) => setFormData({...formData, taxInfo: [e.target.value]})} />
                    <Input placeholder={T.driveLink} type="url" value={(formData.driveLink ?? [""])[0] || ""} onChange={(e) => setFormData({...formData, driveLink: [e.target.value]})} />
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{T.clientType}</Label>
                        <RadioGroup value={formData.type} onValueChange={(value: "agency" | "brand") => setFormData({...formData, type: value})} className="flex gap-4 pt-2">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="brand" id="edit-type-brand" /><Label htmlFor="edit-type-brand" className="font-normal">{T.brand}</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="agency" id="edit-type-agency" /><Label htmlFor="edit-type-agency" className="font-normal">{T.agency}</Label></div>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>{T.cancel}</Button>
                    <Button onClick={handleSave} disabled={!formData.name.trim()}>{T.saveChanges}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
