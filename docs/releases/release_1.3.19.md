# Release 1.3.19 - Anotações Inline com Auto-Save

**Data:** 2025-12-04

Implementação de anotações inline editáveis para conversas e quests, com salvamento automático após 1.5 segundos de inatividade. Campo sempre visível abaixo das informações de data e pontos, sem necessidade de modais ou botões.

## Funcionalidades

### Anotações Inline
- Campo de anotação sempre visível e editável diretamente na tela
- Posicionado abaixo das informações de data e pontos (conversas) ou após título/descrição (quests)
- Design consistente: caixa azul com borda, ícone de nota e label "Sua Anotação"
- Indicador visual "Salvando..." durante o processo de salvamento

### Auto-Save
- Salvamento automático após 1.5 segundos sem digitação (debounce)
- Sincronização automática após salvar
- Suporte para strings vazias (salva como `null` no banco)

### Backend
- Novo endpoint `/api/anotacoes` (GET e POST)
- Workflow n8n `webhook_anotacoes` unificado para conversas e quests
- Campos adicionados:
  - `usr_chat.anotacoes_usr` (texto)
  - `quests_recorrencias.anotacoes_quest` (texto)

### UX
- Remoção de modais e botões de anotação
- Edição direta no campo, sem interrupções
- Campo filtrado dos detalhes extras para evitar duplicação

## Alterações Técnicas

### Frontend
- `ConversaResumoPageV13.tsx`: Campo inline abaixo de data/pontos
- `QuestDetailPageV13.tsx`: Campo inline após título/descrição
- `apiService.ts`: Funções `salvarAnotacao()` e `buscarAnotacao()`
- Removido uso de `AnotacaoEditor` (componente modal)

### Backend
- `api/[...slug].ts`: Endpoint `/api/anotacoes` com validação
- Workflow n8n `webhook_anotacoes`:
  - Webhook POST para salvar anotações
  - Webhook GET para buscar anotações
  - Validação de tipo (`conversa` ou `quest`)
  - Queries SQL condicionais por tipo

### Banco de Dados
- `ALTER TABLE usr_chat ADD COLUMN anotacoes_usr TEXT;`
- `ALTER TABLE quests_recorrencias ADD COLUMN anotacoes_quest TEXT;`

## Correções

- Corrigido erro `Cannot read properties of null (reading 'recorrencias')` em `QuestDetailPageV13.tsx`
- Adicionada verificação de `null` antes de acessar `detail.recorrencias`
- Filtrado `anotacoes_usr` dos detalhes extras para evitar duplicação

## Commits

- `b12f458` [feat] Implementar anotações inline com auto-save para conversas e quests
- `6d702e9` [fix] Corrigir erro ao acessar recorrencias quando detail é null
- `[ui]` Atualizar texto do link histórico para mencionar anotações

## Status

✅ **Pronto para deploy**

Todas as funcionalidades testadas e validadas:
- Salvamento automático funcionando
- Campo visível no local correto
- Sem duplicação nos detalhes extras
- Erro de null corrigido

