-- Adicionar campos do Perfil Pessoal na tabela usuarios
-- Data: 2025-01-22

-- Verificar se os campos já existem antes de adicionar
DO $$
BEGIN
    -- Adicionar campo tom_conversa
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'tom_conversa'
    ) THEN
        ALTER TABLE usuarios 
        ADD COLUMN tom_conversa VARCHAR(20) 
        CHECK (tom_conversa IN ('empativo', 'interativo', 'educativo', 'equilibrado', 'direto'));
        
        RAISE NOTICE 'Campo tom_conversa adicionado com sucesso';
    ELSE
        RAISE NOTICE 'Campo tom_conversa já existe';
    END IF;

    -- Adicionar campo sobre_voce
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'sobre_voce'
    ) THEN
        ALTER TABLE usuarios 
        ADD COLUMN sobre_voce TEXT;
        
        RAISE NOTICE 'Campo sobre_voce adicionado com sucesso';
    ELSE
        RAISE NOTICE 'Campo sobre_voce já existe';
    END IF;
END $$;

-- Verificar campos criados
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name IN ('nome_assistente', 'tom_conversa', 'sobre_voce')
ORDER BY column_name;

