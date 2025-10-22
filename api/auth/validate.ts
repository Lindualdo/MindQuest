const REMOTE_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/auth/validate';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let parsedBody: any = null;

  if (req.method === 'POST') {
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
  }

  const token =
    req.method === 'POST'
      ? parsedBody?.token
      : req.query?.token;

  if (!token || Array.isArray(token)) {
    res.status(400).json({ success: false, error: 'Token inválido' });
    return;
  }

  try {
    const targetUrl = REMOTE_ENDPOINT;
    const postResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    const handleResponse = async (response: Response) => {
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const body = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        res.status(response.status).json(
          typeof body === 'string'
            ? { success: false, error: body || 'Erro desconhecido' }
            : body
        );
        return;
      }

      res.status(200).json(body);
    };

    if (postResponse.ok) {
      await handleResponse(postResponse);
      return;
    }

    // fallback para GET se a API ainda não aceitar POST
    const getResponse = await fetch(`${REMOTE_ENDPOINT}?token=${encodeURIComponent(token)}`);
    await handleResponse(getResponse);
    return;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço externo' });
    }
  }
}
