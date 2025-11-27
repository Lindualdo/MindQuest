const REMOTE_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/insights_historico';

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

const normalizeValues = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : value ? [String(value)] : [];

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(200).end();
  }

  setCorsHeaders(res);

  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id é obrigatório' });
    }

    const params = new URLSearchParams({
      user_id: String(user_id),
    });

    const url = `${REMOTE_ENDPOINT}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API insights_historico] Erro do n8n:', response.status, errorText);
      return res.status(response.status).json({
        error: `Erro ao buscar histórico de insights: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('[API insights_historico] Erro:', error);
    return res.status(500).json({
      error: 'Erro interno ao processar requisição',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

