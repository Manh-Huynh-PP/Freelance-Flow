"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AppSettings } from '@/lib/types';
import { i18n } from '@/lib/i18n';
import { Timer, Play, Pause, RefreshCw, MoreVertical, SkipForward, Expand, Minimize } from 'lucide-react';
import { usePomodoroTimer, type PomodoroSessionType } from '@/hooks/usePomodoroTimer';
import { useDashboard } from '@/contexts/dashboard-context';

type PomodoroProps = {
  settings: AppSettings;
}

export const FullscreenPomodoro = ({ T, timeRemaining, isActive, sessionType, toggle, reset, skipSession, formatTime, onClose }: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const getBackgroundColor = () => {
    if (!isActive) return 'hsl(var(--background))';
    if (sessionType === 'work') return '#ef4444';
    if (sessionType === 'break') return '#10b981';
    return 'hsl(var(--background))';
  };

  const textColorClass = isActive ? 'text-white' : 'text-foreground';
  const sessionLabel = sessionType === 'work' ? T.pomodoroWork || 'Work' : T.pomodoroBreak || 'Break';

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="w-full h-full flex flex-col items-center justify-center transition-colors duration-500"
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <div className="absolute top-8 right-8">
          <Button
            variant="ghost"
            size="icon"
            className={`h-10 w-10 rounded-full ${isActive ? 'text-white hover:bg-white/20' : 'hover:bg-muted'}`}
            onClick={onClose}
          >
            <Minimize className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-12">
          <div className={`text-sm font-medium uppercase tracking-widest ${textColorClass} opacity-70`}>
            {sessionLabel}
          </div>

          <div className={`font-mono font-bold ${textColorClass} text-[8rem] md:text-[12rem] leading-none tabular-nums`}>
            {formatTime(timeRemaining)}
          </div>

          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className={`h-12 w-12 rounded-full ${isActive ? 'text-white hover:bg-white/20' : 'hover:bg-muted'}`}
              onClick={() => reset()}
            >
              <RefreshCw className="h-6 w-6" />
            </Button>

            <Button
              variant={isActive ? "secondary" : "default"}
              size="icon"
              onClick={toggle}
              className={`h-20 w-20 rounded-full ${isActive ? 'bg-white text-foreground hover:bg-white/90' : ''}`}
            >
              {isActive ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`h-12 w-12 rounded-full ${isActive ? 'text-white hover:bg-white/20' : 'hover:bg-muted'}`}
              onClick={() => skipSession()}
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


export function PomodoroWidget({ settings: appSettings }: PomodoroProps) {
  const T = i18n[appSettings.language];
  const { workTime } = useDashboard() as any;
  const pomodoro = usePomodoroTimer({
    initialSettings: { work: 25, break: 5 }, // Có thể lấy từ appSettings sau
    onSessionComplete: (sessionType, durationMinutes) => {
      if (sessionType === 'work') {
        workTime.savePomodoroSession(durationMinutes);
      }
    }
  });
  const [localSettings, setLocalSettings] = useState(pomodoro.settings);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSettingsSave = () => pomodoro.updateSettings(localSettings);

  const sessionTitles: Record<PomodoroSessionType, string> = {
    work: T.pomodoroWork,
    break: T.pomodoroBreak,
  };

  const getBackgroundColor = () => {
    if (!pomodoro.isActive) return 'transparent'; // White
    if (pomodoro.sessionType === 'work') return '#cb4848ff'; // Pastel Red
    if (pomodoro.sessionType === 'break') return '#3bb86fff';
    return 'transparent';
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: getBackgroundColor(),
    transition: 'background-color 0.3s ease',
  };


  return (
    <>
      <Card className="w-full h-full flex flex-col" style={cardStyle}>
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Timer className={`h-4 w-4 mr-2 ${pomodoro.isActive ? 'text-white' : 'text-muted-foreground'}`} />
              <CardTitle className={`text-sm font-normal ${pomodoro.isActive ? 'text-white' : 'text-muted-foreground'}`}>
                {(T as any).pomodoroWidgetName} - {sessionTitles[pomodoro.sessionType]}
              </CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Dialog onOpenChange={() => setLocalSettings(pomodoro.settings)}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className={`h-6 w-6 ${pomodoro.isActive ? 'text-white hover:bg-white/10' : ''}`}><MoreVertical className="h-4 w-4" /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{T.pomodoroSettings}</DialogTitle>
                    <DialogDescription>{T.pomodoroSettingsDesc}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="work-duration">{T.pomodoroWorkMinutes}</Label>
                      <Input id="work-duration" type="number" value={localSettings.work} onChange={(e) => setLocalSettings({ ...localSettings, work: parseInt(e.target.value, 10) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break-duration">{T.pomodoroBreakMinutes}</Label>
                      <Input id="break-duration" type="number" value={localSettings.break} onChange={(e) => setLocalSettings({ ...localSettings, break: parseInt(e.target.value, 10) || 0 })} />
                    </div>
                  </div>
                  <DialogFooter><DialogTrigger asChild><Button onClick={handleSettingsSave}>{T.save}</Button></DialogTrigger></DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" className={`h-6 w-6 ${pomodoro.isActive ? 'text-white hover:bg-white/10' : ''}`} onClick={() => setIsFullscreen(true)}>
                <Expand className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center space-y-4 react-grid-draggable-cancel">
          <p className={`font-bold font-mono text-6xl ${pomodoro.isActive ? 'text-white' : 'text-foreground'}`}>
            {pomodoro.formatTime(pomodoro.timeRemaining)}
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={pomodoro.reset} className={`${pomodoro.isActive ? 'text-white hover:bg-white/10' : ''}`}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={pomodoro.toggle} className={`h-16 w-16 ${pomodoro.isActive ? 'text-white hover:bg-white/10' : ''}`}>
              {pomodoro.isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => pomodoro.skipSession()} className={`${pomodoro.isActive ? 'text-white hover:bg-white/10' : ''}`}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      {isClient && isFullscreen && document.body && ReactDOM.createPortal(
        <FullscreenPomodoro
          {...pomodoro}
          T={T}
          onClose={() => setIsFullscreen(false)}
        />,
        document.body
      )}
    </>
  );
}