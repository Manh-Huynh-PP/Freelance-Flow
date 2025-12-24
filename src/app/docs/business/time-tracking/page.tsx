"use client";

import React from "react";
import { useDocsLanguage } from "@/contexts/DocsLanguageContext";
import { docsTranslations } from "@/lib/i18n/docs-translations";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Timer,
    BarChart3,
    ListChecks,
    AlertTriangle,
    Brain,
    TrendingUp,
    Target,
    Sparkles
} from "lucide-react";

export default function ProductivityAnalysisPage() {
    const { language } = useDocsLanguage();
    const t = (docsTranslations[language] as any).business?.productivityAnalysis;

    if (!t) return null;

    return (
        <div className="space-y-10 max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-3 border-b pb-6">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                        {language === 'vi' ? 'Phân tích' : 'Analysis'}
                    </Badge>
                </div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                    {t.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                    {t.description}
                </p>
            </div>

            {/* Work Time Statistics */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.workTimeTitle}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.workTimeDesc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.workTimeMetrics.map((metric: any, idx: number) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Timer className="h-4 w-4 text-blue-600" />
                                    {metric.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {metric.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Task Analytics */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.taskAnalyticsTitle}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.taskAnalyticsDesc}</p>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-900">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {t.taskAnalyticsFeatures.map((feature: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-green-200 dark:border-green-800">
                                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                                        <ListChecks className="h-4 w-4" />
                                        {feature.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Deadline Alerts */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.deadlineAlertsTitle}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.deadlineAlertsDesc}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {t.deadlineFeatures.map((feature: any, idx: number) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow border-t-4 border-t-red-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Target className="h-4 w-4 text-red-600" />
                                    {feature.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {feature.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* AI Insights */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.aiInsightsTitle}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.aiInsightsDesc}</p>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-100 dark:border-purple-900">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {t.aiInsightsFeatures.map((feature: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-purple-200 dark:border-purple-800">
                                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-purple-700 dark:text-purple-300">{feature.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
