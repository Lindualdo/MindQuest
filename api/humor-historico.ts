const REMOTE_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/humor-historico';

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

const normalizeValues = (value: unknown): string[] => {
  if (value === undefined || value === null) {
    return [];
  }

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

  try {
    const upstreamUrl = new URL(REMOTE_ENDPOINT);
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
      headers: {
        'Content-Type': 'application/json'
      }
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
    res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço externo' });
  }
}
