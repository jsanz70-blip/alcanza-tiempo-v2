/**
 * ELIMINAR SERVICE WORKER para forzar carga fresca desde Vercel.
 * SIN borrar datos del usuario (localStorage).
 */
export function forceServiceWorkerUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      if (registrations.length > 0) {
        for (let reg of registrations) {
          reg.unregister();
        }
        console.log('[SW] Service Worker eliminado. Recargando para obtener la versión más reciente...');
        // Recargar para que Vercel sirva los archivos nuevos
        window.location.reload();
      }
    });
  }
}