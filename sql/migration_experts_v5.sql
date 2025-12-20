-- Migration v5: Adicionar controle de experts com retry
-- Data: 2025-12-20

-- 1. Adicionar coluna experts_processados (jsonb) em usr_chat
ALTER TABLE usr_chat 
ADD COLUMN IF NOT EXISTS experts_processados jsonb DEFAULT '{}'::jsonb;

-- 2. Criar índice GIN para queries no jsonb
CREATE INDEX IF NOT EXISTS idx_usr_chat_experts_processados 
ON usr_chat USING gin (experts_processados);

-- 3. Comentário explicativo
COMMENT ON COLUMN usr_chat.experts_processados IS 
'Controle de processamento individual por expert. Estrutura: {"expert": {"processado_em": "timestamp", "status": "sucesso|erro|bloqueado", "tentativas": 0, "ultimo_erro_em": "timestamp", "ultimo_erro_msg": "mensagem"}}';

-- Exemplo de estrutura esperada:
-- {
--   "sabotadores": {
--     "processado_em": "2025-12-20T10:30:00",
--     "status": "sucesso",
--     "tentativas": 0
--   },
--   "emocoes": {
--     "processado_em": "2025-12-20T10:30:00",
--     "status": "erro",
--     "tentativas": 2,
--     "ultimo_erro_em": "2025-12-20T10:30:00",
--     "ultimo_erro_msg": "constraint violation"
--   },
--   "humor": {
--     "processado_em": "2025-12-20T10:30:00",
--     "status": "sucesso",
--     "tentativas": 0
--   },
--   "bigfive": {
--     "processado_em": "2025-12-20T10:30:00",
--     "status": "bloqueado",
--     "tentativas": 5,
--     "ultimo_erro_em": "2025-12-20T10:30:00",
--     "ultimo_erro_msg": "repeated failure"
--   },
--   "insights": {
--     "processado_em": "2025-12-20T10:30:00",
--     "status": "sucesso",
--     "tentativas": 0
--   }
-- }

