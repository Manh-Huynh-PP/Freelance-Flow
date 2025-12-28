"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Code, FileText, Layers, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocsLanguage } from "@/contexts/DocsLanguageContext";
import { docsTranslations } from "@/lib/i18n/docs-translations";

export function DocsSidebar() {
    const pathname = usePathname();
    const { language } = useDocsLanguage();

    // Cast to any to access sidebar property safely if types aren't fully updated yet
    const t = (docsTranslations[language] as any).sidebar;

    const docsLinks = [
        {
            title: t?.gettingStarted || "Getting Started",
            icon: Book,
            items: [
                { title: t?.intro || "Introduction", href: "/docs" },
                { title: t?.cloneDeploy || "Clone & Deploy", href: "/docs/clone-and-deploy" },
            ],
        },
        {
            title: t?.userManual || "User Manual",
            icon: FileText,
            items: [
                { title: t?.dashboard || "Dashboard Overview", href: "/docs/manual/dashboard" },
                { title: t?.quotes || "Managing Quotes", href: "/docs/manual/quotes" },
                { title: t?.analysis || "Project Analysis", href: "/docs/manual/analysis" },
                { title: t?.widgets || "Widgets", href: "/docs/manual/widgets" },
                { title: t?.shared || "Shared Views", href: "/docs/manual/shared" },
                { title: t?.backup || "Backup & Restore", href: "/docs/manual/backup" },
            ],
        },
        {
            title: t?.theories || "View Theories",
            icon: Layers,
            items: [
                { title: t?.kanban || "Agile & Kanban", href: "/docs/theories/kanban" },
                { title: t?.gantt || "Gantt Charts", href: "/docs/theories/gantt" },
                { title: t?.eisenhower || "Eisenhower Matrix", href: "/docs/theories/eisenhower" },
                { title: t?.pert || "PERT Analysis", href: "/docs/theories/pert" },
                { title: t?.pomodoro || "Pomodoro Technique", href: "/docs/theories/pomodoro" },
            ],
        },
        {
            title: t?.business || "Business Logic",
            icon: TrendingUp,
            items: [
                { title: t?.financials || "Financial Calculations", href: "/docs/business/financials" },
                { title: t?.timeTracking || "Productivity Analysis", href: "/docs/business/time-tracking" },
                { title: t?.fixedCosts || "Fixed Cost Guide", href: "/docs/business/fixed-costs" },
            ],
        },
    ];

    return (
        <aside className="w-64 border-r bg-muted/40 p-4 hidden md:block">
            <div className="h-full py-6 pr-6 lg:py-8">
                <div className="w-full">
                    {docsLinks.map((group, index) => (
                        <div key={index} className="pb-4">
                            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold flex items-center gap-2">
                                <group.icon className="h-4 w-4" />
                                {group.title}
                            </h4>
                            <div className="grid grid-flow-row auto-rows-max text-sm">
                                {group.items.map((item, itemIndex) => (
                                    <Link
                                        key={itemIndex}
                                        href={item.href}
                                        className={cn(
                                            "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground",
                                            pathname === item.href
                                                ? "font-medium text-foreground underline"
                                                : ""
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
