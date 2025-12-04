/**
 * Router consolidado para todas as rotas da API
 * Reduz o número de Serverless Functions de 15 para 1
 * 
 * Endpoints suportados:
 * - /api/quests
 * - /api/quest-detail
 * - /api/criar-quest
 * - /api/criar-quest-manual
 * - /api/concluir-quest
 * - /api/ativar-quest
 * - /api/objetivos
 * - /api/conexao-objetivos
 * - /api/conquista-objetivo
 * - /api/jornada
 * - /api/insights
 * - /api/humor-historico
 * - /api/resumo_conversas
 * - /api/insights_historico
 * - /api/perfil-pessoal
 * - /api/conexao-sabotadores
 * - /api/notificacoes
 * - /api/push-token
 * - /api/card/emocoes
 * - /api/card/insight
 * - /api/card/conversas
 * - /api/card/jornada
 * - /api/progresso-semanal
 * - /api/perfil-big-five
 * - /api/roda/emocoes
 * - /api/acoes/sabotador
 * - /api/ocorrencias/sabotador
 * - /api/full_chat
 */

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://mindquest-n8n.cloudfy.live';
const WEBHOOK_BASE_URL = `${N8N_BASE_URL}/webhook`;

const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

const readUsuarioId = (value: any): string | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const raw = value.usuario_id ?? value.user_id ?? value.id_usuario ?? value.usuarioId ?? value.userId;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
};

const readQuestId = (source: any): string | null => {
  const candidates = [
    source?.quest_id,
    source?.questId,
    source?.instancia_id,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return null;
};

const parseBody = (rawBody: any): any => {
  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  } else if (rawBody && typeof rawBody === 'object') {
    return rawBody;
  } else if (Buffer.isBuffer(rawBody)) {
    try {
      return JSON.parse(rawBody.toString('utf-8'));
    } catch {
      return null;
    }
  }
  return null;
};

const handleResponse = async (response: Response, res: any) => {
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

  if (isJson) {
    res.status(200).json(body);
    return;
  }

  res.status(200).send(body);
};

// Mapeamento de endpoints para webhooks
const ENDPOINT_MAP: Record<string, string> = {
  // Quests
  'quests': '/quests',
  'quest-detail': '/quest-detail',
  'criar-quest': '/criar-quest',
  'criar-quest-manual': '/criar-quest-manual',
  'concluir-quest': '/concluir-quest',
  'ativar-quest': '/ativar-quest',
  // Objetivos
  'objetivos': '/objetivos',
  'objetivos-catalogo': '/objetivos-catalogo',
  'conexao-objetivos': '/conexao-objetivos',
  'conquista-objetivo': '/conquista-objetivo',
  'checkin-objetivo': '/checkin-objetivo',
  // Jornada
  'jornada-niveis': '/jornada-niveis',
  'evoluir-stats': '/evoluir-stats',
  'progresso-semanal': '/progresso-semanal',
  // Cards
  'card/emocoes': '/card/emocoes',
  'card/insight': '/card/insight',
  'card/conversas': '/card/conversas',
  'card/jornada': '/card/jornada',
  // Insights
  'insights': '/insights',
  'humor-historico': '/humor-historico',
  'resumo_conversas': '/resumo_conversas',
  'insights_historico': '/insights_historico',
  'full_chat': '/full_chat',
  // Perfil e outros
  'perfil-pessoal': '/perfil-pessoal',
  'conexao-sabotadores': '/conexao-sabotadores',
  'notificacoes': '/notificacoes',
  'push-token': '/push-token',
  // Big Five e Emoções
  'perfil-big-five': '/perfil-big-five',
  'roda/emocoes': '/roda/emocoes',
  // Sabotadores
  'acoes/sabotador': '/acoes/sabotador',
  'ocorrencias/sabotador': '/ocorrencias/sabotador',
};

