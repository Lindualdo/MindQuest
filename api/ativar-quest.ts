import { setCorsHeaders } from '@/lib/cors';

const DEFAULT_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/ativar-quest';

const readUsuarioId = (source: Record<string, unknown>): string | null => {
  const candidates = [
    source.usuario_id,
    source.user_id,
    source.id_usuario,
  ].filter((v): v is string => typeof v === 'string' && v.trim().length > 0);

  if (candidates.length > 0) {
    const trimmed = candidates[0].trim();
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

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Método não suportado' });
    return;
  }

  const source = req.query ?? {};
  const usuarioId = readUsuarioId(source);
  const questId = typeof source.quest_id === 'string' ? source.quest_id.trim() : null;
  const recorrenciaDias = parseInt(source.recorrencia_dias || '0', 10);

  if (!usuarioId) {
    res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
    return;
  }

  if (!questId) {
    res.status(400).json({ success: false, error: 'quest_id obrigatório' });
    return;
  }

  if (!recorrenciaDias || recorrenciaDias < 1) {
    res.status(400).json({ success: false, error: 'recorrencia_dias deve ser um número maior que 0' });
    return;
  }

  const remoteEndpoint = process.env.ATIVAR_QUEST_WEBHOOK_URL || DEFAULT_ENDPOINT;

  try {
    const url = new URL(remoteEndpoint);
    url.searchParams.set('usuario_id', usuarioId);
    url.searchParams.set('quest_id', questId);
    url.searchParams.set('recorrencia_dias', recorrenciaDias.toString());

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
      res.status(200).json({ success: true, ...body });
      return;
    }

    res.status(200).send(body);
  } catch (error) {
    console.error('[ativar-quest] Erro ao conectar:', error);
    res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço de ativação de quest' });
  }
}

