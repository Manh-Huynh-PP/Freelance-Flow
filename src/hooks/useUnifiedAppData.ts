"use client";

import { useAppData as useSupabaseAppData } from '@/hooks/useAppData-supabase';

/**
 * Unified data hook that strictly uses Supabase
 */
export function useUnifiedAppData() {
  return useSupabaseAppData();
}

// Re-export hook for explicit usage
export { useSupabaseAppData };
export default useUnifiedAppData;