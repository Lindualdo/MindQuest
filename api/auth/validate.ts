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

  const token =
    req.method === 'POST'
      ? req.body?.token
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
    const contentType = upstreamResponse.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseBody = isJson ? await upstreamResponse.json() : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      res.status(upstreamResponse.status).json(
        typeof responseBody === 'string'
          ? { success: false, error: responseBody || 'Erro desconhecido' }
          : responseBody
      );
      return;
    }

    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço externo' });
  }
}
