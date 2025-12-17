# Notificações Inteligentes - Especificação Técnica
## Versão 2.1

**Data:** 2025-12-05  
**Workflow:** `job_notificacoes_lembretes_v2` (ID: `i5VG5rHZ39ytueyu`)  
**Status:** Especificação para implementação

---

## 1. Arquitetura do Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCHEDULE TRIGGER                              │
│              Cron: 0 7,8,10,11,13,14,16,17,19,21 * * *          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 QUERY CONTEXTO COMPLETO                          │
│  - Config usuário + canais                                       │
│  - Conquistas/XP recentes                                        │
│  - Quests (ativas, pendentes, atrasadas)                        │
│  - Última conversa (resumo)                                      │
│  - Streak atual                                                  │
│  - Notificações já enviadas hoje                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              DETERMINAR TIPO DE NOTIFICAÇÃO                      │
│  Hora atual → Janela de Conversa OU Janela de Ação              │
└─────────────────────────────────────────────────────────────────┘
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
         ┌──────────────┐        ┌──────────────┐
         │ AGENTE IA    │        │ AGENTE IA    │
         │ CONVERSA     │        │ AÇÃO         │
         └──────────────┘        └──────────────┘
                  │                       │
                  └───────────┬───────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SWITCH CANAL                                │
│              Push │ WhatsApp │ Email (TODO)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOG + ENVIO                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Tabelas e Queries de Contexto

### 2.1 Query Principal - Contexto Completo

