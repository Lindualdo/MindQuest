import webpush from 'web-push';
import fs from 'fs';
import path from 'path';

// Carregar VAPID keys (prioridade: variáveis de ambiente > arquivo local)
let VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
let VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

// Se não estiver em variáveis de ambiente, tentar arquivo local (dev)
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  try {
    const vapidKeysPath = path.join(process.cwd(), 'config', 'vapid-keys.json');
    const vapidKeys = JSON.parse(fs.readFileSync(vapidKeysPath, 'utf-8'));
    VAPID_PUBLIC_KEY = vapidKeys.publicKey;
    VAPID_PRIVATE_KEY = vapidKeys.privateKey;
  } catch (error) {
    console.error('[Send Push] Erro ao carregar VAPID keys do arquivo:', error);
  }
}

// Configurar web-push se as keys estiverem disponíveis
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:suporte@mindquest.pt',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  // Debug: verificar carregamento das variáveis (remover após validação)
  const hasEnvVars = !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
  const hasFileKeys = !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    res.status(500).json({ 
      success: false, 
      error: 'VAPID keys não configuradas',
      debug: {
        hasEnvVars,
        hasFileKeys,
        publicKeyLength: VAPID_PUBLIC_KEY?.length || 0,
        privateKeyLength: VAPID_PRIVATE_KEY?.length || 0
      }
    });
    return;
  }

  try {
    const { token, titulo, corpo, usuario_id, tipo } = req.body;

    if (!token || !titulo || !corpo) {
      res.status(400).json({ 
        success: false, 
        error: 'Dados incompletos: token, titulo e corpo são obrigatórios' 
      });
      return;
    }

    // Parsear token: endpoint::p256dh::auth
    const [endpoint, p256dh, auth] = token.split('::');

    if (!endpoint || !p256dh || !auth) {
      res.status(400).json({ 
        success: false, 
        error: 'Token inválido: formato esperado endpoint::p256dh::auth' 
      });
      return;
    }

    // Preparar subscription
    const subscription = {
      endpoint,
      keys: {
        p256dh: p256dh,
        auth: auth
      }
    };

    // Preparar payload
    const payload = JSON.stringify({
      title: titulo,
      body: corpo,
      icon: '/mindquest_logo.png',
      badge: '/mindquest_logo.png',
      data: {
        usuario_id: usuario_id || null,
        tipo: tipo || 'lembrete',
        url: '/app',
        timestamp: new Date().getTime()
      }
    });

    // Enviar notificação
    await webpush.sendNotification(subscription, payload);

    res.status(200).json({
      success: true,
      usuario_id: usuario_id || null,
      enviado_em: new Date().toISOString(),
      titulo,
      corpo
    });
  } catch (error: any) {
    console.error('[Send Push] Erro ao enviar notificação:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Erro desconhecido ao enviar notificação',
      details: error.statusCode ? `Status: ${error.statusCode}` : undefined
    });
  }
}

