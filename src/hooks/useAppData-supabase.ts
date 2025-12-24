"use client";

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { initialAppData } from '@/lib/data';
import type { AppData, Client, Task, Quote } from '@/lib/types';
import { SupabaseDataService } from '@/lib/supabase-data-service';
import { i18n } from '@/lib/i18n';
import { useCallback, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { indexTasks } from '@/lib/vector-db/tasks-indexer';
import VectorDBService from '@/lib/vector-db/service';
import { useAuth } from '@/hooks/useAuth';

const noop = (...args: any[]) => { };

const safeInitialAppData: AppData = {
  ...initialAppData,
  workSessions: initialAppData.workSessions || [],
};

const parseDates = (data: AppData): AppData => {
  if (data?.tasks) {
    data.tasks = data.tasks.map(task => {
      const safeParseDate = (date: any): Date => {
        if (!date) return new Date();

        if (date instanceof Date && !isNaN(date.getTime())) {
          return date;
        }

        if (typeof date === 'string' || typeof date === 'number') {
          const parsed = new Date(date);
          if (!isNaN(parsed.getTime())) {
            return parsed;
          }
        }

        return new Date();
      };

      return {
        ...task,
        startDate: safeParseDate(task.startDate),
        deadline: safeParseDate(task.deadline),
      };
    });
  }
  return data;
};

const getLoadingState = () => ({
  appData: safeInitialAppData,
  isDataLoaded: false,
  T: i18n.en,
  setAppData: noop,
  updateTask: noop,
  handleDeleteTask: noop,
  updateQuote: noop,
  updateCollaboratorQuote: noop,
  handleEditTask: noop,
  handleAddClientAndSelect: () => safeInitialAppData.clients[0],
});

export function useAppData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { session, loading: authLoading, isAuthenticated } = useAuth();

  // Derive status from auth state
  const status = authLoading ? 'loading' : (isAuthenticated ? 'authenticated' : 'unauthenticated');

  const shouldLoadData = status === 'authenticated';

  const { data: appData, isLoading, error } = useQuery(['appData', session?.user?.id],
    async () => {
      // Allow loading for admin mode or authenticated users
      if (!shouldLoadData) {
        // Silently return default data for public pages (no console noise)
        return parseDates(safeInitialAppData);
      }

      try {
        return await SupabaseDataService.loadAppData().then(parseDates);
      } catch (err: any) {
        // Only log and show toast if user is authenticated (not expected to fail)
        if (shouldLoadData) {
          console.error('[useAppData] Error loading data:', err);

          if (err.message?.includes('not authenticated')) {
            toast({
              title: "Authentication Required",
              description: "Please log in to access your data.",
              variant: "destructive",
              duration: 10000,
            });
          } else {
            toast({
              title: "Data Loading Error",
              description: "Could not load your data. Using defaults. Please refresh the page.",
              variant: "destructive",
              duration: 8000,
            });
          }
        }

        return parseDates(safeInitialAppData);
      }
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
      retry: false,
      enabled: shouldLoadData, // Run query when ready
    });

  const mutation = useMutation('updateAppData',
    async (updates: Partial<AppData>) => {
      const currentData = queryClient.getQueryData<AppData>(['appData', session?.user?.id]) ?? safeInitialAppData;
      const newData = { ...currentData, ...updates };

      try {
        // Save specific collections that were updated
        if (updates.clients) await SupabaseDataService.saveClients(updates.clients);
        if (updates.projects) await SupabaseDataService.saveProjects(updates.projects);
        if (updates.tasks) await SupabaseDataService.saveTasks(updates.tasks);
        if (updates.quotes) await SupabaseDataService.saveQuotes(updates.quotes);
        if (updates.appSettings) await SupabaseDataService.saveSettings(updates.appSettings);
        if (updates.workSessions) await SupabaseDataService.saveWorkSessions(updates.workSessions);

        // Add missing entities for complete clearing/saving
        if (updates.collaborators) await SupabaseDataService.saveCollaborators(updates.collaborators);
        if (updates.categories) await SupabaseDataService.saveCategories(updates.categories);
        if (updates.notes) await SupabaseDataService.saveNotes(updates.notes);
        if (updates.events) await SupabaseDataService.saveEvents(updates.events);
        if (updates.expenses) await SupabaseDataService.saveExpenses(updates.expenses);
        if (updates.fixedCosts) await SupabaseDataService.saveFixedCosts(updates.fixedCosts);
        if (updates.quoteTemplates) await SupabaseDataService.saveQuoteTemplates(updates.quoteTemplates);
        if (updates.collaboratorQuotes) await SupabaseDataService.saveCollaboratorQuotes(updates.collaboratorQuotes);

        return newData;
      } catch (err: any) {
        console.error('[useAppData] Mutation error:', err);
        throw new Error('Failed to save data. Please try again.');
      }
    },
    {
      onSuccess: (updatedData) => {
        queryClient.setQueryData(['appData', session?.user?.id], parseDates(updatedData));
      },
      onError: (error: any) => {
        toast({
          title: "Data Sync Error",
          description: error.message || "Failed to save data. Please try again.",
          variant: "destructive",
          duration: 6000,
        });
      },
    }
  );

  const handleGenericUpdate = useCallback((updates: Partial<AppData>) => {
    mutation.mutate(updates);
  }, [mutation]);

  const setAppData = useCallback((updater: (prev: AppData) => AppData) => {
    const currentData = queryClient.getQueryData<AppData>(['appData', session?.user?.id]) ?? safeInitialAppData;
    const newData = updater(currentData);
    handleGenericUpdate(newData);
  }, [handleGenericUpdate, queryClient]);

  const saveAppData = useCallback(async (updates: Partial<AppData>) => {
    try {
      const currentData = queryClient.getQueryData<AppData>(['appData', session?.user?.id]) ?? safeInitialAppData;
      const newData = { ...currentData, ...updates } as AppData;

      console.log('💾 saveAppData called with updates:', {
        clientsCount: updates.clients?.length,
        tasksCount: updates.tasks?.length,
        projectsCount: updates.projects?.length,
        quotesCount: updates.quotes?.length,
        hasAppSettings: !!updates.appSettings
      });

      // For normal saves, use saveAppData with isRestore=false
      // This will NOT clear data or remap IDs
      if (updates.clients || updates.tasks || updates.projects || updates.quotes) {
        console.log('🔄 Using saveAppData for bulk update (normal save)...');
        await SupabaseDataService.saveAppData(newData, true, false);
      } else {
        // For individual updates, use specific save methods
        if (updates.appSettings) await SupabaseDataService.saveSettings(updates.appSettings);
        if (updates.workSessions) await SupabaseDataService.saveWorkSessions(updates.workSessions);
      }

      // Update local cache
      queryClient.setQueryData(['appData', session?.user?.id], parseDates(newData));

      console.log('✅ Data saved successfully');
    } catch (error: any) {
      const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error)) || 'Unknown error';
      console.error('❌ saveAppData error:', error, 'Message:', errorMessage);
      toast({ title: "Data Sync Error", description: errorMessage, variant: "destructive" });
      throw error;
    }
  }, [queryClient, toast]);

  // Restore from backup - clears existing data and remaps IDs
  const restoreAppData = useCallback(async (backupData: AppData) => {
    try {
      const isAdminLocalMode = false;

      console.log('📦 restoreAppData called - will clear and remap IDs');

      // Use saveAppData with isRestore=true to clear data and remap all IDs
      await SupabaseDataService.saveAppData(backupData, true, true);

      // Update local cache
      queryClient.setQueryData(['appData', session?.user?.id], parseDates(backupData));

      console.log('✅ Backup restored successfully');
    } catch (error: any) {
      const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error)) || 'Unknown error';
      console.error('❌ restoreAppData error:', error, 'Message:', errorMessage);
      toast({ title: "Restore Error", description: errorMessage, variant: "destructive" });
      throw error;
    }
  }, [queryClient, toast]);

  // Helper to index new tasks (for create operations) - now uses server-side AI
  const indexNewTasks = useCallback((newTasks: Task[]) => {
    // No longer need API key since we use server-side AI proxy
    if (newTasks.length > 0) {
      setTimeout(() => {
        // Update to use server-side proxy for indexing
        indexTasks(newTasks, { apiKey: 'server-proxy', model: 'gemini-2.5-flash' }).catch(e =>
          console.warn('Delta indexing failed for new tasks:', e)
        );
      }, 500);
    }
  }, []);

  const updateTask = useCallback((updates: Partial<Task> & { id: string }) => {
    const updatedTasks = (appData?.tasks || []).map(task => task.id === updates.id ? { ...task, ...updates } : task);
    handleGenericUpdate({ tasks: updatedTasks });

    // Delta indexing for updated task
    const updatedTask = updatedTasks.find(t => t.id === updates.id);
    if (updatedTask && (updates.name || updates.description)) {
      setTimeout(() => {
        indexTasks([updatedTask], { apiKey: 'server-proxy', model: 'gemini-2.5-flash' }).catch(e =>
          console.warn('Delta indexing failed for updated task:', e)
        );
      }, 500);
    }
  }, [appData, handleGenericUpdate]);

  const handleDeleteTask = useCallback((taskId: string) => {
    const updatedTasks = (appData?.tasks || []).filter(task => task.id !== taskId);
    handleGenericUpdate({ tasks: updatedTasks });
  }, [appData, handleGenericUpdate]);

  const updateQuote = useCallback((quoteId: string, updates: Partial<Quote>) => {
    const updatedQuotes = (appData?.quotes || []).map(q => q.id === quoteId ? { ...q, ...updates } : q);
    handleGenericUpdate({ quotes: updatedQuotes });
  }, [appData, handleGenericUpdate]);

  // Set up realtime subscription
  useEffect(() => {
    if (isLoading) return;

    const unsubscribe = SupabaseDataService.subscribeToChanges(() => {
      // Refetch data when changes occur
      queryClient.invalidateQueries(['appData', session?.user?.id]);
    });

    return unsubscribe;
  }, [isLoading, queryClient]); // Remove appData from dependencies

  // Auto-index tasks that don't yet have a stored vector (runs once when data loads)
  const hasAutoIndexedRef = useRef(false);
  useEffect(() => {
    if (isLoading || !appData?.tasks || hasAutoIndexedRef.current) return;

    // Bootstrap VectorDB with persisted vectors
    const persisted = appData.tasks.filter((t: any) => Array.isArray(t.vector) && t.vector.length > 0).map((t: any) => ({
      id: `task:${t.id}`,
      text: `${t.name || ''}\n${t.description || ''}`,
      metadata: { taskId: t.id, project: t.projectId },
      vector: t.vector,
    }));
    if (persisted.length > 0) {
      VectorDBService.upsert(persisted).catch((e: any) => console.warn('VectorDB bootstrap failed:', e));
    }

    // Auto-index tasks without vectors
    const tasksToIndex = appData.tasks.filter((t: any) => !Array.isArray(t.vector) || t.vector.length === 0);
    if (tasksToIndex.length > 0) {
      hasAutoIndexedRef.current = true;
      console.info(`🔍 Auto-indexing ${tasksToIndex.length} tasks without vectors...`);
      indexTasks(tasksToIndex, { apiKey: 'server-proxy', model: 'gemini-2.5-flash' })
        .then(() => console.info(`✅ Auto-indexed ${tasksToIndex.length} tasks successfully`))
        .catch(e => console.warn('Auto-indexing failed:', e.message || e));
    }
  }, [isLoading, appData?.tasks?.length]); // Only re-run when tasks count changes

  const lang = (appData?.appSettings?.language as keyof typeof i18n) || 'en';
  const T = i18n[lang] || i18n.en;

  // Return loading state while auth is loading or data is loading
  if (status === 'loading' || (shouldLoadData && isLoading)) {
    return {
      ...getLoadingState(),
      isDataLoaded: false,
    };
  }

  // Return default data for unauthenticated users
  if (!shouldLoadData) {
    return {
      ...getLoadingState(),
      isDataLoaded: true,
    };
  }

  // Return loading state if appData is not yet available
  if (!appData) {
    return getLoadingState() as any;
  }

  return {
    appData,
    isDataLoaded: !isLoading,
    T,
    setAppData,
    saveAppData,
    restoreAppData, // For backup restore (clears data, remaps IDs)
    updateTask,
    handleDeleteTask,
    updateQuote,
    indexNewTasks,
  };
}