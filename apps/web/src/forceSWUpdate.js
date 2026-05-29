/**
 * Primero fuerza la RESTAURACIÓN de datos desde Supabase,
 * luego actualiza el Service Worker.
 */
export async function forceServiceWorkerUpdate() {
  // PASO 1: Si estamos online y la cache está vacía, restaurar desde Supabase
  if (navigator.onLine && typeof window !== 'undefined') {
    try {
      const { realSupabase } = await import('@/lib/supabaseClient.js');
      
      if (realSupabase) {
        const tables = ['tareas', 'projects', 'daily_objectives'];
        for (const table of tables) {
          try {
            const cached = JSON.parse(localStorage.getItem(`offline_cache_${table}`) || '[]');
            if (cached.length === 0) {
              const { data, error } = await realSupabase.from(table).select('*');
              if (!error && data && data.length > 0) {
                localStorage.setItem(`offline_cache_${table}`, JSON.stringify(data));
                console.log(`[Restore] Restaurados ${data.length} registros de ${table} desde Supabase`);
              }
            }
          } catch (e) {
            console.warn(`[Restore] Error restaurando ${table}:`, e);
          }
        }
      }
    } catch (e) {
      console.warn('[Restore] No se pudo restaurar datos:', e);
    }
  }

  // PASO 2: Solo si hay un nuevo Service Worker esperando, recargar
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
}