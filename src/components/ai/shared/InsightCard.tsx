'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export interface InsightItem {
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    insight: string;
    suggestion: string;
    justification?: string;
}

interface InsightCardProps {
    insight: InsightItem;
    onApply?: () => void;
    className?: string;
}

export function InsightCard({ insight, onApply, className }: InsightCardProps) {
    const getSeverityColor = (s: string) => {
        switch (s) {
            case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    const getIcon = (cat: string) => {
        if (cat.toLowerCase().includes('risk')) return <AlertTriangle className="w-5 h-5" />;
        if (cat.toLowerCase().includes('optimize')) return <TrendingUp className="w-5 h-5" />;
        return <Lightbulb className="w-5 h-5" />;
    };

    return (
        <Card className={`group relative overflow-hidden transition-all hover:shadow-md ${className}`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${getSeverityColor(insight.severity).replace('bg-', 'bg-').split(' ')[0]}`} />
            <CardHeader className="pb-2 pl-6">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className={`${getSeverityColor(insight.severity)} capitalize`}>
                        {insight.category}
                    </Badge>
                    {getIcon(insight.category)}
                </div>
                <CardTitle className="text-base font-medium mt-2 leading-tight">
                    {insight.insight}
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-6 pb-4">
                <p className="text-sm text-muted-foreground mb-3">
                    {insight.suggestion}
                </p>

                {insight.justification && (
                    <p className="text-xs text-muted-foreground/70 italic border-l-2 pl-2 mb-3">
                        "{insight.justification}"
                    </p>
                )}

                {onApply && (
                    <Button variant="ghost" size="sm" onClick={onApply} className="p-0 h-auto text-primary hover:text-primary/80 group-hover:translate-x-1 transition-transform">
                        Take Action <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
