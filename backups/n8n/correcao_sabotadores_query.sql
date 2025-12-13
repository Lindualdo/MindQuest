-- =====================================================
-- CORREÇÃO: Query UPSERT para Gravar Sabotadores
-- Workflow: sw_experts_v2
-- Node: Gravar Sabotadores (821c8d86-c520-48ca-a45a-ba36eb8e1379)
-- =====================================================

-- UPSERT sabotadores: 1 registro por (usuario, sabotador, chat)
WITH sabotadores_input AS (
  SELECT 
    $1::uuid as usuario_id,
    $2::uuid as chat_id,
    $3::jsonb as sabotadores_array
)
INSERT INTO usuarios_sabotadores (
  usuario_id,
  chat_id,
  sabotador_id,
  intensidade_media,
  intensidade_acumulada_dia,
  total_deteccoes_dia,
  total_deteccoes,
  contexto_principal,
  insight_atual,
  apelido_personalizado,
  contramedida_ativa,
  sabotador_predominante,
  data_ultima_atividade
)
SELECT 
  si.usuario_id,
  si.chat_id,
  (sabotador->>'sabotador_id')::varchar(30),
  (sabotador->>'intensidade')::integer,
  (sabotador->>'intensidade')::integer,
  1,
  1,
  (sabotador->>'contexto')::varchar(100),
  (sabotador->>'insights')::text,
  (sabotador->>'apelido')::varchar(50),
  (sabotador->>'contramedida')::text,
  true,
  CURRENT_DATE
FROM sabotadores_input si,
     jsonb_array_elements(si.sabotadores_array) as sabotador
WHERE (sabotador->>'intensidade')::integer >= 30
ON CONFLICT (usuario_id, sabotador_id, chat_id) DO UPDATE SET
  total_deteccoes_dia = usuarios_sabotadores.total_deteccoes_dia + 1,
  total_deteccoes = usuarios_sabotadores.total_deteccoes + 1,
  intensidade_acumulada_dia = usuarios_sabotadores.intensidade_acumulada_dia + EXCLUDED.intensidade_media,
  intensidade_media = (usuarios_sabotadores.intensidade_acumulada_dia + EXCLUDED.intensidade_media) / 
                      (usuarios_sabotadores.total_deteccoes_dia + 1),
  contexto_principal = CASE 
    WHEN EXCLUDED.intensidade_media > usuarios_sabotadores.intensidade_media 
    THEN EXCLUDED.contexto_principal ELSE usuarios_sabotadores.contexto_principal END,
  insight_atual = CASE 
    WHEN EXCLUDED.intensidade_media > usuarios_sabotadores.intensidade_media 
    THEN EXCLUDED.insight_atual ELSE usuarios_sabotadores.insight_atual END,
  contramedida_ativa = CASE 
    WHEN EXCLUDED.intensidade_media > usuarios_sabotadores.intensidade_media 
    THEN EXCLUDED.contramedida_ativa ELSE usuarios_sabotadores.contramedida_ativa END,
  data_ultima_atividade = CURRENT_DATE,
  atualizado_em = NOW()
RETURNING id, sabotador_id, intensidade_media, total_deteccoes_dia;

-- =====================================================
-- REGRAS (para Sticky Note do workflow)
-- =====================================================
/*
## Expert - Sabotadores

### Regras de Persistência
- **Chave única:** `(usuario_id, sabotador_id, chat_id)`
- **Constraint:** `usuarios_sabotadores_unique_por_chat`

### Comportamento UPSERT
| Campo | INSERT | UPDATE |
|-------|--------|--------|
| `total_deteccoes_dia` | 1 | +1 |
| `total_deteccoes` | 1 | +1 |
| `intensidade_acumulada_dia` | valor | soma |
| `intensidade_media` | valor | recalcula média |
| `contexto/insight/contramedida` | valor | mantém se intensidade maior |

### Filtros
- Intensidade mínima: **30**
- Apenas sabotadores do catálogo válido
*/
