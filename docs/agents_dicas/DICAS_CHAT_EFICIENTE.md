# Dicas para Chats Eficientes

**Data:** 2025-11-24

Este documento contém dicas práticas para tornar sessões de chat com assistentes de IA mais eficientes e produtivas.

## 1. Contexto Claro e Objetivo

- **Informe o problema específico:** "barra não mostra quantidade concluída" ao invés de "não está funcionando"
- **Inclua imagens/prints quando relevante:** Screenshots ajudam muito a entender o problema visual
- **Mencione o que já foi testado:** Evita retrabalho e ajuda a focar no problema real

## 2. Use as Regras do Projeto

- **Referencie `AGENTS.md`** para boas práticas n8n quando necessário
- **Aponte documentos de especificação** quando aplicável (`docs/espec/quests/1.3.5/quests_1.3.5.md`)
- **Cite arquivos específicos** quando necessário (`src/pages/App/v1.3/PainelQuestsPageV13.tsx`)

## 3. Validação Incremental

- **Teste após cada correção** antes de seguir para o próximo problema
- **Reporte erros específicos** com mensagens literais do erro
- **Confirme quando algo funcionar:** "funcionou" ajuda a manter o foco

## 4. Separação de Responsabilidades

- **Defina prioridades claras:** "Trabalhe primeiro na interface, depois vamos para back"
- **Foque em um problema por vez:** Evita confusão e garante correções completas
- **Defina escopo:** "Corrija todas as inconsistências de uma vez"

## 5. Feedback Direto

- **Seja específico:** "Está indo na direção certa, mas..." ao invés de só "não está bom"
- **Reporte o estado atual:** "Ainda visível" ao invés de só "não funcionou"
- **Confirme sucesso:** "Funcionou" quando estiver ok

## 6. Use os Recursos do Projeto

- **Mencione workflows n8n por nome:** `webhook_progresso_semanal`, `sw_xp_conversas`
- **Referencie tabelas/estruturas do banco** quando relevante: `usuarios_quest`, `conquistas_historico`
- **Aponte componentes frontend específicos:** `CardWeeklyProgress.tsx`, `PainelQuestsPageV13.tsx`

## 7. Seja Específico sobre o que Quer

- **Peça análises específicas:** "Analise o log de execução" ao invés de "veja o que está errado"
- **Defina escopo de correção:** "Corrija todas as inconsistências de uma vez"
- **Peça validação:** "Teste na base de dados com os dados do node"

## O que Funcionou Bem

### Exemplos de Comunicação Eficiente

✅ **Bom:**
- "analise o log de execução do webhook_quest e corrija o problema"
- "agora apareceu corretamente. mas ainda precisamos fazer alguns pequenos ajustes: 1 - o titulo da quest está errado..."
- "vc cometeu o mesmo erro de operation!!! Atenção aos melhors praticas e lições do N8N no agents.md Não repita mais esse erro"

❌ **Evitar:**
- "não está funcionando" (sem contexto)
- "corrige tudo" (sem especificar o que)
- "está errado" (sem dizer onde ou como)

## Dica Extra

**Mantenha um histórico das correções importantes no `AGENTS.md`** — isso ajuda muito em sessões futuras, especialmente para evitar erros recorrentes (como o problema do `operation` em nodes Postgres).

## Padrão de Mensagens Eficientes

1. **Contexto:** O que está acontecendo?
2. **Problema:** O que está errado ou o que precisa ser feito?
3. **Especificação:** Onde está o problema? (arquivo, workflow, componente)
4. **Validação:** Como validar se está correto?
5. **Prioridade:** O que fazer primeiro?

**Exemplo:**
> "O webhook `webhook_concluir_quest` não funcionou e não consegui concluir uma quest. Deve estar com dados antigos ainda, verifique o log e corrija. Analise a fundo a query, teste na base de dados com os dados do node e corrija todas as inconsistências de uma vez."

---

**Última atualização:** 2025-11-24

