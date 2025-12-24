"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'vi';

interface DocsLanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const DocsLanguageContext = createContext<DocsLanguageContextType | undefined>(undefined);

export function DocsLanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        // Listen for language changes from localStorage
        const stored = localStorage.getItem("freelance-flow-language");
        if (stored === "vi" || stored === "en") {
            setLanguage(stored);
        }

        // Listen for storage events (when language changes in another component)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "freelance-flow-language" && (e.newValue === "vi" || e.newValue === "en")) {
                setLanguage(e.newValue);
            }
        };

        // Custom event listener for same-window changes
        const handleLanguageChange = (e: Event) => {
            const customEvent = e as CustomEvent<Language>;
            setLanguage(customEvent.detail);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('languageChange', handleLanguageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('languageChange', handleLanguageChange);
        };
    }, []);

    return (
        <DocsLanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </DocsLanguageContext.Provider>
    );
}

export function useDocsLanguage() {
    const context = useContext(DocsLanguageContext);
    if (context === undefined) {
        throw new Error('useDocsLanguage must be used within a DocsLanguageProvider');
    }
    return context;
}
