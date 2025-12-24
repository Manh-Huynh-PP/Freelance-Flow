"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase-service';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from 'react-query';
import { useToast } from "@/hooks/use-toast";

interface RealtimeContextType {
  isConnected: boolean;
  subscribeToTable: (table: string, callback: (payload: any) => void) => RealtimeChannel | null;
  unsubscribe: (channel: RealtimeChannel) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const channelsRef = useRef<RealtimeChannel[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn('⚠️ Supabase client not available');
      return;
    }

    // Set initial connection state
    setIsConnected(true);
    console.log('✅ Supabase real-time enabled');

    return () => {
      // Clean up channels without causing state updates
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, []); // No dependencies to avoid re-render loops

  const subscribeToTable = (table: string, callback: (payload: any) => void): RealtimeChannel | null => {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const channel = supabase
      .channel(`table-${table}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: table,
          filter: 'user_id=eq.auth.uid()'  // Only listen to current user's data
        },
        (payload) => {
          console.log(`🔄 Real-time update for ${table}:`, payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries(['appData']);
          queryClient.invalidateQueries([table]);
          
          // Call the custom callback
          callback(payload);
          
          // Show toast for important updates
          if (['tasks', 'projects', 'clients'].includes(table)) {
            const eventType = payload.eventType;
            const tableName = table.slice(0, -1); // Remove 's' from plural
            
            toast({
              title: `${tableName} ${eventType}`,
              description: `Real-time update received`,
              duration: 2000,
            });
          }
        }
      )
      .subscribe();

    channelsRef.current.push(channel);
    return channel;
  };

  const unsubscribe = (channel: RealtimeChannel) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    supabase.removeChannel(channel);
    const index = channelsRef.current.indexOf(channel);
    if (index > -1) {
      channelsRef.current.splice(index, 1);
    }
  };

  const contextValue: RealtimeContextType = {
    isConnected,
    subscribeToTable,
    unsubscribe,
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
}