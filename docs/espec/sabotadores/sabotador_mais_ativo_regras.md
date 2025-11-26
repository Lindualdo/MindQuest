# Regras e Abordagem: Identificação do Sabotador Mais Ativo

**Data:** 2025-01-22  
**Status:** Em revisão - aguardando validação  
**Versão:** 1.0

## Contexto

Identificação do "sabotador mais ativo" de um usuário para criação de quests e exibição no card da home. Atualmente existem implementações diferentes entre:
- Workflow `sw_criar_quest` (node "Buscar Sabotadores Recentes")
- Webhook `webhook_card_emocoes` (node "Sabotador_Ativo")

## Situação Atual

**Problema identificado:**
- Ambas as implementações estão incorretas
- Workflow criar quest: ordena por data mais recente (não por atividade)
- Webhook card home: usa filtro de período de 7 dias (deve ignorar período)
- Ambos não calculam corretamente a intensidade média

**Abordagem temporária adotada:**
- Identificar sabotador mais ativo baseado em:
  1. Quantidade de registros (`total_deteccoes`)
  2. Quantidade de conversas afetadas (`conversas_afetadas`)
  3. Intensidade média (`AVG(intensidade_media)`)
- Ordenação: `total_deteccoes DESC, conversas_afetadas DESC, intensidade_media DESC`
- Sem filtro de período (considera todos os registros do usuário)

**Observação:** Encontrei várias abordagens diferentes, mas iria complicar muito a implementação agora e não tenho certeza qual escolher. Esta é uma solução temporária para unificar o comportamento.

## Questões para Revisão Futura

### 1. Detecção de Melhorias
**Pergunta:** Se considerarmos apenas a intensidade média, como iremos detectar melhorias nas ações recentes do usuário?

**Contexto:** Se um sabotador tinha intensidade média alta no passado, mas nas últimas semanas a intensidade caiu, como capturar essa melhoria? A média aritmética simples pode "mascarar" melhorias recentes.

**Possíveis abordagens:**
- Incluir decaimento temporal (peso maior para registros recentes)
- Comparar média recente (últimos 30 dias) vs. média histórica
- Usar tendência (slope) da intensidade ao longo do tempo

### 2. Priorização da Intensidade
**Pergunta:** Vamos considerar apenas o mais intenso?

**Contexto:** Um sabotador que aparece raramente mas com intensidade muito alta (ex: 95) pode ser mais danoso que um que aparece frequentemente com intensidade baixa (ex: 40).

**Possíveis abordagens:**
- Usar apenas intensidade máxima (`MAX(intensidade_media)`)
- Usar apenas intensidade média (`AVG(intensidade_media)`)
- Combinar frequência e intensidade (ver abordagem recomendada abaixo)

### 3. Visualização e Comparação
**Pergunta:** Seria interessante ter um gráfico de intensidade recente X média para comparar a tendência?

**Contexto:** Permitir ao usuário visualizar se o sabotador está melhorando (intensidade recente < média) ou piorando (intensidade recente > média).

**Possíveis implementações:**
- Gráfico de linha: intensidade ao longo do tempo
- Comparação: média dos últimos 7 dias vs. média dos últimos 30 dias vs. média histórica
- Indicador visual: seta para cima/baixo mostrando tendência

## Abordagem Recomendada: Score Composto

### Fórmula Principal

**Score de Atividade = Frequência × Intensidade Média**

Onde:
- **Frequência** = Quantidade de registros (`COUNT(*)`)
- **Intensidade Média** = Média aritmética de `intensidade_media` (`AVG(intensidade_media)`)

### Justificativa Psicológica

Para identificar o **sabotador mais ativo**, **nenhum dos dois fatores deve dominar isoladamente** — o ideal é **combiná-los em uma métrica composta**, pois psicologicamente:

- **Quantidade de registros (frequência)** reflete a **persistência e consistência** do sabotador (quanto mais ele "aparece", mais ele sabota rotineiramente).

- **Intensidade média** (calculada como média aritmética) reflete o **impacto emocional/cognitivo médio** por ocorrência.

**Por que multiplicar?**
- **Equilibra os dois fatores** de forma natural
- **Prioriza sabotadores "crônicos e intensos"**, que são os mais danosos
- Inspirado em modelos validados como Positive Intelligence/PQ de Shirzad Chamine
- Baseado em métricas de hábitos/saúde mental como "Impact Score" em apps como Daylio ou Habitica

### Exemplo Prático

**Dados do caso "Inquieto":**
- Frequência: 24 detecções
- Intensidade média: 69.17
- **Score = 24 × 69.17 ≈ 1.660**

### Comparação de Abordagens

Tabela comparativa com 3 sabotadores fictícios:

| Sabotador        | Frequência (Qtd. Registros) | Intensidade Média | Score (Frequência × Intensidade) | Apenas Frequência (Rank) | Apenas Intensidade (Rank) |
|------------------|-----------------------------|-------------------|----------------------------------|---------------------------|----------------------------|
| Inquieto        | 24                         | 69                | **1.656** (1º)                  | 1º                       | 2º                        |
| Perfeccionista  | 5                          | 92                | 460 (2º)                        | 3º                       | 1º                        |
| Hiper-Racional  | 15                         | 75                | 1.125 (3º)                      | 2º                       | 3º                        |

**Análise:**
- **Com score composto**: Inquieto é o mais ativo (crônico + impacto médio alto)
- **Se priorizar só frequência**: Ignora o Perfeccionista devastador
- **Se priorizar só intensidade**: Superestima raros de alto impacto

### Implementação SQL

```sql
SELECT
  us.sabotador_id,
  COUNT(*) AS total_deteccoes,
  COUNT(DISTINCT us.chat_id) AS conversas_afetadas,
  AVG(us.intensidade_media) AS intensidade_media,
  COUNT(*) * AVG(us.intensidade_media) AS score_atividade
FROM usuarios_sabotadores us
WHERE us.usuario_id = $1::uuid
GROUP BY us.sabotador_id
ORDER BY score_atividade DESC
LIMIT 1;
```

## Ajustes Opcionais (Refinamentos Futuros)

### 1. Incluir Conversas Afetadas
**Fórmula:** `Score = (Frequência × Conversas Afetadas) × Intensidade Média`

**Justificativa:** Penaliza sabotadores que "vazam" para mais contextos (afetam mais conversas diferentes).

### 2. Peso Ponderado
**Fórmula:** `Score = (0.6 × Frequência Normalizada) + (0.4 × Intensidade Normalizada)`

**Justificativa:** Use se frequência for mais importante no app (baseado em feedback de usuários). Permite ajustar o peso relativo entre os fatores.

### 3. Decaimento Temporal
**Fórmula:** `Score = Frequência × Intensidade Média × fator_recencia`

Onde `fator_recencia = e^(-dias_desde_hoje)` ou similar.

**Justificativa:** Dá mais peso a registros recentes para capturar "evolução" do sabotador e detectar melhorias recentes.

## Próximos Passos

1. **Implementação temporária:** Usar ordenação por `total_deteccoes DESC, conversas_afetadas DESC, intensidade_media DESC` (sem score composto)
2. **Validação:** Testar com dados reais e coletar feedback
3. **Refinamento:** Implementar score composto (`Frequência × Intensidade Média`) após validação
4. **Melhorias futuras:** Considerar decaimento temporal e visualizações de tendência

## Referências

- Positive Intelligence (PQ) - Shirzad Chamine
- Métricas de impacto em apps de saúde mental (Daylio, Habitica)
- Modelos de identificação de padrões comportamentais em terapia cognitivo-comportamental

