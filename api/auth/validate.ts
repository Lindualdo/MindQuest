const REMOTE_ENDPOINT = 'https://mindquest-n8n.cloudfy.live/webhook/auth/validate';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { token } = req.query;

  if (!token || Array.isArray(token)) {
    res.status(400).json({ success: false, error: 'Token inválido' });
    return;
  }

  try {
    const response = await fetch(`${REMOTE_ENDPOINT}?token=${encodeURIComponent(token)}`);
    const data = await response.json();

    res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço externo' });
  }
}
