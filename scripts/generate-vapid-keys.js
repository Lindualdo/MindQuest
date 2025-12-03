#!/usr/bin/env node

/**
 * Script para gerar chaves VAPID para Web Push API
 * MindQuest v1.3
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { readFileSync, writeFileSync } from 'fs';

const WEB_PUSH_PACKAGE = 'web-push';

console.log('🔑 Gerando chaves VAPID para Web Push API...\n');

try {
  // Verificar se web-push está instalado
  let webPushInstalled = false;
  try {
    execSync(`npm list ${WEB_PUSH_PACKAGE}`, { stdio: 'ignore' });
    webPushInstalled = true;
  } catch {
    // Não está instalado
  }

  if (!webPushInstalled) {
    console.log('📦 Instalando web-push...');
    execSync(`npm install ${WEB_PUSH_PACKAGE} --save-dev`, { stdio: 'inherit' });
  }

  // Gerar chaves VAPID
  console.log('🔐 Gerando par de chaves VAPID...\n');
  const output = execSync('npx web-push generate-vapid-keys', { encoding: 'utf-8' });
  
  const lines = output.trim().split('\n');
  let publicKey = '';
  let privateKey = '';

  lines.forEach(line => {
    if (line.includes('Public Key:')) {
      publicKey = line.split('Public Key:')[1].trim();
    } else if (line.includes('Private Key:')) {
      privateKey = line.split('Private Key:')[1].trim();
    }
  });

  if (!publicKey || !privateKey) {
    // Tentar parsear formato alternativo
    const publicMatch = output.match(/Public Key[:\s]+([A-Za-z0-9_-]+)/);
    const privateMatch = output.match(/Private Key[:\s]+([A-Za-z0-9_-]+)/);
    
    if (publicMatch) publicKey = publicMatch[1].trim();
    if (privateMatch) privateKey = privateMatch[1].trim();
  }

  if (!publicKey || !privateKey) {
    console.error('❌ Erro ao extrair chaves VAPID');
    console.log('Output completo:', output);
    process.exit(1);
  }

  console.log('✅ Chaves VAPID geradas com sucesso!\n');
  console.log('📋 Chaves geradas:');
  console.log('─'.repeat(60));
  console.log(`Public Key:  ${publicKey}`);
  console.log(`Private Key: ${privateKey.substring(0, 20)}... (oculto por segurança)`);
  console.log('─'.repeat(60));
  console.log('');

  // Criar arquivo .env.local se não existir
  const envLocalPath = '.env.local';
  let envContent = '';

  if (existsSync(envLocalPath)) {
    envContent = readFileSync(envLocalPath, 'utf-8');
  }

  // Adicionar ou atualizar VAPID_PUBLIC_KEY
  if (envContent.includes('VITE_VAPID_PUBLIC_KEY=')) {
    envContent = envContent.replace(
      /VITE_VAPID_PUBLIC_KEY=.*/,
      `VITE_VAPID_PUBLIC_KEY=${publicKey}`
    );
  } else {
    envContent += `\n# VAPID Keys para Web Push API\nVITE_VAPID_PUBLIC_KEY=${publicKey}\n`;
  }

  writeFileSync(envLocalPath, envContent.trim() + '\n');
  console.log(`✅ Variável VITE_VAPID_PUBLIC_KEY adicionada ao ${envLocalPath}`);

  // Criar arquivo de documentação com chave privada (para n8n)
  const vapidKeysPath = 'config/vapid-keys.json';
  const vapidKeys = {
    publicKey,
    privateKey,
    generatedAt: new Date().toISOString(),
    note: 'Mantenha a chave privada segura! Use apenas no servidor/n8n.'
  };

  // Criar diretório se não existir
  if (!existsSync('config')) {
    execSync('mkdir -p config', { stdio: 'ignore' });
  }

  writeFileSync(vapidKeysPath, JSON.stringify(vapidKeys, null, 2));
  console.log(`✅ Chaves salvas em ${vapidKeysPath} (inclui chave privada para n8n)`);
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('   - A chave pública está no .env.local (segura para commit)');
  console.log('   - A chave privada está em config/vapid-keys.json (NÃO commitar!)');
  console.log('   - Adicione config/vapid-keys.json ao .gitignore');
  console.log('');

} catch (error) {
  console.error('❌ Erro ao gerar chaves VAPID:', error.message);
  process.exit(1);
}

