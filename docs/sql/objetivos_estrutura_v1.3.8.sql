-- ============================================================
-- MindQuest - Estrutura de Dados: Sistema de Objetivos v1.3.8
-- Data: 2025-11-29
-- ============================================================

-- 1. Adicionar campos icone e ordem em areas_vida_catalogo
ALTER TABLE areas_vida_catalogo 
  ADD COLUMN IF NOT EXISTS icone VARCHAR(10),
  ADD COLUMN IF NOT EXISTS ordem INT DEFAULT 0;

-- Atualizar com ícones e ordem
UPDATE areas_vida_catalogo SET icone = '💼', ordem = 1 WHERE codigo = 'trabalho';
UPDATE areas_vida_catalogo SET icone = '💛', ordem = 2 WHERE codigo = 'relacionamentos';
UPDATE areas_vida_catalogo SET icone = '🙏', ordem = 3 WHERE codigo = 'espiritualidade';
UPDATE areas_vida_catalogo SET icone = '💰', ordem = 4 WHERE codigo = 'financas';
UPDATE areas_vida_catalogo SET icone = '🏃', ordem = 5 WHERE codigo = 'saude';
UPDATE areas_vida_catalogo SET icone = '🧠', ordem = 6 WHERE codigo = 'evolucao';
UPDATE areas_vida_catalogo SET icone = '👨‍👩‍👧', ordem = 7 WHERE codigo = 'familia';
UPDATE areas_vida_catalogo SET icone = '🎮', ordem = 8 WHERE codigo = 'laser';

-- 2. Criar tabela objetivos_catalogo
CREATE TABLE objetivos_catalogo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_vida_id UUID REFERENCES areas_vida_catalogo(id),
  codigo VARCHAR(50) NOT NULL UNIQUE,
  titulo VARCHAR(100) NOT NULL,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- 3. Criar tabela usuarios_objetivos
CREATE TABLE usuarios_objetivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  area_vida_id UUID NOT NULL REFERENCES areas_vida_catalogo(id),
  objetivo_catalogo_id UUID REFERENCES objetivos_catalogo(id),
  titulo VARCHAR(100) NOT NULL,
  detalhamento TEXT NOT NULL,
  prazo_dias INT NOT NULL CHECK (prazo_dias IN (30, 45, 60)),
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_limite DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' 
    CHECK (status IN ('ativo', 'alcancado', 'expirado', 'cancelado')),
  alcancado_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para busca
CREATE INDEX idx_usuarios_objetivos_usuario ON usuarios_objetivos(usuario_id);
CREATE INDEX idx_usuarios_objetivos_status ON usuarios_objetivos(usuario_id, status);

