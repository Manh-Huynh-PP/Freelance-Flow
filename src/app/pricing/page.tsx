"use client";

import { useState, useEffect } from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingSection } from "@/components/landing/PricingSection";
import { useAuth } from "@/hooks/useAuth";
import { landingPageTranslations } from "@/lib/i18n/landing";

export default function PricingPage() {
    const { session } = useAuth();
    const isLoggedIn = !!session;
    const [language, setLanguage] = useState<"en" | "vi">("en");

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

    const t = landingPageTranslations[language];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <LandingHeader
                language={language}
                onLanguageChange={handleLanguageChange}
                isLoggedIn={isLoggedIn}
                heroCtaPrimary={t.heroCtaPrimary}
            />

            <main className="flex-1">
                <PricingSection language={language} />
            </main>

            <LandingFooter language={language} />
        </div>
    );
}