```sql
WITH config_usuario AS (
  -- Configurações de notificação do usuário
  SELECT 
    n.usuario_id,
    u.nome,
    u.whatsapp_numero,
    n.lembretes_ativo,
    n.lembretes_periodo,
    n.lembretes_conversas_diarias,
    n.lembretes_quests,
    n.lembretes_canais,
    ARRAY_AGG(DISTINCT dp.token) FILTER (WHERE dp.token IS NOT NULL) AS push_tokens
  FROM notificacoes n
  JOIN usuarios u ON u.id = n.usuario_id
  LEFT JOIN dispositivos_push dp ON dp.usuario_id = n.usuario_id
  WHERE n.lembretes_ativo = true
  GROUP BY n.usuario_id, u.nome, u.whatsapp_numero, n.lembretes_ativo,
           n.lembretes_periodo, n.lembretes_conversas_diarias, 
           n.lembretes_quests, n.lembretes_canais
),

conquistas_recentes AS (
  -- XP e conquistas dos últimos 7 dias
  SELECT 
    uc.usuario_id,
    SUM(uc.xp_ganho) AS xp_semana,
    COUNT(*) AS conquistas_semana,
    MAX(uc.criado_em) AS ultima_conquista
  FROM usuarios_conquistas uc
  WHERE uc.criado_em >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY uc.usuario_id
),

nivel_atual AS (
  -- Nível e streak do usuário
  SELECT 
    j.usuario_id,
    j.nivel_atual,
    j.xp_total,
    j.streak_dias,
    j.streak_max
  FROM usuarios_jornada j
),

conversas_recentes AS (
  -- Última conversa e resumo
  SELECT DISTINCT ON (c.usuario_id)
    c.usuario_id,
    c.id AS ultima_conversa_id,
    c.criado_em AS ultima_conversa_data,
    c.resumo AS ultima_conversa_resumo,
    c.status AS ultima_conversa_status
  FROM usr_chat c
  WHERE c.criado_em >= CURRENT_DATE - INTERVAL '7 days'
  ORDER BY c.usuario_id, c.criado_em DESC
),

conversa_hoje AS (
  -- Verificar se já conversou hoje
  SELECT usuario_id, true AS teve_conversa_hoje
  FROM usr_chat
  WHERE DATE(criado_em) = CURRENT_DATE
  GROUP BY usuario_id
),

quests_contexto AS (
  -- Quests ativas com detalhes completos
  SELECT 
    uq.usuario_id,
    uq.id AS quest_id,
    COALESCE(uq.config->>'titulo', 'Quest') AS titulo,
    COALESCE(uq.config->>'descricao', '') AS descricao,
    uq.origem,  -- 'sabotador' ou 'objetivo'
    uq.origem_id,
    uq.status AS quest_status,
    -- Sabotador relacionado (se origem = sabotador)
    s.nome AS sabotador_nome,
    -- Objetivo relacionado (se origem = objetivo)
    o.titulo AS objetivo_titulo,
    -- Recorrência
    qr.id AS recorrencia_id,
    qr.data_planejada,
    qr.status AS recorrencia_status,
    CASE 
      WHEN qr.data_planejada < CURRENT_DATE AND qr.status = 'pendente' THEN 'atrasada'
      WHEN qr.data_planejada = CURRENT_DATE AND qr.status = 'pendente' THEN 'hoje'
      WHEN qr.id IS NULL AND uq.status = 'ativa' THEN 'nao_planejada'
      ELSE 'ok'
    END AS urgencia
  FROM usuarios_quest uq
  LEFT JOIN quests_recorrencias qr ON qr.usuarios_quest_id = uq.id 
    AND qr.data_planejada <= CURRENT_DATE 
    AND qr.status = 'pendente'
  LEFT JOIN sabotadores s ON uq.origem = 'sabotador' AND uq.origem_id = s.id
  LEFT JOIN objetivos o ON uq.origem = 'objetivo' AND uq.origem_id = o.id
  WHERE uq.status = 'ativa'
),

quests_agregadas AS (
  -- Agregar quests por usuário
  SELECT 
    qc.usuario_id,
    COUNT(*) FILTER (WHERE qc.urgencia = 'atrasada') AS quests_atrasadas,
    COUNT(*) FILTER (WHERE qc.urgencia = 'hoje') AS quests_hoje,
    COUNT(*) FILTER (WHERE qc.urgencia = 'nao_planejada') AS quests_nao_planejadas,
    -- Top 2 quests priorizadas (1 sabotador + 1 objetivo se possível)
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'quest_id', qc.quest_id,
        'titulo', qc.titulo,
        'descricao', qc.descricao,
        'origem', qc.origem,
        'sabotador', qc.sabotador_nome,
        'objetivo', qc.objetivo_titulo,
        'urgencia', qc.urgencia,
        'data_planejada', qc.data_planejada
      ) ORDER BY 
        CASE qc.urgencia 
          WHEN 'atrasada' THEN 1 
          WHEN 'hoje' THEN 2 
          WHEN 'nao_planejada' THEN 3 
        END,
        qc.data_planejada NULLS LAST
    ) AS quests_detalhes
  FROM quests_contexto qc
  WHERE qc.urgencia IN ('atrasada', 'hoje', 'nao_planejada')
  GROUP BY qc.usuario_id
),

notificacoes_hoje AS (
  -- O que já foi notificado hoje
  SELECT 
    nl.usuario_id,
    ARRAY_AGG(DISTINCT nl.tipo) AS tipos_notificados,
    MAX(nl.criado_em) FILTER (WHERE nl.tipo LIKE 'conversa%') AS ultima_notif_conversa,
    MAX(nl.criado_em) FILTER (WHERE nl.tipo LIKE 'acao%') AS ultima_notif_acao
  FROM notificacoes_log nl
  WHERE DATE(nl.criado_em) = CURRENT_DATE
  GROUP BY nl.usuario_id
)

SELECT 
  cu.usuario_id,
  cu.nome,
  cu.whatsapp_numero,
  cu.lembretes_periodo,
  cu.lembretes_conversas_diarias,
  cu.lembretes_quests,
  cu.lembretes_canais,
  cu.push_tokens,
  
  -- Conquistas
  COALESCE(cr.xp_semana, 0) AS xp_semana,
  COALESCE(cr.conquistas_semana, 0) AS conquistas_semana,
  
  -- Nível
  COALESCE(na.nivel_atual, 1) AS nivel_atual,
  COALESCE(na.xp_total, 0) AS xp_total,
  COALESCE(na.streak_dias, 0) AS streak_dias,
  
  -- Conversa
  COALESCE(ch.teve_conversa_hoje, false) AS teve_conversa_hoje,
  conv.ultima_conversa_resumo,
  conv.ultima_conversa_data,
  
  -- Quests
  COALESCE(qa.quests_atrasadas, 0) AS quests_atrasadas,
  COALESCE(qa.quests_hoje, 0) AS quests_hoje,
  COALESCE(qa.quests_nao_planejadas, 0) AS quests_nao_planejadas,
  qa.quests_detalhes,
  
  -- Controle de notificações
  COALESCE(nh.tipos_notificados, ARRAY[]::text[]) AS tipos_notificados_hoje,
  nh.ultima_notif_conversa,
  nh.ultima_notif_acao

FROM config_usuario cu
LEFT JOIN conquistas_recentes cr ON cr.usuario_id = cu.usuario_id
LEFT JOIN nivel_atual na ON na.usuario_id = cu.usuario_id
LEFT JOIN conversas_recentes conv ON conv.usuario_id = cu.usuario_id
LEFT JOIN conversa_hoje ch ON ch.usuario_id = cu.usuario_id
LEFT JOIN quests_agregadas qa ON qa.usuario_id = cu.usuario_id
LEFT JOIN notificacoes_hoje nh ON nh.usuario_id = cu.usuario_id;
```

