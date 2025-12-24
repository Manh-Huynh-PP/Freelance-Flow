"use client";

import { useState, useEffect } from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsLanguageProvider } from '@/contexts/DocsLanguageContext';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [language, setLanguage] = useState<'en' | 'vi'>('en');

    useEffect(() => {
        const stored = localStorage.getItem("freelance-flow-language");
        if (stored === "vi" || stored === "en") {
            setLanguage(stored);
        }
    }, []);

    const handleLanguageChange = (lang: 'en' | 'vi') => {
        setLanguage(lang);
        localStorage.setItem("freelance-flow-language", lang);
        // Dispatch custom event for docs pages to listen
        window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
    };

    return (
        <DocsLanguageProvider>
            <div className="flex flex-col min-h-screen">
                <LandingHeader language={language} onLanguageChange={handleLanguageChange} />

                <div className="flex-1 flex">
                    <DocsSidebar />

                    <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-auto">
                        <div className="max-w-4xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>

                <LandingFooter language={language} />
            </div>
        </DocsLanguageProvider>
    );
}
