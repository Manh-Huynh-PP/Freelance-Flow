"use client";

import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid2X2, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function EisenhowerTheoryPage() {
    const { language } = useDocsLanguage();
    const t = (docsTranslations[language].theories as any).eisenhower;

    const colorMap: Record<string, string> = {
        "Red": "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800",
        "Đỏ": "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800",
        "Blue": "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800",
        "Xanh dương": "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800",
        "Yellow": "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-800",
        "Vàng": "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-800",
        "Gray": "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700",
        "Xám": "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
    };

    return (
        <div className="space-y-10 max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-3 border-b pb-6">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
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
                    src="/landing/screenshots/eisenhower-desktop.webp"
                    alt="Eisenhower Matrix View"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Note Card */}
            {t.note && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
                                    {language === 'vi' ? 'Lưu ý' : 'Note'}
                                </h3>
                                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                                    {t.note}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Four Quadrants */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <Grid2X2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.quadrantsTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.quadrants.map((quadrant: any, idx: number) => (
                        <Card key={idx} className={`border-2 ${colorMap[quadrant.color] || 'bg-gray-100'}`}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">
                                    {quadrant.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {quadrant.desc}
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
                            <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {idx + 1}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tips */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.tipsTitle}
                    </h2>
                </div>
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-100 dark:border-amber-900">
                    <CardContent className="p-6">
                        <ul className="space-y-3">
                            {t.tips.map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
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
