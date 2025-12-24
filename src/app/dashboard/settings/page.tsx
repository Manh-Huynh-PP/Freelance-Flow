"use client";

const predefinedStatusColors: { name: string; colors: StatusColors }[] = [
    { name: 'Default', colors: { todo: '#a855f7', inprogress: '#eab308', done: '#22c55e', onhold: '#f97316', archived: '#64748b' } },
    { name: 'Vibrant', colors: { todo: '#ef4444', inprogress: '#3b82f6', done: '#16a34a', onhold: '#f59e0b', archived: '#4b5563' } },
    { name: 'Pastel', colors: { todo: '#f9a8d4', inprogress: '#93c5fd', done: '#a7f3d0', onhold: '#fde68a', archived: '#d1d5db' } }
];

const predefinedEisenhowerSchemes = [
    { name: 'colorScheme1', label: 'Classic', colors: { do: { background: '#fef2f2', border: '#fecaca' }, decide: { background: '#eff6ff', border: '#bfdbfe' }, delegate: { background: '#fef9c3', border: '#fde047' }, delete: { background: '#f3f4f6', border: '#d1d5db' } } },
    { name: 'colorScheme2', label: 'Vibrant', colors: { do: { background: '#faf5ff', border: '#d8b4fe' }, decide: { background: '#f0fdf4', border: '#bbf7d0' }, delegate: { background: '#fff7ed', border: '#fed7aa' }, delete: { background: '#eff6ff', border: '#bfdbfe' } } },
    { name: 'colorScheme3', label: 'Modern', colors: { do: { background: '#f0fdfa', border: '#99f6e4' }, decide: { background: '#fdf2f8', border: '#fbcfe8' }, delegate: { background: '#fffbeb', border: '#fde68a' }, delete: { background: '#eef2ff', border: '#c7d2fe' } } }
];

import React, { useState, useRef, useEffect, SetStateAction } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { QuestionMarkIcon } from '@/components/ui/question-mark-icon';
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from "@/lib/utils";
import { Slider } from '@/components/ui/slider';
import { i18n } from "@/lib/i18n";
import { Separator } from '@/components/ui/separator';
import { Book, ArrowRight } from "lucide-react";
import type { AppSettings, ThemeSettings, StatusColors, AppData, DashboardColumn } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { GeminiModel, GEMINI_MODELS, ModelFallbackManager } from '@/ai/utils/gemini-models';
import { Badge } from '@/components/ui/badge';
import { Zap, Star, Info } from 'lucide-react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from '@/contexts/dashboard-context';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import { CollaboratorDataService } from '@/lib/collaborator-data-service';
import { StatusSettings } from '@/components/status-settings';
import { BackupManager } from '@/components/backup-manager';
import { getContrastingTextColor } from "@/lib/colors";
import styles from './SettingsColors.module.css';
import { WIDGETS } from '@/lib/widgets';
import { FeedbackForm } from '@/components/feedback-form';
import { ChangePasswordForm } from '@/components/change-password-form';

const predefinedThemes: { name: string; colors: ThemeSettings & { background: string } }[] = [
    { name: 'Default', colors: { primary: "#2A5EE5", accent: "#ffffff", background: "#f5f6fa" } },
    { name: 'Teal', colors: { primary: "#14B8B8", accent: "#109393", background: "#e6f7f7" } },
    { name: 'Crimson', colors: { primary: "#DC2638", accent: "#C01D2E", background: "#fff5f6" } },
    { name: 'Forest', colors: { primary: "#52A852", accent: "#438A43", background: "#f3f9f3" } },
    { name: 'Violet', colors: { primary: "#6C28E3", accent: "#561EC5", background: "#f7f5fa" } },
    { name: 'Lavender', colors: { primary: "#B5A6F9", accent: "#9885F7", background: "#f8f7fc" } },
    { name: 'Mint', colors: { primary: "#A6F2CF", accent: "#81EAB8", background: "#f5fcf8" } },
    { name: 'Sky', colors: { primary: "#A5DEF9", accent: "#82CBF6", background: "#f5fbfd" } },
    { name: 'Peach', colors: { primary: "#FFC999", accent: "#FFB366", background: "#fff8f3" } },
    { name: 'Monochrome', colors: { primary: "#353B41", accent: "#F2f2f2", background: "#f4f4f4" } }
];

