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
    Download,
    Upload,
    RefreshCcw,
    AlertTriangle,
    Lightbulb,
    FileSpreadsheet,
    FileJson,
    Merge,
    Replace,
    Clock,
    History,
    ShieldCheck,
    Star
} from "lucide-react";

export default function BackupRestorePage() {
    const { language } = useDocsLanguage();
    const t = (docsTranslations[language] as any).manual?.backup;

    if (!t) return null;

    return (
        <div className="space-y-10 max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-3 border-b pb-6">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        {language === 'vi' ? 'Hướng dẫn' : 'Manual'}
                    </Badge>
                </div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                    {t.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                    {t.description}
                </p>
            </div>

            {/* Export Data */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.exportTitle}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.exportDesc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.exportFormats.map((format: any, idx: number) => (
                        <Card key={idx} className={`hover:shadow-md transition-shadow ${format.recommended ? 'border-2 border-green-500' : ''}`}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    {idx === 0 ? <FileSpreadsheet className="h-5 w-5 text-green-600" /> : <FileJson className="h-5 w-5 text-blue-600" />}
                                    <CardTitle className="text-lg">{format.name}</CardTitle>
                                    {format.recommended && (
                                        <Badge className="bg-green-500 ml-2">
                                            <Star className="h-3 w-3 mr-1" />
                                            {language === 'vi' ? 'Khuyên dùng' : 'Recommended'}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{format.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Import Data */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.importTitle}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.importDesc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.importModes.map((mode: any, idx: number) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    {mode.icon === 'Merge' ? <Merge className="h-5 w-5 text-blue-600" /> : <Replace className="h-5 w-5 text-orange-600" />}
                                    <CardTitle className="text-lg">{mode.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{mode.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Auto Backup */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <RefreshCcw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.autoBackupTitle}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.autoBackupDesc}</p>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-100 dark:border-purple-900">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {t.autoBackupFeatures.map((feature: any, idx: number) => {
                                const icons = [Clock, History, ShieldCheck];
                                const Icon = icons[idx] || Clock;
                                return (
                                    <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-purple-200 dark:border-purple-800">
                                        <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-purple-700 dark:text-purple-300">{feature.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Danger Zone */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {t.dangerZoneTitle}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.dangerZoneDesc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.clearOptions.map((option: any, idx: number) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-red-700 dark:text-red-300">{option.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Best Practices */}
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
                                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                        {idx + 1}
                                    </div>
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