### 2.2 Tabelas Utilizadas

| Tabela | Dados Extraídos |
|--------|-----------------|
| `usuarios` | nome, whatsapp_numero |
| `notificacoes` | config de lembretes e canais |
| `dispositivos_push` | tokens para push |
| `usuarios_conquistas` | XP e conquistas recentes |
| `usuarios_jornada` | nível, streak |
| `usr_chat` | última conversa, resumo |
| `usuarios_quest` | quests ativas |
| `quests_recorrencias` | pendências e atrasos |
| `sabotadores` | nome do sabotador relacionado |
| `objetivos` | título do objetivo relacionado |
| `notificacoes_log` | controle de envio |

---

## 3. Janelas de Envio

### 3.1 Mapeamento Hora → Tipo

```javascript
const JANELAS = {
  manha: {
    conversa: [7, 8],   // 7h ou 8h
    acao: [10, 11]      // 10h ou 11h
  },
  tarde: {
    conversa: [13, 14], // 13h ou 14h
    acao: [16, 17]      // 16h ou 17h
  },
  noite: {
    conversa: [19],     // 19h
    acao: [21]          // 21h
  }
};

function getTipoNotificacao(horaAtual, periodoUsuario) {
  const janelas = JANELAS[periodoUsuario];
  
  if (janelas.conversa.includes(horaAtual)) return 'conversa';
  if (janelas.acao.includes(horaAtual)) return 'acao';
  
  return null; // Não é hora de enviar para este período
}
```

### 3.2 Schedule Cron

```
0 7,8,10,11,13,14,16,17,19,21 * * *
```

---

## 4. Agente IA - Notificação de Conversa

### 4.1 System Prompt

```markdown
Você é o assistente de notificações do MindQuest, um app de desenvolvimento pessoal.

Sua tarefa é criar UMA mensagem de notificação para convidar o usuário a conversar com seu mentor.

## Filosofia MindQuest
- Conversar → Entender → Agir → Evoluir
- Tom: Acolhedor, humano, empático
- Objetivo: Engajar sem pressionar

## Regras da Mensagem
1. SEMPRE use o nome do usuário
2. Reconheça conquistas recentes (se houver)
3. Faça referência à última conversa (se relevante)
4. Termine com convite aberto, nunca imperativo
5. Máximo 3 frases no corpo

## Formato de Saída (JSON)
{
  "titulo": "Texto curto e engajador (max 50 chars)",
  "corpo_push": "Versão curta para push (max 100 chars)",
  "corpo_whatsapp": "Versão completa para WhatsApp (max 300 chars)",
  "sugestoes_resposta": ["Opção 1", "Opção 2"],
  "contexto_mentor": "Contexto para o mentor caso usuário responda"
}

## Prioridade do Conteúdo
1. Se streak > 3: Celebrar consistência
2. Se XP alto na semana: Reconhecer esforço
3. Se tem resumo de conversa: Dar continuidade
4. Caso geral: Convite acolhedor
```

### 4.2 User Prompt Template

```markdown
## Dados do Usuário
- Nome: {{nome}}
- Período preferido: {{lembretes_periodo}}

## Contexto de Evolução
- Nível atual: {{nivel_atual}}
- XP total: {{xp_total}}
- XP esta semana: {{xp_semana}}
- Streak atual: {{streak_dias}} dias
- Conquistas na semana: {{conquistas_semana}}

## Última Conversa
- Data: {{ultima_conversa_data}}
- Resumo: {{ultima_conversa_resumo}}

## Status Hoje
- Já conversou hoje: {{teve_conversa_hoje}}

Gere a notificação de CONVERSA seguindo as regras do system prompt.
```

### 4.3 Exemplo de Saída - Conversa

```json
{
  "titulo": "Aldo, como você está? 💭",
  "corpo_push": "Vi que você manteve 5 dias de streak! Quer compartilhar como está se sentindo?",
  "corpo_whatsapp": "Oi Aldo! 👋\n\nVi que você está com 5 dias seguidos de evolução - isso é incrível!\n\nNa nossa última conversa você mencionou a pressão no trabalho. Como está lidando com isso?\n\nQuer conversar um pouco?",
  "sugestoes_resposta": ["Sim, vamos conversar!", "Agora não, mais tarde"],
  "contexto_mentor": "Usuário recebeu notificação de conversa. Contexto: streak de 5 dias, última conversa sobre pressão no trabalho. Está engajado mas pode estar sobrecarregado."
}
```

