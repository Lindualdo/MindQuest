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

  if (event.data) {
    try {
      const textPayload = event.data.text();
      if (textPayload) {
        try {
          const parsed = JSON.parse(textPayload);
          notificationData.title = parsed.title || notificationData.title;
          notificationData.body = parsed.body || notificationData.body;
          notificationData.icon = parsed.icon || notificationData.icon;
          notificationData.badge = parsed.badge || notificationData.badge;
          notificationData.tag = parsed.tag || notificationData.tag;
          notificationData.requireInteraction =
            typeof parsed.requireInteraction === 'boolean'
              ? parsed.requireInteraction
              : notificationData.requireInteraction;
          notificationData.data = parsed.data || notificationData.data;
        } catch (jsonError) {
          console.log('[SW] Payload não é JSON, usando texto puro');
          notificationData.body = textPayload;
        }
      }
    } catch (error) {
      console.error('[SW] Erro ao ler payload do push:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data,
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

