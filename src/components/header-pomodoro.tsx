import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pause, Maximize2, Timer } from 'lucide-react';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { FullscreenPomodoro } from '@/app/dashboard/widgets/pomodoro';
import type { AppSettings } from '@/lib/types';
import { i18n } from '@/lib/i18n';

export function PomodoroHeaderControl({ settings }: { settings: AppSettings }) {
    const pomodoro = usePomodoroTimer({ initialSettings: { work: 25, break: 5 } });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const T = i18n[settings.language];
    const widgetConfig = settings.widgets?.find(w => w.id === 'pomodoro');
    const originalTitleRef = useRef<string>('');

    // Update document title when timer is active
    useEffect(() => {
        if (!originalTitleRef.current) {
            originalTitleRef.current = document.title;
        }

        if (pomodoro.isActive) {
            const sessionLabel = pomodoro.sessionType === 'work' ? '🍅' : '☕';
            document.title = `${sessionLabel} ${pomodoro.formatTime(pomodoro.timeRemaining)}`;
        } else {
            document.title = originalTitleRef.current;
        }

        return () => {
            document.title = originalTitleRef.current;
        };
    }, [pomodoro.isActive, pomodoro.timeRemaining, pomodoro.sessionType, pomodoro.formatTime]);

    if (widgetConfig && !widgetConfig.enabled) return null;

    // Dynamic colors based on session type when active
    const getContainerStyle = () => {
        if (!pomodoro.isActive) return {};
        if (pomodoro.sessionType === 'work') return { backgroundColor: '#ef4444', borderColor: '#ef4444' };
        if (pomodoro.sessionType === 'break') return { backgroundColor: '#10b981', borderColor: '#10b981' };
        return {};
    };

    const activeTextClass = pomodoro.isActive ? 'text-white' : '';
    const activeIconClass = pomodoro.isActive ? 'text-white' : 'text-muted-foreground';
    const activeButtonClass = pomodoro.isActive ? 'text-white hover:bg-white/20' : 'hover:bg-muted';
    const activeDividerClass = pomodoro.isActive ? 'divide-white/30' : 'divide-border';

    return (
        <>
            <TooltipProvider>
                <div
                    className={`inline-flex items-stretch rounded-2xl overflow-hidden border-2 shadow-sm ${activeDividerClass} transition-colors duration-300`}
                    style={getContainerStyle()}
                >
                    <div className="flex items-center gap-1 px-3 py-1.5">
                        <Timer className={`h-4 w-4 ${activeIconClass}`} />
                        <span className={`font-mono font-semibold text-sm tabular-nums ${activeTextClass}`}>
                            {pomodoro.formatTime(pomodoro.timeRemaining)}
                        </span>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-9 w-10 rounded-none ${activeButtonClass}`}
                                onClick={pomodoro.toggle}
                            >
                                {pomodoro.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{pomodoro.isActive ? 'Pause' : 'Play'}</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-9 w-10 rounded-none ${activeButtonClass}`}
                                onClick={() => setIsFullscreen(true)}
                            >
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Fullscreen</p></TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
            {isFullscreen && (
                <FullscreenPomodoro
                    T={T}
                    timeRemaining={pomodoro.timeRemaining}
                    isActive={pomodoro.isActive}
                    sessionType={pomodoro.sessionType}
                    toggle={pomodoro.toggle}
                    reset={pomodoro.reset}
                    skipSession={pomodoro.skipSession}
                    formatTime={pomodoro.formatTime}
                    onClose={() => setIsFullscreen(false)}
                />
            )}
        </>
    );
}
