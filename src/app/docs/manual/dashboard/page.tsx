"use client";

import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    LayoutDashboard,
    Sidebar,
    Maximize,
    MousePointerClick,
    Table,
    Kanban,
    Calendar,
    GanttChart,
    LayoutGrid,
    Network,
    LayoutTemplate,
    Search,
    User,
    Keyboard,
    PanelLeftClose,
    Move,
    Settings2,
    MousePointer2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const iconMap: any = {
    // Sections
    "LayoutHeader": LayoutTemplate,
    "Sidebar": Sidebar,
    "Maximize": Maximize,
    "MousePointerClick": MousePointerClick,

    // Views
    "Table": Table,
    "Kanban": Kanban,
    "Calendar": Calendar,
    "GanttChart": GanttChart,
    "LayoutGrid": LayoutGrid,
    "Network": Network,

    // Tips
    "Keyboard": Keyboard,
    "PanelLeftClose": PanelLeftClose,
    "Move": Move,
    "Settings2": Settings2,
    "MousePointer2": MousePointer2
};

export default function DashboardManualPage() {
    const { language } = useDocsLanguage();
    const t = docsTranslations[language].manual.dashboard as any;

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
                <div className="text-xl text-muted-foreground leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.description}</ReactMarkdown>
                </div>
            </div>

            {/* Dashboard Screenshot */}
            {t.image && (
                <div className="rounded-xl border bg-muted/50 p-2 shadow-sm">
                    <img
                        src={t.image}
                        alt="Dashboard Preview"
                        className="w-full h-auto rounded-lg border shadow-sm"
                    />
                </div>
            )}

            {/* Main Sections */}
            <div className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 flex items-center gap-2">
                    <LayoutDashboard className="h-6 w-6" />
                    {t.sectionsTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {t.sections.map((section: any, index: number) => {
                        const Icon = iconMap[section.icon] || LayoutDashboard;
                        return (
                            <Card key={index} className="transition-all hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{section.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-base text-muted-foreground">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.desc}</ReactMarkdown>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* View Modes */}
            <div className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 flex items-center gap-2">
                    <LayoutGrid className="h-6 w-6" />
                    {t.viewModesTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {t.viewModes.map((view: any, index: number) => {
                        const Icon = iconMap[view.icon] || LayoutGrid;
                        return (
                            <div key={index} className="group relative rounded-xl border p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-md bg-background border shadow-sm group-hover:border-primary/50 transition-colors">
                                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="font-semibold">{view.name}</h3>
                                </div>
                                <div className="text-sm text-muted-foreground leading-snug">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{view.desc}</ReactMarkdown>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Navigation Tips */}
            <div className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 flex items-center gap-2">
                    <Keyboard className="h-6 w-6" />
                    {t.navigationTitle}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {t.navigationTips.map((tip: any, index: number) => {
                        const Icon = iconMap[tip.icon] || Keyboard;
                        return (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border">
                                <Icon className="h-5 w-5 text-primary mt-1 shrink-0" />
                                <div className="text-base">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            strong: ({ node, ...props }) => <span className="font-bold text-foreground px-1.5 py-0.5 rounded bg-muted border border-border text-sm font-mono mx-1" {...props} />
                                        }}
                                    >
                                        {tip.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
