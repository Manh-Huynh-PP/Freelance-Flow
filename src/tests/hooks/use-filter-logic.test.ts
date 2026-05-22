import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilterLogic } from '@/hooks/use-filter-logic';
import { initialAppData } from '@/lib/data';
import type { Task, AppSettings } from '@/lib/types';

// Mock next/navigation
const mockReplace = vi.fn();
const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/dashboard',
}));

// Mock FilterSettingsService
vi.mock('@/lib/filter-settings-service', () => ({
  FilterSettingsService: {
    getFilterSettings: () => null,
    saveFilterSettings: vi.fn(),
    createDefaultSettings: (statusIds: string[]) => ({
      selectedStatuses: statusIds,
      selectedCategory: 'all',
      selectedClient: 'all',
      selectedProject: 'all',
      sortFilter: 'deadline-asc',
      dateRange: undefined,
    }),
    mergeWithDefaults: (saved: any, defaults: any) => saved || defaults,
  },
}));

const tasks: Task[] = initialAppData.tasks;
const appSettings: AppSettings = initialAppData.appSettings;

describe('useFilterLogic', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Initialization ──
  describe('Initialization', () => {
    it('TC-01: should load filter settings from appSettings on mount', () => {
      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      // Should have all statuses selected by default
      expect(result.current.selectedStatuses.length).toBeGreaterThan(0);
      expect(result.current.sortFilter).toBe('deadline-asc');
    });

    it('TC-02: should use URL searchParams over saved settings when present', () => {
      mockSearchParams = new URLSearchParams('statuses=inprogress&sort=deadline-desc');

      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      expect(result.current.selectedStatuses).toContain('inprogress');
      expect(result.current.sortFilter).toBe('deadline-desc');
    });
  });

  // ── Filtering ──
  describe('Filtering', () => {
    it('TC-04: should filter tasks by status', () => {
      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      act(() => {
        // Select only 'inprogress'
        result.current.handleStatusBatchChange(['inprogress']);
      });

      const filtered = result.current.filteredTasks;
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(t => {
        expect(t.status).toBe('inprogress');
      });
    });

    it('TC-05: should filter tasks by category', () => {
      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      act(() => {
        result.current.handleCategoryChange('cat-1');
      });

      result.current.filteredTasks.forEach(t => {
        expect(t.categoryId).toBe('cat-1');
      });
    });

    it('TC-06: should filter tasks by client', () => {
      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      act(() => {
        result.current.handleClientChange('client-1');
      });

      result.current.filteredTasks.forEach(t => {
        expect(t.clientId).toBe('client-1');
      });
    });

    it('TC-07: should filter tasks by date range (overlap logic)', () => {
      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      act(() => {
        result.current.handleDateRangeChange({
          from: new Date('2024-08-01'),
          to: new Date('2024-08-15'),
        });
      });

      // All filtered tasks should overlap with Aug 1-15 range
      result.current.filteredTasks.forEach(t => {
        const taskStart = new Date(t.startDate);
        const taskEnd = new Date(t.deadline);
        const rangeStart = new Date('2024-08-01');
        const rangeEnd = new Date('2024-08-15');
        rangeEnd.setHours(23, 59, 59, 999);
        // Task overlaps if: taskEnd >= rangeStart AND taskStart <= rangeEnd
        expect(taskEnd >= rangeStart).toBe(true);
        expect(taskStart <= rangeEnd).toBe(true);
      });
    });

    it('TC-08: should exclude deleted tasks in active view', () => {
      const tasksWithDeleted = [
        ...tasks,
        { ...tasks[0], id: 'deleted-task', deletedAt: '2024-01-01T00:00:00Z' } as Task,
      ];

      const { result } = renderHook(() => useFilterLogic(tasksWithDeleted, appSettings, 'active'));

      const ids = result.current.filteredTasks.map(t => t.id);
      expect(ids).not.toContain('deleted-task');
    });

    it('TC-09: should only show deleted tasks in trash view', () => {
      const tasksWithDeleted = [
        ...tasks,
        { ...tasks[0], id: 'deleted-task', deletedAt: '2024-01-01T00:00:00Z' } as Task,
      ];

      const { result } = renderHook(() => useFilterLogic(tasksWithDeleted, appSettings, 'trash'));

      const ids = result.current.filteredTasks.map(t => t.id);
      expect(ids).toContain('deleted-task');
      ids.forEach(id => {
        if (id !== 'deleted-task') {
          // Non-deleted tasks should NOT appear in trash
          const task = tasksWithDeleted.find(t => t.id === id);
          expect(task?.deletedAt).toBeTruthy();
        }
      });
    });

    it('TC-10: should handle empty tasks array gracefully', () => {
      const { result } = renderHook(() => useFilterLogic([], appSettings, 'active'));

      expect(result.current.filteredTasks).toEqual([]);
      expect(result.current.unsortedFilteredTasks).toEqual([]);
    });
  });

  // ── Sorting ──
  describe('Sorting', () => {
    it('TC-11: should sort by deadline-asc (default)', () => {
      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      const deadlines = result.current.filteredTasks.map(t => new Date(t.deadline).getTime());
      for (let i = 1; i < deadlines.length; i++) {
        expect(deadlines[i]).toBeGreaterThanOrEqual(deadlines[i - 1]);
      }
    });

    it('TC-12: should sort by deadline-desc', () => {
      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      act(() => {
        result.current.handleSortChange('deadline-desc');
      });

      const deadlines = result.current.filteredTasks.map(t => new Date(t.deadline).getTime());
      for (let i = 1; i < deadlines.length; i++) {
        expect(deadlines[i]).toBeLessThanOrEqual(deadlines[i - 1]);
      }
    });

    it('TC-13: should sort by createdAt-desc', () => {
      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      act(() => {
        result.current.handleSortChange('createdAt-desc');
      });

      const dates = result.current.filteredTasks.map(t =>
        t.createdAt ? new Date(t.createdAt).getTime() : new Date(t.startDate).getTime()
      );
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
      }
    });
  });

  // ── Clear filters ──
  describe('Clear filters', () => {
    it('TC-16: should reset all filters to defaults on handleClearFilters', () => {
      const { result } = renderHook(() => useFilterLogic(tasks, appSettings, 'active'));

      // Apply some filters first
      act(() => {
        result.current.handleCategoryChange('cat-1');
        result.current.handleClientChange('client-1');
        result.current.handleSortChange('deadline-desc');
      });

      // Clear
      act(() => {
        result.current.handleClearFilters();
      });

      expect(result.current.categoryFilter).toBeNull();
      expect(result.current.clientFilter).toBeNull();
      expect(result.current.sortFilter).toBe('deadline-asc');
    });
  });
});