---

## 5. Agente IA - Notificação de Ação

### 5.1 System Prompt

```markdown
Você é o assistente de notificações do MindQuest, um app de desenvolvimento pessoal.

Sua tarefa é criar UMA mensagem de notificação sobre quests/ações pendentes.

## Filosofia MindQuest
- Conversar → Entender → Agir → Evoluir
- Tom: Motivador, mas sem pressão
- Foco: Micro-ações, pequenos passos

## Regras de Seleção de Quests
1. Priorizar quests ATRASADAS sobre pendentes
2. Diversificar: 1 de sabotador + 1 de objetivo (se possível)
3. Se quests muito semelhantes: mencionar apenas 1
4. Máximo 2 quests por notificação

## Regras da Mensagem
1. SEMPRE use o nome do usuário
2. Conecte a quest ao contexto (sabotador/objetivo)
3. Destaque o benefício da ação, não a obrigação
4. Sugira micro-compromisso (5 min, 1 passo)
5. Máximo 4 frases no corpo

## Formato de Saída (JSON)
{
  "titulo": "Gancho emocional + contexto (max 50 chars)",
  "corpo_push": "Versão curta para push (max 100 chars)",
  "corpo_whatsapp": "Versão completa para WhatsApp (max 350 chars)",
  "quests_mencionadas": ["id1", "id2"],
  "sugestoes_resposta": ["Vou fazer agora", "Lembrar mais tarde"],
  "contexto_mentor": "Contexto para o mentor caso usuário responda"
}

## Exemplos de Ganchos por Sabotador
- Hiper-Realizador: "Hora de celebrar pequenas vitórias"
- Controlador: "Um passo de cada vez está ok"
- Ansioso: "5 minutos de calma podem mudar seu dia"
- Crítico: "Você merece esse cuidado"
```

### 5.2 User Prompt Template

```markdown
## Dados do Usuário
- Nome: {{nome}}
- Nível: {{nivel_atual}}
- Streak: {{streak_dias}} dias

## Quests Pendentes
Total atrasadas: {{quests_atrasadas}}
Total hoje: {{quests_hoje}}
Total não planejadas: {{quests_nao_planejadas}}

## Detalhes das Quests (ordenadas por prioridade)
{{#each quests_detalhes}}
### Quest {{@index + 1}}
- ID: {{quest_id}}
- Título: {{titulo}}
- Descrição: {{descricao}}
- Origem: {{origem}}
- Sabotador relacionado: {{sabotador}}
- Objetivo relacionado: {{objetivo}}
- Urgência: {{urgencia}}
- Data planejada: {{data_planejada}}
{{/each}}

## Instruções
1. Analise as quests e selecione no máximo 2
2. Priorize diversidade (1 sabotador + 1 objetivo)
3. Se quests semelhantes, escolha apenas 1
4. Gere mensagem seguindo as regras do system prompt
```

### 5.3 Exemplo de Saída - Ação

```json
{
  "titulo": "Aldo, hora de desafiar o Hiper-Realizador 💪",
  "corpo_push": "2 pequenas ações te esperam hoje. Que tal começar com 'Micro-Movimento'?",
  "corpo_whatsapp": "Ei Aldo! 💪\n\nVocê tem 2 quests esperando por você:\n\n1️⃣ **Micro-Movimento** - 5 min de atividade física\n   → Desafia seu Hiper-Realizador a celebrar o básico\n\n2️⃣ **Reflexão do dia** - Ligada ao seu objetivo de equilíbrio\n\nQual quer fazer primeiro?",
  "quests_mencionadas": ["uuid-quest-1", "uuid-quest-2"],
  "sugestoes_resposta": ["Vou fazer o Micro-Movimento", "Prefiro a Reflexão", "Depois faço"],
  "contexto_mentor": "Usuário recebeu notificação de ação. Quests: Micro-Movimento (sabotador Hiper-Realizador) e Reflexão (objetivo equilíbrio). Ambas pendentes do dia."
}
```

---

## 6. Adaptação por Canal

### 6.1 Push Notification

