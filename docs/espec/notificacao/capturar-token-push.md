# Como Capturar Token de Push Real

## Método 1: Via Console do Navegador (Recomendado)

Abra o console do navegador (F12) e execute:

```javascript
// 1. Obter subscription de push
async function capturarTokenPush() {
  if (!('serviceWorker' in navigator)) {
    console.error('❌ Service Worker não suportado');
    return;
  }

  if (!('Notification' in window)) {
    console.error('❌ Notificações não suportadas');
    return;
  }

  try {
    // Aguardar service worker estar pronto
    const registration = await navigator.serviceWorker.ready;
    console.log('✅ Service Worker pronto');

    // Obter subscription existente
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      console.log('⚠️  Nenhuma subscription encontrada. Criando nova...');
      
      // VAPID Public Key
      const vapidPublicKey = 'BDFvqrQTPxtRfsh79LQ5DsVsDUtAOOulOwRE1BKMkPklnYQjqbbftZjFemkyJDxf5r8krPpGJL1TNBMTe9i7wiE';
      
      // Converter VAPID key para Uint8Array
      const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      };

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });
      
      console.log('✅ Nova subscription criada');
    }

    // Extrair chaves
    const endpoint = subscription.endpoint;
    const p256dhKey = subscription.getKey('p256dh');
    const authKey = subscription.getKey('auth');

    if (!p256dhKey || !authKey) {
      console.error('❌ Chaves não disponíveis na subscription');
      return;
    }

    // Converter para base64
    const p256dhBase64 = btoa(String.fromCharCode(...new Uint8Array(p256dhKey)));
    const authBase64 = btoa(String.fromCharCode(...new Uint8Array(authKey)));

    // Formato do token: endpoint::p256dh::auth
    const token = `${endpoint}::${p256dhBase64}::${authBase64}`;

    console.log('\n' + '='.repeat(60));
    console.log('✅ TOKEN DE PUSH CAPTURADO:');
    console.log('='.repeat(60));
    console.log('\n📋 Token completo:');
    console.log(token);
    console.log('\n📦 Formato JSON para teste:');
    console.log(JSON.stringify({
      token: token,
      titulo: 'Teste de Notificação',
      corpo: 'Esta é uma notificação de teste do MindQuest',
      usuario_id: 'SEU_USER_ID_AQUI',
      tipo: 'lembrete'
    }, null, 2));
    console.log('\n' + '='.repeat(60));

    return token;
  } catch (error) {
    console.error('❌ Erro ao capturar token:', error);
  }
}

// Executar
capturarTokenPush();
```

## Método 2: Via Página de Debug (Recomendado para Testes)

Crie uma página temporária para testar. Vou criar isso agora.

## Método 3: Verificar Token no Banco de Dados

Se o token já foi registrado via `registerPushToken()`, você pode consultar:

```sql
SELECT 
  dp.usuario_id,
  dp.token,
  dp.user_agent,
  dp.criado_em,
  u.nome_preferencia
FROM dispositivos_push dp
INNER JOIN usuarios u ON u.id = dp.usuario_id
WHERE dp.usuario_id = 'SEU_USER_ID_AQUI'
ORDER BY dp.criado_em DESC;
```

## Usar Token para Teste Manual

Após capturar o token, você pode testar via:

1. **Script de teste local:**
```bash
node scripts/test-push-real.mjs
```

2. **cURL:**
```bash
curl -X POST https://mindquest.pt/api/send-push \
  -H "Content-Type: application/json" \
  -d '{
    "token": "SEU_TOKEN_AQUI",
    "titulo": "Teste Manual",
    "corpo": "Testando notificação push real",
    "usuario_id": "SEU_USER_ID",
    "tipo": "lembrete"
  }'
```

