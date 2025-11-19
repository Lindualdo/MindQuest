const DEFAULT_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/card/quests';

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

const readUsuarioId = (value: any): string | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value.usuario_id ?? value.user_id ?? value.id_usuario;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return null;
};

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!['GET', 'POST'].includes(req.method)) {
    res.status(405).json({ success: false, error: 'Método não suportado' });
    return;
  }

  const source = req.method === 'GET' ? req.query : req.body ?? {};
  const usuarioId = readUsuarioId(source);

  if (!usuarioId) {
    res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
    return;
  }

  const remoteEndpoint = process.env.CARD_QUESTS_WEBHOOK_URL || DEFAULT_ENDPOINT;

  try {
    // O webhook espera user_id como query param
    const url = new URL(remoteEndpoint);
    url.searchParams.set('user_id', usuarioId);

    const upstreamResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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

    if (isJson) {
      res.status(200).json(body);
      return;
    }

    res.status(200).send(body);
  } catch (error) {
    console.error('[card/quests] Erro ao conectar:', error);
    res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço de card de quests' });
  }
}

