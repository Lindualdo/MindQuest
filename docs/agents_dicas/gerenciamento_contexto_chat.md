# Gerenciamento de Contexto em Chats

**Data:** 2025-11-24  
**Objetivo:** Saber quando o contexto está cheio e quando iniciar novo chat

---

## Sinais de que o Contexto Está Cheio

### 1. Performance Degradada
- **Respostas mais lentas:** O assistente demora mais para responder
- **Respostas incompletas:** Respostas são cortadas ou truncadas
- **Perda de contexto:** O assistente "esquece" informações mencionadas anteriormente
- **Erros de memória:** Confunde informações de diferentes partes da conversa

### 2. Comportamento Estranho
- **Repetição:** O assistente repete informações já fornecidas
- **Inconsistências:** Diz uma coisa agora e outra depois (sem mudança de requisito)
- **Respostas genéricas:** Para de usar informações específicas do projeto
- **Ignora detalhes:** Não menciona arquivos/componentes específicos que você citou

### 3. Limitações Técnicas
- **Muitas mensagens:** Chat com 50+ mensagens geralmente está no limite
- **Muitos arquivos abertos:** 10+ arquivos diferentes mencionados/alterados
- **Múltiplas tarefas:** 5+ tarefas diferentes resolvidas no mesmo chat
- **Histórico longo:** Conversa com várias horas de trabalho

### 4. Indicadores Específicos do Cursor
- **Tool calls falhando:** Ferramentas começam a falhar sem motivo aparente
- **Timeout em operações:** Operações que antes eram rápidas começam a dar timeout
- **Respostas vazias:** O assistente tenta responder mas não consegue

---

## Quando Iniciar um Novo Chat

### ✅ **Iniciar Novo Chat Quando:**

1. **Mudança de Contexto Grande**
   - Mudou de módulo/sistema (ex: de quests para dashboard)
   - Mudou de versão (ex: de v1.3 para v1.4)
   - Nova feature completamente diferente

2. **Tarefa Completa Finalizada**
   - Feature implementada e testada
   - Bug corrigido e validado
   - Documentação atualizada

3. **Performance Degradada**
   - Respostas ficando lentas/incompletas
   - Assistente começando a "esquecer" coisas

4. **Muitas Iterações**
   - 3+ rodadas de correções no mesmo problema
   - Múltiplas refatorações no mesmo código
   - Histórico muito longo (50+ mensagens)

5. **Nova Sessão de Trabalho**
   - Parou de trabalhar e voltou no dia seguinte
   - Mudou de foco e quer começar "limpo"

### ❌ **NÃO Precisa Iniciar Novo Chat:**

1. **Correções Pequenas**
   - Ajustes pontuais em código existente
   - Correções de bugs simples
   - Pequenos ajustes de UI

2. **Tarefas Relacionadas**
   - Continuidade da mesma feature
   - Ajustes baseados em feedback
   - Melhorias incrementais

3. **Performance Ainda Boa**
   - Respostas rápidas e precisas
   - Assistente lembra do contexto
   - Tool calls funcionando normalmente

---

## Estratégia Recomendada

### Para Tarefas Grandes (Features, Refatorações)
1. **Início:** Novo chat com prompt inicial completo
2. **Durante:** Continuar no mesmo chat enquanto performance estiver boa
3. **Fim:** Finalizar e iniciar novo chat para próxima tarefa

### Para Tarefas Múltiplas Pequenas
1. **Agrupar:** Fazer várias tarefas relacionadas no mesmo chat
2. **Limite:** Máximo de 5-7 tarefas pequenas por chat
3. **Trocar:** Quando mudar de contexto ou performance degradar

### Para Debug e Correções
1. **Mesmo chat:** Continuar no mesmo chat para manter contexto do problema
2. **Limite:** Se passar de 3-4 iterações sem resolver, considerar novo chat
3. **Documentar:** Antes de trocar, documentar o que foi tentado

---

## Checklist: Devo Trocar de Chat?

Marque os itens que se aplicam:

- [ ] Respostas estão ficando lentas ou incompletas
- [ ] Assistente está "esquecendo" informações mencionadas
- [ ] Chat tem mais de 50 mensagens
- [ ] Mais de 10 arquivos diferentes foram mencionados/alterados
- [ ] Mudei de contexto grande (módulo/versão/feature)
- [ ] Tarefa atual está completa e validada
- [ ] Tool calls começaram a falhar sem motivo
- [ ] Assistente está repetindo informações ou sendo inconsistente

**Se marcou 3+ itens:** Considere iniciar um novo chat.

**Se marcou 1-2 itens:** Continue, mas monitore a performance.

**Se não marcou nenhum:** Continue no mesmo chat.

---

## Como Iniciar um Novo Chat Eficientemente

### 1. Preparação (Antes de Fechar o Chat Atual)
- [ ] Documentar o que foi feito (commits, alterações)
- [ ] Anotar pendências ou próximos passos
- [ ] Salvar informações importantes (IDs, caminhos, etc.)

### 2. Novo Chat
- [ ] Copiar prompt inicial apropriado (`prompt_inicial_chat.md`)
- [ ] Mencionar contexto da tarefa atual
- [ ] Referenciar commits/documentação relevante
- [ ] Informar pendências do chat anterior (se houver)

### 3. Exemplo de Abertura de Novo Chat

```
[Colar prompt inicial]

Estou continuando trabalho do chat anterior. Contexto:
- Último commit: a7a24e4 - Ajustar sistema de quests para contar quantidade
- Tarefa atual: Corrigir cálculo de progresso no CardWeeklyProgress
- Pendência: Validar se qtdQuestsConcluidas está sendo retornado corretamente

Pode me ajudar a debugar o problema?
```

---

## Dicas Práticas

### Monitorar Performance
- **Antes de cada mensagem:** Avalie se a última resposta foi completa e precisa
- **Se notar degradação:** Anote e considere trocar no próximo ponto natural
- **Não force:** Se performance está ruim, melhor trocar do que continuar frustrado

### Organizar por Contexto
- **1 chat = 1 contexto:** Features relacionadas no mesmo chat
- **Mudou contexto = novo chat:** Facilita para o assistente focar
- **Documentar transições:** Facilita continuidade entre chats

### Usar Documentação
- **Referência técnica:** Use `referencia_tecnica.md` para evitar repetir contexto
- **Prompt inicial:** Sempre use para dar contexto rápido
- **Commits:** Referencie commits para contexto histórico

---

## Exemplo Prático

### Cenário: Desenvolvendo Feature de Quests

**Chat 1 (Início):**
- Prompt inicial completo
- Implementação da feature base
- Testes iniciais
- **Fim:** Feature funcional, commit feito

**Chat 2 (Ajustes):**
- Prompt inicial resumido
- "Continuando feature de quests, commit abc123"
- Ajustes de UI e feedback
- **Fim:** Ajustes completos, commit feito

**Chat 3 (Bug):**
- Prompt inicial resumido
- "Bug no webhook_quests após commit def456"
- Debug e correção
- **Fim:** Bug corrigido, commit feito

**Chat 4 (Nova Feature):**
- Prompt inicial completo
- Nova feature diferente (ex: dashboard)
- **Fim:** Feature completa

---

**Última atualização:** 2025-11-24

