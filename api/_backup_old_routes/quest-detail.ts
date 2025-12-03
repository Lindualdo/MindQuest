import { setCorsHeaders } from './auth/validate';

const DEFAULT_ENDPOINT = 'https://n8n.mindquest.app/webhook/quest-detail';

const readUsuarioId = (source: Record<string, unknown>): string | null => {
  const keys = ['usuario_id', 'user_id', 'usuarioId', 'userId'];
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return null;
};

const readQuestId = (source: Record<string, unknown>): string | null => {
  const keys = ['quest_id', 'questId', 'instancia_id'];
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string') {
      const trimmed = value.trim();
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
  const questId = readQuestId(source);

  if (!usuarioId) {
    res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
    return;
  }

  if (!questId) {
    res.status(400).json({ success: false, error: 'quest_id obrigatório' });
    return;
  }

  const remoteEndpoint = process.env.QUEST_DETAIL_WEBHOOK_URL || DEFAULT_ENDPOINT;

  // Montar query params para GET
  const queryParams = new URLSearchParams({
    user_id: usuarioId,
    quest_id: questId,
  });

  const webhookUrl = `${remoteEndpoint}?${queryParams.toString()}`;

  try {
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
          : 'Erro ao buscar detalhe da quest',
      });
      return;
    }

    res.status(200).json(body);
  } catch (error) {
    console.error('[quest-detail] Erro ao chamar webhook:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno ao buscar detalhe da quest',
    });
  }
}

