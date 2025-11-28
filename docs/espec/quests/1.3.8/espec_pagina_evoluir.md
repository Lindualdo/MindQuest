# MindQuest - Página Evoluir v1.3.8 - Definição

**Data:** 2025-01-22 14:30  
**Versão:** 1.3.8

---

## Status Atual

- ✅ Cards de estatísticas (Conversas, Ações, Pontos) - implementado
- ✅ Estrutura base com 4 seções - implementado
- ⏳ Funcionalidades das seções - **a definir**

---

## Seções a Implementar

### 1. Perfil Pessoal
**Campos:**
- Nome preferido (já existe: `usuarios.nome_preferencia`)
- Nome Assistente (personalizar como chamar o assistente de IA)
- Tom de conversa: Empático (padrão) / Interativo / Educativo / Equilibrado / Direto/Firme
- Conte mais sobre você (campo livre)

**Persistência:**
- ✅ **Decisão:** Adicionar campos direto na tabela `usuarios`
- Campos novos:
  - `nome_assistente` (VARCHAR) - ⚠️ **Verificar se já existe**
  - `tom_conversa` (VARCHAR ou ENUM: 'empativo', 'interativo', 'educativo', 'equilibrado', 'direto')
  - `sobre_voce` (TEXT)
- Motivo: Poucos campos, consultas simples, performance melhor

**Pendências:**
- Como impacta geração de quests/insights? (usar `tom_conversa` e `sobre_voce` no prompt da IA)

### 2. Objetivos
**Campos:**
- Meta principal (30-90 dias)
- Áreas de foco: Autoconhecimento, Produtividade, Relacionamentos, Saúde emocional

**Visualizações:**
- Progresso ao longo do tempo
- Estatísticas de evolução
- Histórico de conquistas

**Pendências:**
- Estrutura de dados para objetivos
- Formato de visualização de progresso

### 3. Personalizações
**Configurações:**
- Tema: Claro/Escuro/Automático
- Login com e-mail e senha (alternativa ao token)

**Notificações (checks):**
- Lembrar sobre as quests / ações
- Enviar resumo semanal: emoções, eventos principais, ações concluídas, evolução, etc.
- Lembrar sobre as conversas de reflexão
- Receber mensagens inspiradoras (quantidade por dia: 1 a 5)
- Receber ajuda com os sabotadores mais ativos (contramedidas)
- período preferido das notificações

**Pendências:**
- Sistema de temas (CSS/Tailwind?)
- Integração com notificações
- Implementação de login com e-mail/senha

### 4. Recursos
**Conteúdo:**
- Sobre o MindQuest (Como funciona, Metodologia)
- FAQs
- Conquistas e badges
- Feedback

**Pendências:**
- Criar conteúdo
- Estrutura de conquistas completa

---

## Decisões Necessárias

1. ✅ **Perfil Pessoal - Persistência:** Adicionar campos `nome_assistente`, `tom_conversa` e `sobre_voce` na tabela `usuarios` (verificar se `nome_assistente` já existe)
2. **APIs:** Quais webhooks criar? (perfil, objetivos, preferencias)
3. **Priorização:** Qual seção implementar primeiro?
4. **Temas:** Como implementar dark mode?
5. **Conquistas:** Estrutura completa já existe ou precisa criar?

---

**Última atualização:** 2025-01-22 14:30
