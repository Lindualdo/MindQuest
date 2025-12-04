// Endpoint temporário para diagnosticar VAPID keys na Vercel
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Verificar variáveis de ambiente
  const envPublic = process.env.VAPID_PUBLIC_KEY;
  const envPrivate = process.env.VAPID_PRIVATE_KEY;

  // Tentar carregar do arquivo (não disponível em produção)
  let filePublic = '';
  let filePrivate = '';
  try {
    const fs = await import('fs');
    const path = await import('path');
    const vapidKeysPath = path.join(process.cwd(), 'config', 'vapid-keys.json');
    const vapidKeys = JSON.parse(fs.readFileSync(vapidKeysPath, 'utf-8'));
    filePublic = vapidKeys.publicKey;
    filePrivate = vapidKeys.privateKey;
  } catch (error) {
    // Arquivo não existe (normal em produção)
  }

  res.status(200).json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    vapid: {
      env: {
        publicKeyPresent: !!envPublic,
        privateKeyPresent: !!envPrivate,
        publicKeyLength: envPublic?.length || 0,
        privateKeyLength: envPrivate?.length || 0,
        publicKeyStart: envPublic?.substring(0, 20) || null,
        privateKeyStart: envPrivate?.substring(0, 20) || null
      },
      file: {
        publicKeyPresent: !!filePublic,
        privateKeyPresent: !!filePrivate,
        publicKeyLength: filePublic?.length || 0,
        privateKeyLength: filePrivate?.length || 0
      }
    },
    allEnvVars: Object.keys(process.env)
      .filter(key => key.includes('VAPID'))
      .map(key => ({
        key,
        present: true,
        length: process.env[key]?.length || 0
      }))
  });
}

