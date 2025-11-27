const DEFAULT_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/criar-quest-manual';

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

const readUsuarioId = (source: any): string | null => {
  if (source && typeof source === 'object') {
    const userId = source.usuario_id || source.user_id || source.usuarioId || source.userId;
    if (userId && typeof userId === 'string') {
      const trimmed = userId.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return null;
};

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Método não suportado' });
    return;
  }

  const source = req.query ?? {};
  const usuarioId = readUsuarioId(source);

  if (!usuarioId) {
    res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
    return;
  }

  const titulo = source.titulo;
  if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
    res.status(400).json({ success: false, error: 'titulo obrigatório' });
    return;
  }

  const remoteEndpoint = process.env.CRIAR_QUEST_MANUAL_WEBHOOK_URL || DEFAULT_ENDPOINT;

  try {
    // Montar query params para GET
    const queryParams = new URLSearchParams({
      user_id: usuarioId,
      titulo: titulo.trim(),
    });

    if (source.descricao && typeof source.descricao === 'string' && source.descricao.trim()) {
      queryParams.set('descricao', source.descricao.trim());
    }

    if (source.insight_id && typeof source.insight_id === 'string' && source.insight_id.trim()) {
      queryParams.set('insight_id', source.insight_id.trim());
    }

    if (source.area_vida_id && typeof source.area_vida_id === 'string' && source.area_vida_id.trim()) {
      queryParams.set('area_vida_id', source.area_vida_id.trim());
    }

    const webhookUrl = `${remoteEndpoint}?${queryParams.toString()}`;

    const upstreamResponse = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await upstreamResponse.json() : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      res.status(upstreamResponse.status).json({
        success: false,
        error: isJson && typeof body === 'object' && 'error' in body
          ? (body as { error: string }).error
          : 'Erro ao criar quest',
      });
      return;
    }

    res.status(200).json(body);
  } catch (error) {
    console.error('[criar-quest-manual] Erro ao conectar:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao conectar ao serviço de criação de quests' 
    });
  }
}

