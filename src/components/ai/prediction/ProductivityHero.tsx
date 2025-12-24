'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, CheckCircle2, Zap } from 'lucide-react';

interface ProductivityHeroProps {
    score: number;
    focusTime: number; // hours
    completedTasks: number;
    onTrackPercentage: number;
}

export function ProductivityHero({ score, focusTime, completedTasks, onTrackPercentage }: ProductivityHeroProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Main Score Card */}
            <Card className="md:col-span-1 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 flex flex-col items-center justify-center p-6 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Zap className="w-24 h-24" />
                </div>
                <div className="relative">
                    <div className="text-5xl font-bold tracking-tighter text-primary">{score}</div>
                    <div className="absolute -top-2 -right-4 text-xs font-bold bg-background shadow-sm px-1.5 py-0.5 rounded-full border text-muted-foreground">/100</div>
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-center">Productivity Health</div>
            </Card>

            {/* Stats Grid */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    icon={<Clock className="w-5 h-5 text-blue-500" />}
                    label="Focus Hours"
                    value={`${focusTime.toFixed(1)}h`}
                    subtext="This Week"
                />
                <StatCard
                    icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                    label="Tasks Done"
                    value={completedTasks.toString()}
                    subtext="Last 7 Days"
                />
                <StatCard
                    icon={<Target className="w-5 h-5 text-purple-500" />}
                    label="On Track"
                    value={`${onTrackPercentage}%`}
                    subtext="Deadline Accuracy"
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
