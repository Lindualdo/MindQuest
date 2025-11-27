# Regras de Cálculo de Energia - Documento Executivo

**Data:** 2025-11-27  
**Status:** Ativo  
**Versão:** 1.0

## Visão Geral

O sistema detecta o nível de energia do usuário através de análise por IA das conversas, gerando uma escala de 1 a 10 onde 1-3 é muito baixa (exausto, sem forças), 4-5 baixa (cansado), 6-7 moderada, 8-9 alta (disposto, energizado) e 10 muito alta (hiperativo).

## Regras de Cálculo (Atual)

**Energia no Card de Emoções:** Atualmente calculada através da análise PANAS (emotions), considerando emoções positivas/negativas de **todo o histórico** do usuário, sem filtro de período. Retorna percentuais de emoções positivas, negativas e neutras, além de uma categoria geral (POSITIVA/NEGATIVA/NEUTRA).

**Energia Nível (Detectada):** O sistema detecta `energia_nivel` (1-10) através de IA e armazena na tabela `usuarios_humor_energia`, mas este valor não é utilizado no card de emoções atualmente.

## Justificativa (Atual)

A análise PANAS fornece uma visão indireta da energia através do balanço emocional. Emoções positivas (joy, trust, anticipation) indicam maior energia, enquanto emoções negativas (sadness, fear, anger, disgust) indicam menor energia.

## Aplicação (Atual)

- **Percentual Positivo > 60%:** Indica energia positiva predominante
- **Percentual Negativo > 60%:** Indica energia negativa predominante
- **Balanço equilibrado:** Indica energia neutra/estável

## Dados Adicionais

Além do nível de energia, o sistema também detecta variação durante a conversa (estável/ascendente/descendente/oscilatória), período do dia e confiança da análise (0-100).

## Melhorias Futuras

**Implementar Cálculo de Energia Nível:** Utilizar o campo `energia_nivel` (1-10) já detectado pela IA, similar ao cálculo de humor:

**Média de Energia:** Calcular com base em **todos os registros históricos** de `energia_nivel`, sem filtro de período. Média aritmética simples arredondada para 2 casas decimais.

**Energia Atual:** Corresponde ao **último registro** de `energia_nivel` detectado, independente da data.

**Médias Recentes:** Implementar cálculo de médias por período específico:
- Últimos 7 dias
- Última semana (segunda a domingo)
- Último mês (30 dias)

**Visualização:** Criar gráfico de linhas comparando:
- Média histórica (linha base)
- Médias recentes por período
- Energia atual
- Evolução/regressão ao longo do tempo

