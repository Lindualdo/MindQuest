# Regras para Cálculo de Percentual dos Traços Big Five

## Contexto
A tabela `usuarios_perfis` armazena múltiplos registros ao longo do tempo, cada um com:
- Perfil primário e secundário detectados
- Scores de cada traço (0-100)
- Confiabilidade da análise (0-100)

## Fatores a Considerar

### 1. Frequência de Detecção
- Quantas vezes cada traço apareceu como **primário** ou **secundário**
- Traços mais frequentes indicam padrão mais estável

### 2. Score do Traço
- Valor numérico de 0-100 para cada traço
- Indica a intensidade da característica

### 3. Confiabilidade
- Quão confiável foi cada análise (0-100)
- Análises mais confiáveis devem ter mais peso

## Sugestões de Fórmulas

### Opção 1: Média Ponderada por Confiabilidade e Frequência (RECOMENDADA)

```
Score_final_traco = Σ(score_traco_i × confianca_i × peso_frequencia_i) / Σ(confianca_i × peso_frequencia_i)
```

Onde:
- `score_traco_i` = score do traço no registro i
- `confianca_i` = confiabilidade do registro i (0-100)
- `peso_frequencia_i` = peso baseado na frequência:
  - Se traço é primário no registro: peso = 2.0
  - Se traço é secundário no registro: peso = 1.0
  - Se traço não é primário nem secundário: peso = 0.5

**Vantagens:**
- Dá mais peso a análises confiáveis
- Dá mais peso quando o traço é dominante (primário/secundário)
- Considera todos os registros históricos

### Opção 2: Média Ponderada por Confiabilidade + Bônus de Frequência

```
Score_base_traco = Σ(score_traco_i × confianca_i) / Σ(confianca_i)
Bônus_frequencia = (vezes_primario × 5) + (vezes_secundario × 2)
Score_final_traco = Score_base_traco + (Bônus_frequencia × fator_ajuste)
```

Onde:
- `fator_ajuste` = valor pequeno (ex: 0.5-1.0) para não distorcer muito
- Limita o score final entre 0-100

**Vantagens:**
- Separa claramente o score base da frequência
- Fácil de entender e ajustar

### Opção 3: Janela Temporal (Últimos N Registros)

```
Score_final_traco = Média ponderada dos últimos N registros (ex: 7 ou 10)
```

Onde:
- Considera apenas registros recentes
- N pode ser fixo ou baseado em dias (ex: últimos 30 dias)

**Vantagens:**
- Mais dinâmico, reflete evolução recente
- Menos influenciado por dados antigos

### Opção 4: Média Ponderada Exponencial (Mais Recente = Mais Peso)

```
Peso_i = confianca_i × (fator_decadencia ^ (dias_desde_registro))
Score_final_traco = Σ(score_traco_i × Peso_i) / Σ(Peso_i)
```

Onde:
- `fator_decadencia` = 0.9 (dá 90% do peso a registros 1 dia mais antigos)
- Registros mais recentes têm mais peso

**Vantagens:**
- Combina histórico com relevância temporal
- Adapta-se melhor a mudanças no perfil

## Recomendação Final: Opção 1 + Opção 4 (Híbrida)

**Fórmula Combinada:**
```
Para cada registro i:
  peso_base_i = confianca_i / 100
  
  Se traço é primário: peso_freq_i = 2.0
  Se traço é secundário: peso_freq_i = 1.0
  Senão: peso_freq_i = 0.5
  
  dias_atraso_i = data_atual - data_conversa_i
  peso_temporal_i = 0.95 ^ dias_atraso_i  // Mais recente = mais peso
  
  peso_final_i = peso_base_i × peso_freq_i × peso_temporal_i

Score_final_traco = Σ(score_traco_i × peso_final_i) / Σ(peso_final_i)
```

**Percentual Final:**
Como os scores são independentes, não somam 100. Para apresentar como percentual:

```
Percentual_traco = (Score_final_traco / Score_max_possivel) × 100
```

Ou, se quiser normalizar entre todos os traços:
```
Soma_todos_scores = Σ(Score_final_traco)
Percentual_traco = (Score_final_traco / Soma_todos_scores) × 100
```

## Exemplo Prático com os Dados do Usuário

**Dados disponíveis:**
- 15 registros de 27/10 a 21/11
- Perfil primário mais comum: conscientiousness (13/15 = 87%)
- Perfil secundário mais comum: openness (7/15 = 47%)

**Aplicando a fórmula híbrida:**
1. Registros mais recentes (últimos 7 dias) têm peso ~95-100%
2. Registros antigos (25+ dias) têm peso ~20-25%
3. Quando conscientiousness é primário: peso_freq = 2.0
4. Quando openness é secundário: peso_freq = 1.0

**Resultado esperado:**
- Conscientiousness: ~85-90% (alto score + frequente como primário)
- Openness: ~70-75% (alto score + frequente como secundário)
- Outros traços: percentuais menores

## Implementação SQL

```sql
WITH pesos AS (
  SELECT 
    *,
    CASE 
      WHEN perfil_primario = 'conscientiousness' THEN 2.0
      WHEN perfil_secundario = 'conscientiousness' THEN 1.0
      ELSE 0.5
    END as peso_freq_conscientiousness,
    CASE 
      WHEN perfil_primario = 'openness' THEN 2.0
      WHEN perfil_secundario = 'openness' THEN 1.0
      ELSE 0.5
    END as peso_freq_openness,
    -- ... repetir para outros traços
    POWER(0.95, EXTRACT(DAY FROM (CURRENT_DATE - data_conversa))) as peso_temporal,
    confianca_media / 100.0 as peso_confianca
  FROM usuarios_perfis
  WHERE usuario_id = $1
)
SELECT 
  SUM(score_conscientiousness * peso_confianca * peso_freq_conscientiousness * peso_temporal) 
  / SUM(peso_confianca * peso_freq_conscientiousness * peso_temporal) as score_final_conscientiousness,
  -- ... repetir para outros traços
FROM pesos;
```

