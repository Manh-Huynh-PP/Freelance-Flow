"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { WorkSession } from '@/lib/helpers/time-analyzer';
import { useAuth } from '@/hooks/useAuth';

const STORAGE_KEY = 'work-time-sessions';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function useWorkTimeData(initialSessions?: WorkSession[], onPersist?: (sessions: WorkSession[]) => void) {
  const { session } = useAuth();
  const userId = session?.user?.id || 'anon';
  const STORAGE_KEY = `work-time-sessions-${userId}`;

  // Prefer persisted localStorage sessions (most-recent local changes) when available.
  const [sessions, setSessions] = useState<WorkSession[]>(() => {
    try {
      if (userId === 'anon') return Array.isArray(initialSessions) ? initialSessions : [];

      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          // console.debug('[worktime] init: read from localStorage', parsed); 
          return parsed;
        } catch { }
      }
    } catch { }
    return Array.isArray(initialSessions) ? initialSessions : [];
  });
  const initializedRef = useRef(false);

  // Ensure we synchronously reconcile localStorage on mount/user-change.
  useEffect(() => {
    if (userId === 'anon') return;

    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.debug('[worktime] mount: loaded sessions from localStorage', parsed);
          setSessions(parsed);
          initializedRef.current = true;
          return;
        }
      }
    } catch (err) {
      console.debug('[worktime] mount: failed to read localStorage', err);
    }
  }, [STORAGE_KEY, userId]);

  useEffect(() => {
    // Initialize from app-provided sessions only once (or when they contain data).
    if (Array.isArray(initialSessions)) {
      // Filter out active sessions (no endTime) from app-provided data to avoid
      // unintentionally re-opening a user's check-in on reload. We'll only merge
      // completed sessions from appData and prefer local entries when IDs conflict.
      const appCompleted = initialSessions.filter(s => !!s.endTime);

      if (!initializedRef.current) {
        initializedRef.current = true;
        // If local already has sessions, merge completed ones without overwriting local
        if ((sessions || []).length === 0 && appCompleted.length > 0) {
          console.debug('[worktime] init: applying app-provided completed sessions because local is empty', appCompleted);
          setSessions(appCompleted);
          return;
        }
        if ((sessions || []).length > 0 && appCompleted.length > 0) {
          // merge dedupe by id, prefer local
          const byId: Record<string, any> = {};
          [...appCompleted, ...sessions].forEach(s => { byId[s.id] = byId[s.id] || s; });
          const merged = Object.values(byId) as WorkSession[];
          console.debug('[worktime] init: merging app-completed sessions into local', merged);
          setSessions(merged);
          return;
        }
      } else {
        // Post-init updates (e.g., after a restore): only add completed sessions that don't exist locally
        if (appCompleted.length > 0) {
          const localIds = new Set((sessions || []).map(s => s.id));
          const toAdd = appCompleted.filter(s => !localIds.has(s.id));
          if (toAdd.length > 0) {
            console.debug('[worktime] update: adding non-duplicate completed sessions from appData', toAdd);
            setSessions(prev => [...prev, ...toAdd]);
          }
        }
      }
    }
  }, [initialSessions, sessions.length]);

  useEffect(() => {
    try {
      if (userId === 'anon') return;

      if (sessions.length > 0) {
        // console.debug('[worktime] persist: writing to localStorage', sessions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } else {
        // Optional: clear if empty? Or keep to avoid race conditions. Keeping for now.
      }
    } catch { }
  }, [sessions, STORAGE_KEY, userId]);

  // Provide a safe reset if sessions field missing after a restore
  useEffect(() => {
    if (!initialSessions && sessions.length === 0) {
      // Optional reset logic if needed
    }
  }, [initialSessions, sessions.length]);

  const checkIn = useCallback(() => {
    setSessions(prev => {
      const hasActive = prev.some(s => s.type === 'WORK_SESSION' && !s.endTime);
      if (hasActive) return prev;
      const next = [
        ...prev, ({
          id: generateId(),
          type: 'WORK_SESSION',
          startTime: new Date().toISOString(),
          endTime: '' // Marked as active
        } as unknown) as WorkSession
      ];
      try { console.debug('[worktime] action: checkIn ->', next); } catch { }
      if (onPersist) onPersist(next);
      return next;
    });
  }, [onPersist]);

  const checkOut = useCallback(() => {
    setSessions(prev => {
      const next = prev.map(s => (s.type === 'WORK_SESSION' && !s.endTime) ? { ...s, endTime: new Date().toISOString() } : s);
      try { console.debug('[worktime] action: checkOut ->', next); } catch { }
      if (onPersist) onPersist(next);
      return next;
    });
  }, [onPersist]);

  const savePomodoroSession = useCallback((durationMinutes: number) => {
    const now = new Date();
    setSessions(prev => {
      const next = [
        ...prev, {
          id: generateId(),
          type: 'POMODORO_FOCUS' as const,
          startTime: new Date(now.getTime() - durationMinutes * 60 * 1000).toISOString(),
          endTime: now.toISOString(),
          durationMinutes
        } as WorkSession
      ];
      if (onPersist) onPersist(next);
      return next;
    });
  }, [onPersist]);

  return { sessions, checkIn, checkOut, savePomodoroSession };
}
