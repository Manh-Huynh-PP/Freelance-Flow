"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Rocket, Laptop, Database, Globe, Server, Cloud, Check, XCircle, AlertTriangle } from 'lucide-react';

export default function DocsPage() {
    const { language } = useDocsLanguage();
    const t = docsTranslations[language].intro;

    return (
        <div className="space-y-12 max-w-5xl mx-auto py-6">
            {/* Hero Section */}
            <div className="space-y-4 text-center sm:text-left border-b pb-8">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {t.title}
                </h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
                    {t.description}
                </p>
            </div>

            {/* Why Freelance Flow */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        {t.whatIsTitle}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t.whatIsDesc}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {t.features.map((feature, index) => (
                        <Card key={index} className="hover:bg-accent/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Deployment Options Comparison */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        {t.gettingStartedTitle}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t.gettingStartedDesc}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(t.gettingStartedOptions as any[]).map((opt, index) => (
                        <Card key={index} className="flex flex-col border-2 hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    {opt.type === 'self-hosted' ? (
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                                            <Server className="h-6 w-6" />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-300">
                                            <Cloud className="h-6 w-6" />
                                        </div>
                                    )}
                                    {opt.title}
                                </CardTitle>
                                <CardDescription className="text-base pt-2">
                                    {opt.desc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-6">
                                {/* Pros */}
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600 dark:text-green-400">
                                        <Check className="h-4 w-4" /> Benefits
                                    </h4>
                                    <ul className="space-y-2">
                                        {opt.pros?.map((pro: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                <span>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Cons */}
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                        <XCircle className="h-4 w-4" /> Considerations
                                    </h4>
                                    <ul className="space-y-2">
                                        {opt.cons?.map((con: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                                                <span>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Limits */}
                                {opt.limit && (
                                    <div className="mt-auto pt-4 border-t">
                                        <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                                            <AlertTriangle className="h-4 w-4" />
                                            <span>Limit: {opt.limit}</span>
                                        </div>
                                    </div>
                                )}

                                <Button asChild size="lg" className="w-full mt-2">
                                    <Link href={opt.link}>
                                        {opt.btnText || (language === 'vi' ? 'Xem hướng dẫn' : 'View Guide')}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* System Requirements */}
            <div className="space-y-6">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    {t.keyFeaturesTitle}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {t.keyFeatures.map((req, index) => (
                        <div key={index} className="flex flex-col p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                            <span className="font-semibold flex items-center gap-2 mb-1">
                                {index === 0 && <Globe className="h-4 w-4" />}
                                {index === 1 && <Database className="h-4 w-4" />}
                                {index === 2 && <Laptop className="h-4 w-4" />}
                                {req.title}
                            </span>
                            <span className="text-sm text-muted-foreground">{req.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-lg border text-center">
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-slate dark:prose-invert max-w-none mx-auto">
                    {t.closingMessage}
                </ReactMarkdown>
            </div>
        </div>
    );
}