-- 4. Trigger para limitar 2 objetivos ativos por usuário
CREATE OR REPLACE FUNCTION check_limite_objetivos_ativos()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'ativo' THEN
    IF (SELECT COUNT(*) FROM usuarios_objetivos 
        WHERE usuario_id = NEW.usuario_id 
        AND status = 'ativo' 
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')) >= 2 THEN
      RAISE EXCEPTION 'Limite de 2 objetivos ativos atingido';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limite_objetivos_ativos
  BEFORE INSERT OR UPDATE ON usuarios_objetivos
  FOR EACH ROW EXECUTE FUNCTION check_limite_objetivos_ativos();

-- 5. Carga do catálogo de objetivos

-- Carreira/Trabalho
INSERT INTO objetivos_catalogo (area_vida_id, codigo, titulo, ordem) VALUES
  ('22222222-2222-4222-8222-222222222222', 'mudar_emprego', 'Mudar de emprego', 1),
  ('22222222-2222-4222-8222-222222222222', 'mudar_area', 'Mudar de área de atuação', 2),
  ('22222222-2222-4222-8222-222222222222', 'proprio_negocio', 'Iniciar meu próprio negócio', 3),
  ('22222222-2222-4222-8222-222222222222', 'promocao', 'Conseguir uma promoção', 4),
  ('22222222-2222-4222-8222-222222222222', 'produtividade', 'Melhorar produtividade no trabalho', 5);

-- Relacionamentos
INSERT INTO objetivos_catalogo (area_vida_id, codigo, titulo, ordem) VALUES
  ('66666666-6666-4666-8666-666666666666', 'encontrar_alguem', 'Encontrar alguém para a vida', 1),
  ('66666666-6666-4666-8666-666666666666', 'novas_amizades', 'Fazer novas amizades', 2),
  ('66666666-6666-4666-8666-666666666666', 'comunicacao_parceiro', 'Melhorar comunicação com parceiro(a)', 3),
  ('66666666-6666-4666-8666-666666666666', 'lacos_familiares', 'Fortalecer laços familiares', 4),
  ('66666666-6666-4666-8666-666666666666', 'limites_saudaveis', 'Estabelecer limites saudáveis', 5);

-- Espiritualidade
INSERT INTO objetivos_catalogo (area_vida_id, codigo, titulo, ordem) VALUES
  ('44444444-4444-4444-8444-444444444444', 'explorar_crenca', 'Explorar uma crença ou filosofia', 1),
  ('44444444-4444-4444-8444-444444444444', 'meditacao', 'Desenvolver prática de meditação', 2),
  ('44444444-4444-4444-8444-444444444444', 'proposito', 'Encontrar propósito e sentido', 3),
  ('44444444-4444-4444-8444-444444444444', 'gratidao', 'Cultivar gratidão diária', 4);

-- Finanças
INSERT INTO objetivos_catalogo (area_vida_id, codigo, titulo, ordem) VALUES
  ('33333333-3333-4333-8333-333333333333', 'aumentar_renda', 'Aumentar minha renda', 1),
  ('33333333-3333-4333-8333-333333333333', 'controlar_gastos', 'Controlar gastos e contas', 2),
  ('33333333-3333-4333-8333-333333333333', 'comecar_investir', 'Começar a investir', 3),
  ('33333333-3333-4333-8333-333333333333', 'reserva_emergencia', 'Criar reserva de emergência', 4),
  ('33333333-3333-4333-8333-333333333333', 'quitar_dividas', 'Quitar dívidas', 5);

-- Saúde
INSERT INTO objetivos_catalogo (area_vida_id, codigo, titulo, ordem) VALUES
  ('11111111-1111-4111-8111-111111111111', 'perder_peso', 'Perder peso', 1),
  ('11111111-1111-4111-8111-111111111111', 'ganhar_massa', 'Ganhar massa muscular', 2),
  ('11111111-1111-4111-8111-111111111111', 'qualidade_sono', 'Melhorar qualidade do sono', 3),
  ('11111111-1111-4111-8111-111111111111', 'reduzir_ansiedade', 'Reduzir ansiedade/estresse', 4),
  ('11111111-1111-4111-8111-111111111111', 'melhorar_exames', 'Melhorar exames (colesterol, glicose, etc.)', 5);

-- Evolução Pessoal
INSERT INTO objetivos_catalogo (area_vida_id, codigo, titulo, ordem) VALUES
  ('88888888-8888-4888-8888-888888888888', 'autoconhecimento', 'Desenvolver autoconhecimento', 1),
  ('88888888-8888-4888-8888-888888888888', 'aprender_novo', 'Aprender algo novo (idioma, habilidade)', 2),
  ('88888888-8888-4888-8888-888888888888', 'ler_mais', 'Ler mais livros', 3),
  ('88888888-8888-4888-8888-888888888888', 'superar_medo', 'Superar um medo ou bloqueio', 4),
  ('88888888-8888-4888-8888-888888888888', 'disciplina', 'Desenvolver disciplina e consistência', 5);

-- Família
INSERT INTO objetivos_catalogo (area_vida_id, codigo, titulo, ordem) VALUES
  ('55555555-5555-4555-8555-555555555555', 'tempo_familia', 'Dedicar mais tempo à família', 1),
  ('55555555-5555-4555-8555-555555555555', 'resolver_conflitos', 'Resolver conflitos familiares', 2);

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================

