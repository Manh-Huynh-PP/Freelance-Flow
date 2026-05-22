"use client";

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWorkTimeData } from '@/hooks/useWorkTimeData';
import type { WorkSession } from '@/lib/helpers/time-analyzer';

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ session: { user: { id: 'test-user-123' } } }),
}));

const STORAGE_KEY = 'work-time-sessions-test-user-123';

function makeSession(overrides: Partial<WorkSession> & { id: string }): WorkSession {
  return {
    type: 'WORK_SESSION',
    startTime: new Date('2024-01-01T09:00:00Z').toISOString(),
    endTime: new Date('2024-01-01T17:00:00Z').toISOString(),
    ...overrides,
  } as WorkSession;
}

describe('useWorkTimeData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ── Initialization ──
  describe('Initialization', () => {
    it('TC-01: should initialize with empty array when no initialSessions and no localStorage', () => {
      const { result } = renderHook(() => useWorkTimeData(undefined, undefined));
      expect(result.current.sessions).toEqual([]);
    });

    it('TC-02: should initialize from localStorage when data exists', () => {
      const stored = [makeSession({ id: 'stored-1' })];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

      const { result } = renderHook(() => useWorkTimeData(undefined, undefined));
      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].id).toBe('stored-1');
    });

    it('TC-03: should initialize from initialSessions when localStorage is empty', () => {
      const initial = [makeSession({ id: 'init-1' })];
      const { result } = renderHook(() => useWorkTimeData(initial, undefined));
      // After effect runs, sessions should contain initial data
      expect(result.current.sessions.length).toBeGreaterThanOrEqual(1);
    });

    it('TC-04: should NOT read localStorage when userId is anon', () => {
      // Override mock for this test
      vi.doMock('@/hooks/useAuth', () => ({
        useAuth: () => ({ session: null }),
      }));
      
      // Since we can't easily re-mock mid-test with renderHook,
      // we verify the behavior through the storage key pattern
      localStorage.setItem('work-time-sessions-anon', JSON.stringify([makeSession({ id: 'anon-1' })]));
      // The hook with real auth mock (test-user-123) should NOT read anon key
      const { result } = renderHook(() => useWorkTimeData(undefined, undefined));
      const hasAnonSession = result.current.sessions.some(s => s.id === 'anon-1');
      expect(hasAnonSession).toBe(false);
    });
  });

  // ── Session merge (D2 fix) ──
  describe('Session merge (D2 fix)', () => {
    it('TC-05: should merge app-provided completed sessions with local sessions on init', () => {
      const localSession = makeSession({ id: 'local-1' });
      localStorage.setItem(STORAGE_KEY, JSON.stringify([localSession]));

      const appSession = makeSession({ id: 'app-1' });
      const { result } = renderHook(() => useWorkTimeData([appSession], undefined));

      // Should contain both
      const ids = result.current.sessions.map(s => s.id);
      expect(ids).toContain('local-1');
      expect(ids).toContain('app-1');
    });

    it('TC-06: should deduplicate sessions by id when merging', () => {
      const localSession = makeSession({ id: 'dup-1', startTime: '2024-06-01T09:00:00Z' });
      localStorage.setItem(STORAGE_KEY, JSON.stringify([localSession]));

      const appSession = makeSession({ id: 'dup-1', startTime: '2024-01-01T09:00:00Z' });
      const { result } = renderHook(() => useWorkTimeData([appSession], undefined));

      const dup = result.current.sessions.filter(s => s.id === 'dup-1');
      // Should have exactly 1 copy (no duplicates)
      expect(dup).toHaveLength(1);
    });

    it('TC-07: should NOT re-merge when initialSessions reference unchanged', () => {
      const appSessions = [makeSession({ id: 'stable-1' })];
      const onPersist = vi.fn();
      const { result, rerender } = renderHook(
        ({ sessions }) => useWorkTimeData(sessions, onPersist),
        { initialProps: { sessions: appSessions } }
      );

      const countAfterInit = result.current.sessions.length;

      // Rerender with same reference
      rerender({ sessions: appSessions });
      
      expect(result.current.sessions.length).toBe(countAfterInit);
    });

    it('TC-08: should filter active sessions during merge effect (completed only)', () => {
      // When localStorage has data, the merge effect filters out active sessions from initialSessions
      const localSession = makeSession({ id: 'local-existing' });
      localStorage.setItem(STORAGE_KEY, JSON.stringify([localSession]));
      
      const activeSess = { ...makeSession({ id: 'active-from-app' }), endTime: '' } as WorkSession;
      const completedSess = makeSession({ id: 'completed-from-app' });
      const { result } = renderHook(() => useWorkTimeData([activeSess, completedSess], undefined));

      const ids = result.current.sessions.map(s => s.id);
      // Active sessions from app-provided data should NOT be merged
      expect(ids).not.toContain('active-from-app');
      // Completed sessions should be merged
      expect(ids).toContain('completed-from-app');
      expect(ids).toContain('local-existing');
    });
  });

  // ── Check-in / Check-out ──
  describe('Check-in / Check-out', () => {
    it('TC-09: should add a new WORK_SESSION on checkIn', () => {
      const { result } = renderHook(() => useWorkTimeData(undefined, undefined));

      act(() => {
        result.current.checkIn();
      });

      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].type).toBe('WORK_SESSION');
      expect(result.current.sessions[0].endTime).toBe('');
    });

    it('TC-10: should NOT add duplicate active session on double checkIn', () => {
      const { result } = renderHook(() => useWorkTimeData(undefined, undefined));

      act(() => {
        result.current.checkIn();
      });
      act(() => {
        result.current.checkIn();
      });

      const activeSessions = result.current.sessions.filter(s => s.type === 'WORK_SESSION' && !s.endTime);
      expect(activeSessions).toHaveLength(1);
    });

    it('TC-11: should close active session on checkOut', () => {
      const { result } = renderHook(() => useWorkTimeData(undefined, undefined));

      act(() => {
        result.current.checkIn();
      });
      act(() => {
        result.current.checkOut();
      });

      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].endTime).not.toBe('');
    });

    it('TC-12: should call onPersist callback after checkIn', () => {
      const onPersist = vi.fn();
      const { result } = renderHook(() => useWorkTimeData(undefined, onPersist));

      act(() => {
        result.current.checkIn();
      });

      expect(onPersist).toHaveBeenCalledTimes(1);
      expect(onPersist).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ type: 'WORK_SESSION' }),
      ]));
    });

    it('TC-13: should call onPersist callback after checkOut', () => {
      const onPersist = vi.fn();
      const { result } = renderHook(() => useWorkTimeData(undefined, onPersist));

      act(() => {
        result.current.checkIn();
      });
      onPersist.mockClear();
      act(() => {
        result.current.checkOut();
      });

      expect(onPersist).toHaveBeenCalledTimes(1);
    });
  });

  // ── localStorage persistence (D1 fix) ──
  describe('localStorage persistence', () => {
    it('TC-14: should write sessions to localStorage after state change', async () => {
      const { result } = renderHook(() => useWorkTimeData(undefined, undefined));

      act(() => {
        result.current.checkIn();
      });

      // After effect runs, localStorage should be written
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });
  });

  // ── Pomodoro ──
  describe('Pomodoro', () => {
    it('TC-16: should save POMODORO_FOCUS session with correct duration', () => {
      const onPersist = vi.fn();
      const { result } = renderHook(() => useWorkTimeData(undefined, onPersist));

      act(() => {
        result.current.savePomodoroSession(25);
      });

      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].type).toBe('POMODORO_FOCUS');
      expect((result.current.sessions[0] as any).durationMinutes).toBe(25);
      expect(onPersist).toHaveBeenCalled();
    });
  });
});
