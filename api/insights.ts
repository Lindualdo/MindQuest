/**
 * Router consolidado para webhooks de proxy
 * Endpoints: /api/insights, /api/humor-historico, /api/resumo_conversas, /api/insights_historico
 */
import { setCorsHeaders } from './utils/cors';

const WEBHOOK_BASE_URL = 'https://mindquest-n8n.cloudfy.live/webhook';

const ENDPOINT_MAP: Record<string, string> = {
  'insights': '/insights',
  'humor-historico': '/humor-historico',
  'resumo_conversas': '/resumo_conversas',
  'insights_historico': '/insights_historico',
};

const normalizeValues = (value: unknown): string[] => {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry : JSON.stringify(entry)))
      .filter((entry): entry is string => Boolean(entry));
  }
  return [typeof value === 'string' ? value : JSON.stringify(value)];
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

  // Detectar endpoint pelo path da URL
  const url = new URL(req.url || '/api/insights', 'http://localhost');
  const pathParts = url.pathname.split('/').filter(Boolean);
  const endpointName = pathParts[pathParts.length - 1] || 'insights';
  
  const endpointPath = ENDPOINT_MAP[endpointName] || ENDPOINT_MAP['insights'];
  const remoteEndpoint = `${WEBHOOK_BASE_URL}${endpointPath}`;

  try {
    const upstreamUrl = new URL(remoteEndpoint);
    const source = req.method === 'GET' ? req.query : req.body ?? {};

    if (source && typeof source === 'object') {
      Object.entries(source as Record<string, unknown>).forEach(([key, rawValue]) => {
        normalizeValues(rawValue).forEach((value) => {
          upstreamUrl.searchParams.append(key, value);
        });
      });
    }

    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
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

    res.status(200).json(isJson ? body : body);
  } catch (error) {
    console.error(`[insights-router/${endpointName}] Erro:`, error);
    res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço externo' });
  }
}

