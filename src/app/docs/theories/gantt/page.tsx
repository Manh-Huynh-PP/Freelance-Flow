"use client";

import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function GanttTheoryPage() {
    const { language } = useDocsLanguage();
    const t = (docsTranslations[language] as any).theories?.gantt;

    return (
        <div className="space-y-10 max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-3 border-b pb-6">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        {language === 'vi' ? 'Lý thuyết' : 'Theory'}
                    </Badge>
                </div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                    {t.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                    {t.description}
                </p>
            </div>

            {/* Screenshot */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border shadow-lg">
                <Image
                    src="/landing/screenshots/gantt-desktop.webp"
                    alt="Gantt Chart View"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Components */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.componentsTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.components.map((component: any, idx: number) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    {component.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {component.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Usage Steps */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-3">
                    {t.usageTitle}
                </h2>
                <div className="space-y-3">
                    {t.usageSteps.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border">
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {idx + 1}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.benefitsTitle}
                    </h2>
                </div>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-900">
                    <CardContent className="p-6">
                        <ul className="space-y-3">
                            {t.benefits.map((benefit: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
