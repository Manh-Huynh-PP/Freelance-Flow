"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { landingPageTranslations } from "@/lib/i18n/landing";

const libraries = [
    { name: "Next.js", url: "https://nextjs.org/", version: "16.0" },
    { name: "React", url: "https://react.dev/", version: "18.3" },
    { name: "Tailwind CSS", url: "https://tailwindcss.com/", version: "3.4" },
    { name: "Supabase", url: "https://supabase.com/", version: "2.8" },
    { name: "Radix UI", url: "https://www.radix-ui.com/", version: "1.0" },
    { name: "Lucide React", url: "https://lucide.dev/", version: "0.47" },
    { name: "Recharts", url: "https://recharts.org/", version: "2.15" },
    { name: "React Flow", url: "https://reactflow.dev/", version: "11.1" },
    { name: "dnd-kit", url: "https://dndkit.com/", version: "6.3" },
    { name: "React Hook Form", url: "https://react-hook-form.com/", version: "7.5" },
    { name: "Zod", url: "https://zod.dev/", version: "3.24" },
    { name: "Tiptap", url: "https://tiptap.dev/", version: "3.0" }
];

interface CreditsSectionProps {
    language: "en" | "vi";
}

export function CreditsSection({ language }: CreditsSectionProps) {
    const t = landingPageTranslations[language];

    return (
        <section id="credits" className="w-full py-12 md:py-24 bg-background relative overflow-hidden border-t">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm border border-primary/20">
                        {t.creditsTitle}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        {t.creditsSubtitle}
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-lg">
                        {t.creditsDesc}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {libraries.map((lib) => (
                        <Link
                            key={lib.name}
                            href={lib.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/30 hover:bg-primary/10 hover:border-primary/30 transition-all"
                        >
                            <span className="font-medium text-sm">{lib.name}</span>
                            <span className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">v{lib.version}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
