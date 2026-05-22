import { describe, it, expect } from 'vitest';
import { initialAppData } from '@/lib/data';
import type { AppData, Task } from '@/lib/types';

/**
 * computeAppDataDiff: pure function that computes which collections changed
 * by reference equality. Extracted from setAppData for testability.
 */
function computeAppDataDiff(
  currentData: AppData,
  newData: AppData
): Partial<AppData> {
  const diff: Partial<AppData> = {};
  for (const key of Object.keys(newData) as (keyof AppData)[]) {
    if (newData[key] !== currentData[key]) {
      (diff as any)[key] = newData[key];
    }
  }
  return diff;
}

describe('computeAppDataDiff', () => {
  it('TC-01: should return only changed collections when 1 task updated', () => {
    const current = { ...initialAppData };
    const updatedTasks = current.tasks.map((t, i) =>
      i === 0 ? { ...t, name: 'Updated Name' } : t
    );
    const next = { ...current, tasks: updatedTasks };

    const diff = computeAppDataDiff(current, next);

    expect(diff.tasks).toBeDefined();
    expect(diff.tasks).toBe(updatedTasks);
    // Other collections should NOT be in diff
    expect(diff.clients).toBeUndefined();
    expect(diff.quotes).toBeUndefined();
    expect(diff.appSettings).toBeUndefined();
    expect(diff.projects).toBeUndefined();
  });

  it('TC-02: should return empty diff when no changes', () => {
    const current = { ...initialAppData };
    // Same reference = no change
    const diff = computeAppDataDiff(current, current);

    expect(Object.keys(diff)).toHaveLength(0);
  });

  it('TC-03: should detect tasks AND quotes change when editing task with quote', () => {
    const current = { ...initialAppData };
    const updatedTasks = [...current.tasks];
    updatedTasks[0] = { ...updatedTasks[0], name: 'Changed' };
    const updatedQuotes = [...current.quotes];
    updatedQuotes[0] = { ...updatedQuotes[0], status: 'accepted' as const };

    const next = { ...current, tasks: updatedTasks, quotes: updatedQuotes };
    const diff = computeAppDataDiff(current, next);

    expect(diff.tasks).toBeDefined();
    expect(diff.quotes).toBeDefined();
    expect(diff.clients).toBeUndefined();
  });

  it('TC-04: should detect only appSettings change for settings update', () => {
    const current = { ...initialAppData };
    const updatedSettings = { ...current.appSettings, language: 'vi' as const };
    const next = { ...current, appSettings: updatedSettings };

    const diff = computeAppDataDiff(current, next);

    expect(diff.appSettings).toBeDefined();
    expect(diff.appSettings?.language).toBe('vi');
    expect(diff.tasks).toBeUndefined();
    expect(diff.clients).toBeUndefined();
  });

  it('TC-05: should handle array reference equality correctly (same content = no diff if same ref)', () => {
    const current = { ...initialAppData };
    // Create new object but keep same array references
    const next = { ...current };

    const diff = computeAppDataDiff(current, next);

    // Because arrays are same reference, no diff
    expect(Object.keys(diff)).toHaveLength(0);
  });

  it('TC-06: should NOT include unchanged collections in diff', () => {
    const current = { ...initialAppData };
    // Only change tasks array by creating new reference
    const next = {
      ...current,
      tasks: [...current.tasks, {
        id: 'new-task',
        name: 'New Task',
        status: 'todo',
        startDate: new Date(),
        deadline: new Date(),
        clientId: '',
        categoryId: 'default',
      } as Task],
    };

    const diff = computeAppDataDiff(current, next);

    // Only tasks should be in diff
    const keys = Object.keys(diff);
    expect(keys).toEqual(['tasks']);
    expect(diff.tasks).toHaveLength(current.tasks.length + 1);
  });
});
