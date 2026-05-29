/**
 * Este script se ejecuta en App.jsx para forzar la actualización
 * del Service Worker y limpiar cachés antiguas.
 * Es crítico para que la PWA descargue el nuevo código con Realtime.
 */
export function forceServiceWorkerUpdate() {
  if ('serviceWorker' in navigator) {
    // Unregister all existing service workers
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
        console.log('[SW] Service Worker antiguo desregistrado');
      }
    }).then(() => {
      // Re-register the new service worker
      return navigator.serviceWorker.register('/sw.js');
    }).then(function(registration) {
      console.log('[SW] Nuevo Service Worker registrado con éxito');
      
      // Check if there's a waiting service worker (new version)
      if (registration.waiting) {
        // Send skip waiting message
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }).catch(function(error) {
      console.warn('[SW] Error al registrar Service Worker:', error);
    });
    
    // Listen for controller change to reload the page
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      console.log('[SW] Nuevo Service Worker activo. Recargando página...');
      window.location.reload();
    });
  }
  
  // Clear old caches
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        if (cacheName.startsWith('tareas-app-')) {
          caches.delete(cacheName).then(function() {
            console.log('[Cache] Caché antigua eliminada:', cacheName);
          });
        }
      });
    });
  }
}