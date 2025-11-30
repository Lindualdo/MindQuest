import type { VercelRequest, VercelResponse } from '@vercel/node';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://mindquest-n8n.cloudfy.live';
const WEBHOOK_PATH = '/webhook/conquista-objetivo';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
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
    }

    if (req.method === 'POST') {
      const { user_id, objetivo_id } = req.body;
      
      if (!user_id || !objetivo_id) {
        return res.status(400).json({ 
          success: false, 
          error: 'user_id e objetivo_id são obrigatórios' 
        });
      }

      const webhookUrl = `${N8N_BASE_URL}${WEBHOOK_PATH}`;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, objetivo_id }),
      });

      const data = await response.json();
      return res.status(response.ok ? 200 : 500).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API conquista-objetivo] Erro:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao processar requisição' 
    });
  }
}

