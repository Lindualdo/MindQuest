# 📱 Como Capturar Token Real de Push Notifications

## Método Rápido (Console do Navegador)

### Passo 1: Abrir Console
1. Acesse `https://mindquest.pt/app` (ou sua URL local)
2. Pressione **F12** (ou Clique direito → Inspecionar)
3. Vá na aba **Console**

### Passo 2: Copiar e Colar o Código

Copie todo o código abaixo e cole no console:

```javascript
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
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    const endpoint = subscription.endpoint;
    const p256dhBase64 = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh'))));
    const authBase64 = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))));
    const token = `${endpoint}::${p256dhBase64}::${authBase64}`;

    console.log('\n✅ TOKEN CAPTURADO:\n' + token + '\n');
    console.log('📋 Copie o token acima e use no script de teste!');
    return token;
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
})();
```

### Passo 3: Copiar o Token

Após executar, você verá algo como:

```
✅ TOKEN CAPTURADO:
https://fcm.googleapis.com/fcm/send/abc123::p256dh_key::auth_key
```

**Copie TODO esse token** (desde `https://` até o final)

---

## Método 2: Via Arquivo Completo

Se preferir, use o arquivo completo:

1. Abra: `docs/espec/notificacao/codigo-console-capturar-token.js`
2. Copie todo o conteúdo
3. Cole no console do navegador

---

## Testar o Token Capturado

### Opção 1: Script Node.js

```bash
node scripts/test-push-real.mjs "SEU_TOKEN_AQUI" "SEU_USER_ID"
```

### Opção 2: cURL

```bash
curl -X POST https://mindquest.pt/api/send-push \
  -H "Content-Type: application/json" \
  -d '{
    "token": "SEU_TOKEN_AQUI",
    "titulo": "Teste Real",
    "corpo": "Notificação de teste com token real!",
    "usuario_id": "SEU_USER_ID",
    "tipo": "lembrete"
  }'
```

### Opção 3: Console do Navegador

```javascript
fetch('https://mindquest.pt/api/send-push', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'SEU_TOKEN_AQUI',
    titulo: 'Teste Real',
    corpo: 'Notificação de teste!',
    usuario_id: 'SEU_USER_ID',
    tipo: 'lembrete'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## Verificar se Funcionou

1. **Status 200** = Notificação enviada ✅
2. **Erro 410** = Token expirado (criar nova subscription)
3. **Erro 400** = Token inválido (verificar formato)

---

## Próximos Passos

Após validar o token:
1. ✅ API de push está funcionando
2. ✅ VAPID keys configuradas corretamente
3. ⏭️ Testar workflow completo do n8n

