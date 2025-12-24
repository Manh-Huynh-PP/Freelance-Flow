"use client";

import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Banknote,
    StickyNote,
    Timer,
    CheckSquare,
    PlusCircle,
    Move,
    Settings,
    PenTool,
    TrendingUp,
    EyeOff,
    LayoutDashboard,
    ArrowRight,
    Calculator,
    Sparkles,
    Clock,
    CheckCircle,
    Sidebar,
    Edit3,
    Layout
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const iconMap: any = {
    "Banknote": Banknote,
    "StickyNote": StickyNote,
    "Timer": Timer,
    "CheckSquare": CheckSquare,
    "PlusCircle": PlusCircle,
    "Move": Move,
    "Settings": Settings,
    "PenTool": PenTool,
    "TrendingUp": TrendingUp,
    "EyeOff": EyeOff,
    "Calculator": Calculator,
    "Sparkles": Sparkles,
    "Clock": Clock,
    "CheckCircle": CheckCircle,
    "Sidebar": Sidebar,
    "Edit3": Edit3,
    "Layout": Layout
};

export default function WidgetsManualPage() {
    const { language } = useDocsLanguage();
    const t = docsTranslations[language].manual.widgets as any;

    if (!t) return null;

    return (
        <div className="space-y-10 max-w-6xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-3 border-b pb-6">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        {language === 'vi' ? 'Hướng dẫn' : 'Manual'}
                    </Badge>
                    <Badge variant="secondary">v1.2</Badge>
                </div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                    {t.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                    {t.description}
                </p>
            </div>

            {/* Available Widgets - Compact Grid */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <LayoutDashboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.featuresTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {t.features.map((feature: any, index: number) => {
                        const Icon = iconMap[feature.icon] || Timer;
                        return (
                            <Card key={index} className="group hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">{feature.title}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-3">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {feature.features.map((item: string, i: number) => (
                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* Widget Locations */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Layout className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.managementTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {t.managementSteps.map((step: any, index: number) => {
                        const Icon = iconMap[step.icon] || Layout;
                        return (
                            <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900/30">
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-gray-100">{step.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Usage Tips */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.tipsTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {t.tips.map((tip: any, index: number) => {
                        const Icon = iconMap[tip.icon] || CheckCircle;
                        return (
                            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                                <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {tip.text}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    );
}
