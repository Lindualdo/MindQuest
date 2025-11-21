# Análise da Tabela `usuarios_perfis`

## Estrutura da Tabela

- **id**: uuid (PK)
- **usuario_id**: uuid (FK → usuarios)
- **chat_id**: uuid (unique)
- **data_conversa**: date
- **perfil_original**: varchar(20)
- **perfil_primario**: varchar(20) - **RELEVANTE**
- **perfil_secundario**: varchar(20) - **RELEVANTE**
- **resumo_perfil**: text - **RELEVANTE**
- **insuficiente**: boolean
- **score_openness**: integer (0-100) - **RELEVANTE**
- **score_conscientiousness**: integer (0-100) - **RELEVANTE**
- **score_extraversion**: integer (0-100) - **RELEVANTE**
- **score_agreeableness**: integer (0-100) - **RELEVANTE**
- **score_neuroticism**: integer (0-100) - **RELEVANTE**
- **confianca_openness**: integer (0-100)
- **confianca_conscientiousness**: integer (0-100)
- **confianca_extraversion**: integer (0-100)
- **confianca_agreeableness**: integer (0-100)
- **confianca_neuroticism**: integer (0-100)
- **confianca_media**: integer (0-100) - **RELEVANTE**
- **raw_resposta**: jsonb (dados completos da análise)
- **criado_em**: timestamp
- **atualizado_em**: timestamp - **RELEVANTE** (para saber quando foi atualizado)

## Dados do Usuário de Teste (d949d81c-9235-41ce-8b3b-6b5d593c5e24)

### Último Perfil (2025-11-21)

**Perfis:**
- **Primário**: `conscientiousness` (Conscienciosidade) - 85/100
- **Secundário**: `openness` (Abertura) - 70/100

**Scores Big Five:**
- **Abertura (Openness)**: 70/100
- **Conscienciosidade (Conscientiousness)**: 85/100
- **Extroversão (Extraversion)**: 55/100
- **Amabilidade (Agreeableness)**: 60/100
- **Neuroticismo (Neuroticism)**: 40/100

**Confiabilidade:**
- **Média**: 76%
- Data de atualização: 2025-11-21 16:04:25

**Resumo do Perfil:**
"Aldo demonstra forte disciplina e organização, focando em planejamento e metas claras para o desenvolvimento do seu app e controle financeiro. A abertura para aprender com erros indica curiosidade e flexibilidade, com uma emoção estável apesar das dificuldades recentes. Ele equilibra cautela emocional com energia moderada para socialização e cooperação."

## Informações Mais Relevantes para a Página de Perfil

### 1. Perfis Primário e Secundário
- **Perfil Primário**: Conscienciosidade (85/100)
- **Perfil Secundário**: Abertura (70/100)
- Esses são os traços dominantes do Big Five

### 2. Resumo do Perfil
- Texto descritivo gerado pela IA baseado nas conversas
- Fornece contexto sobre como a personalidade se manifesta

### 3. Scores Big Five
- Todos os 5 traços com scores de 0-100
- Permitem visualização em gráficos/barras

### 4. Confiabilidade
- Indica o quão confiável é a análise (0-100)
- Útil para mostrar ao usuário a precisão dos dados

### 5. Data de Atualização
- Quando o perfil foi calculado pela última vez
- Útil para mostrar "Atualizado em..."

## Sugestões para Implementação na Página de Perfil

1. **Card de Perfil Big Five**
   - Exibir perfil primário e secundário de forma destacada
   - Mostrar resumo do perfil
   - Data de última atualização

2. **Gráfico de Scores Big Five**
   - Barras horizontais ou radar chart
   - Cores diferentes para cada traço
   - Indicador de confiabilidade

3. **Tradução dos Traços**
   - openness → "Abertura à experiência"
   - conscientiousness → "Conscienciosidade"
   - extraversion → "Extroversão"
   - agreeableness → "Amabilidade"
   - neuroticism → "Neuroticismo"

## Nota sobre Integração

O `dashboardData` já possui `perfil_big_five` mas parece estar vindo do endpoint antigo. Pode ser necessário criar um novo endpoint ou ajustar o existente para buscar da tabela `usuarios_perfis`.


