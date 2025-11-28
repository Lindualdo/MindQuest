# MindQuest - Página Evoluir v1.3.8 - Definição

**Data:** 2025-01-22 14:30  
**Versão:** 1.3.8

---

## Status Atual

- ✅ Cards de estatísticas (Conversas, Ações, Pontos) - implementado
- ✅ Estrutura base com 4 seções - implementado
- ✅ **Perfil Pessoal** - implementado
- ⏳ Objetivos - a definir
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

1. ✅ **Perfil Pessoal - Persistência:** Campos criados na tabela `usuarios`
2. ✅ **Perfil Pessoal - Implementação:** Página, API e webhook criados
3. **APIs:** Quais webhooks criar? (objetivos, preferencias)
4. **Priorização:** Qual seção implementar primeiro? (Objetivos, Personalizações ou Recursos)
5. **Temas:** Como implementar dark mode?
6. **Conquistas:** Estrutura completa já existe ou precisa criar?

---

**Última atualização:** 2025-01-22 19:45
