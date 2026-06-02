import { useEffect, useCallback, useRef } from 'react';
import { onRealtimeSync } from '@/lib/supabaseClient';

/**
 * Hook that listens for realtime changes from other devices via Supabase Realtime.
 * When a change is detected, it calls the provided callback.
 * 
 * @param {string|string[]} tables - Table name(s) to listen for
 * @param {Function} callback - Called with { table, eventType, new, old } when a change occurs
 * @param {Object} options - Optional settings
 * @param {number} options.debounceMs - Debounce interval in ms (default: 300)
 */
export function useRealtimeSync(tables, callback, options = {}) {
  const { debounceMs = 300 } = options;
  const callbackRef = useRef(callback);
  const tablesRef = useRef(tables);

  // Update refs when props change
  useEffect(() => {
    callbackRef.current = callback;
    tablesRef.current = tables;
  }, [callback, tables]);

  const handleSync = useCallback((event) => {
    const tableList = Array.isArray(tablesRef.current) ? tablesRef.current : [tablesRef.current];
    if (!tableList.includes(event.table)) return;
    callbackRef.current(event);
  }, []);

  useEffect(() => {
    // Debounce to avoid rapid re-renders
    let timeoutId = null;
    const wrappedCallback = (event) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleSync(event), debounceMs);
    };

    const unsubscribe = onRealtimeSync(wrappedCallback);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [handleSync, debounceMs]);
}

export default useRealtimeSync;