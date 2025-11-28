# MindQuest - Página Evoluir v1.3.8 - Definição

**Data:** 2025-01-22 14:30  
**Versão:** 1.3.8

---

## Status Atual

- ✅ Cards de estatísticas (Conversas, Ações, Pontos) - implementado
- ✅ Estrutura base com 4 seções - implementado
- ✅ **Perfil Pessoal** - implementado
- ✅ **Objetivos** - implementado
- ⏳ Personalizações - a definir
- ⏳ Recursos - a definir

---

## Seções a Implementar

### 1. Perfil Pessoal
**Campos:**
- Nome preferido (já existe: `usuarios.nome_preferencia`)
- Nome Assistente (personalizar como chamar o assistente de IA)
- Tom de conversa (radio buttons com descrições):
  - **Empático (padrão):** Respostas compassivas e acolhedoras, focadas em entender suas emoções
  - **Interativo:** Diálogo colaborativo com perguntas que te ajudam a refletir e descobrir respostas
  - **Educativo:** Explicações passo a passo para te ensinar técnicas e conceitos de desenvolvimento pessoal
  - **Equilibrado:** Combina acolhimento empático com perguntas interativas para uma experiência completa
  - **Direto/Firme:** Tom mais direto e firme, como um mentor que te desafia e não tem medo de ser direto
- Conte mais sobre você (campo livre - texto)

**Persistência:**
- ✅ **Decisão:** Adicionar campos direto na tabela `usuarios`
- ✅ **Campos criados:**
  - `nome_assistente` (VARCHAR(100)) - já existia
  - `tom_conversa` (VARCHAR(20)) - criado com CHECK constraint
  - `sobre_voce` (TEXT) - criado
- Motivo: Poucos campos, consultas simples, performance melhor

**Implementação:**
- ✅ Página: `PerfilPessoalPageV13.tsx`
- ✅ API: `api/perfil-pessoal.ts`
- ✅ Webhook n8n: `webhook_perfil_pessoal` (ID: Xo32TaonbDju1uF9)
- ✅ SQL: `docs/sql/add_campos_perfil_pessoal.sql`

**Pendências:**
- Como impacta geração de quests/insights? (usar `tom_conversa` e `sobre_voce` no prompt da IA)

### 2. Objetivos
**O que o usuário precisa:**
- Listar objetivos principais por ordem de prioridade (campo texto livre)
- Editar objetivos conforme evolui

**Campos:**
- Objetivos (texto livre - lista de objetivos por prioridade)

**Persistência:**
- Campo `objetivo` (TEXT) na tabela `usuarios`
- Histórico de objetivos (tabela separada) para medir progresso

**Relação com Quests/Ações:**
- **Quests personalizadas:** Foco nos objetivos definidos + conversas
- **Quests sabotadores:** Trabalham padrões mentais (suporte para avançar)
- **Quests TCC/Estoicismo:** Melhorias gerais (humor, energia, emoções)
- **Áreas da vida:** Identificação automática nas conversas (já existe)

**Identificação de Objetivos:**
- Sistema identifica objetivos informados pelo usuário
- Sistema identifica objetivos mencionados nas conversas
- Cria lista de objetivos relacionada automaticamente com áreas da vida

**Progresso:**
- **Game/App:** Focado em pontos (XPs) - já existe
- **Vida Real:** Focado em realização dos objetivos definidos e concluídos
- **Feedback do usuário:** Usuário marca se objetivos foram alcançados (tela separada de Progresso)

**Implementação:**
- ✅ Página: `ObjetivosPageV13.tsx`
- ✅ API: `api/objetivos.ts`
- ✅ Webhook n8n: `webhook_objetivos` (ID: t2V2FjqurbcnvMvh)
- ✅ SQL: `docs/sql/add_campo_objetivo.sql`
- ✅ Campo `objetivo` (TEXT) na tabela `usuarios`
- ⏳ Tela separada: Progresso (mostra evolução + feedback do usuário) - pendente

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

1. ✅ **Perfil Pessoal - Persistência:** Campos criados na tabela `usuarios`
2. ✅ **Perfil Pessoal - Implementação:** Página, API e webhook criados
3. **APIs:** Quais webhooks criar? (objetivos, preferencias)
4. **Priorização:** Qual seção implementar primeiro? (Objetivos, Personalizações ou Recursos)
5. **Temas:** Como implementar dark mode?
6. **Conquistas:** Estrutura completa já existe ou precisa criar?

---

**Última atualização:** 2025-01-22 21:20
