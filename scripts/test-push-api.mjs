#!/usr/bin/env node

/**
 * Script de teste para a API de Push Notifications
 * Testa o endpoint /api/send-push na Vercel
 */

const API_URL = 'https://mind-quest-orcin.vercel.app/api/send-push';

// Token de teste no formato esperado: endpoint::p256dh::auth
// Este é um token fictício apenas para validar a estrutura da API
const MOCK_TOKEN = [
  'https://fcm.googleapis.com/fcm/send/test123',
  'BMockP256dhKeyForTesting1234567890',
  'MockAuthKeyForTesting123'
].join('::');

async function testPushAPI() {
  console.log('🧪 Testando API de Push Notifications\n');
  console.log('📍 Endpoint:', API_URL);
  console.log('⏳ Enviando requisição...\n');

  try {
    const payload = {
      token: MOCK_TOKEN,
      titulo: 'Teste Manual - MindQuest',
      corpo: 'Validando estrutura da API de push notifications',
      usuario_id: 'test-user-123',
      tipo: 'lembrete'
    };

    console.log('📦 Payload:', JSON.stringify(payload, null, 2), '\n');

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
        if (data.error && data.error.includes('410')) {
          console.log('\n✅ VALIDAÇÃO COMPLETA:');
          console.log('   - API está acessível');
          console.log('   - VAPID keys estão configuradas');
          console.log('   - web-push está funcionando');
          console.log('   - Apenas precisa de token real para envio');
        }
      } else if (data.success === true) {
        console.log('✅ Push enviado com sucesso!');
        console.log('   Usuário:', data.usuario_id);
        console.log('   Título:', data.titulo);
        console.log('   Enviado em:', data.enviado_em);
      }
    } else {
      console.log('❌ Erro na API');
      
      if (response.status === 500 && data.error?.includes('VAPID')) {
        console.log('⚠️  VAPID keys NÃO configuradas na Vercel');
      } else if (response.status === 400) {
        console.log('⚠️  Erro de validação:', data.error);
      }
    }

  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('⚠️  URL não encontrada - verificar domínio da Vercel');
    }
  }
}

// Executar teste
testPushAPI();

