
"use client";

import { Check, Zap, Server, Shield, Database, Layout, BookOpen, MessageSquare, Mail, Linkedin, AtSign, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { landingPageTranslations } from "@/lib/i18n/landing";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PricingSectionProps {
    language: "en" | "vi";
}

export function PricingSection({ language }: PricingSectionProps) {
    const t = landingPageTranslations.pricing[language];

    return (
        <section className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">

                {/* Header */}
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                        {t.badge}
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        {t.title}
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">
                        {t.subtitle}
                    </p>
                </div>

                {/* Self-hosted Option */}
                <div className="max-w-4xl mx-auto mb-16">
                    <Card className="bg-muted/50 border-dashed">
                        <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                <Layout className="h-6 w-6" />
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-1">
                                <h3 className="font-bold text-lg">{t.selfHostTitle}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {t.selfHostDesc}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                <Button size="sm" variant="outline" asChild className="gap-2">
                                    <Link href="/docs/clone-and-deploy">
                                        <Zap className="h-3.5 w-3.5" /> {t.installGuide}
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild className="gap-2">
                                    <Link href="/docs">
                                        <BookOpen className="h-3.5 w-3.5" /> {t.userGuide}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex justify-center mb-4 text-sm text-muted-foreground uppercase tracking-widest font-mono">
                    ----- Professional Deployment Service -----
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24 items-start">
                    {/* Basic Plan */}
                    <Card className="flex flex-col border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden h-full">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground px-4 py-1 rounded-b-lg text-xs font-semibold uppercase tracking-wider">
                            {t.basicPlan}
                        </div>
                        <CardHeader className="text-center pt-12 pb-8">
                            <div className="text-3xl font-bold">{t.basicPrice}</div>
                            <p className="text-sm text-muted-foreground">{t.paymentOneTime}</p>
                        </CardHeader>
                        <CardContent className="flex-1 px-8 pb-8">
                            <ul className="space-y-4">
                                {t.basicFeatures.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-1 h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="pb-8 px-8">
                            <Button asChild className="w-full" variant="outline" size="lg">
                                <Link href="/contact">{t.contactAdvise}</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Professional Plan */}
                    <Card className="flex flex-col border-primary shadow-lg relative overflow-hidden bg-primary text-primary-foreground h-full">
                        <div className="absolute top-0 right-0 bg-background text-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider">
                            {t.recommended}
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary-foreground/10 text-primary-foreground px-4 py-1 rounded-b-lg text-xs font-semibold uppercase tracking-wider">
                            {t.proPlan}
                        </div>
                        <CardHeader className="text-center pt-12 pb-8">
                            <div className="text-3xl font-bold">{t.proPrice}</div>
                            <p className="text-sm text-primary-foreground/80">{t.paymentOneTime}</p>
                        </CardHeader>
                        <CardContent className="flex-1 px-8 pb-8">
                            <ul className="space-y-4">
                                {t.proFeatures.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-1 h-4 w-4 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                                            <Check className="h-3 w-3 text-primary-foreground" />
                                        </div>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="pb-8 px-8">
                            <Button asChild className="w-full bg-background text-foreground hover:bg-background/90" size="lg">
                                <Link href="/contact">{t.contactNow}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Technical Info */}
                <div className="max-w-5xl mx-auto mb-24">
                    <div className="flex items-center justify-center gap-2 mb-10">
                        <Server className="h-5 w-5" />
                        <h3 className="text-xl font-bold">{t.techTitle}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border shadow-none bg-muted/20">
                            <CardContent className="pt-6 text-center space-y-2">
                                <div className="mx-auto w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary mb-4 border">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <h4 className="font-semibold text-sm text-muted-foreground">{t.tech1Title}</h4>
                                <div className="font-bold text-2xl">{t.tech1Value}</div>
                                <p className="text-xs text-muted-foreground px-4 text-balance">
                                    {t.tech1Desc}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border shadow-none bg-muted/20">
                            <CardContent className="pt-6 text-center space-y-2">
                                <div className="mx-auto w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary mb-4 border">
                                    <Database className="h-5 w-5" />
                                </div>
                                <h4 className="font-semibold text-sm text-muted-foreground">{t.tech2Title}</h4>
                                <div className="font-bold text-2xl">{t.tech2Value}</div>
                                <p className="text-xs text-muted-foreground px-4 text-balance">
                                    {t.tech2Desc}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border shadow-none bg-muted/20">
                            <CardContent className="pt-6 text-center space-y-2">
                                <div className="mx-auto w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary mb-4 border">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <h4 className="font-semibold text-sm text-muted-foreground">{t.tech3Title}</h4>
                                <div className="font-bold text-xl">{t.tech3Value}</div>
                                <p className="text-xs text-muted-foreground px-4 text-balance">
                                    {t.tech3Desc}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 p-4 bg-muted/30 rounded-lg text-xs text-center text-muted-foreground mx-auto max-w-3xl">
                        {t.disclaimer}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="max-w-3xl mx-auto text-center">
                    <h3 className="text-2xl font-bold mb-2">{t.contactTitle}</h3>
                    <p className="text-muted-foreground mb-8">{t.contactSubtitle}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a href="https://zalo.me/0359312806" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs text-muted-foreground">Zalo / Viber</div>
                                <div className="font-semibold">+84 359 312 806</div>
                            </div>
                        </a>

                        <a href="mailto:admin@manhhuynh.work" className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs text-muted-foreground">Email</div>
                                <div className="font-semibold">admin@manhhuynh.work</div>
                            </div>
                        </a>

                        <a href="https://threads.net/@manh.des.98" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                                <AtSign className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs text-muted-foreground">Threads</div>
                                <div className="font-semibold">@manh.des.98</div>
                            </div>
                        </a>

                        <a href="https://www.linkedin.com/in/manh-huynh-designer/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                                <Linkedin className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs text-muted-foreground">LinkedIn</div>
                                <div className="font-semibold">Manh Huynh</div>
                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}

