const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://mindquest-n8n.cloudfy.live';
const NIVEIS_WEBHOOK_PATH = '/webhook/jornada-niveis';
const STATS_WEBHOOK_PATH = '/webhook/evoluir-stats';

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
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

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Método não suportado' });
    return;
  }

  const action = req.query?.action || 'niveis';
  const usuarioId = readUsuarioId(req.query);

  if (!usuarioId) {
    res.status(400).json({ success: false, error: 'user_id obrigatório' });
    return;
  }

  try {
    let webhookPath: string;

    if (action === 'stats') {
      webhookPath = STATS_WEBHOOK_PATH;
    } else {
      // default: niveis
      webhookPath = NIVEIS_WEBHOOK_PATH;
    }

    const webhookUrl = `${N8N_BASE_URL}${webhookPath}?user_id=${encodeURIComponent(usuarioId)}`;

    const upstreamResponse = await fetch(webhookUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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

    res.status(200).json(body);
  } catch (error) {
    console.error(`[jornada] Erro ao buscar ${action}:`, error);
    res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço' });
  }
}

