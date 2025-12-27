-- Migration: Adicionar coluna memoria_ia para Expert Memoria
-- Data: 2025-12-27

-- 1. Adicionar coluna memoria_ia (jsonb) em usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS memoria_ia jsonb DEFAULT '{}'::jsonb;

-- 2. Criar índice GIN para queries no jsonb (opcional, útil para buscas futuras)
CREATE INDEX IF NOT EXISTS idx_usuarios_memoria_ia 
ON usuarios USING gin (memoria_ia);

-- 3. Comentário explicativo
COMMENT ON COLUMN usuarios.memoria_ia IS 
'Memória permanente do usuário extraída por IA. Estrutura: {"pessoal": {"idade": null, "estado_civil": "string", "filhos": ["array"], "cidade": "string", "profissao": "string"}, "preferencias": {"gostos": ["array"], "interesses": ["array"], "dialetos": "string"}, "fatos_marcantes": ["array"], "ultima_atualizacao": "ISO8601"}';

-- Exemplo de estrutura esperada:
-- {
--   "pessoal": {
--     "idade": null,
--     "estado_civil": "casado",
--     "filhos": ["Pedro (5 anos)"],
--     "cidade": "Fortaleza",
--     "profissao": "Designer"
--   },
--   "preferencias": {
--     "gostos": ["estoicismo", "café sem açúcar", "rock progressivo"],
--     "interesses": ["IA", "astronomia"],
--     "dialetos": "Usa muitas gírias cearenses e termos técnicos de design"
--   },
--   "fatos_marcantes": [
--     "Comprou o primeiro carro em Dez/24",
--     "Está transicionando de carreira"
--   ],
--   "ultima_atualizacao": "2025-12-27T10:00:00Z"
-- }

