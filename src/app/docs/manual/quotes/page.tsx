"use client";

import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    FilePlus,
    LayoutList,
    ListPlus,
    Save,
    FileEdit,
    Send,
    CheckCircle2,
    XCircle,
    Link,
    FileDown,
    Copy,
    ArrowRight,
    Flag,
    CalendarClock,
    CheckSquare,
    Link2,
    CreditCard,
    Receipt,
    Circle,
    Timer,
    PauseCircle,
    Archive
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const iconMap: any = {
    "FilePlus": FilePlus,
    "LayoutList": LayoutList,
    "ListPlus": ListPlus,
    "Save": Save,
    "FileEdit": FileEdit,
    "Send": Send,
    "CheckCircle2": CheckCircle2,
    "XCircle": XCircle,
    "Link": Link,
    "FileDown": FileDown,
    "Copy": Copy,
    "Flag": Flag,
    "CalendarClock": CalendarClock,
    "CheckSquare": CheckSquare,
    "Link2": Link2,
    "CreditCard": CreditCard,
    "Receipt": Receipt,
    "Circle": Circle,
    "Timer": Timer,
    "PauseCircle": PauseCircle,
    "Archive": Archive
};

export default function QuotesManualPage() {
    const { language } = useDocsLanguage();
    const t = docsTranslations[language].manual.quotes as any;

    return (
        <div className="space-y-12 max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-4 border-b pb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-primary border-primary">v1.2</Badge>
                    <Badge variant="secondary">{language === 'vi' ? 'Hướng dẫn' : 'Manual'}</Badge>
                </div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {t.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    {t.description}
                </p>
            </div>

            {/* Creating Process */}
            <div className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    {t.creatingTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {t.creatingSteps.map((step: any, index: number) => {
                        const Icon = iconMap[step.icon] || FileText;
                        return (
                            <Card key={index} className="relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-muted-foreground/10 font-bold text-6xl select-none -z-10">
                                    {index + 1}
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                        <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">{step.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Lifecycle Statuses */}
            <div className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
                    {t.statusesTitle}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {t.statuses.map((status: any, index: number) => {
                        const Icon = iconMap[status.icon] || FileEdit;
                        return (
                            <div key={index} className={`flex items-start gap-4 p-4 rounded-lg border ${status.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-10 ')}`}>
                                <div className={`p-2 rounded-full ${status.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base mb-1">{status.name}</h3>
                                    <p className="text-sm text-muted-foreground">{status.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Timeline & Payments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Timeline */}
                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 flex items-center gap-2">
                        <Flag className="h-6 w-6" />
                        {t.timelineTitle}
                    </h2>
                    <p className="text-muted-foreground">{t.timelineDesc}</p>
                    <div className="grid gap-4">
                        {t.timelineSteps.map((step: any, index: number) => {
                            const Icon = iconMap[step.icon] || Flag;
                            return (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                                            <Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{step.title}</CardTitle>
                                            <CardDescription>{step.desc}</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Payments */}
                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 flex items-center gap-2">
                        <CreditCard className="h-6 w-6" />
                        {t.paymentsTitle}
                    </h2>
                    <p className="text-muted-foreground">{t.paymentsDesc}</p>
                    <div className="grid gap-4">
                        {t.paymentSteps.map((step: any, index: number) => {
                            const Icon = iconMap[step.icon] || CreditCard;
                            return (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                                            <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{step.title}</CardTitle>
                                            <CardDescription>{step.desc}</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Templates & Sharing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Templates */}
                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
                        {t.templatesTitle}
                    </h2>
                    <Card>
                        <CardHeader>
                            <CardDescription className="text-base">
                                {t.templatesDesc}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-4">
                                {t.templateSteps.map((step: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <ArrowRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                </div>

                {/* Sharing */}
                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
                        {t.sharingTitle}
                    </h2>
                    <div className="space-y-3">
                        {t.sharingOptions.map((option: any, index: number) => {
                            const Icon = iconMap[option.icon] || Link;
                            return (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">{option.text}</p>
                                        <p className="text-xs text-muted-foreground">{option.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
