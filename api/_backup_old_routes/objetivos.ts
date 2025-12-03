const DEFAULT_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/objetivos';
const DEFAULT_CATALOGO_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/objetivos-catalogo';

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

  // GET: Buscar objetivos do usuário OU catálogo (action=catalogo)
  if (req.method === 'GET') {
    const action = req.query?.action;

    // GET ?action=catalogo → retorna catálogo de áreas e objetivos
    if (action === 'catalogo') {
      const remoteEndpoint = process.env.OBJETIVOS_CATALOGO_WEBHOOK_URL || DEFAULT_CATALOGO_ENDPOINT;
      try {
        const upstreamResponse = await fetch(remoteEndpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const contentType = upstreamResponse.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');
        const body = isJson ? await upstreamResponse.json() : await upstreamResponse.text();
        if (!upstreamResponse.ok) {
          res.status(upstreamResponse.status).json(
            typeof body === 'string' ? { success: false, error: body || 'Erro desconhecido' } : body
          );
          return;
        }
        res.status(200).json(body);
        return;
      } catch (error) {
        console.error('[objetivos] Erro ao buscar catálogo:', error);
        res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço' });
        return;
      }
    }

    // GET com user_id → retorna objetivos do usuário
    const usuarioId = readUsuarioId(req.query);

    if (!usuarioId) {
      res.status(400).json({ success: false, error: 'user_id obrigatório' });
      return;
    }

    const remoteEndpoint = process.env.OBJETIVOS_WEBHOOK_URL || DEFAULT_ENDPOINT;

    try {
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
      console.error('[objetivos] Erro ao buscar objetivos:', error);
      res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço' });
    }
    return;
  }

  // POST: Criar novo objetivo
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

    if (!usuarioId) {
      res.status(400).json({ success: false, error: 'user_id obrigatório' });
      return;
    }

    const remoteEndpoint = process.env.OBJETIVOS_WEBHOOK_URL || DEFAULT_ENDPOINT;

    try {
      const upstreamResponse = await fetch(remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedBody),
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
      console.error('[objetivos] Erro ao criar objetivo:', error);
      res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço' });
    }
    return;
  }

  res.status(405).json({ success: false, error: 'Método não suportado' });
}
