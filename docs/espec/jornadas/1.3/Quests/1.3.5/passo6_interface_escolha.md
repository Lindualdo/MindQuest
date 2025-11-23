# Passo 6: Interface de Escolha/Ativação

**Data:** 2025-11-23 11:25  
**Versão:** 1.3.5  
**Status:** Planejamento - Aguardando aprovação

---

## Objetivo

Permitir usuário escolher e ativar quests do catálogo

---

## O que fazer (Macro)

1. **Tela "Banco de Quests":**
   - Listar quests disponíveis do catálogo
   - Filtros: estágio da jornada, categoria, sabotador, área da vida
   - Busca por título/descrição
   - Mostrar detalhes: título, descrição, tempo estimado, dificuldade

2. **Botão "Ativar" em quests planejadas:**
   - Validar slots disponíveis antes de ativar
   - Confirmar ativação
   - Atualizar `status_execucao` para `ativa`

3. **Validação de slots:**
   - Verificar se há slot disponível
   - Se não houver, mostrar mensagem e sugerir concluir quests ativas
   - Exibir contador de slots

4. **Abas na interface:**
   - **Planejadas:** Quests criadas pelo sistema, aguardando ativação
   - **Ativas:** Quests em execução (máx. 5)
   - **Concluídas:** Histórico de quests concluídas

5. **Visual diferenciado:**
   - Quests essenciais: mostrar como "sempre ativas" (diferente visual)
   - Quests do sistema: indicar origem
   - Quests personalizadas: indicar que foram criadas pela IA

---

## Dependências

- Passo 2 (status de execução) - para mostrar quests planejadas
- Passo 4 (slots) - para validação
- Frontend atualizado

---

## Impacto

- Mudança significativa na interface
- Nova tela/painel
- Melhor UX para escolha de quests

---

## Próximos Passos (Após Aprovação)

- Detalhar wireframes
- Definir componentes React
- Especificar filtros e busca
- Definir fluxo de ativação

---

*Documento macro - detalhamento será feito na execução*

