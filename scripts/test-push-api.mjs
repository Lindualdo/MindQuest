#!/usr/bin/env node

/**
 * Script de teste para a API de Push Notifications
 * Testa o endpoint /api/send-push em diferentes ambientes
 */

const ENVIRONMENTS = [
  {
    name: 'Preview/Staging',
    url: 'https://mind-quest-nuxiptvq3-btcturbo.vercel.app'
  },
  {
    name: 'Produção',
    url: 'https://mindquest.pt'
  }
];

// Token de teste no formato esperado: endpoint::p256dh::auth
// Este é um token fictício apenas para validar a estrutura da API
const MOCK_TOKEN = [
  'https://fcm.googleapis.com/fcm/send/test123',
  'BMockP256dhKeyForTesting1234567890',
  'MockAuthKeyForTesting123'
].join('::');

async function testPushAPI(environment) {
  const API_URL = `${environment.url}/api/send-push`;
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testando: ${environment.name}`);
  console.log(`📍 Endpoint: ${API_URL}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const payload = {
      token: MOCK_TOKEN,
      titulo: 'Teste Manual - MindQuest',
      corpo: 'Validando estrutura da API de push notifications',
      usuario_id: 'test-user-123',
      tipo: 'lembrete'
    };

    console.log('📦 Payload:', JSON.stringify(payload, null, 2), '\n');
    console.log('⏳ Enviando requisição...\n');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log('📨 Status:', response.status);
    console.log('📄 Resposta:', JSON.stringify(data, null, 2), '\n');

    // Mostrar debug se disponível
    if (data.debug) {
      console.log('🔍 Debug Info:');
      console.log('   - Env vars presentes:', data.debug.hasEnvVars);
      console.log('   - Keys presentes:', data.debug.hasKeys);
      console.log('   - Public Key length:', data.debug.publicKeyLength);
      console.log('   - Private Key length:', data.debug.privateKeyLength);
      console.log('   - Env Public Present:', data.debug.envVars?.publicPresent);
      console.log('   - Env Private Present:', data.debug.envVars?.privatePresent, '\n');
    }

    // Análise do resultado
    if (response.ok) {
      console.log('✅ API está respondendo corretamente');
      
      if (data.success === false) {
        console.log('⚠️  Push não foi enviado (esperado - token de teste)');
        console.log('   Erro:', data.error);
        
        // Se o erro for sobre token inválido do push service, significa que:
        // 1. A API está funcionando ✅
        // 2. VAPID keys estão configuradas ✅
        // 3. web-push tentou enviar mas o token é fictício ✅
        if (data.error && (data.error.includes('410') || data.error.includes('expired'))) {
          console.log('\n✅ VALIDAÇÃO COMPLETA:');
          console.log('   - API está acessível');
          console.log('   - VAPID keys estão configuradas');
          console.log('   - web-push está funcionando');
          console.log('   - Apenas precisa de token real para envio');
          return { success: true, status: 'valid' };
        }
        
        // Verificar se é problema de VAPID keys
        if (data.error && data.error.includes('VAPID')) {
          console.log('\n❌ VAPID keys NÃO configuradas corretamente');
          return { success: false, status: 'vapid_missing' };
        }
      } else if (data.success === true) {
        console.log('✅ Push enviado com sucesso!');
        console.log('   Usuário:', data.usuario_id);
        console.log('   Título:', data.titulo);
        console.log('   Enviado em:', data.enviado_em);
        return { success: true, status: 'sent' };
      }
    } else {
      console.log('❌ Erro na API');
      
      if (response.status === 500 && data.error?.includes('VAPID')) {
        console.log('⚠️  VAPID keys NÃO configuradas na Vercel');
        return { success: false, status: 'vapid_missing' };
      } else if (response.status === 400) {
        console.log('⚠️  Erro de validação:', data.error);
        return { success: false, status: 'validation_error' };
      }
    }

    return { success: false, status: 'unknown' };

  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('⚠️  URL não encontrada - verificar domínio');
      return { success: false, status: 'not_found' };
    }
    
    return { success: false, status: 'error', error: error.message };
  }
}

// Executar testes em todos os ambientes
async function runAllTests() {
  console.log('🚀 Testando APIs de Push Notifications\n');
  
  const results = [];
  
  for (const env of ENVIRONMENTS) {
    const result = await testPushAPI(env);
    results.push({ environment: env.name, ...result });
    
    // Aguardar um pouco entre testes
    if (env !== ENVIRONMENTS[ENVIRONMENTS.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Resumo final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    const statusIcon = result.success ? '✅' : '❌';
    console.log(`${statusIcon} ${result.environment}: ${result.status}`);
  });
  
  console.log('\n');
}

// Executar
runAllTests().catch(console.error);
