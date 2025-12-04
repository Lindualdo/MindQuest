#!/usr/bin/env node

/**
 * Script para testar push notification com token REAL
 * Uso: node scripts/test-push-real.mjs <TOKEN> <USER_ID>
 */

const API_URL = process.env.API_URL || 'https://mindquest.pt/api/send-push';

// Obter token e user_id dos argumentos
const token = process.argv[2];
const userId = process.argv[3] || 'test-user';

if (!token) {
  console.error('❌ Token é obrigatório!');
  console.log('\n📋 Uso:');
  console.log('  node scripts/test-push-real.mjs <TOKEN> [USER_ID]');
  console.log('\n📝 Exemplo:');
  console.log('  node scripts/test-push-real.mjs "https://fcm.googleapis.com/...::p256dh::auth" "user-123"');
  console.log('\n💡 Para capturar o token, veja: docs/espec/notificacao/capturar-token-push.md');
  process.exit(1);
}

async function testRealPush() {
  console.log('🧪 Testando Push Notification com Token Real\n');
  console.log('📍 Endpoint:', API_URL);
  console.log('👤 User ID:', userId);
  console.log('🔑 Token length:', token.length, 'caracteres');
  console.log('');

  const payload = {
    token: token,
    titulo: '🎉 Teste Real - MindQuest',
    corpo: 'Esta é uma notificação de teste com token real! Se você recebeu isso, está funcionando! 🚀',
    usuario_id: userId,
    tipo: 'lembrete'
  };

  try {
    console.log('⏳ Enviando notificação...\n');

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

    if (response.ok && data.success) {
      console.log('✅ NOTIFICAÇÃO ENVIADA COM SUCESSO!');
      console.log('   - Verifique seu dispositivo/navegador');
      console.log('   - Título:', data.titulo);
      console.log('   - Enviado em:', data.enviado_em);
    } else {
      console.log('❌ Erro ao enviar notificação');
      console.log('   Erro:', data.error || 'Erro desconhecido');
      
      if (data.error && data.error.includes('410')) {
        console.log('\n⚠️  Token expirado ou inválido');
        console.log('   Você precisa criar uma nova subscription');
      } else if (data.error && data.error.includes('VAPID')) {
        console.log('\n⚠️  Problema com VAPID keys');
      }
    }

  } catch (error) {
    console.error('❌ Erro ao testar:', error.message);
  }
}

testRealPush();

