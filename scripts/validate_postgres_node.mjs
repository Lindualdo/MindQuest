#!/usr/bin/env node

/**
 * Script de validação de nodes Postgres após update via MCP
 * 
 * Uso:
 *   node scripts/validate_postgres_node.mjs <workflow-id> <node-id>
 * 
 * Exemplo:
 *   node scripts/validate_postgres_node.mjs gMb1UwtmEh5pkfxR 6f280135-12cc-4989-b2af-2dd8890edcb8
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do n8n (se disponível)
const n8nUrl = process.env.N8N_URL || 'http://localhost:5678';
const n8nApiKey = process.env.N8N_API_KEY;

async function validatePostgresNode(workflowId, nodeId) {
  console.log(`\n🔍 Validando nó Postgres...`);
  console.log(`   Workflow ID: ${workflowId}`);
  console.log(`   Node ID: ${nodeId}\n`);

  try {
    // Buscar workflow via API do n8n
    const response = await fetch(`${n8nUrl}/api/v1/workflows/${workflowId}`, {
      headers: {
        'X-N8N-API-KEY': n8nApiKey || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar workflow: ${response.status} ${response.statusText}`);
    }

    const workflow = await response.json();
    const node = workflow.nodes?.find(n => n.id === nodeId);

    if (!node) {
      throw new Error(`Nó ${nodeId} não encontrado no workflow`);
    }

    if (node.type !== 'n8n-nodes-base.postgres') {
      console.log(`⚠️  AVISO: Nó não é do tipo Postgres (tipo: ${node.type})`);
    }

    const params = node.parameters || {};
    const operation = params.operation;
    const query = params.query;
    const options = params.options || {};

    console.log('📋 Parâmetros encontrados:');
    console.log(`   operation: ${operation || '(não definido)'}`);
    console.log(`   query: ${query ? `${query.length} caracteres` : '(vazia)'}`);
    console.log(`   options: ${JSON.stringify(options)}\n`);

    // Validações
    const errors = [];
    const warnings = [];

    if (!operation) {
      errors.push('❌ ERRO: Campo "operation" não está definido');
    } else if (operation !== 'executeQuery') {
      errors.push(`❌ ERRO: operation está como "${operation}" (deveria ser "executeQuery")`);
    } else {
      console.log('✅ operation: "executeQuery" (correto)');
    }

    if (!query || query.trim() === '') {
      errors.push('❌ ERRO: Campo "query" está vazio');
    } else {
      console.log('✅ query: definida');
    }

    if (!options || typeof options !== 'object') {
      warnings.push('⚠️  AVISO: Campo "options" não é um objeto válido');
    } else {
      console.log('✅ options: definido');
    }

    // Verificar se query usa placeholders mas não tem queryReplacement
    if (query && query.includes('$1') && !options.queryReplacement) {
      warnings.push('⚠️  AVISO: Query usa placeholders ($1) mas não tem queryReplacement em options');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    if (errors.length > 0) {
      console.log('🚨 ERROS ENCONTRADOS:\n');
      errors.forEach(err => console.log(`   ${err}`));
      console.log('\n');
      process.exit(1);
    }

    if (warnings.length > 0) {
      console.log('⚠️  AVISOS:\n');
      warnings.forEach(warn => console.log(`   ${warn}`));
      console.log('\n');
    }

    console.log('✅ Validação concluída: Nó Postgres está configurado corretamente!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro durante validação:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

// Executar validação
const workflowId = process.argv[2];
const nodeId = process.argv[3];

if (!workflowId || !nodeId) {
  console.error('❌ Uso: node scripts/validate_postgres_node.mjs <workflow-id> <node-id>');
  process.exit(1);
}

validatePostgresNode(workflowId, nodeId);

