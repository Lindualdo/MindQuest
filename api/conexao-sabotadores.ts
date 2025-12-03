import type { VercelRequest, VercelResponse } from '@vercel/node';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://mindquest-n8n.cloudfy.live';
const WEBHOOK_PATH = '/webhook/conexao-sabotadores';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const { user_id } = req.query;
    
    if (!user_id || typeof user_id !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'user_id é obrigatório' 
      });
    }

    const webhookUrl = `${N8N_BASE_URL}${WEBHOOK_PATH}?user_id=${encodeURIComponent(user_id)}`;
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : 500).json(data);
  } catch (error) {
    console.error('[API conexao-sabotadores] Erro:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao processar requisição' 
    });
  }
}

