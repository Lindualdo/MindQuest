# Regras de Cálculo de Humor - Documento Executivo

**Data:** 2025-11-27  
**Status:** Ativo  
**Versão:** 1.0

## Visão Geral

O sistema detecta o humor do usuário através de análise por IA das conversas, gerando uma escala de 1 a 10 onde 1-3 é muito negativo, 4-5 negativo, 6-7 neutro/misto, 8-9 positivo e 10 muito positivo.

## Regras de Cálculo

**Média de Humor:** Calculada com base em **todos os registros históricos** do usuário, sem filtro de período. Média aritmética simples arredondada para 2 casas decimais.

**Humor Atual:** Corresponde ao **último registro** de humor detectado, independente da data.

## Justificativa

A média histórica completa fornece contexto de longo prazo e evita distorções de períodos específicos. Permite identificar tendências e criar uma linha de base confiável para comparações.

## Aplicação

- **Humor Atual > Média:** Indica melhora recente
- **Humor Atual < Média:** Indica piora recente  
- **Humor Atual ≈ Média:** Indica estabilidade

## Dados Adicionais

Além do humor, o sistema também detecta nível de energia (1-10), variação durante a conversa (estável/ascendente/descendente/oscilatória) e confiança da análise (0-100).

## Melhorias Futuras

**Linha Base:** Manter a média histórica como referência principal para comparações.

**Médias Recentes:** Implementar cálculo de médias por período específico:
- Últimos 7 dias
- Última semana (segunda a domingo)
- Último mês (30 dias)

**Humor Atual:** Manter como indicador do estado emocional mais recente.

**Visualização:** Criar gráfico de linhas comparando:
- Média histórica (linha base)
- Médias recentes por período
- Humor atual
- Evolução/regressão ao longo do tempo
