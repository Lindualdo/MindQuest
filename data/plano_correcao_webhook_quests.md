# Plano de Correção: webhook_quests - Status de Conclusão

## Problema Identificado

**Situação atual:**
- Barras de progresso da semana: ✅ CORRETO
- Barras diárias: ✅ CORRETO  
- Quantidade de pendentes/concluídas: ❌ ERRADO
  - **Esperado:** 1 concluída + 2 pendentes (para 20/11)
  - **Atual:** 3 pendentes + 0 concluídas

**Causa raiz:**
1. O node "Buscar Conclusoes Historico" está executando e retornando dados corretamente:
   - `quest_id: "56a229b6-9230-4509-8537-c3e7afefbf2e"`
   - `datas_concluidas: ["2025-11-20"]`

2. Porém, a função `enriquecerRecorrencias` no node "Montar Resposta" não está aplicando o status corretamente:
   - O `recorrencias->dias[]` está retornando TODOS os dias como `status: "pendente"`
   - O dia `2025-11-20` da quest `56a229b6-9230-4509-8537-c3e7afefbf2e` deveria ter `status: "concluida"`

3. Problema na normalização de datas:
   - No `recorrencias->dias[]`: `"data": "2025-11-20"` (sem timestamp)
   - No `conquistas_historico`: `"data_concluida": "2025-11-20"` (sem timestamp)
   - Mas alguns dias vêm como `"data": "2025-11-19 00:00:00+00"` (com timestamp)
   - A função `normalizarData` pode não estar normalizando corretamente todos os formatos

4. Problema na busca de dados:
   - O node "Buscar Conclusoes Historico" está retornando `datas_concluidas` como array JSONB
   - Mas a função pode não estar acessando corretamente esse array

## Análise dos Dados na Base

**Quests:**
- 3 quests no total
- Quest `56a229b6-9230-4509-8537-c3e7afefbf2e`: status `concluida`, TEM registro em `conquistas_historico` para `2025-11-20`
- Quest `33a63c68-76f8-4e01-bc38-2ded3bad2c48`: status `pendente`, SEM registro em `conquistas_historico`
- Quest `1e0bed0a-7f2f-46f5-996f-c73dc6872263`: status `concluida`, SEM registro em `conquistas_historico` (anomalia)

**Conquistas_historico:**
- 1 registro de quest: `quest_id: "56a229b6-9230-4509-8537-c3e7afefbf2e"` com `data_concluida: "2025-11-20"`

**Recorrencias:**
- Todas as quests têm `recorrencias->dias[]` SEM campo `status` (correto, conforme documentação)
- O dia `2025-11-20` existe em `recorrencias->dias[]` para todas as 3 quests

## Plano de Correção

### 1. Corrigir função `normalizarData` no node "Montar Resposta"
   - **Problema:** A função pode não estar normalizando corretamente todos os formatos de data
   - **Solução:** Melhorar a função para tratar:
     - `"2025-11-20"` (formato YYYY-MM-DD)
     - `"2025-11-20 00:00:00+00"` (com timestamp)
     - `"2025-11-19T21:51:58.292Z"` (ISO datetime)
   - **Localização:** Node "Montar Resposta", função `normalizarData`

### 2. Verificar mapeamento de conclusões no node "Montar Resposta"
   - **Problema:** O `conclusoesMap` pode não estar sendo construído corretamente
   - **Solução:** 
     - Verificar se `conclusoesRaw` está sendo acessado corretamente
     - Garantir que `datas_concluidas` seja tratado como array
     - Normalizar todas as datas antes de comparar
   - **Localização:** Node "Montar Resposta", seção de mapeamento de conclusões

### 3. Corrigir função `enriquecerRecorrencias` no node "Montar Resposta"
   - **Problema:** A função não está aplicando o status corretamente
   - **Solução:**
     - Garantir normalização consistente de datas em ambos os lados (recorrencias e conclusões)
     - Usar comparação de strings normalizadas (YYYY-MM-DD)
     - Adicionar logs de debug (remover depois) para validar
   - **Localização:** Node "Montar Resposta", função `enriquecerRecorrencias`

### 4. Validar execução do node "Buscar Conclusoes Historico"
   - **Problema:** O node pode não estar sendo aguardado corretamente pelo Merge node
   - **Solução:**
     - Verificar configuração do Merge node "Aguardar Dados"
     - Garantir que o Merge aguarda ambas as entradas
     - Adicionar `onError: 'continueRegularOutput'` no node "Buscar Conclusoes Historico" (já feito)
   - **Localização:** Node "Aguardar Dados" (Merge) e node "Buscar Conclusoes Historico"

### 5. Testar e validar
   - **Após correções:**
     - Testar webhook via MCP
     - Validar que `recorrencias->dias[]` tem `status: 'concluida'` para o dia correto
     - Validar no frontend que as tabs "Pendentes" e "Concluídas" estão corretas
   - **Validação esperada:**
     - Para 20/11: 1 concluída (quest `56a229b6-9230-4509-8537-c3e7afefbf2e`) + 2 pendentes

## Ordem de Execução

1. **Primeiro:** Corrigir função `normalizarData` (garantir que normaliza todos os formatos)
2. **Segundo:** Corrigir mapeamento de conclusões (garantir acesso correto aos dados)
3. **Terceiro:** Corrigir função `enriquecerRecorrencias` (garantir aplicação correta do status)
4. **Quarto:** Validar execução do Merge node (garantir que aguarda ambas as entradas)
5. **Quinto:** Testar e validar no frontend

## Arquivos a Modificar

1. **n8n Workflow `webhook_quests`** (ID: `yvg9NkBsLF3mbr5f`)
   - Node "Montar Resposta" (ID: `c5aa0b1b-c5c8-4519-8f41-54a1334ed198`)
   - Função `normalizarData`: melhorar normalização
   - Função `enriquecerRecorrencias`: corrigir aplicação de status
   - Seção de mapeamento de conclusões: corrigir acesso aos dados

## Validação Final

- ✅ Node "Buscar Conclusoes Historico" executando corretamente
- ✅ Retornando `datas_concluidas: ["2025-11-20"]` para quest `56a229b6-9230-4509-8537-c3e7afefbf2e`
- ✅ Node "Montar Resposta" enriquecendo `recorrencias->dias[]` com `status: 'concluida'` para dia `2025-11-20`
- ✅ Frontend recebendo dados corretos e mostrando 1 concluída + 2 pendentes para 20/11

