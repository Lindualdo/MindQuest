const DEFAULT_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/push-token';

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

  // POST: Registrar/atualizar token de dispositivo
  if (req.method === 'POST') {
    let parsedBody: any = null;

    const rawBody = req.body;
    if (typeof rawBody === 'string') {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = null;
      }
    } else if (rawBody && typeof rawBody === 'object') {
      parsedBody = rawBody;
    } else if (Buffer.isBuffer(rawBody)) {
      try {
        parsedBody = JSON.parse(rawBody.toString('utf-8'));
      } catch {
        parsedBody = null;
      }
    }

    const usuarioId = readUsuarioId(parsedBody);
    const token = parsedBody?.token;

    if (!usuarioId) {
      res.status(400).json({ success: false, error: 'user_id obrigatório' });
      return;
    }

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      res.status(400).json({ success: false, error: 'token obrigatório' });
      return;
    }

    const remoteEndpoint = process.env.PUSH_TOKEN_WEBHOOK_URL || DEFAULT_ENDPOINT;

    try {
      const upstreamResponse = await fetch(remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: usuarioId,
          token: token.trim(),
          user_agent: parsedBody?.user_agent || null,
        }),
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
      console.error('[push-token] Erro ao registrar token:', error);
      res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço' });
    }
    return;
  }

  res.status(405).json({ success: false, error: 'Método não suportado' });
}

