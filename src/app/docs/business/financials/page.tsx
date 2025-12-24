"use client";

import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calculator, BarChart3, Brain, Sparkles, Lightbulb } from 'lucide-react';

export default function FinancialsBusinessPage() {
    const { language } = useDocsLanguage();
    const t = (docsTranslations[language] as any).business?.financials;

    return (
        <div className="space-y-10 max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-3 border-b pb-6">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {language === 'vi' ? 'Nghiệp vụ' : 'Business Logic'}
                    </Badge>
                </div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                    {t.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                    {t.description}
                </p>
            </div>

            {/* Key Financial Metrics */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Calculator className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.metricsTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.metrics.map((metric: any, idx: number) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                                </div>
                                <CardDescription className="font-mono text-sm bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                    {metric.formula}
                                </CardDescription>
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

            {/* Financial Charts */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.chartsTitle}
                    </h2>
                </div>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-100 dark:border-blue-900">
                    <CardContent className="p-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{t.chartsDesc}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {t.charts.map((chart: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">{chart.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{chart.desc}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* AI Business Analysis */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.aiAnalysisTitle}
                    </h2>
                </div>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-100 dark:border-purple-900">
                    <CardContent className="p-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{t.aiAnalysisDesc}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {t.aiFeatures.map((feature: any, idx: number) => (
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

            {/* Financial Management Tips */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <Lightbulb className="h-6 w-6 text-amber-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.tipsTitle}
                    </h2>
                </div>
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-100 dark:border-amber-900">
                    <CardContent className="p-6">
                        <ul className="space-y-3">
                            {t.tips.map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
