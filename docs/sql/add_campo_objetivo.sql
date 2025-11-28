-- Adicionar campo objetivo na tabela usuarios
-- Data: 2025-01-22

-- Verificar se a coluna já existe antes de adicionar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios' 
        AND column_name = 'objetivo'
    ) THEN
        ALTER TABLE public.usuarios 
        ADD COLUMN objetivo TEXT;
        
        COMMENT ON COLUMN public.usuarios.objetivo IS 'Objetivos principais do usuário listados por ordem de prioridade';
    END IF;
END $$;

