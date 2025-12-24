"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { docsTranslations } from '@/lib/i18n/docs-translations';
import { useDocsLanguage } from '@/contexts/DocsLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Copy, CheckCircle2, AlertCircle, Server, Cloud } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function CloneAndDeployPage() {
    const { language } = useDocsLanguage();
    const t = docsTranslations[language].cloneAndDeploy as any; // Using any to bypass strict type check for new fields
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto py-6">
            {/* Header */}
            <div className="space-y-4 border-b pb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-primary border-primary">v1.2</Badge>
                    <Badge variant="secondary">{language === 'vi' ? 'Kỹ thuật' : 'Technical'}</Badge>
                </div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {t.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                    {t.description}
                </p>
            </div>

            {/* Prerequisites */}
            <div className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {t.prerequisitesTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {t.prerequisites.map((req: any, index: number) => (
                        <Card key={index} className="bg-muted/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    {req.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{req.version}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {t.proTip && (
                <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
                        {t.proTip.title}
                    </h3>
                    <div className="text-sm text-blue-700 dark:text-blue-400">
                        <ReactMarkdown components={{
                            strong: ({ node, ...props }) => <span className="font-bold text-blue-900 dark:text-blue-200" {...props} />
                        }}>
                            {t.proTip.desc}
                        </ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Installation Steps */}
            <div className="space-y-8">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
                    {language === 'vi' ? 'Quy trình Cài đặt' : 'Installation Process'}
                </h2>

                <div className="grid gap-6">
                    {t.steps.map((step: any, index: number) => (
                        <Card key={index} className="overflow-hidden">
                            <CardHeader className="bg-muted/20 border-b pb-4">
                                <CardTitle className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    {step.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="text-base text-foreground">
                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.desc}</ReactMarkdown>
                                    </div>
                                </div>
                                {step.code && (
                                    <div className="relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-background"
                                                onClick={() => handleCopy(step.code, index)}
                                            >
                                                {copiedIndex === index ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed border border-slate-800">
                                            <div className="flex items-center gap-2 text-slate-400 mb-2 pb-2 border-b border-slate-800 text-xs select-none">
                                                <Terminal className="h-3 w-3" />
                                                bash
                                            </div>
                                            <code>{step.code}</code>
                                        </pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Deployment */}
            <div className="space-y-6">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
                    {t.deploymentTitle}
                </h2>
                <Tabs defaultValue="vercel" className="w-full">
                    <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="vercel" className="flex items-center gap-2">
                            <Cloud className="h-4 w-4" /> Vercel
                        </TabsTrigger>
                        <TabsTrigger value="manual" className="flex items-center gap-2">
                            <Server className="h-4 w-4" /> {language === 'vi' ? 'Thủ công' : 'Manual'}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="vercel" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.vercelTitle}</CardTitle>
                                <CardDescription>{t.deploymentDesc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    {t.vercelSteps.map((step: string, i: number) => (
                                        <li key={i} className="pl-2">
                                            <span dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="manual">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {language === 'vi'
                                            ? 'Để triển khai thủ công, hãy build ứng dụng bằng `npm run build` và start bằng `npm start`. Khuyến nghị sử dụng [PM2](https://pm2.keymetrics.io/) để quản lý process.'
                                            : 'For manual deployment, build the app using `npm run build` and start it with `npm start`. It is recommended to use [PM2](https://pm2.keymetrics.io/) for process management.'}
                                    </ReactMarkdown>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Troubleshooting */}
            {t.troubleshooting && (
                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
                        {t.troubleshootingTitle}
                    </h2>
                    <Accordion type="single" collapsible className="w-full">
                        {t.troubleshooting.map((item: any, index: number) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left font-medium">
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {item.title}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    <div className="p-3 bg-muted rounded-md text-sm">
                                        <span className="font-semibold text-foreground">{language === 'vi' ? 'Vấn đề:' : 'Problem:'} </span>
                                        {item.problem}
                                    </div>
                                    <div className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 rounded-md text-sm border border-green-500/20">
                                        <span className="font-semibold">{language === 'vi' ? 'Giải pháp:' : 'Solution:'} </span>
                                        {item.solution}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}
        </div>
    );
}
