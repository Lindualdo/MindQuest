// Service Worker para notificações push
// MindQuest v1.3

const CACHE_NAME = 'mindquest-v1.3';
const NOTIFICATION_TITLE = 'MindQuest';

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker instalado');
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// Receber notificações push
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event);
  
  let notificationData = {
    title: NOTIFICATION_TITLE,
    body: 'Você tem uma nova notificação',
    icon: '/mindquest_logo_vazado.png',
    badge: '/mindquest_logo_vazado_small.png',
    tag: 'mindquest-notification',
    requireInteraction: false,
    data: {}
  };

  const showNotificationPromise = event.data
    ? event.data.text().then((text) => {
        if (text) {
          try {
            const data = JSON.parse(text);
            return {
              title: data.title || NOTIFICATION_TITLE,
              body: data.body || notificationData.body,
              icon: data.icon || notificationData.icon,
              badge: data.badge || notificationData.badge,
              tag: data.tag || notificationData.tag,
              requireInteraction: data.requireInteraction || false,
              data: data.data || {}
            };
          } catch (jsonError) {
            // Se não for JSON, usar como texto simples
            console.log('[SW] Dados não são JSON, usando como texto:', text);
            return {
              title: NOTIFICATION_TITLE,
              body: text || notificationData.body,
              icon: notificationData.icon,
              badge: notificationData.badge,
              tag: notificationData.tag,
              requireInteraction: false,
              data: {}
            };
          }
        }
        return notificationData;
      }).catch((e) => {
        console.error('[SW] Erro ao processar dados do push:', e);
        return notificationData;
      })
    : Promise.resolve(notificationData);

  event.waitUntil(
    showNotificationPromise.then((finalData) => {
      return self.registration.showNotification(finalData.title, {
        body: finalData.body,
        icon: finalData.icon,
        badge: finalData.badge,
        tag: finalData.tag,
        requireInteraction: finalData.requireInteraction,
        data: finalData.data,
      vibrate: [200, 100, 200],
        actions: [
          {
            action: 'open',
            title: 'Abrir',
            icon: '/mindquest_logo_vazado_small.png'
          },
          {
            action: 'close',
            title: 'Fechar'
          }
        ]
      });
    })
  );
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificação clicada:', event);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Abrir/focar a aplicação
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se já existe uma janela aberta, focar nela
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Caso contrário, abrir nova janela
      if (clients.openWindow) {
        const url = event.notification.data?.url || '/app/1.3';
        return clients.openWindow(url);
      }
    })
  );
});

// Erro no service worker
self.addEventListener('error', (event) => {
  console.error('[SW] Erro no Service Worker:', event);
});

