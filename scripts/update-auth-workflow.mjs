import process from 'node:process';

const apiRoot = new URL('https://mindquest-n8n.cloudfy.live/api/v1/');
const apiKey = process.env.N8N_API_KEY;
const workflowId = 'r0CuG6F3S1TR8ohs';

if (!apiKey) {
  console.error('Defina a variável N8N_API_KEY antes de rodar.');
  process.exit(1);
}

async function fetchJson(relativePath, options = {}) {
  const url = new URL(relativePath, apiRoot);
  
  const fetchOptions = {
    method: options.method || 'GET',
    headers: {
      'X-N8N-API-KEY': apiKey,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };
  
  if (options.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }
  
  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Falha ao acessar ${url}: ${res.status} ${res.statusText}\n${text}`);
  }

  return res.json();
}

async function updateWorkflow() {
  try {
    // 1. Obter workflow atual
    console.log('📥 Obtendo workflow atual...');
    const workflow = await fetchJson(`workflows/${workflowId}`);
    
    // 2. Atualizar nó 01_Validar_Usuario (Postgres)
    console.log('🔧 Atualizando nó 01_Validar_Usuario...');
    const validarUsuarioNode = workflow.nodes.find(n => n.id === 'a89eea39-2f9c-426f-8306-1df9868e1596');
    if (validarUsuarioNode) {
      validarUsuarioNode.parameters.query = `SELECT 
    u.id as user_id,
    u.nome,
    u.nome_preferencia,
    COALESCE(u.cronotipo_detectado, NULL) as cronotipo_detectado
FROM usuarios u
WHERE u.token_acesso = $1 
  AND u.token_expira_em > CURRENT_TIMESTAMP
LIMIT 1;`;
      validarUsuarioNode.parameters.operation = 'executeQuery';
      validarUsuarioNode.parameters.options = {
        queryReplacement: '={{ $json.body.token }}'
      };
    }

    // 3. Atualizar nó organiza_dados (Code)
    console.log('🔧 Atualizando nó organiza_dados...');
    const organizaDadosNode = workflow.nodes.find(n => n.id === 'b43955dd-13ae-4738-b3d5-45f9b5e7d47b');
    if (organizaDadosNode) {
      organizaDadosNode.parameters.jsCode = `const items = $input.all();
const userRow = items[0]?.json || {};

function normalizeString(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'string') return String(value);
  const trimmed = value.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'null') return fallback;
  return trimmed;
}

// Validar se usuário foi encontrado
if (!userRow.user_id) {
  return [{
    json: {
      response: {
        success: false,
        error: 'Token inválido ou expirado'
      }
    }
  }];
}

// Retornar apenas dados do usuário
const user = {
  id: normalizeString(userRow.user_id),
  nome: normalizeString(userRow.nome, 'Usuário'),
  nome_preferencia: normalizeString(userRow.nome_preferencia, userRow.nome || 'Usuário'),
  cronotipo_detectado: normalizeString(userRow.cronotipo_detectado, null)
};

return [{
  json: {
    response: {
      success: true,
      user: user
    }
  }
}];`;
      organizaDadosNode.parameters.mode = 'runOnceForAllItems';
    }

    // 4. Atualizar workflow no n8n
    console.log('💾 Atualizando workflow no n8n...');
    const updated = await fetchJson(`workflows/${workflowId}`, {
      method: 'PUT',
      body: JSON.stringify(workflow)
    });

    console.log('✅ Workflow atualizado com sucesso!');
    console.log(`   ID: ${updated.id}`);
    console.log(`   Nome: ${updated.name}`);
    console.log(`   Ativo: ${updated.active}`);
    
    return updated;
  } catch (error) {
    console.error('❌ Erro ao atualizar workflow:', error.message);
    throw error;
  }
}

updateWorkflow().catch(console.error);