```javascript
const pushPayload = {
  token: usuario.push_token,
  titulo: ia_output.titulo,
  corpo: ia_output.corpo_push,
  data: {
    tipo: tipo_notificacao, // 'conversa' ou 'acao'
    usuario_id: usuario.id,
    deep_link: tipo === 'conversa' ? '/chat' : '/quests'
  }
};
```

### 6.2 WhatsApp (via sw_evolution_send_message_v2)

```javascript
const whatsappPayload = {
  instanceName: "MindQuest",
  remoteJidOrNumber: usuario.whatsapp_numero,
  messageText: ia_output.corpo_whatsapp + '\n\n' + 
    ia_output.sugestoes_resposta.map((s, i) => `${i+1}. ${s}`).join('\n'),
  minDelayMs: "2000"
};

// Salvar contexto para o Mentor
await salvarContextoMentor(usuario.id, ia_output.contexto_mentor);
```

### 6.3 Integração com Mentor

Quando usuário responde no WhatsApp, o Mentor recebe:

```json
{
  "contexto_notificacao": {
    "tipo": "acao",
    "enviado_em": "2025-12-05T10:00:00Z",
    "contexto": "Usuário recebeu notificação de ação. Quests: Micro-Movimento...",
    "resposta_usuario": "Vou fazer o Micro-Movimento"
  }
}
```

---

## 7. Estrutura do Log

### 7.1 Tabela `notificacoes_log` (atualizada)

```sql
-- Adicionar colunas para IA
ALTER TABLE notificacoes_log ADD COLUMN IF NOT EXISTS 
  titulo TEXT,
  contexto_mentor TEXT,
  quests_mencionadas UUID[];

-- Tipos atualizados
-- tipo: 'conversa_celebracao', 'conversa_continuidade', 'conversa_geral'
--       'acao_atrasada', 'acao_hoje', 'acao_planejamento'
```

### 7.2 Insert com Contexto

```sql
INSERT INTO notificacoes_log (
  usuario_id, canal, tipo, titulo, mensagem, 
  contexto_mentor, quests_mencionadas, status
) VALUES (
  $1::uuid, $2, $3, $4, $5, $6, $7::uuid[], 'enviado'
)
```

---

## 8. Fluxo do Workflow

### 8.1 Nodes Principais

```
1. Schedule Trigger (cron)
2. Manual Trigger (teste)
3. Query Contexto Completo (Postgres)
4. Determinar Tipo (Code)
   - Filtra por período
   - Identifica janela (conversa/ação)
   - Verifica se já notificou
5. Preparar Prompt (Code)
   - Monta contexto para IA
6. Agente IA Conversa (AI Agent)
7. Agente IA Ação (AI Agent)
8. Parser Resposta IA (Code)
9. Switch Canal
10. Enviar Push (HTTP Request)
11. Enviar WhatsApp (sw_evolution_send_message_v2)
12. Email (NoOp - TODO)
13. Log (Postgres)
```

### 8.2 Checklist de Implementação

- [ ] Atualizar query de contexto
- [ ] Criar node de determinação de tipo
- [ ] Configurar agente IA para Conversa
- [ ] Configurar agente IA para Ação
- [ ] Parser de resposta JSON da IA
- [ ] Adaptar mensagem por canal
- [ ] Salvar contexto para Mentor
- [ ] Atualizar estrutura de log
- [ ] Testar fluxo completo
- [ ] Ativar schedule

---

## 9. Configuração dos Agentes IA no n8n

### 9.1 Modelo Recomendado

```
Provider: OpenAI
Model: gpt-4o-mini
Temperature: 0.7
Max Tokens: 500
Response Format: JSON
```

### 9.2 Fallback

Se IA falhar, usar templates estáticos:

```javascript
const TEMPLATES_FALLBACK = {
  conversa: {
    titulo: "{{nome}}, vamos conversar?",
    corpo: "Como está seu dia? Seu mentor está aqui para ouvir você."
  },
  acao: {
    titulo: "{{nome}}, você tem quests pendentes",
    corpo: "Você tem {{total}} quests esperando. Que tal fazer uma agora?"
  }
};
```

---

## 10. TODO - Email (Futuro)

```javascript
// Estrutura para digest semanal
const emailDigest = {
  to: usuario.email,
  subject: "Sua semana no MindQuest 📊",
  template: "weekly_digest",
  data: {
    nome: usuario.nome,
    xp_semana: contexto.xp_semana,
    quests_completadas: contexto.quests_completadas,
    streak: contexto.streak_dias,
    insights: contexto.insights_semana
  }
};
```
