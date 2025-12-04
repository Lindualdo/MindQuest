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
  
  let title = NOTIFICATION_TITLE;
  let body = 'Você tem uma nova notificação';
  let icon = '/mindquest_logo_vazado.png';
  let badge = '/mindquest_logo_vazado_small.png';
  let tag = 'mindquest-notification';
  let data = {};

  if (event.data) {
    try {
      // text() é SÍNCRONO em PushMessageData
      const textPayload = event.data.text();
      console.log('[SW] Payload recebido:', textPayload);
      
      if (textPayload) {
        try {
          const parsed = JSON.parse(textPayload);
          title = parsed.title || title;
          body = parsed.body || body;
          icon = parsed.icon || icon;
          badge = parsed.badge || badge;
          tag = parsed.tag || tag;
          data = parsed.data || data;
          console.log('[SW] Payload parseado com sucesso:', parsed);
        } catch (jsonError) {
          console.log('[SW] Payload não é JSON, usando texto puro');
          body = textPayload;
        }
      }
    } catch (error) {
      console.error('[SW] Erro ao ler payload:', error);
    }
  }

  console.log('[SW] Exibindo notificação:', { title, body });

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      badge: badge,
      tag: tag,
      data: data,
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Abrir'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    }).then(() => {
      console.log('[SW] Notificação exibida com sucesso');
    }).catch((err) => {
      console.error('[SW] Erro ao exibir notificação:', err);
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

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
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
