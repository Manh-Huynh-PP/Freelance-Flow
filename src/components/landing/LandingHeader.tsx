"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingHeaderProps {
    language: "en" | "vi";
    onLanguageChange: (lang: "en" | "vi") => void;
    isLoggedIn?: boolean;
    heroCtaPrimary?: string;
}

export function LandingHeader({ language, onLanguageChange, isLoggedIn = false, heroCtaPrimary = "Get Started" }: LandingHeaderProps) {
    const handleLanguageChange = (lang: "en" | "vi") => {
        onLanguageChange(lang);
        if (typeof window !== 'undefined') {
            try {
                const storedSettings = localStorage.getItem("freelance-flow-settings");
                if (storedSettings) {
                    const parsed = JSON.parse(storedSettings);
                    parsed.language = lang;
                    localStorage.setItem("freelance-flow-settings", JSON.stringify(parsed));
                }
            } catch { }
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link className="flex items-center gap-2" href="/">
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
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/#features">
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
                                <Link href="/auth/register">{heroCtaPrimary}</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
