# Passos Macro para Implementação - Sistema de Quests v1.3.5

**Data:** 2025-11-23 08:56  
**Versão:** 1.3.5  
**Status:** Aguardando aprovação para cada passo

---

## ⚠️ Nota Importante

**Comportamento a evitar:**
- ❌ Implementar sem aprovação prévia
- ❌ Criar múltiplos arquivos/documentos sem confirmar necessidade
- ❌ Avançar para próximo passo sem validação do anterior

**Comportamento correto:**
- ✅ Apresentar proposta e aguardar aprovação
- ✅ Discutir cada passo antes de implementar
- ✅ Trabalho colaborativo: sempre confirmar antes de seguir

---

## Passos Macro (Visão Geral)

### Passo 1: Catálogo Estruturado de Quests
**Objetivo:** Criar base de dados com todas as quests disponíveis no sistema

**O que envolve:**
- Criar tabela `quests_catalogo` no banco
- Definir estrutura de dados (campos, relacionamentos)
- Popular catálogo inicial (~111 quests: essenciais, transformadoras, contramedidas)
- Documentar estrutura e padrões

**Status:** 📝 Documento criado, aguardando aprovação para implementar

---

### Passo 2: Atualizar Geração de Quests (sw_criar_quest)
**Objetivo:** Fazer workflow consultar catálogo ao invés de gerar tudo via IA

**O que envolve:**
- Modificar `sw_criar_quest` para consultar `quests_catalogo`
- Manter IA para personalização, mas baseada em templates do catálogo
- Definir lógica de seleção (quais quests sugerir baseado em contexto)
- Testar geração mantendo compatibilidade com sistema atual

**Status:** ⏳ Aguardando aprovação do Passo 1

---

### Passo 3: Sistema de Estágios (planejada → ativa → concluida)
**Objetivo:** Implementar estágios para quests (usuário escolhe quando ativar)

**O que envolve:**
- Adicionar campo `estagio` em `usuarios_quest` (ou usar `status` expandido)
- Modificar lógica: quests nascem como `planejada`, viram `ativa` quando usuário ativa
- Atualizar workflows para respeitar estágios
- Ajustar frontend para mostrar estágios (abas: Planejadas, Ativas, Concluídas)

**Status:** ⏳ Aguardando aprovação dos passos anteriores

---

### Passo 4: Gestão de Slots (máx. 5 quests ativas)
**Objetivo:** Limitar número de quests ativas simultaneamente

**O que envolve:**
- Implementar validação: máximo 5 quests com `estagio = 'ativa'` por usuário
- Lógica de liberação de slot (quando quest concluída)
- Interface: avisar quando slot está cheio, sugerir concluir antes de ativar nova
- Exceções: quests essenciais sempre contam, mas não ocupam slot

**Status:** ⏳ Aguardando aprovação dos passos anteriores

---

### Passo 5: Interface de Escolha/Ativação de Quests
**Objetivo:** Permitir usuário escolher e ativar quests do catálogo

**O que envolve:**
- Criar tela/painel de "Banco de Quests"
- Filtros: categoria, nível prioridade, área da vida, sabotador
- Interface de ativação: card de quest → botão "Ativar"
- Validação: verificar slots disponíveis antes de ativar

**Status:** ⏳ Aguardando aprovação dos passos anteriores

---

### Passo 6: Quests Essenciais Padronizadas
**Objetivo:** Implementar quests que sempre devem estar ativas (reflexão matinal/noturna)

**O que envolve:**
- Lógica especial: quests essenciais sempre ativas (não ocupam slot)
- Criação automática: sistema cria para novo usuário
- Manutenção: sistema garante que sempre existam
- Interface: mostrar como "sempre ativas" (diferente visual)

**Status:** ⏳ Aguardando aprovação dos passos anteriores

---

### Passo 7: Sistema de Priorização e Sugestões
**Objetivo:** IA sugere quests relevantes baseado em contexto do usuário

**O que envolve:**
- Algoritmo de priorização: baseado em insights, conversas, sabotadores ativos
- Interface: "Sugeridas para Você" com justificativa
- Personalização: quests adaptadas ao perfil Big Five, áreas da vida
- Feedback loop: aprender com escolhas do usuário

**Status:** ⏳ Aguardando aprovação dos passos anteriores

---

### Passo 8: Atualizar Frontend - Painel de Quests
**Objetivo:** Reorganizar interface conforme nova estrutura

**O que envolve:**
- Abas: Planejadas, Ativas, Concluídas
- Card de progresso semanal (já existe, pode precisar ajustes)
- Integração com banco de quests
- Visual diferenciado para essenciais vs opcionais

**Status:** ⏳ Aguardando aprovação dos passos anteriores

---

### Passo 9: Assistente de Suporte Semanal
**Objetivo:** IA interativa aos domingos para planejamento da semana

**O que envolve:**
- Workflow/agendamento: executar aos domingos
- Conversa via WhatsApp: ajudar usuário a planejar semana
- Sugerir quests baseado em objetivos
- Permitir ajustes de prioridades

**Status:** ⏳ Aguardando aprovação dos passos anteriores

---

### Passo 10: Reboot de Recorrências Concluídas
**Objetivo:** Permitir reiniciar quests recorrentes após conclusão completa

**O que envolve:**
- Lógica: quando quest recorrente concluída, oferecer "Reiniciar"
- Interface: botão "Fazer Novamente" em quests concluídas
- Manter histórico: não apagar, criar nova instância
- Validar: só permitir reboot de recorrentes, não únicas

**Status:** ⏳ Aguardando aprovação dos passos anteriores

---

## Ordem de Implementação Sugerida

**Fase 1 - Fundação (Passos 1-2):**
- Passo 1: Catálogo
- Passo 2: Atualizar geração

**Fase 2 - Estrutura (Passos 3-4):**
- Passo 3: Estágios
- Passo 4: Slots

**Fase 3 - Interface (Passos 5-6):**
- Passo 5: Escolha/Ativação
- Passo 6: Essenciais

**Fase 4 - Inteligência (Passo 7):**
- Passo 7: Priorização e Sugestões

**Fase 5 - Refinamento (Passos 8-10):**
- Passo 8: Frontend
- Passo 9: Assistente Semanal
- Passo 10: Reboot

---

## Dependências entre Passos

```
Passo 1 (Catálogo)
    ↓
Passo 2 (Geração consulta catálogo)
    ↓
Passo 3 (Estágios)
    ↓
Passo 4 (Slots depende de estágios)
    ↓
Passo 5 (Interface depende de estágios + slots)
    ↓
Passo 6 (Essenciais - pode ser paralelo ao 5)
    ↓
Passo 7 (Priorização - depende de catálogo + estágios)
    ↓
Passo 8 (Frontend - depende de tudo acima)
    ↓
Passo 9 (Assistente - depende de priorização)
    ↓
Passo 10 (Reboot - depende de estágios)
```

---

## Próxima Ação

**Aguardando aprovação para:**
1. Validar se lista de passos macro está completa
2. Confirmar ordem de implementação sugerida
3. Decidir qual passo discutir primeiro em detalhes

---

*Documento criado para guiar discussão colaborativa dos passos de implementação*

