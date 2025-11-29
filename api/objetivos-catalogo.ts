const DEFAULT_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/objetivos-catalogo';

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
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

  const remoteEndpoint = process.env.OBJETIVOS_CATALOGO_WEBHOOK_URL || DEFAULT_ENDPOINT;

  try {
    const upstreamResponse = await fetch(remoteEndpoint, {
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
    console.error('[objetivos-catalogo] Erro ao buscar catálogo:', error);
    res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço' });
  }
}

