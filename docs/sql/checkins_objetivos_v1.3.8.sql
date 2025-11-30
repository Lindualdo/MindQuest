-- ============================================================
-- MindQuest - Estrutura de Dados: Check-ins de Objetivos v1.3.8
-- Data: 2025-11-30
-- ============================================================

-- Tabela para registrar check-ins semanais de progresso nos objetivos
CREATE TABLE checkins_objetivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  objetivo_id UUID NOT NULL REFERENCES usuarios_objetivos(id),
  pontuacao INT NOT NULL CHECK (pontuacao BETWEEN 1 AND 5),
  observacoes TEXT,
  data_checkin DATE NOT NULL DEFAULT CURRENT_DATE,
  semana_ano VARCHAR(7) NOT NULL, -- formato: '2025-W48'
  criado_em TIMESTAMP DEFAULT NOW(),
  
  -- Impedir duplicata: 1 check-in por objetivo por semana
  UNIQUE(objetivo_id, semana_ano)
);

-- Índices para busca
CREATE INDEX idx_checkins_usuario ON checkins_objetivos(usuario_id);
CREATE INDEX idx_checkins_objetivo ON checkins_objetivos(objetivo_id);
CREATE INDEX idx_checkins_semana ON checkins_objetivos(usuario_id, semana_ano);

-- ============================================================
-- Comentários sobre os campos:
-- ============================================================
-- pontuacao: 1=Muito baixo, 2=Baixo, 3=Médio, 4=Bom, 5=Excelente
-- semana_ano: formato ISO week (ex: '2025-W48')
-- Constraint UNIQUE garante apenas 1 check-in por objetivo por semana
-- ============================================================

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================