// Endpoints que aceitam passagem direta de query params
const SIMPLE_GET_ENDPOINTS = [
  'card/emocoes', 'card/insight', 'card/conversas', 'card/jornada',
  'progresso-semanal', 'perfil-big-five', 'roda/emocoes',
  'acoes/sabotador', 'ocorrencias/sabotador', 'full_chat',
  'objetivos', 'perfil-pessoal', 'notificacoes', 
  'conexao-objetivos', 'conexao-sabotadores', 'conquista-objetivo',
  'checkin-objetivo',
];

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Extrair o endpoint do path - suporta subpaths como card/jornada
  // Na Vercel, o slug pode vir de req.query.slug ou precisar ser extraído de req.url
  let endpoint = '';
  
  // Tentar primeiro do query param (padrão Vercel)
  const slug = req.query.slug as string[] | string | undefined;
  if (slug) {
    endpoint = Array.isArray(slug) ? slug.join('/') : slug;
  }
  
  // Fallback: extrair de req.url se slug não estiver disponível
  if (!endpoint && req.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      const pathParts = url.pathname.split('/').filter(Boolean);
      // Remover 'api' do início se presente
      const apiIndex = pathParts.indexOf('api');
      if (apiIndex >= 0 && pathParts.length > apiIndex + 1) {
        endpoint = pathParts.slice(apiIndex + 1).join('/');
      } else if (pathParts.length > 0) {
        endpoint = pathParts.join('/');
      }
    } catch (e) {
      // Se falhar ao parsear URL, tentar extração simples
      const match = req.url.match(/\/api\/([^?]+)/);
      if (match && match[1]) {
        endpoint = match[1];
      }
    }
  }

  console.log(`[Router] ${req.method} /api/${endpoint}`, { 
    query: req.query, 
    url: req.url,
    slug: req.query.slug 
  });

  // Validar se endpoint foi extraído
  if (!endpoint) {
    console.error('[Router] Endpoint não encontrado', { 
      url: req.url, 
      query: req.query,
      headers: req.headers 
    });
    res.status(404).json({ 
      success: false, 
      error: 'Endpoint não encontrado',
      debug: { url: req.url, query: req.query }
    });
    return;
  }

  // Roteamento especial para jornada (com action)
  if (endpoint === 'jornada') {
    const action = req.query?.action || 'niveis';
    const usuarioId = readUsuarioId(req.query);

    if (!usuarioId) {
      res.status(400).json({ success: false, error: 'user_id obrigatório' });
      return;
    }

    const webhookPath = action === 'stats' ? '/evoluir-stats' : '/jornada-niveis';
    const webhookUrl = `${WEBHOOK_BASE_URL}${webhookPath}?user_id=${encodeURIComponent(usuarioId)}`;

    try {
      const upstreamResponse = await fetch(webhookUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      await handleResponse(upstreamResponse, res);
    } catch (error) {
      console.error(`[jornada] Erro:`, error);
      res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço' });
    }
    return;
  }

  // Roteamento especial para objetivos com action=catalogo
  if (endpoint === 'objetivos' && req.method === 'GET' && req.query?.action === 'catalogo') {
    const remoteEndpoint = `${WEBHOOK_BASE_URL}/objetivos-catalogo`;
    try {
      const upstreamResponse = await fetch(remoteEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      await handleResponse(upstreamResponse, res);
    } catch (error) {
      console.error('[objetivos] Erro ao buscar catálogo:', error);
      res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço' });
    }
    return;
  }

  // Roteamento especial para insights (suporta múltiplos endpoints)
  if (['insights', 'humor-historico', 'resumo_conversas', 'insights_historico'].includes(endpoint)) {
    const endpointPath = ENDPOINT_MAP[endpoint] || ENDPOINT_MAP['insights'];
    const remoteEndpoint = `${WEBHOOK_BASE_URL}${endpointPath}`;

    try {
      const upstreamUrl = new URL(remoteEndpoint);
      const source = req.method === 'GET' ? req.query : parseBody(req.body) ?? {};

      if (source && typeof source === 'object') {
        Object.entries(source as Record<string, unknown>).forEach(([key, rawValue]) => {
          if (rawValue === undefined || rawValue === null || key === 'slug') return;
          const values = Array.isArray(rawValue) 
            ? rawValue
                .map(v => typeof v === 'string' ? v : JSON.stringify(v))
                .filter((v): v is string => Boolean(v))
            : [typeof rawValue === 'string' ? rawValue : JSON.stringify(rawValue)];
          values.forEach(value => {
            if (value) upstreamUrl.searchParams.append(key, value);
          });
        });
      }

      const upstreamResponse = await fetch(upstreamUrl.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      await handleResponse(upstreamResponse, res);
    } catch (error) {
      console.error(`[insights-router/${endpoint}] Erro:`, error);
      res.status(500).json({ success: false, error: 'Erro ao conectar ao serviço externo' });
    }
    return;
  }

  // Obter webhook path do mapeamento
  const webhookPath = ENDPOINT_MAP[endpoint];
  if (!webhookPath) {
    res.status(404).json({ success: false, error: `Endpoint não encontrado: ${endpoint}` });
    return;
  }

  const remoteEndpoint = `${WEBHOOK_BASE_URL}${webhookPath}`;

  // Handlers específicos por endpoint
  try {
    // GET handlers
    if (req.method === 'GET') {
      // Endpoints GET simples - passam query params direto
      if (SIMPLE_GET_ENDPOINTS.includes(endpoint)) {
        const url = new URL(remoteEndpoint);
        // Passar todos os query params exceto slug
        Object.entries(req.query as Record<string, unknown>).forEach(([key, value]) => {
          if (key !== 'slug' && value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
          }
        });
        
        const upstreamResponse = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        await handleResponse(upstreamResponse, res);
        return;
      }

      if (endpoint === 'quests') {
        const usuarioId = readUsuarioId(req.query);
        if (!usuarioId) {
          res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
          return;
        }
        const url = new URL(remoteEndpoint);
        const userIdParam = req.query.user_id || req.query.usuario_id || usuarioId;
        url.searchParams.set('user_id', userIdParam);
        const upstreamResponse = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        await handleResponse(upstreamResponse, res);
        return;
      }

      if (endpoint === 'quest-detail') {
        const usuarioId = readUsuarioId(req.query);
        const questId = readQuestId(req.query);
        if (!usuarioId || !questId) {
          res.status(400).json({ success: false, error: 'usuario_id e quest_id obrigatórios' });
          return;
        }
        const queryParams = new URLSearchParams({
          user_id: usuarioId,
          quest_id: questId,
        });
        const webhookUrl = `${remoteEndpoint}?${queryParams.toString()}`;
        const upstreamResponse = await fetch(webhookUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        await handleResponse(upstreamResponse, res);
        return;
      }

      if (endpoint === 'concluir-quest') {
        const usuarioId = readUsuarioId(req.query);
        const questId = readQuestId(req.query);
        if (!usuarioId || !questId) {
          res.status(400).json({ success: false, error: 'usuario_id e quest_id obrigatórios' });
          return;
        }
        const queryParams = new URLSearchParams({
          usuario_id: usuarioId,
          quest_id: questId,
        });
        if (req.query.fonte) queryParams.set('fonte', String(req.query.fonte));
        if (req.query.comentario) queryParams.set('comentario', String(req.query.comentario));
        if (req.query.data_referencia) queryParams.set('data_referencia', String(req.query.data_referencia));
        if (req.query.dataReferencia) queryParams.set('data_referencia', String(req.query.dataReferencia));
        const webhookUrl = `${remoteEndpoint}?${queryParams.toString()}`;
        const upstreamResponse = await fetch(webhookUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        await handleResponse(upstreamResponse, res);
        return;
      }

      if (endpoint === 'ativar-quest') {
        const usuarioId = readUsuarioId(req.query);
        const questId = readQuestId(req.query);
        const recorrenciaDias = parseInt(req.query.recorrencia_dias || req.query.recorrenciaDias || '0', 10);
        if (!usuarioId || !questId || !recorrenciaDias || recorrenciaDias < 1) {
          res.status(400).json({ success: false, error: 'usuario_id, quest_id e recorrencia_dias válidos obrigatórios' });
          return;
        }
        const queryParams = new URLSearchParams({
          usuario_id: usuarioId,
          quest_id: questId,
          recorrencia_dias: recorrenciaDias.toString(),
        });
        if (req.query.tipo_recorrencia) {
          queryParams.set('tipo_recorrencia', String(req.query.tipo_recorrencia));
        }
        const webhookUrl = `${remoteEndpoint}?${queryParams.toString()}`;
        const upstreamResponse = await fetch(webhookUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        await handleResponse(upstreamResponse, res);
        return;
      }
    }

    // POST handlers
    if (req.method === 'POST') {
      const parsedBody = parseBody(req.body);

      if (endpoint === 'quests') {
        const usuarioId = readUsuarioId(parsedBody);
        if (!usuarioId) {
          res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
          return;
        }
        const payload: Record<string, unknown> = { usuario_id: usuarioId };
        if (parsedBody?.quests_personalizadas !== undefined) {
          payload.quests_personalizadas = parsedBody.quests_personalizadas;
        }
        if (parsedBody?.atualizacoes_status !== undefined) {
          payload.atualizacoes_status = parsedBody.atualizacoes_status;
        }
        const upstreamResponse = await fetch(remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        await handleResponse(upstreamResponse, res);
        return;
      }

      if (endpoint === 'criar-quest') {
        const usuarioId = readUsuarioId(parsedBody);
        if (!usuarioId) {
          res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
          return;
        }
        if (!parsedBody?.titulo || typeof parsedBody.titulo !== 'string' || !parsedBody.titulo.trim()) {
          res.status(400).json({ success: false, error: 'titulo obrigatório' });
          return;
        }
        if (!parsedBody?.area_vida || typeof parsedBody.area_vida !== 'string') {
          res.status(400).json({ success: false, error: 'area_vida obrigatória' });
          return;
        }
        const payload = {
          usuario_id: usuarioId,
          titulo: parsedBody.titulo.trim(),
          descricao: parsedBody.descricao || null,
          tipo: parsedBody.tipo || 'personalizada',
          area_vida: parsedBody.area_vida,
          recorrencia_dias: parsedBody.recorrencia_dias || null,
          quest_estagio: 'a_fazer',
        };
        const upstreamResponse = await fetch(remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        await handleResponse(upstreamResponse, res);
        return;
      }

      // criar-quest-manual - passa body direto
      if (endpoint === 'criar-quest-manual') {
        const usuarioId = readUsuarioId(parsedBody);
        if (!usuarioId) {
          res.status(400).json({ success: false, error: 'usuario_id obrigatório' });
          return;
        }
        const upstreamResponse = await fetch(remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedBody),
        });
        await handleResponse(upstreamResponse, res);
        return;
      }

      if (endpoint === 'push-token') {
        const usuarioId = readUsuarioId(parsedBody);
        const token = parsedBody?.token;
        if (!usuarioId || !token || typeof token !== 'string' || token.trim().length === 0) {
          res.status(400).json({ success: false, error: 'user_id e token obrigatórios' });
          return;
        }
        const payload = {
          user_id: usuarioId,
          token: token.trim(),
          user_agent: parsedBody?.user_agent || null,
        };
        const upstreamResponse = await fetch(remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        await handleResponse(upstreamResponse, res);
        return;
      }

      if (endpoint === 'conquista-objetivo') {
        const { user_id, objetivo_id } = parsedBody || {};
        if (!user_id || !objetivo_id) {
          res.status(400).json({ success: false, error: 'user_id e objetivo_id são obrigatórios' });
          return;
        }
        const upstreamResponse = await fetch(remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id, objetivo_id }),
        });
        await handleResponse(upstreamResponse, res);
        return;
      }

      // Endpoints POST simples (objetivos, perfil-pessoal, notificacoes, checkin-objetivo)
      if (['objetivos', 'perfil-pessoal', 'notificacoes', 'checkin-objetivo'].includes(endpoint)) {
        const usuarioId = readUsuarioId(parsedBody);
        if (!usuarioId) {
          res.status(400).json({ success: false, error: 'user_id obrigatório' });
          return;
        }
        const upstreamResponse = await fetch(remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedBody),
        });
        await handleResponse(upstreamResponse, res);
        return;
      }
    }

    res.status(405).json({ success: false, error: 'Método não suportado' });
  } catch (error) {
    console.error(`[router/${endpoint}] Erro:`, error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao conectar ao serviço' 
    });
  }
}
