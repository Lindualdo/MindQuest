/**
 * Utilitário para gerenciar notificações push
 * MindQuest v1.3
 */

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Converte subscription para formato de token (base64)
 */
function subscriptionToToken(subscription: PushSubscription): string {
  const key = subscription.getKey('p256dh');
  const auth = subscription.getKey('auth');
  
  if (!key || !auth) {
    throw new Error('Subscription keys não disponíveis');
  }

  // Converter ArrayBuffer para base64
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(key)));
  const authBase64 = btoa(String.fromCharCode(...new Uint8Array(auth)));
  
  return `${subscription.endpoint}::${keyBase64}::${authBase64}`;
}

/**
 * Solicita permissão e registra service worker
 */
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('[Push] Notificações não suportadas neste navegador');
    return false;
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('[Push] Service Worker não suportado');
    return false;
  }

  try {
    // Registrar service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    console.log('[Push] Service Worker registrado:', registration);

    // Solicitar permissão
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[Push] Permissão negada pelo usuário');
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Push] Erro ao registrar service worker:', error);
    return false;
  }
}

/**
 * Obtém ou cria subscription de push
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Verificar se já existe subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Criar nova subscription
      if (!VAPID_PUBLIC_KEY) {
        console.warn('[Push] VAPID_PUBLIC_KEY não configurada');
        return null;
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      
      console.log('[Push] Nova subscription criada:', subscription);
    }

    return subscription;
  } catch (error) {
    console.error('[Push] Erro ao obter subscription:', error);
    return null;
  }
}

/**
 * Converte VAPID key de base64 URL-safe para Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Registra token de dispositivo no servidor
 */
export async function registerPushToken(userId: string): Promise<boolean> {
  try {
    const hasPermission = await requestPushPermission();
    if (!hasPermission) {
      return false;
    }

    const subscription = await getPushSubscription();
    if (!subscription) {
      return false;
    }

    const token = subscriptionToToken(subscription);
    const userAgent = navigator.userAgent;

    const response = await fetch('/api/push-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        token: token,
        user_agent: userAgent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Push] Erro ao registrar token:', errorData);
      return false;
    }

    const data = await response.json();
    if (data.success) {
      console.log('[Push] Token registrado com sucesso');
      return true;
    }

    return false;
  } catch (error) {
    console.error('[Push] Erro ao registrar token:', error);
    return false;
  }
}

/**
 * Verifica se notificações estão habilitadas
 */
export function isPushEnabled(): boolean {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
}

