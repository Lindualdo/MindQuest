/**
 * Código para copiar e colar no Console do Navegador
 * Abra o DevTools (F12) → Console → Cole este código e pressione Enter
 */

(async function capturarTokenPush() {
  console.log('🔍 Iniciando captura de token de push...\n');

  // Verificar suporte
  if (!('serviceWorker' in navigator)) {
    console.error('❌ Service Worker não suportado neste navegador');
    return;
  }

  if (!('Notification' in window)) {
    console.error('❌ Notificações não suportadas neste navegador');
    return;
  }

  // Verificar permissão
  if (Notification.permission !== 'granted') {
    console.warn('⚠️  Permissão de notificação não concedida');
    console.log('   Permissão atual:', Notification.permission);
    return;
  }

  try {
    // VAPID Public Key (nova chave gerada)
    const VAPID_PUBLIC_KEY = 'BDFvqrQTPxtRfsh79LQ5DsVsDUtAOOulOwRE1BKMkPklnYQjqbbftZjFemkyJDxf5r8krPpGJL1TNBMTe9i7wiE';

    // Função auxiliar para converter VAPID key
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

    // Aguardar service worker estar pronto
    const registration = await navigator.serviceWorker.ready;
    console.log('✅ Service Worker pronto');

    // Obter subscription existente ou criar nova
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      console.log('⚠️  Nenhuma subscription encontrada. Criando nova...');
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      console.log('✅ Nova subscription criada');
    } else {
      console.log('✅ Subscription existente encontrada');
    }

    // Extrair dados da subscription
    const endpoint = subscription.endpoint;
    const p256dhKey = subscription.getKey('p256dh');
    const authKey = subscription.getKey('auth');

    if (!p256dhKey || !authKey) {
      console.error('❌ Chaves não disponíveis na subscription');
      return;
    }

    // Converter ArrayBuffer para base64
    const p256dhBase64 = btoa(String.fromCharCode(...new Uint8Array(p256dhKey)));
    const authBase64 = btoa(String.fromCharCode(...new Uint8Array(authKey)));

    // Formato do token: endpoint::p256dh::auth
    const token = `${endpoint}::${p256dhBase64}::${authBase64}`;

    // Exibir resultado formatado
    console.log('\n' + '='.repeat(70));
    console.log('✅ TOKEN DE PUSH CAPTURADO COM SUCESSO!');
    console.log('='.repeat(70));
    
    console.log('\n📋 Token completo (copie tudo):');
    console.log(token);
    
    console.log('\n📦 Componentes do token:');
    console.log('  - Endpoint:', endpoint.substring(0, 50) + '...');
    console.log('  - p256dh:', p256dhBase64.substring(0, 30) + '...');
    console.log('  - auth:', authBase64.substring(0, 30) + '...');
    
    console.log('\n🧪 Para testar via script:');
    console.log(`node scripts/test-push-real.mjs "${token}" "SEU_USER_ID"`);
    
    console.log('\n📄 Payload JSON para teste manual:');
    const payload = {
      token: token,
      titulo: 'Teste de Notificação',
      corpo: 'Esta é uma notificação de teste do MindQuest',
      usuario_id: 'SEU_USER_ID_AQUI',
      tipo: 'lembrete'
    };
    console.log(JSON.stringify(payload, null, 2));
    
    console.log('\n' + '='.repeat(70));
    console.log('💡 Dica: Copie o token completo e use no script de teste!');
    console.log('='.repeat(70));

    // Retornar token para uso programático
    return token;

  } catch (error) {
    console.error('❌ Erro ao capturar token:', error);
    console.error('   Detalhes:', error.message);
    if (error.message.includes('not supported')) {
      console.error('   Este navegador pode não suportar push notifications');
    }
  }
})();

