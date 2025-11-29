import type { VercelRequest, VercelResponse } from '@vercel/node';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://mindquest-n8n.cloudfy.live';
// TODO: Mudar para /webhook/ após ativar na UI do n8n
const WEBHOOK_PATH = '/webhook-test/jornada-niveis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookUrl = `${N8N_BASE_URL}${WEBHOOK_PATH}`;
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : 500).json(data);
  } catch (error) {
    console.error('[API jornada-niveis] Erro:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao buscar níveis da jornada' 
    });
  }
}

