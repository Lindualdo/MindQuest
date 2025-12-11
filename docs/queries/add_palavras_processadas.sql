-- Migração: Adicionar coluna palavras_processadas (v1.3.19)
-- Data: 2025-12-11
-- Objetivo: Permitir reprocessamento de conversas com delta de palavras

-- 1. Adicionar coluna palavras_processadas
ALTER TABLE usr_chat ADD COLUMN IF NOT EXISTS palavras_processadas INTEGER DEFAULT 0;

-- 2. Migrar dados existentes (se processada_em != NULL, assumir que foi processado)
UPDATE usr_chat 
SET palavras_processadas = COALESCE(total_palavras_usuario, 0)
WHERE processada_em IS NOT NULL 
  AND (palavras_processadas IS NULL OR palavras_processadas = 0);

-- 3. Criar índice para performance (opcional)
CREATE INDEX IF NOT EXISTS idx_usr_chat_palavras_processadas 
ON usr_chat(usuario_id, palavras_processadas);

-- 4. Verificar migração
SELECT 
  COUNT(*) as total_conversas,
  COUNT(CASE WHEN palavras_processadas > 0 THEN 1 END) as ja_processadas,
  COUNT(CASE WHEN palavras_processadas = 0 THEN 1 END) as pendentes
FROM usr_chat;
