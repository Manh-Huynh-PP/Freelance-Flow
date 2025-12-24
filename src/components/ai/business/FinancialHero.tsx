'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancialHeroProps {
    netProfit: number;
    revenue: number;
    expenses: number;
    margin: number;
    currency: string;
}

export function FinancialHero({ netProfit, revenue, expenses, margin, currency = 'USD' }: FinancialHeroProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Main Profit Card */}
            <Card className={cn(
                "md:col-span-1 flex flex-col items-center justify-center p-6 space-y-2 relative overflow-hidden bg-gradient-to-br border-primary/20",
                netProfit >= 0 ? "from-emerald-500/10 to-transparent" : "from-red-500/10 to-transparent"
            )}>
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <DollarSign className="w-24 h-24" />
                </div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Net Profit</span>
                <div className={cn("text-4xl font-bold tracking-tighter", netProfit >= 0 ? "text-emerald-500" : "text-red-500")}>
                    {formatCurrency(netProfit)}
                </div>
                <div className={cn("text-xs px-2 py-0.5 rounded-full border bg-background/50", netProfit >= 0 ? "text-emerald-500 border-emerald-500/30" : "text-red-500 border-red-500/30")}>
                    {margin}% Margin
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                    label="Total Revenue"
                    value={formatCurrency(revenue)}
                    subtext="Gross Income"
                />
                <StatCard
                    icon={<TrendingDown className="w-5 h-5 text-orange-500" />}
                    label="Total Costs"
                    value={formatCurrency(expenses)}
                    subtext="Expenses & COGS"
                />
                <StatCard
                    icon={<Wallet className="w-5 h-5 text-purple-500" />}
                    label="Runway (Est.)"
                    value={expenses > 0 ? `${(Math.max(0, netProfit) / (expenses / 30)).toFixed(1)} Days` : "∞"}
                    subtext="Based on current monthly avg"
                />
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, subtext }: { icon: any, label: string, value: string, subtext: string }) {
    return (
        <Card className="flex flex-col justify-center p-5 hover:bg-muted/30 transition-colors cursor-default">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-background rounded-full shadow-sm border">{icon}</div>
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        </Card>
    );
}
