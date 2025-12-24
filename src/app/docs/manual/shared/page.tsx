"use client";

import React from "react";
import { useDocsLanguage } from "@/contexts/DocsLanguageContext";
import { docsTranslations } from "@/lib/i18n/docs-translations";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Layout,
    FileText,
    Calendar,
    Link,
    Settings,
    Send,
    Eye,
    Download,
    Smartphone,
    ShieldCheck,
    Share2,
    FileDown,
    Image,
    MousePointerClick,
    ArrowRight,
    Briefcase,
    Unlock
} from "lucide-react";

// Map icon strings to React components
const iconMap: Record<string, React.ElementType> = {
    Layout,
    FileText,
    Calendar,
    Link,
    Settings,
    Send,
    Eye,
    Download,
    Smartphone,
    ShieldCheck,
    Share2,
    FileDown,
    Image,
    MousePointerClick,
    ArrowRight,
    Briefcase,
    Unlock
};

export default function SharedManualPage() {
    const { language } = useDocsLanguage();
    const t = (docsTranslations[language].manual as any).shared;

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        Feature
                    </Badge>
                    <span className="text-sm text-gray-500 font-medium">Coming Soon</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                    {t.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                    {t.description}
                </p>
            </div>

            {/* Sharing Methods */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Share2 className="w-6 h-6 text-blue-500" />
                    {t.methodsTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {t.methods.map((method: any, idx: number) => {
                        const Icon = iconMap[method.icon] || Layout;
                        return (
                            <Card key={idx} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow border-t-4 border-t-blue-500 rounded-xl overflow-hidden">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-lg font-bold">{method.title}</CardTitle>
                                    <CardDescription className="text-sm mt-2">{method.desc}</CardDescription>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* How to Share Steps */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Settings className="w-6 h-6 text-indigo-500" />
                    {t.stepsTitle}
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {t.steps.map((step: any, idx: number) => {
                            const Icon = iconMap[step.icon] || Settings;
                            return (
                                <div key={idx} className="relative flex flex-col items-center text-center space-y-4">
                                    {/* Connector Line */}
                                    {idx !== t.steps.length - 1 && (
                                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />
                                    )}

                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-800">
                                        <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {idx + 1}. {step.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                                        {step.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Client View Features */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Eye className="w-6 h-6 text-green-500" />
                    {t.clientViewTitle}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {t.clientFeatures.map((item: any, idx: number) => {
                        const Icon = iconMap[item.icon] || Eye;
                        return (
                            <Card key={idx} className="bg-white dark:bg-gray-800 border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all">
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {item.text}
                                    </span>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>
        </div>
    );
}
