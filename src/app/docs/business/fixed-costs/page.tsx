"use client";

import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Calendar, Calculator, Clock, Lightbulb, DollarSign, Repeat } from 'lucide-react';

export default function FixedCostsDocsPage() {
    const { language } = useDocsLanguage();
    const t = (docsTranslations[language] as any).business?.fixedCosts;

    if (!t) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="space-y-10 max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-3 border-b pb-6">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
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

            {/* What Are Fixed Costs */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.introTitle}
                    </h2>
                </div>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-100 dark:border-purple-900">
                    <CardContent className="p-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{t.introDesc}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {t.introExamples.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-purple-200 dark:border-purple-800">
                                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">{item.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.example}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Frequency Types */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Repeat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.frequencyTitle}
                    </h2>
                </div>

                <p className="text-gray-600 dark:text-gray-400">{t.frequencyDesc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.frequencies.map((freq: any, idx: number) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">{freq.name}</CardTitle>
                                <CardDescription>{freq.desc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    {language === 'vi' ? 'Ví dụ: ' : 'Example: '}{freq.example}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Calculation */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Calculator className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.calculationTitle}
                    </h2>
                </div>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-900">
                    <CardContent className="p-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{t.calculationDesc}</p>
                        <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-green-200 dark:border-green-800">
                            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">{t.calculationExample.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">{t.calculationExample.desc}</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* One-time Costs */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.onetimeTitle}
                    </h2>
                </div>

                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-100 dark:border-orange-900">
                    <CardContent className="p-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{t.onetimeDesc}</p>
                        <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-orange-200 dark:border-orange-800">
                            <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">{t.onetimeExample.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">{t.onetimeExample.desc}</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Continuous Costs */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.continuousTitle}
                    </h2>
                </div>

                <Card className="bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20 border-cyan-100 dark:border-cyan-900">
                    <CardContent className="p-6">
                        <p className="text-gray-700 dark:text-gray-300">{t.continuousDesc}</p>
                    </CardContent>
                </Card>
            </section>

            {/* Tips */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <Lightbulb className="h-6 w-6 text-amber-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.tipsTitle}
                    </h2>
                </div>
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-100 dark:border-amber-900">
                    <CardContent className="p-6">
                        <ul className="space-y-3">
                            {t.tips.map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-200 text-sm font-medium flex-shrink-0">
                                        {idx + 1}
                                    </span>
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
