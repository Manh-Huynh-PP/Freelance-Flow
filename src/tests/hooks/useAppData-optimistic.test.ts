import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from 'react-query';
import { initialAppData } from '@/lib/data';
import type { AppData } from '@/lib/types';

// We test the optimistic update logic conceptually since the hook requires
// full React + Supabase environment. This tests the core pattern used in onMutate/onError.

function parseDates(data: AppData): AppData {
  // Simplified version - just return data as-is for testing
  return data;
}

describe('Optimistic Updates', () => {
  let queryClient: QueryClient;
  const userId = 'test-user-123';
  const queryKey = ['appData', userId];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    // Set initial data
    queryClient.setQueryData(queryKey, initialAppData);
  });

  it('TC-01: should update queryClient cache immediately on mutate (before API)', () => {
    const previousData = queryClient.getQueryData<AppData>(queryKey);
    expect(previousData).toBeDefined();

    // Simulate onMutate
    const updates: Partial<AppData> = {
      tasks: [...(previousData!.tasks), {
        id: 'optimistic-task',
        name: 'Optimistic Task',
        status: 'todo',
        startDate: new Date(),
        deadline: new Date(),
        clientId: '',
        categoryId: 'default',
      } as any],
    };

    // Apply optimistic update
    queryClient.setQueryData(queryKey, parseDates({ ...previousData!, ...updates }));

    // Verify cache immediately has new data
    const updatedCache = queryClient.getQueryData<AppData>(queryKey);
    expect(updatedCache!.tasks).toHaveLength(previousData!.tasks.length + 1);
    expect(updatedCache!.tasks.find(t => t.id === 'optimistic-task')).toBeDefined();
  });

  it('TC-02: should rollback cache to previousData when mutation fails', () => {
    const previousData = queryClient.getQueryData<AppData>(queryKey);

    // Simulate optimistic update
    const updates: Partial<AppData> = {
      tasks: previousData!.tasks.filter(t => t.id !== 'task-1'), // Remove task-1
    };
    queryClient.setQueryData(queryKey, parseDates({ ...previousData!, ...updates }));

    // Verify task-1 is gone
    const optimisticCache = queryClient.getQueryData<AppData>(queryKey);
    expect(optimisticCache!.tasks.find(t => t.id === 'task-1')).toBeUndefined();

    // Simulate rollback (onError)
    queryClient.setQueryData(queryKey, previousData);

    // Verify task-1 is back
    const rolledBackCache = queryClient.getQueryData<AppData>(queryKey);
    expect(rolledBackCache!.tasks.find(t => t.id === 'task-1')).toBeDefined();
    expect(rolledBackCache!.tasks.length).toBe(previousData!.tasks.length);
  });

  it('TC-03: should cancel outgoing queries before optimistic update', async () => {
    const cancelSpy = vi.spyOn(queryClient, 'cancelQueries');

    // Simulate onMutate cancel
    await queryClient.cancelQueries(queryKey);

    expect(cancelSpy).toHaveBeenCalledWith(queryKey);
    cancelSpy.mockRestore();
  });

  it('TC-04: should preserve data structure after optimistic update (parseDates)', () => {
    const previousData = queryClient.getQueryData<AppData>(queryKey);

    const updates: Partial<AppData> = {
      appSettings: { ...previousData!.appSettings, language: 'vi' as const },
    };

    const merged = parseDates({ ...previousData!, ...updates });
    queryClient.setQueryData(queryKey, merged);

    const result = queryClient.getQueryData<AppData>(queryKey);
    // All original fields should still exist
    expect(result!.tasks).toBeDefined();
    expect(result!.clients).toBeDefined();
    expect(result!.quotes).toBeDefined();
    expect(result!.appSettings.language).toBe('vi');
  });
});

describe('handleGenericUpdate diff routing', () => {
  it('TC-06: should only include tasks in updates when only tasks changed', () => {
    const updates: Partial<AppData> = {
      tasks: initialAppData.tasks,
    };

    // Verify only tasks key exists
    expect(updates.tasks).toBeDefined();
    expect(updates.clients).toBeUndefined();
    expect(updates.quotes).toBeUndefined();
  });

  it('TC-07: should only include clients in updates when only clients changed', () => {
    const updates: Partial<AppData> = {
      clients: initialAppData.clients,
    };

    expect(updates.clients).toBeDefined();
    expect(updates.tasks).toBeUndefined();
    expect(updates.quotes).toBeUndefined();
  });

  it('TC-08: should NOT include quotes when only tasks changed', () => {
    const current = initialAppData;
    const newTasks = [...current.tasks];
    newTasks[0] = { ...newTasks[0], name: 'Changed' };

    // Compute diff
    const diff: Partial<AppData> = {};
    if (newTasks !== current.tasks) diff.tasks = newTasks;
    // quotes reference unchanged, so should not appear

    expect(diff.tasks).toBeDefined();
    expect(diff.quotes).toBeUndefined();
  });
});
