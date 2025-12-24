"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, LayoutGrid, DollarSign, BarChart3, Clock, Lock, Globe, Zap, Palette, Shield, Github } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { landingPageTranslations } from "@/lib/i18n/landing";
import { HeroBackground } from "./HeroBackground";
import { CreditsSection } from "./CreditsSection";
import { AnimatedLinesBackground } from "./AnimatedLinesBackground";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LandingPage() {
    const { session } = useAuth();
    const isLoggedIn = !!session;
    const [language, setLanguage] = useState<"en" | "vi">("en");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Track mouse position for animated lines
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Load language preference from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("freelance-flow-language");
        if (stored === "vi" || stored === "en") {
            setLanguage(stored);
        }
    }, []);

    // Save language preference to localStorage
    const handleLanguageChange = (lang: "en" | "vi") => {
        setLanguage(lang);
        localStorage.setItem("freelance-flow-language", lang);
    };

    // Get translations
    const t = landingPageTranslations[language];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Navbar */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <Link className="flex items-center justify-center gap-2" href="/">
                    <Image src="/icons/logo.png" alt="Freelance Flow Logo" width={32} height={32} className="h-8 w-8" />
                    <span className="font-bold text-lg hidden sm:inline-block">Freelance Flow</span>
                </Link>

                {/* Language Switcher - Compact */}
                <div className="ml-3 flex items-center gap-0.5 rounded-md border bg-muted p-0.5">
                    <button
                        className={cn(
                            "px-1.5 py-0.5 text-xs font-medium rounded transition-colors",
                            language === 'en' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                        )}
                        onClick={() => handleLanguageChange('en')}
                    >
                        EN
                    </button>
                    <button
                        className={cn(
                            "px-1.5 py-0.5 text-xs font-medium rounded transition-colors",
                            language === 'vi' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                        )}
                        onClick={() => handleLanguageChange('vi')}
                    >
                        VI
                    </button>
                </div>

                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
                        {language === "vi" ? "Tính năng" : "Features"}
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/docs">
                        {language === "vi" ? "Hướng dẫn" : "Docs"}
                    </Link>

                    {isLoggedIn ? (
                        <Button asChild size="sm" variant="default">
                            <Link href="/dashboard">
                                {language === "vi" ? "Bảng điều khiển" : "Dashboard"} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button asChild size="sm" variant="ghost">
                                <Link href="/auth/login">Login</Link>
                            </Button>
                            <Button asChild size="sm" variant="default">
                                <Link href="/auth/register">{t.heroCtaPrimary}</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
                    {/* Animated Background */}
                    <HeroBackground />

                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 pb-2">
                                    {t.heroTitle} <span className="text-primary">{t.heroSubtitle}</span>
                                </h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-gray-400">
                                    {t.heroDescription}
                                </p>
                            </div>
                            <div className="space-x-4">
                                {isLoggedIn ? (
                                    <Button asChild size="lg" className="h-11 px-8">
                                        <Link href="/dashboard">{language === "vi" ? "Vào Bảng điều khiển" : "Go to Dashboard"} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                    </Button>
                                ) : (
                                    <Button asChild size="lg" className="h-11 px-8">
                                        <Link href="/auth/register">{language === "vi" ? "Bắt đầu Miễn phí" : "Get Started Free"}</Link>
                                    </Button>
                                )}
                                <Button asChild variant="outline" size="lg" className="h-11 px-8">
                                    <Link href="#features">{language === "vi" ? "Tìm hiểu thêm" : "Learn More"}</Link>
                                </Button>
                                <Button asChild variant="secondary" size="lg" className="h-11 px-8">
                                    <Link href="/pricing">{language === "vi" ? "Dịch vụ setup" : "Setup Service"}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm border shadow-sm">
                                    {t.coreFeatures}
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t.featuresTitle}</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    {t.featuresSubtitle}
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 md:grid-cols-2 lg:grid-cols-2 lg:gap-12">
                            {/* Feature 1: Multiple View Modes */}
                            <Card className="flex flex-col h-full bg-background/60 backdrop-blur border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
                                <CardHeader>
                                    <LayoutGrid className="h-10 w-10 mb-2 text-primary" />
                                    <CardTitle>{t.feature1Title}</CardTitle>
                                    <CardDescription>
                                        {t.feature1Description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 flex-1">
                                    <p className="text-sm text-foreground/80">
                                        {language === "vi"
                                            ? "Kanban, Lịch, Gantt, Ma trận Eisenhower, và hơn thế nữa. Trực quan hóa quy trình làm việc theo cách bạn muốn."
                                            : "Kanban, Calendar, Gantt, Eisenhower Matrix, and more. Visualize your workflow exactly how you want."}
                                    </p>
                                    <div className="grid gap-2 mt-4 text-sm">
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature1Detail1}</span>
                                            <span className="text-xs text-muted-foreground">Drag & Drop</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature1Detail2}</span>
                                            <span className="text-xs text-muted-foreground">Timeline</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature1Detail3}</span>
                                            <span className="text-xs text-muted-foreground">Priority</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature1Detail4}</span>
                                            <span className="text-xs text-muted-foreground">Network</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feature 2: Quotes & Timeline */}
                            <Card className="flex flex-col h-full bg-background/60 backdrop-blur border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
                                <CardHeader>
                                    <DollarSign className="h-10 w-10 mb-2 text-primary" />
                                    <CardTitle>{t.feature2Title}</CardTitle>
                                    <CardDescription>
                                        {t.feature2Description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 flex-1">
                                    <p className="text-sm text-foreground/80">
                                        {language === "vi"
                                            ? "Tạo báo giá tích hợp với tiến độ dự án. Chia sẻ dễ dàng qua Link, Ảnh, hoặc xuất Excel."
                                            : "Generate quotes integrated with project timelines. Share them easily via Link, Image, or Excel export."}
                                    </p>
                                    <div className="grid gap-2 mt-4 text-sm">
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature2Detail1}</span>
                                            <span className="text-xs text-muted-foreground">Templates</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature2Detail2}</span>
                                            <span className="text-xs text-muted-foreground">Encrypted</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature2Detail3}</span>
                                            <span className="text-xs text-muted-foreground">PDF/Excel</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feature 3: Smart Analytics */}
                            <Card className="flex flex-col h-full bg-background/60 backdrop-blur border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
                                <CardHeader>
                                    <BarChart3 className="h-10 w-10 mb-2 text-primary" />
                                    <CardTitle>{t.feature3Title}</CardTitle>
                                    <CardDescription>
                                        {t.feature3Description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 flex-1">
                                    <p className="text-sm text-foreground/80">
                                        {language === "vi"
                                            ? "Theo dõi doanh thu, lợi nhuận, chi phí và năng suất. Để AI phân tích dữ liệu của bạn để tìm cơ hội tối ưu hóa."
                                            : "Track revenue, profit, costs, and productivity. Let AI analyze your data to find optimization opportunities."}
                                    </p>
                                    <div className="grid gap-2 mt-4 text-sm">
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature3Tag1}</span>
                                            <span className="text-xs text-muted-foreground">Real-time</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature3Tag2}</span>
                                            <span className="text-xs text-muted-foreground">Analytics</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature3Tag3}</span>
                                            <span className="text-xs text-muted-foreground">Smart</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feature 4: Productivity Tools */}
                            <Card className="flex flex-col h-full bg-background/60 backdrop-blur border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
                                <CardHeader>
                                    <Zap className="h-10 w-10 mb-2 text-primary" />
                                    <CardTitle>{t.feature4Title}</CardTitle>
                                    <CardDescription>
                                        {t.feature4Description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 flex-1">
                                    <p className="text-sm text-foreground/80">
                                        {language === "vi"
                                            ? "Tích hợp Pomodoro Timer và Theo dõi thời gian làm việc giúp bạn tập trung và tính phí chính xác từng phút."
                                            : "Integrated Pomodoro Timer and Work Time Tracker help you stay in the flow and account for every billable minute."}
                                    </p>
                                    <div className="grid gap-2 mt-4 text-sm">
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature4Detail1}</span>
                                            <span className="text-xs text-muted-foreground">Built-in Header</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature4Detail2}</span>
                                            <span className="text-xs text-muted-foreground">Auto-logging</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                            <span className="font-medium">{t.feature4Detail3}</span>
                                            <span className="text-xs text-muted-foreground">AI Powered</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center mt-12">
                            <Button asChild variant="outline" size="lg">
                                <Link href="/docs">
                                    {language === "vi" ? "Xem đầy đủ Hướng dẫn" : "View full Documentation"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Feature Visuals Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                {t.visualizeTitle}
                            </h2>
                            <p className="max-w-[700px] text-muted-foreground md:text-xl">
                                {t.visualizeSubtitle}
                            </p>
                        </div>

                        <div className="mx-auto max-w-5xl">
                            <Tabs defaultValue="kanban" className="w-full">
                                <div className="flex justify-center mb-8 overflow-x-auto pb-2">
                                    <TabsList>
                                        <TabsTrigger value="kanban">Kanban</TabsTrigger>
                                        <TabsTrigger value="calendar">Calendar</TabsTrigger>
                                        <TabsTrigger value="gantt">Gantt</TabsTrigger>
                                        <TabsTrigger value="eisenhower">Eisenhower</TabsTrigger>
                                        <TabsTrigger value="pert">PERT</TabsTrigger>
                                        <TabsTrigger value="table">Table</TabsTrigger>
                                    </TabsList>
                                </div>

                                <ViewModeImage value="kanban" src="/landing/screenshots/kanban-desktop.webp" alt="Kanban View" />
                                <ViewModeImage value="calendar" src="/landing/screenshots/calendar-desktop.webp" alt="Calendar View" />
                                <ViewModeImage value="gantt" src="/landing/screenshots/gantt-desktop.webp" alt="Gantt Chart View" />
                                <ViewModeImage value="eisenhower" src="/landing/screenshots/eisenhower-desktop.webp" alt="Eisenhower Matrix" />
                                <ViewModeImage value="pert" src="/landing/screenshots/pert-desktop.webp" alt="PERT Chart" />
                                <ViewModeImage value="table" src="/landing/screenshots/table-desktop.webp" alt="Table View" />
                            </Tabs>
                        </div>
                    </div>
                </section>





                {/* Open Source Section */}
                <section id="open-source" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-muted/50">
                    <AnimatedLinesBackground mouseX={mousePosition.x} mouseY={mousePosition.y} />

                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="flex flex-col items-center justify-center space-y-8 text-center">
                            <div className="space-y-4 max-w-3xl">
                                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm border border-primary/20">
                                    {t.openSourceTitle}
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    {t.openSourceSubtitle}
                                </h2>
                                <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                                    {t.openSourceDesc}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                                <Button asChild size="lg" className="gap-2 min-w-[200px]">
                                    <Link href="https://github.com/manhhuynh-designer/Freelance-Flow" target="_blank" rel="noopener noreferrer">
                                        <Github className="h-5 w-5" />
                                        {t.openSourceButton}
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="gap-2 min-w-[200px]">
                                    <Link href="https://coffee.manhhuynh.work" target="_blank" rel="noopener noreferrer">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
                                        </svg>
                                        {t.buyMeACoffee}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Credits Section */}
                <CreditsSection language={language} />

                {/* Footer */}
                <footer className="w-full py-6 border-t px-4 md:px-6">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                        <p className="text-sm text-muted-foreground">
                            © 2025 Freelance Flow. {t.footerDesignedBy}.
                        </p>
                        <div className="flex gap-4">
                            <Link className="text-sm text-muted-foreground hover:underline" href="/privacy">
                                {t.footerPrivacy}
                            </Link>
                            <Link className="text-sm text-muted-foreground hover:underline" href="/terms">
                                {t.footerTerms}
                            </Link>
                            <Link className="text-sm text-muted-foreground hover:underline" href="/contact">
                                {t.footerContact}
                            </Link>
                        </div>
                    </div>
                </footer>
            </main>
        </div >
    );
}

function FeatureHighlight({ icon: Icon, text, description }: { icon: any, text: string, description: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/30 cursor-help hover:bg-muted/50 transition-colors">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium">{text}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function ViewModeImage({ value, src, alt }: { value: string, src: string, alt: string }) {
    return (
        <TabsContent value={value} className="mt-0">
            <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted/50 shadow-xl">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                    priority={value === 'kanban'}
                />
            </div>
        </TabsContent>
    );
}
