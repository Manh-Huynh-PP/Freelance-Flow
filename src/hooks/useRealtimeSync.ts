"use client";

import { useEffect } from 'react';
import { useRealtime } from '@/contexts/realtime-context';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Hook to subscribe to real-time updates for a specific table
 */
export function useRealtimeSubscription(
  table: string, 
  enabled: boolean = true,
  onUpdate?: (payload: any) => void
) {
  const { subscribeToTable, unsubscribe } = useRealtime();

  useEffect(() => {
    if (!enabled) return;

    let channel: RealtimeChannel | null = null;

    const handleUpdate = (payload: any) => {
      console.log(`📡 Real-time update for ${table}:`, payload);
      onUpdate?.(payload);
    };

    // Subscribe to table changes
    channel = subscribeToTable(table, handleUpdate);

    return () => {
      if (channel) {
        unsubscribe(channel);
      }
    };
  }, [table, enabled, subscribeToTable, unsubscribe, onUpdate]);
}

/**
 * Hook to subscribe to multiple tables at once
 */
export function useMultipleRealtimeSubscriptions(
  tables: string[],
  enabled: boolean = true,
  onUpdate?: (table: string, payload: any) => void
) {
  const { subscribeToTable, unsubscribe } = useRealtime();

  useEffect(() => {
    if (!enabled || tables.length === 0) return;

    const channels: RealtimeChannel[] = [];

    tables.forEach(table => {
      const handleUpdate = (payload: any) => {
        console.log(`📡 Real-time update for ${table}:`, payload);
        onUpdate?.(table, payload);
      };

      const channel = subscribeToTable(table, handleUpdate);
      if (channel) {
        channels.push(channel);
      }
    });

    return () => {
      channels.forEach(channel => {
        unsubscribe(channel);
      });
    };
  }, [tables, enabled, subscribeToTable, unsubscribe, onUpdate]);
}

/**
 * Hook specifically for task updates with custom handling
 */
export function useTaskRealtimeSync() {
  const onTaskUpdate = (payload: any) => {
    const { eventType, new: newTask, old: oldTask } = payload;
    
    switch (eventType) {
      case 'INSERT':
        console.log('✨ New task created:', newTask);
        break;
      case 'UPDATE': 
        console.log('📝 Task updated:', newTask);
        break;
      case 'DELETE':
        console.log('🗑️ Task deleted:', oldTask);
        break;
    }
  };

  useRealtimeSubscription('tasks', true, onTaskUpdate);
}

/**
 * Hook for project updates
 */
export function useProjectRealtimeSync() {
  const onProjectUpdate = (payload: any) => {
    const { eventType, new: newProject, old: oldProject } = payload;
    
    switch (eventType) {
      case 'INSERT':
        console.log('🎯 New project created:', newProject);
        break;
      case 'UPDATE':
        console.log('📊 Project updated:', newProject);
        break;
      case 'DELETE':
        console.log('🗑️ Project deleted:', oldProject);
        break;
    }
  };

  useRealtimeSubscription('projects', true, onProjectUpdate);
}