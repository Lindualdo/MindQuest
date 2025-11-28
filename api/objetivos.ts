import { setCorsHeaders } from './utils/cors';

const DEFAULT_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/objetivos';

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

  // GET: Buscar objetivos
  if (req.method === 'GET') {
    const usuarioId = readUsuarioId(req.query);

    if (!usuarioId) {
      res.status(400).json({ success: false, error: 'user_id é obrigatório' });
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
            : { ...(typeof body === 'object' ? body : {}), success: false }
        );
        return;
      }

      if (!isJson) {
        res.status(500).json({
          success: false,
          error: 'Webhook retornou HTML em vez de JSON. Verifique se o workflow está ativo.',
        });
        return;
      }

      // Garantir formato de resposta esperado pelo frontend
      const responseData = typeof body === 'object' && body !== null
        ? { ...body, success: true }
        : { success: true, objetivo: body || null };
      
      res.status(200).json(responseData);
    } catch (error) {
      console.error('[objetivos] Erro ao buscar objetivos:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar objetivos',
      });
    }
    return;
  }

  // POST: Salvar objetivos
  if (req.method === 'POST') {
    // Na Vercel, o body já vem parseado automaticamente
    const body = req.body ?? {};
    
    console.log('[objetivos] POST recebido:', { body });

    const usuarioId = readUsuarioId(body);

    if (!usuarioId) {
      res.status(400).json({ success: false, error: 'user_id é obrigatório' });
      return;
    }

    const remoteEndpoint = process.env.OBJETIVOS_WEBHOOK_URL || DEFAULT_ENDPOINT;

    const payload = {
      user_id: usuarioId,
      objetivo: body?.objetivo || null,
    };

    console.log('[objetivos] Enviando para webhook:', { remoteEndpoint, payload });

    try {
      const upstreamResponse = await fetch(remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('[objetivos] Webhook response status:', upstreamResponse.status);

      const contentType = upstreamResponse.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const body = isJson ? await upstreamResponse.json() : await upstreamResponse.text();

      console.log('[objetivos] Webhook response body:', { isJson, body: typeof body === 'object' ? JSON.stringify(body) : body });

      if (!upstreamResponse.ok) {
        res.status(upstreamResponse.status).json(
          typeof body === 'string'
            ? { success: false, error: body || 'Erro desconhecido' }
            : { ...(typeof body === 'object' ? body : {}), success: false }
        );
        return;
      }

      if (!isJson) {
        res.status(500).json({
          success: false,
          error: 'Webhook retornou HTML em vez de JSON. Verifique se o workflow está ativo.',
        });
        return;
      }

      // Garantir formato de resposta esperado pelo frontend
      const responseData = typeof body === 'object' && body !== null
        ? { ...body, success: true }
        : { success: true };

      console.log('[objetivos] Retornando resposta:', responseData);
      res.status(200).json(responseData);
    } catch (error) {
      console.error('[objetivos] Erro ao salvar objetivos:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao salvar objetivos',
      });
    }
    return;
  }

  res.status(405).json({ success: false, error: 'Método não suportado' });
}
