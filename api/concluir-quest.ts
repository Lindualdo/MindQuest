const DEFAULT_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/concluir-quest';

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

const readUsuarioId = (source: any): string | null => {
  const candidates = [
    source?.usuario_id,
    source?.usuarioId,
    source?.user_id,
    source?.userId,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return null;
};

const readQuestId = (source: any): string | null => {
  const candidates = [
    source?.quest_id,
    source?.questId,
    source?.instancia_id,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return null;
};

export default async function handler(req: any, res: any) {
  console.log('[concluir-quest] Handler chamado:', { method: req.method, url: req.url, body: req.body });
  
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    console.log('[concluir-quest] Método não suportado:', req.method);
    res.status(405).json({ success: false, error: 'Método não suportado' });
    return;
  }

  const source = req.query ?? {};
  const usuarioId = readUsuarioId(source);
  const questId = readQuestId(source);

  console.log('[concluir-quest] Dados extraídos:', { usuarioId, questId, source });

  if (!usuarioId) {
    console.log('[concluir-quest] Erro: usuario_id obrigatório');
    res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
    return;
  }

  if (!questId) {
    console.log('[concluir-quest] Erro: quest_id obrigatório');
    res.status(400).json({ success: false, error: 'quest_id obrigatório' });
    return;
  }

  const remoteEndpoint = process.env.CONCLUIR_QUEST_WEBHOOK_URL || DEFAULT_ENDPOINT;

  // Montar query params para GET
  const queryParams = new URLSearchParams({
    usuario_id: usuarioId,
    quest_id: questId,
  });
  if (source.fonte) queryParams.set('fonte', String(source.fonte));
  if (source.comentario) queryParams.set('comentario', String(source.comentario));

  const webhookUrl = `${remoteEndpoint}?${queryParams.toString()}`;

  console.log('[concluir-quest] Chamando webhook:', { webhookUrl, usuarioId, questId });

  try {
    const upstreamResponse = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[concluir-quest] Response status:', upstreamResponse.status, upstreamResponse.statusText);

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await upstreamResponse.json() : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      res.status(upstreamResponse.status).json(
        typeof body === 'string'
          ? { success: false, error: body || 'Erro desconhecido' }
          : body
      );
      return;
    }

    // Retorna a resposta do webhook diretamente
    if (isJson) {
      res.status(200).json(body);
      return;
    }

    res.status(200).send(body);
  } catch (error) {
    console.error('[concluir-quest] erro:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao conectar ao serviço de quests' 
    });
  }
}

