import webpush from 'web-push';
import fs from 'fs';
import path from 'path';

// Função para carregar VAPID keys (lazy loading no handler)
function getVapidKeys() {
  // Prioridade 1: Variáveis de ambiente (produção Vercel)
  let publicKey = process.env.VAPID_PUBLIC_KEY || '';
  let privateKey = process.env.VAPID_PRIVATE_KEY || '';

  // Prioridade 2: Arquivo local (desenvolvimento)
  if (!publicKey || !privateKey) {
    try {
      const vapidKeysPath = path.join(process.cwd(), 'config', 'vapid-keys.json');
      const vapidKeys = JSON.parse(fs.readFileSync(vapidKeysPath, 'utf-8'));
      publicKey = vapidKeys.publicKey || publicKey;
      privateKey = vapidKeys.privateKey || privateKey;
    } catch (error) {
      // Arquivo não existe (normal em produção)
      console.error('[Send Push] Arquivo vapid-keys.json não encontrado:', error);
    }
  }

  return { publicKey, privateKey };
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

  // Carregar VAPID keys (lazy loading)
  const { publicKey: VAPID_PUBLIC_KEY, privateKey: VAPID_PRIVATE_KEY } = getVapidKeys();

  // Debug: verificar carregamento das variáveis
  const hasEnvVars = !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
  const hasKeys = !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    res.status(500).json({ 
      success: false, 
      error: 'VAPID keys não configuradas',
      debug: {
        hasEnvVars,
        hasKeys,
        publicKeyLength: VAPID_PUBLIC_KEY?.length || 0,
        privateKeyLength: VAPID_PRIVATE_KEY?.length || 0,
        envVars: {
          publicPresent: !!process.env.VAPID_PUBLIC_KEY,
          privatePresent: !!process.env.VAPID_PRIVATE_KEY
        }
      }
    });
    return;
  }

  // Configurar web-push (sempre no handler para garantir)
  webpush.setVapidDetails(
    'mailto:suporte@mindquest.pt',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );

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

