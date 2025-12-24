"use client";

import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, Coffee, Armchair, CheckCircle2, Zap, Target, Battery, Focus } from 'lucide-react';

const cycleIconMap: Record<string, any> = {
    Timer,
    Coffee,
    Armchair
};

const benefitsIconMap: Record<string, any> = {
    Focus,
    Battery,
    Target,
    Zap
};

export default function PomodoroTheoryPage() {
    const { language } = useDocsLanguage();
    const t = (docsTranslations[language].theories as any).pomodoro;

    return (
        <div className="space-y-10 max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-3 border-b pb-6">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
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

            {/* Pomodoro Cycle */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Timer className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.cycleTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {t.cycle.map((phase: any, idx: number) => {
                        const Icon = cycleIconMap[phase.icon] || Timer;
                        return (
                            <Card key={idx} className="hover:shadow-md transition-shadow border-t-4 border-t-red-500">
                                <CardHeader className="text-center pb-3">
                                    <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-3">
                                        <Icon className="h-8 w-8 text-red-600 dark:text-red-400" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {phase.duration}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                        {phase.desc}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        );
                    })}
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
                            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
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
                    <Zap className="h-6 w-6 text-yellow-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t.benefitsTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.benefits.map((benefit: any, idx: number) => {
                        const Icon = benefitsIconMap[benefit.icon] || Zap;
                        return (
                            <Card key={idx} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                                            <Icon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <CardTitle className="text-lg">{benefit.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {benefit.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Best Practices */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-3">
                    {t.tipsTitle}
                </h2>
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-100 dark:border-red-900">
                    <CardContent className="p-6">
                        <ul className="space-y-3">
                            {t.tips.map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>

            {/* Applications */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-3">
                    {t.applicationTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {t.applications.map((app: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{app}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
