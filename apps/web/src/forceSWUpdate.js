/**
 * Fuerza la actualización del Service Worker para que la PWA
 * descargue la nueva versión del código.
 * 
 * IMPORTANTE: SOLO limpia las cachés de archivos estáticos del SW.
 * NO toca localStorage (datos del usuario).
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
  
  // SOLO limpia cachés de archivos estáticos del Service Worker
  // NO toca localStorage - los datos de usuario están a salvo
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        if (cacheName.startsWith('tareas-app-')) {
          caches.delete(cacheName).then(function() {
            console.log('[Cache] Caché de assets eliminada:', cacheName);
          });
        }
      });
    });
  }
}
