const DEFAULT_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/criar-quest';

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método não suportado' });
    return;
  }

  const body = req.body ?? {};
  const usuarioId = readUsuarioId(body);

  if (!usuarioId) {
    res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
    return;
  }

  if (!body.titulo || typeof body.titulo !== 'string' || !body.titulo.trim()) {
    res.status(400).json({ success: false, error: 'titulo obrigatório' });
    return;
  }

  if (!body.area_vida || typeof body.area_vida !== 'string') {
    res.status(400).json({ success: false, error: 'area_vida obrigatória' });
    return;
  }

  const remoteEndpoint = process.env.CRIAR_QUEST_WEBHOOK_URL || DEFAULT_ENDPOINT;

  try {
    const payload = {
      usuario_id: usuarioId,
      titulo: body.titulo.trim(),
      descricao: body.descricao || null,
      tipo: body.tipo || 'personalizada',
      area_vida: body.area_vida,
      recorrencia_dias: body.recorrencia_dias || null,
      quest_estagio: 'a_fazer',
    };

    const upstreamResponse = await fetch(remoteEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseBody = isJson ? await upstreamResponse.json() : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      res.status(upstreamResponse.status).json(
        typeof responseBody === 'string'
          ? { success: false, error: responseBody || 'Erro desconhecido' }
          : responseBody
      );
      return;
    }

    if (isJson) {
      res.status(200).json(responseBody);
      return;
    }

    res.status(200).send(responseBody);
  } catch (error) {
    console.error('[criar-quest] Erro ao conectar:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao conectar ao serviço de criação de quests' 
    });
  }
}

