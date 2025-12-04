// Cole este código NOVO e COMPLETO no console do navegador (F12)
// Após colar, pressione Enter e copie o token que aparecer

(async function() {
  const VAPID_PUBLIC_KEY = 'BDFvqrQTPxtRfsh79LQ5DsVsDUtAOOulOwRE1BKMkPklnYQjqbbftZjFemkyJDxf5r8krPpGJL1TNBMTe9i7wiE';
  
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  try {
    console.log('🔍 Iniciando captura...');
    
    // Verificar permissão
    if (Notification.permission !== 'granted') {
      console.warn('⚠️ Permissão:', Notification.permission);
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        console.error('❌ Permissão negada');
        return;
      }
    }
    
    // Aguardar service worker
    const registration = await navigator.serviceWorker.ready;
    console.log('✅ Service Worker pronto');
    
    // Obter ou criar subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      console.log('⚠️ Criando nova subscription...');
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      console.log('✅ Subscription criada');
    } else {
      console.log('✅ Subscription existente');
    }
    
    // Extrair token
    const endpoint = subscription.endpoint;
    const p256dhBase64 = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh'))));
    const authBase64 = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))));
    const token = `${endpoint}::${p256dhBase64}::${authBase64}`;
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ TOKEN CAPTURADO:');
    console.log('='.repeat(70));
    console.log('\n' + token + '\n');
    console.log('📋 COPIE O TOKEN ACIMA (desde https até o final)');
    console.log('='.repeat(70));
    
    // Salvar em variável global para facilitar
    window.PUSH_TOKEN = token;
    console.log('💡 Token também salvo em: window.PUSH_TOKEN');
    
    return token;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  }
})();

