# Análise de Dados do Usuário
**Usuário ID:** `d949d81c-9235-41ce-8b3b-6b5d593c5e24`  
**Data da Análise:** 2025-01-22

---

## 1. usuarios_quest (Estágios e Status)

### Resumo Geral
- **Total de quests:** 4
- **Status:** 3 concluídas, 1 ativa
- **Estágios:** 1 `a_fazer`, 2 `fazendo`, 1 `feito`

### Detalhamento por Quest

#### Quest 1: "Finalizar o Desenvolvimento do App para Lançamento"
- **ID:** `01027b60-9efb-40eb-a83f-9595e64d9116`
- **Status:** `concluida`
- **Estágio:** `a_fazer` ⚠️ **INCONSISTÊNCIA:** Status concluída mas estágio a_fazer
- **Tipo:** Única (sem recorrência)
- **Concluída em:** 2025-11-26 10:29:54
- **Recorrências:** Nenhuma

#### Quest 2: "Gratidão por Focar em uma Única Tarefa Mesmo com o Sr. Inquieto"
- **ID:** `32caf72b-256d-4589-b760-c0e5674103e6`
- **Status:** `concluida`
- **Estágio:** `feito` ✅
- **Tipo:** Diária
- **Concluída em:** 2025-11-26 10:05:40
- **Recorrências planejadas:** 2 dias (25/11, 26/11)
- **XP previsto:** 40 por dia

#### Quest 3: "Atividade Física - Micro-Movimento para Aumentar Energia"
- **ID:** `9a3c0b35-9620-47ab-8bb1-ab43cd71eda7`
- **Status:** `concluida`
- **Estágio:** `fazendo` ⚠️ **INCONSISTÊNCIA:** Status concluída mas estágio fazendo
- **Tipo:** Diária
- **Concluída em:** 2025-11-26 09:53:37
- **Recorrências planejadas:** 7 dias (25/11 a 01/12)
- **XP previsto:** 30 por dia

#### Quest 4: "Reflexão Diária"
- **ID:** `861f0ecf-3520-42cc-b493-401068ddab03`
- **Status:** `ativa`
- **Estágio:** `fazendo` ✅
- **Tipo:** Diária (conversa)
- **Recorrências planejadas:** 5 dias (26/11 a 30/11)
- **XP previsto:** 10 por dia

---

## 2. conquistas_historico (Registros e Ocorrências)

### Resumo Geral
- **Total de registros:** 4
- **Tipos:** 3 quests, 1 conversa

### Detalhamento por Registro

#### Registro 1: Quest "Finalizar o Desenvolvimento do App"
- **Quest ID:** `01027b60-9efb-40eb-a83f-9595e64d9116`
- **Tipo:** `quest`
- **Ocorrências:** 1
- **Total concluídas:** 1
- **XP base:** 10 (por ocorrência)
- **XP bonus:** 0
- **Data conclusão:** 2025-11-26

#### Registro 2: Quest "Gratidão por Focar"
- **Quest ID:** `32caf72b-256d-4589-b760-c0e5674103e6`
- **Tipo:** `quest`
- **Ocorrências:** 5 ⚠️ **INCONSISTÊNCIA:** Planejado 2 dias, mas 5 ocorrências registradas
- **Total concluídas:** 5
- **XP base:** 10 (por ocorrência)
- **XP bonus:** 0
- **Datas:** 4 ocorrências em 25/11, 1 em 26/11

#### Registro 3: Quest "Atividade Física"
- **Quest ID:** `9a3c0b35-9620-47ab-8bb1-ab43cd71eda7`
- **Tipo:** `quest`
- **Ocorrências:** 3
- **Total concluídas:** 3
- **XP base:** 10 (por ocorrência)
- **XP bonus:** 0
- **Datas:** 1 em 25/11, 2 em 26/11

#### Registro 4: Conversa "Reflexão Diária"
- **Quest ID:** `861f0ecf-3520-42cc-b493-401068ddab03`
- **Tipo:** `conversa`
- **Ocorrências:** 32
- **Total concluídas:** 32
- **XP base:** 10 (por ocorrência)
- **XP bonus:** 0
- **Período:** 13/10 a 24/11 (32 dias de conversas)

---

## 3. usuarios_conquistas (Registros e Pontos)

### Resumo
- **XP Total:** 410
- **XP Base:** 410
- **XP Bonus:** 0
- **Total Quests Concluídas:** 9
- **Total Quests Personalizadas:** 3
- **Sequência Atual:** 0
- **Última atualização:** 2025-11-26 10:29:55

### Cálculo de XP
- **Quests:** 9 ocorrências × 10 XP = 90 XP
- **Conversas:** 32 ocorrências × 10 XP = 320 XP
- **Total:** 410 XP ✅ (confere)

---

## 4. Inconsistências Identificadas

### ⚠️ Quest 1: Estágio vs Status
- **Problema:** Status `concluida` mas `quest_estagio = 'a_fazer'`
- **Esperado:** `quest_estagio = 'feito'`
- **Impacto:** Quest apareceria em "A fazer" mesmo estando concluída

### ⚠️ Quest 2: Ocorrências vs Planejamento
- **Problema:** Planejado 2 dias, mas 5 ocorrências registradas
- **Detalhe:** 4 ocorrências no mesmo dia (25/11) - possível duplicação
- **Impacto:** XP calculado incorretamente (50 XP vs 20 XP esperado)

### ⚠️ Quest 3: Estágio vs Status
- **Problema:** Status `concluida` mas `quest_estagio = 'fazendo'`
- **Esperado:** `quest_estagio = 'feito'`
- **Impacto:** Quest apareceria em "Fazendo" mesmo estando concluída

---

## 5. Recomendações

1. **Sincronizar estágios com status:**
   - Atualizar `quest_estagio` quando `status = 'concluida'` → `'feito'`
   - Criar trigger ou lógica no workflow de conclusão

2. **Validar ocorrências duplicadas:**
   - Investigar por que Quest 2 tem 4 ocorrências no mesmo dia
   - Implementar validação para evitar duplicação

3. **Atualizar estágios existentes:**
   ```sql
   UPDATE usuarios_quest 
   SET quest_estagio = 'feito' 
   WHERE status = 'concluida' 
     AND quest_estagio != 'feito';
   ```

---

**Última atualização:** 2025-01-22

