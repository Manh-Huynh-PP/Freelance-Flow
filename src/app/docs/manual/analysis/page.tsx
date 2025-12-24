"use client";

import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    PieChart,
    Percent,
    Target,
    Banknote,
    Activity,
    BarChart3,
    Clock,
    ArrowDownCircle,
    Kanban,
    CheckSquare,
    BrainCircuit,
    Timer,
    Layers,
    Zap,
    CalendarRange,
    Sparkles,
    Lightbulb,
    Rocket,
    LineChart,
    AlertTriangle,
    Radar,
    FileText,
    Sheet,
    FileJson,
    Download
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const iconMap: any = {
    // Financial
    "TrendingUp": TrendingUp,
    "PieChart": PieChart,
    "Percent": Percent,
    "Target": Target,
    "Banknote": Banknote,

    // Project
    "Activity": Activity,
    "BarChart3": BarChart3,
    "Clock": Clock,
    "ArrowDownCircle": ArrowDownCircle,
    "Kanban": Kanban,

    // Productivity
    "CheckSquare": CheckSquare,
    "BrainCircuit": BrainCircuit,
    "Timer": Timer,
    "Layers": Layers,
    "Zap": Zap,

    // AI
    "CalendarRange": CalendarRange,
    "Sparkles": Sparkles,
    "Lightbulb": Lightbulb,
    "Rocket": Rocket,
    "LineChart": LineChart,
    "AlertTriangle": AlertTriangle,
    "Radar": Radar,

    // Export
    "FileText": FileText,
    "Sheet": Sheet,
    "FileJson": FileJson
};

export default function AnalysisManualPage() {
    const { language } = useDocsLanguage();
    const t = docsTranslations[language].manual.analysis as any;

    if (!t) return null;

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

            {/* Analysis Types */}
            <div className="space-y-8">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight text-center">
                    {t.typesTitle}
                </h2>

                <div className="grid grid-cols-1 gap-8">
                    {t.analysisTypes.map((type: any, index: number) => {
                        const MainIcon = iconMap[type.icon] || Activity;
                        return (
                            <Card key={index} className="overflow-hidden border-2 hover:border-primary/20 transition-all">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-background shadow-sm border">
                                            <MainIcon className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl">{type.title}</CardTitle>
                                            <CardDescription className="text-base font-medium text-primary/80">
                                                {type.subtitle}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-muted-foreground">
                                        {type.desc}
                                    </p>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {type.metrics.map((metric: any, mIndex: number) => {
                                            const MetricIcon = iconMap[metric.icon] || Activity;
                                            return (
                                                <div key={mIndex} className="flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                                    <MetricIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                                    <div className="space-y-1">
                                                        <h4 className="font-semibold text-sm leading-none">{metric.label}</h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            {metric.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* AI Insights and Export */}
            {/* AI Insights and Export */}
            {/* AI Insights */}
            <div>
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">New Feature</span>
                        </div>
                        <CardTitle className="text-2xl">{t.aiTitle}</CardTitle>
                        <CardDescription>{t.aiDesc}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Features */}
                        <div className="grid sm:grid-cols-3 gap-3">
                            {t.aiFeatures.map((feature: any, index: number) => {
                                const Icon = iconMap[feature.icon] || Sparkles;
                                return (
                                    <div key={index} className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-background/60 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
                                        <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-semibold text-sm">{feature.name}</div>
                                            <div className="text-xs text-muted-foreground leading-tight">{feature.desc}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Steps */}
                        <div className="space-y-3 pt-6 border-t border-indigo-100/50 dark:border-indigo-900/30">
                            <h4 className="font-semibold text-sm">How to use:</h4>
                            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                {t.aiSteps.map((step: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="flex shrink-0 items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                            {index + 1}
                                        </div>
                                        <span>{step.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