const defaultSettings: Omit<AppSettings, 'theme' | 'statusColors' | 'stickyNoteColor' | 'dashboardColumns' | 'statusSettings' | 'widgets'> = {
    trashAutoDeleteDays: 30,
    language: 'en',
    currency: 'VND',
    preferredModelProvider: 'google',
    googleApiKey: '',
    googleModel: GeminiModel.GEMINI_2_5_FLASH,
};

import { Suspense } from "react";

export default function SettingsPage() {
    return (
        <Suspense fallback={<div className="p-4 md:p-6"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-96 w-full" /></div>}>
            <SettingsPageContent />
        </Suspense>
    );
}

function SettingsPageContent() {
    const dashboardContext = useDashboard();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
    const [clearConfirmText, setClearConfirmText] = useState("");

    const appData = dashboardContext?.appData;
    const setAppData = dashboardContext?.setAppData;
    const handleClearAllData = dashboardContext?.handleClearAllData;
    const appSettings = appData?.appSettings;
    const handleFileUpload = dashboardContext?.handleFileUpload;

    if (!appData || !appSettings || !setAppData || !handleClearAllData) {
        return (
            <div className="p-4 md:p-6">
                <Skeleton className="h-10 w-1/3" /><Skeleton className="h-96 w-full" />
            </div>
        );
    }

    const T = i18n[appSettings.language as 'en' | 'vi'] || i18n.en;

    // Action tracking
    const { actionBuffer } = dashboardContext;

    const onSettingsChange = (update: SetStateAction<AppSettings>, actionDescription?: string) => {
        const oldSettings = appData.appSettings;
        const newSettings = typeof update === 'function' ? update(oldSettings) : update;

        setAppData((prevData: AppData) => ({
            ...prevData,
            appSettings: newSettings,
        }));

        // Track the settings change
        if (actionDescription && actionBuffer) {
            actionBuffer.pushAction({
                action: 'settings',
                entityType: 'settings',
                entityId: 'app-settings',
                description: actionDescription,
                previousData: oldSettings,
                newData: newSettings,
                canUndo: true
            });
        }
    };

    const handleReset = () => {
        onSettingsChange(() => ({
            ...(defaultSettings as AppSettings),
            theme: predefinedThemes[0].colors,
            statusColors: predefinedStatusColors[0].colors,
            stickyNoteColor: { background: '#fef9c3', foreground: '#713f12' },
            dashboardColumns: [
                { id: 'name', label: 'Task', visible: true }, { id: 'client', label: 'Client', visible: true },
                { id: 'category', label: 'Category', visible: true }, { id: 'deadline', label: 'Deadline', visible: true },
                { id: 'status', label: 'Status', visible: true }, { id: 'priceQuote', label: 'Quote', visible: true },
            ],
            statusSettings: [
                { id: 'todo', label: i18n.en.statuses.todo, subStatuses: [] },
                { id: 'inprogress', label: i18n.en.statuses.inprogress, subStatuses: [{ id: 'planning', label: 'Planning' }, { id: 'development', label: 'Development' }, { id: 'testing', label: 'Testing' }] },
                { id: 'done', label: i18n.en.statuses.done, subStatuses: [{ id: 'completed', label: 'Completed' }, { id: 'delivered', label: 'Delivered' }] },
                { id: 'onhold', label: i18n.en.statuses.onhold, subStatuses: [] },
                { id: 'archived', label: i18n.en.statuses.archived, subStatuses: [] },
            ],
            widgets: [
                { id: 'calculator', enabled: true, showInSidebar: false, colSpan: 1, rowSpan: 1 },
                { id: 'sticky-notes', enabled: true, showInSidebar: true, colSpan: 2, rowSpan: 2 },
                { id: 'pomodoro', enabled: true, showInSidebar: false, colSpan: 1, rowSpan: 1 },
            ]
        }));
        toast({ title: T.settingsReset, description: T.settingsResetDesc });
    }

    const handleThemeChange = (themeName: string) => {
        const selectedTheme = predefinedThemes.find(t => t.name === themeName);
        if (selectedTheme) {
            onSettingsChange(
                s => ({ ...s, theme: selectedTheme.colors }),
                `Changed theme to ${themeName}`
            );
        }
    }

    const handleStatusPresetChange = (name: string) => {
        const selected = predefinedStatusColors.find(p => p.name === name);
        if (selected) {
            onSettingsChange(
                s => ({ ...s, statusColors: selected.colors }),
                `Changed status color scheme to ${name}`
            );
        }
    }

    const handleStickyNoteBgChange = (color: string) => {
        onSettingsChange(
            s => ({
                ...s,
                stickyNoteColor: { background: color, foreground: getContrastingTextColor(color) }
            }),
            `Changed sticky note color to ${color}`
        );
    }

    const themePrimary = appSettings.theme?.primary ?? predefinedThemes[0].colors.primary;
    const themeAccent = appSettings.theme?.accent ?? predefinedThemes[0].colors.accent;
    const activeThemeName = predefinedThemes.find(t =>
        t.colors.primary === themePrimary &&
        t.colors.accent === themeAccent
    )?.name || 'Custom';

    const activeStatusPresetName = predefinedStatusColors.find(p =>
        JSON.stringify(p.colors) === JSON.stringify(appSettings.statusColors || predefinedStatusColors[0].colors)
    )?.name || 'Custom';

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (handleFileUpload) {
            handleFileUpload(file);
        }

        event.target.value = '';
    };

    const handleClearData = async () => {
        // Decide based on radio selection in Danger Zone
        const radios = document.getElementsByName('clear-mode');
        let clearBackups = false;
        radios.forEach((r: any, idx) => { if (r.checked) clearBackups = idx !== 0; });

        try {
            if (clearBackups) {
                await (dashboardContext as any)?.handleClearDataAndBackups?.();
            } else {
                await (dashboardContext as any)?.handleClearOnlyData?.();
            }
            toast({
                title: T.clearAllData,
                description: "All data has been successfully cleared.",
                variant: "default"
            });
        } catch (error) {
            console.error('Clear data failed:', error);
            // Error toast is already shown in handleClearDataAndBackups if it fails
        }
    }

    const confirmationText = appSettings.language === 'vi' ? 'XÓA' : 'DELETE';

    return (
        <>
            <div className="p-4 md:p-6 max-w-5xl 2xl:max-w-6xl mx-auto w-full">
                <Tabs defaultValue="appearance" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="appearance">{T.tabAppearance}</TabsTrigger>
                        <TabsTrigger value="general">{T.tabGeneral}</TabsTrigger>
                        <TabsTrigger value="statuses">{T.tabStatuses}</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>

                        <TabsTrigger value="data">{T.tabData}</TabsTrigger>
                        <TabsTrigger value="support">{T.support || 'Support'}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="appearance">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{T.appearanceSettings}</CardTitle>
                                <CardDescription>{T.appearanceSettingsDesc}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>{T.themeMode}</Label>
                                    <ThemeToggle />
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>{T.themeColor}</Label>
                                    <RadioGroup value={activeThemeName} onValueChange={handleThemeChange} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {predefinedThemes.map(theme => (
                                            <div key={theme.name}>
                                                <RadioGroupItem value={theme.name} id={theme.name} className="peer sr-only" />
                                                <Label
                                                    htmlFor={theme.name}
                                                    className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", "peer-data-[state=checked]:border-primary")}
                                                >
                                                    <div className="w-full h-8 rounded" style={{ backgroundColor: theme.colors.primary }} />
                                                    <span className="mt-2 font-semibold">{theme.name}</span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>{T.statusColors}</Label>
                                    <RadioGroup value={activeStatusPresetName} onValueChange={handleStatusPresetChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {predefinedStatusColors.map(preset => (
                                            <div key={preset.name}>
                                                <RadioGroupItem value={preset.name} id={`status-${preset.name}`} className="peer sr-only" />
                                                <Label
                                                    htmlFor={`status-${preset.name}`}
                                                    className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", "peer-data-[state=checked]:border-primary")}
                                                >
                                                    <div className="flex gap-2 w-full h-8 items-center">
                                                        {Object.values(preset.colors).map((color, index) => (
                                                            <div key={index} className={`w-1/5 h-5 rounded-full`} style={{ background: color, backgroundColor: color }} />
                                                        ))}
                                                    </div>
                                                    <span className="mt-2 font-semibold">{preset.name}</span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>{T.eisenhowerColorScheme}</Label>
                                    <p className="text-sm text-muted-foreground">{T.eisenhowerColorSchemeDesc}</p>
                                    <RadioGroup
                                        value={appSettings.eisenhowerColorScheme || 'colorScheme1'}
                                        onValueChange={(value: 'colorScheme1' | 'colorScheme2' | 'colorScheme3') => onSettingsChange(
                                            s => ({ ...s, eisenhowerColorScheme: value }),
                                            `Changed Eisenhower color scheme to ${value.replace('colorScheme', 'Scheme ')}`
                                        )}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    >
                                        {predefinedEisenhowerSchemes.map(scheme => (
                                            <div key={scheme.name}>
                                                <RadioGroupItem value={scheme.name} id={`eisenhower-${scheme.name}`} className="peer sr-only" />
                                                <Label
                                                    htmlFor={`eisenhower-${scheme.name}`}
                                                    className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", "peer-data-[state=checked]:border-primary")}
                                                >
                                                    <div className="flex gap-1 w-full h-8 items-center justify-center">
                                                        <div className={`${styles.eisenhowerPreview} ${styles[`scheme${scheme.name.slice(-1)}Do`]}`}></div>
                                                        <div className={`${styles.eisenhowerPreview} ${styles[`scheme${scheme.name.slice(-1)}Decide`]}`}></div>
                                                        <div className={`${styles.eisenhowerPreview} ${styles[`scheme${scheme.name.slice(-1)}Delegate`]}`}></div>
                                                        <div className={`${styles.eisenhowerPreview} ${styles[`scheme${scheme.name.slice(-1)}Delete`]}`}></div>
                                                    </div>
                                                    <span className="mt-2 font-semibold">
                                                        {(T[`colorScheme${scheme.name.slice(-1)}` as keyof typeof T] as string) || scheme.label}
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>{T.dashboardColumns}</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(appSettings.dashboardColumns || []).map((column: DashboardColumn) => {
                                            const labelKey = column.id === 'name' ? 'taskName' : column.id === 'priceQuote' ? 'priceQuote' : column.id;
                                            let columnLabel: string = column.label;
                                            const tValue = T[labelKey as keyof typeof T];
                                            if (typeof tValue === 'string') { columnLabel = tValue; }
                                            return (
                                                <div key={column.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`col-${column.id}`} checked={column.visible}
                                                        onCheckedChange={(checked) => {
                                                            const columnName = column.label || column.id;
                                                            onSettingsChange(
                                                                s => ({ ...s, dashboardColumns: (s.dashboardColumns || []).map(c => c.id === column.id ? { ...c, visible: !!checked } : c) }),
                                                                `${checked ? 'Showed' : 'Hidden'} ${columnName} column in dashboard`
                                                            );
                                                        }}
                                                    />
                                                    <label htmlFor={`col-${column.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        {columnLabel}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label htmlFor="sticky-note-color">{T.stickyNoteBackground}</Label>
                                    <Input
                                        id="sticky-note-color" type="color" value={appSettings.stickyNoteColor?.background || '#fef9c3'}
                                        onChange={(e) => handleStickyNoteBgChange(e.target.value)}
                                        className="p-1 h-10 w-14"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="general">
                        <Card>
                            <CardHeader><CardTitle className="text-base">{T.otherColorsAndSettings}</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label>{T.language}</Label>
                                    <RadioGroup value={appSettings.language} onValueChange={(value) => onSettingsChange(
                                        s => ({ ...s, language: value as 'en' | 'vi' }),
                                        `Changed language to ${value === 'en' ? 'English' : 'Vietnamese'}`
                                    )} className="flex gap-4">
                                        <div key="en"><RadioGroupItem value="en" id="lang-en" className="peer sr-only" /><Label htmlFor="lang-en" className={cn("flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 px-3 hover:bg-accent hover:text-accent-foreground cursor-pointer h-10", "peer-data-[state=checked]:border-primary")}><svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-auto mr-2 rounded-sm"><rect width="24" height="16" fill="#012169" /><path d="M0 0L24 16M24 0L0 16" stroke="white" strokeWidth="2" /><path d="M12 0V16M0 8H24" stroke="white" strokeWidth="4" /><path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="2" /></svg><span className="font-medium">English</span></Label></div>
                                        <div key="vi"><RadioGroupItem value="vi" id="lang-vi" className="peer sr-only" /><Label htmlFor="lang-vi" className={cn("flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 px-3 hover:bg-accent hover:text-accent-foreground cursor-pointer h-10", "peer-data-[state=checked]:border-primary")}><svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-auto mr-2 rounded-sm"><rect width="24" height="16" fill="#DA251D" /><path d="M12 2.5L13.657 7.236H18.633L14.488 10.127L16.145 14.864L12 11.973L7.855 14.864L9.512 10.127L5.367 7.236H10.343L12 2.5Z" fill="#FFFF00" /></svg><span className="font-medium">Tiếng Việt</span></Label></div>
                                    </RadioGroup>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label>{T.currency}</Label>
                                    <Select value={appSettings.currency} onValueChange={(value) => onSettingsChange(
                                        s => ({ ...s, currency: value as 'VND' | 'USD' }),
                                        `Changed currency to ${value}`
                                    )}>
                                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select a currency" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VND">{T.VND} (₫)</SelectItem>
                                            <SelectItem value="USD">{T.USD} ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label htmlFor="trash-days">{T.autoDeleteTrash}: {appSettings.trashAutoDeleteDays} {T.days}</Label>
                                    <Slider id="trash-days" min={7} max={90} step={1} value={[appSettings.trashAutoDeleteDays]} onValueChange={(value) => onSettingsChange(
                                        s => ({ ...s, trashAutoDeleteDays: value[0] }),
                                        `Changed trash auto-delete to ${value[0]} days`
                                    )} />
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="validity-note">{T.quoteValidityNote || 'Quote Validity Note'}</Label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <QuestionMarkIcon className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="max-w-xs">{T.quoteValidityNoteDesc || 'Customize the validity note text shown on quotes and share pages'}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <div className="space-y-2">
                                        <textarea
                                            id="validity-note"
                                            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={appSettings.quoteValidityNote || ((T as any).quoteValidityNote || '')}
                                            onChange={(e) => onSettingsChange(
                                                s => ({ ...s, quoteValidityNote: e.target.value }),
                                                'Updated quote validity note text'
                                            )}
                                            placeholder={(T as any).quoteValidityNote || 'Enter custom validity note text...'}
                                        />
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="show-validity-default"
                                                checked={appSettings.showValidityNoteByDefault ?? true}
                                                onCheckedChange={(checked) => onSettingsChange(
                                                    s => ({ ...s, showValidityNoteByDefault: !!checked }),
                                                    `${checked ? 'Enabled' : 'Disabled'} validity note by default when sharing`
                                                )}
                                            />
                                            <label htmlFor="show-validity-default" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {T.showValidityNoteByDefault || 'Show by default when sharing'}
                                            </label>
                                        </div>
                                        {appSettings.quoteValidityNote && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onSettingsChange(
                                                    s => ({ ...s, quoteValidityNote: undefined }),
                                                    'Reset quote validity note to default'
                                                )}
                                            >
                                                {T.resetToDefault || 'Reset to Default'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label htmlFor="eisenhower-max-tasks">{T.eisenhowerMaxTasks}: {appSettings.eisenhowerMaxTasksPerQuadrant || 10}</Label>
                                    <Slider id="eisenhower-max-tasks" min={3} max={20} step={1} value={[appSettings.eisenhowerMaxTasksPerQuadrant || 10]} onValueChange={(value) => onSettingsChange(
                                        s => ({ ...s, eisenhowerMaxTasksPerQuadrant: value[0] }),
                                        `Changed Eisenhower max tasks per quadrant to ${value[0]}`
                                    )} />
                                    <p className="text-sm text-muted-foreground">{T.eisenhowerMaxTasksDesc}</p>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>{T.widgets || 'Widgets'}</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(appSettings.widgets || []).map((widget: any) => {
                                            const label = widget.id === 'sticky-notes' ? ((T as any).stickyNotes || 'Sticky Notes') :
                                                widget.id === 'calculator' ? ((T as any).calculator || 'Simple Calculator') :
                                                    widget.id === 'pomodoro' ? ((T as any).pomodoro || 'Pomodoro Timer') : widget.id;
                                            return (
                                                <div key={widget.id} className="p-3 border rounded-md space-y-2">
                                                    <div className="font-medium">{label}</div>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`widget-enabled-${widget.id}`}
                                                                checked={widget.enabled}
                                                                onCheckedChange={(checked) => {
                                                                    onSettingsChange(
                                                                        (s: AppSettings) => ({
                                                                            ...s,
                                                                            widgets: (s.widgets || []).map(w => w.id === widget.id ? { ...w, enabled: !!checked } : w)
                                                                        }),
                                                                        `${checked ? 'Enabled' : 'Disabled'} ${label} widget`
                                                                    );
                                                                }}
                                                            />
                                                            <label htmlFor={`widget-enabled-${widget.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                {(T as any).enable || 'Enable'}
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`widget-sidebar-${widget.id}`}
                                                                checked={widget.showInSidebar}
                                                                onCheckedChange={(checked) => {
                                                                    onSettingsChange(
                                                                        (s: AppSettings) => ({
                                                                            ...s,
                                                                            widgets: (s.widgets || []).map(w => w.id === widget.id ? { ...w, showInSidebar: !!checked } : w)
                                                                        }),
                                                                        `${checked ? 'Showed' : 'Hidden'} ${label} in sidebar`
                                                                    );
                                                                }}
                                                                disabled={!widget.enabled}
                                                            />
                                                            <label htmlFor={`widget-sidebar-${widget.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                {T.showInSidebar || 'Show in Sidebar'}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="statuses">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{T.statusSettings}</CardTitle>
                                <CardDescription>{T.statusSettingsDesc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <StatusSettings
                                    settings={appSettings}
                                    onSettingsChange={(update) => {
                                        // StatusSettings already handles detailed tracking inside the component
                                        const updatedSettings = typeof update === 'function' ? update(appSettings) : update;
                                        setAppData((prevData: AppData) => ({
                                            ...prevData,
                                            appSettings: updatedSettings,
                                        }));
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security">
                        <div className="max-w-2xl px-1">
                            <ChangePasswordForm />
                        </div>
                    </TabsContent>

                    <TabsContent value="data">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">{T.dataManagement || 'Data Management'}</h2>
                                <p className="text-sm text-muted-foreground">{T.dataManagementDesc || 'Backup, restore and manage your data'}</p>
                            </div>

                            {/* Full Backup Manager */}
                            <BackupManager />

                            {/* Data Restore content is integrated inside BackupManager to match layout */}

                            <Card className="border-destructive/20">
                                <CardHeader><CardTitle className="text-lg text-destructive">{T.dangerZone}</CardTitle><CardDescription>{T.dangerZoneDesc}</CardDescription></CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
                                            <div>
                                                <p className="font-medium">{T.clearAllData}</p>
                                                <p className="text-sm text-muted-foreground">{T.clearAllDataDesc}</p>
                                                <div className="mt-2 flex items-center gap-4 text-xs">
                                                    <label className="flex items-center gap-2">
                                                        <input type="radio" name="clear-mode" defaultChecked /> {appSettings.language === 'vi' ? 'Chỉ xoá dữ liệu chính' : 'Clear main data only'}
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input type="radio" name="clear-mode" /> {appSettings.language === 'vi' ? 'Xoá dữ liệu và cả backup' : 'Clear data and backups'}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <AlertDialog open={isConfirmClearOpen} onOpenChange={setIsConfirmClearOpen}>
                                            <AlertDialogTrigger asChild><Button variant="destructive"><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>{T.clearAllData}</Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="flex items-center gap-2 text-destructive"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>{T.clearAllDataWarningTitle}</AlertDialogTitle>
                                                    <AlertDialogDescription>{T.clearAllDataWarningDesc?.replace('{confirmationText}', confirmationText) || `Type "${confirmationText}" to confirm deleting all data.`}</AlertDialogDescription>
                                                    <div className="p-3 bg-destructive/10 rounded border border-destructive/20 mt-2"><span className="text-sm text-destructive font-medium">⚠️ {T.warningNotReversible || 'Warning: This action cannot be undone!'}</span></div>
                                                </AlertDialogHeader>
                                                <div className="py-2">
                                                    <Input value={clearConfirmText} onChange={(e) => setClearConfirmText(e.target.value)} placeholder={appSettings.language === 'vi' ? `Gõ "${confirmationText}" để xác nhận` : `Type "${confirmationText}" to confirm`} className="border-destructive/20 focus:border-destructive" />
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setClearConfirmText('')}>{T.cancel}</AlertDialogCancel>
                                                    <AlertDialogAction disabled={clearConfirmText !== confirmationText} className={cn(buttonVariants({ variant: "destructive" }))} onClick={handleClearData}><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>{T.confirmClear}</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="support">
                        <div className="space-y-6">
                            {/* Documentation Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Book className="h-5 w-5" />
                                        {T.documentation || 'Documentation'}
                                    </CardTitle>
                                    <CardDescription>{T.documentationDesc || 'Learn how to use Freelance Flow effectively.'}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground mr-4">
                                            {T.documentationLongDesc || 'Access comprehensive guides, user manuals, and theory explanations for all features.'}
                                        </p>
                                        <Button asChild>
                                            <a href="/docs" target="_blank" rel="noopener noreferrer">
                                                {T.openDocumentation || 'Open Docs'} <ArrowRight className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Contact/Feedback */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">{T.contactTitle || 'Get in Touch'}</CardTitle>
                                        <CardDescription>{T.contactDesc || "Have feedback or a feature request? We'd love to hear from you."}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FeedbackForm language={appSettings.language} />
                                    </CardContent>
                                </Card>

                                {/* Right: Terms of Service */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">{T.termsTitle || 'Terms of Service'}</CardTitle>
                                        <CardDescription>
                                            {(T.termsUpdated || 'Last updated') + ': ' + new Date().toISOString().split('T')[0]}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose dark:prose-invert max-w-none space-y-4 text-sm">
                                            <p>{T.termsIntro || "By using Freelance Flow, you agree to these terms. This app is provided as-is, stores data locally in your browser, and only sends data to AI providers when you explicitly use AI features with your own API key."}</p>
                                            <h3 className="text-base font-semibold mt-4">{T.termsOverview || 'Overview'}</h3>
                                            <p>{T.termsPrivacyDesc || "Your task data stays in your browser's storage. Backups you export are your responsibility to store safely. We do not host or collect your data."}</p>
                                            <h3 className="text-base font-semibold mt-4">{T.termsPrivacy || 'Privacy'}</h3>
                                            <p>{T.termsPrivacyDesc || "Your task data stays in your browser's storage. Backups you export are your responsibility to store safely. We do not host or collect your data."}</p>
                                            <h3 className="text-base font-semibold mt-4">{T.termsAi || 'AI Features'}</h3>
                                            <p>{T.termsAiDesc || "AI features require your API key. Requests are sent to the provider you configured (e.g., Google AI) only when you use those features."}</p>
                                            <h3 className="text-base font-semibold mt-4">{T.termsWarranty || 'No Warranty'}</h3>
                                            <p>{T.termsWarrantyDesc || "The software is provided 'as is' without warranties of any kind. Use at your own risk."}</p>
                                            <h3 className="text-base font-semibold mt-4">{T.termsLiability || 'Limitation of Liability'}</h3>
                                            <p>{T.termsLiabilityDesc || "In no event shall the authors be liable for any claim, damages, or other liability arising from the use of the software."}</p>
                                            <h3 className="text-base font-semibold mt-4">{T.termsChanges || 'Changes to Terms'}</h3>
                                            <p>{T.termsChangesDesc || "We may update these terms from time to time. Continued use of the app after changes constitutes acceptance."}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={handleReset}>{T.resetToDefaults}</Button>
                </div>
            </div >
        </>
    );
}
