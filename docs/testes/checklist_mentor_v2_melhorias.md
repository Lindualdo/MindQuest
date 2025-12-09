# Checklist de Testes - Melhorias Mentor v2

**Data:** 2025-12-09  
**Workflows:** `mentor_mindquest_v2`, `job_execute_experts`

---

## 1. Micro Resumo por Temas

### 1.1 Fechamento de Tema
| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 1.1.1 | Tema explorado suficientemente | Conversar sobre um assunto por 3-4 mensagens | Mentor apresenta micro resumo em bullets |  |
| 1.1.2 | Validação explícita | Após micro resumo | Mentor pergunta: "Quer explorar mais ou seguimos?" |  |
| 1.1.3 | Usuário confirma fechamento | Responder "pode fechar" ou similar | `tema_atual_fechado: true` no JSON |  |
| 1.1.4 | Usuário quer continuar | Responder "quero falar mais sobre isso" | `tema_atual_fechado: false`, conversa continua |  |
| 1.1.5 | Tema vs Sessão | Fechar tema | Conversa NÃO encerra, mentor propõe novo tema |  |

### 1.2 Estrutura JSON
| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 1.2.1 | Campo `tema_atual` presente | Qualquer interação | JSON contém `tema_atual.titulo`, `resumo`, `decisoes` |  |
| 1.2.2 | Resumo atualizado | A cada interação | `tema_atual.resumo` reflete pontos discutidos |  |
| 1.2.3 | Decisões capturadas | Usuário toma decisão | Aparece em `tema_atual.decisoes` |  |

---

## 2. Trigger de Experts

### 2.1 Por Tema Fechado
| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 2.1.1 | Tema fechado dispara experts | Fechar tema (micro resumo + confirmação) | `trigger_experts: true`, experts executam |  |
| 2.1.2 | Mensagem enviada junto | Ao disparar experts | Usuário recebe resposta normalmente |  |

### 2.2 Por Limite de Interações (7+)
| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 2.2.1 | 6 interações sem trigger | Conversar 6x sem fechar tema | `trigger_experts: false` |  |
| 2.2.2 | 7ª interação COM contexto rico | 7ª msg com emoções/reflexões | `trigger_experts: true` |  |
| 2.2.3 | 7ª interação SEM contexto rico | 7ª msg superficial ("ok", "tá") | `trigger_experts: false` |  |
| 2.2.4 | Contexto rico detectado | Expressar emoção ou reflexão | `contexto_rico: true` |  |

### 2.3 Fluxo dos Experts
| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 2.3.1 | Experts recebem dados | Verificar execução | `mensagens_texto` populado corretamente |  |
| 2.3.2 | Sem duplicação | Disparar experts 2x na mesma sessão | Análises incrementais, não duplicadas |  |

---

## 3. Exclusão de Sessão Atual do Contexto

| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 3.1 | Histórico não inclui hoje | Iniciar conversa do dia | `ultimas_conversas` NÃO contém data de hoje |  |
| 3.2 | Redis mantém contexto | Continuar conversa | Mentor lembra o que foi dito (via Redis) |  |
| 3.3 | Sem duplicação de contexto | Verificar prompt enviado | Mensagens não aparecem 2x (Redis + DB) |  |

---

## 4. Batch Noturno (job_execute_experts)

| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 4.1 | Schedule configurado | Verificar workflow | Trigger: cron `0 23 * * *` (23:00) |  |
| 4.2 | Busca pendentes | Executar manualmente | Retorna conversas com `processada_em IS NULL` |  |
| 4.3 | Processa corretamente | Executar com dados | Experts recebem `usuario_id`, `chat_id`, `mensagens` |  |
| 4.4 | Marca processada | Após execução | `processada_em` atualizado no `usr_chat` |  |
| 4.5 | Idempotente | Executar 2x seguidas | Segunda execução não reprocessa mesmo registro |  |

---

## 5. Detecção de Notificação

### 5.1 Busca de Notificação
| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 5.1.1 | Notificação recente existe | Enviar notificação, responder em <4h | `tem_notificacao_recente: true` |  |
| 5.1.2 | Notificação expirada | Responder após >4h | `tem_notificacao_recente: false` |  |
| 5.1.3 | Sem notificação | Iniciar conversa sem notificação prévia | `tem_notificacao_recente: false` |  |
| 5.1.4 | Apenas WhatsApp | Ter notificação push, não whatsapp | Não detecta (filtra por `canal = 'whatsapp'`) |  |

### 5.2 Comportamento do Mentor
| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 5.2.1 | Confirma interesse | Responder a notificação | Mentor pergunta: "Quer falar sobre [tema]?" |  |
| 5.2.2 | Usuário confirma | Responder "sim" ou sobre o tema | Mentor conduz conversa sobre notificação |  |
| 5.2.3 | Usuário nega | Responder sobre outro assunto | Mentor segue novo tema, não insiste |  |
| 5.2.4 | Não força tema | Resposta ambígua | Mentor pergunta UMA vez só |  |

### 5.3 Tipos de Notificação
| # | Tipo | Abordagem Esperada | ✓ |
|---|------|-------------------|---|
| 5.3.1 | `acao_*` (quest) | "Quer conversar sobre a quest [titulo]?" |  |
| 5.3.2 | `conversa_celebracao` | "Parabéns! Quer celebrar?" |  |
| 5.3.3 | `conversa_continuidade` | "Que bom te ver! Como está?" |  |
| 5.3.4 | `conversa_geral` | Acolhe normalmente |  |

### 5.4 Marcação de Respondida
| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 5.4.1 | Marca após processar | Responder notificação | `respondida = TRUE`, `respondida_em` preenchido |  |
| 5.4.2 | Não remarca | Segunda interação | Não busca mesma notificação novamente |  |
| 5.4.3 | Sem notificação, não quebra | Interação normal | Node `marca_notificacao` executa sem erro |  |

---

## 6. Fluxo Geral (Regressão)

| # | Cenário | Como Testar | Esperado | ✓ |
|---|---------|-------------|----------|---|
| 6.1 | Primeira conversa | Novo usuário | Mentor se apresenta, conhece usuário |  |
| 6.2 | Nova sessão (retorno) | Usuário existente, nova sessão | Abertura contextual |  |
| 6.3 | Continuação de sessão | Mesma sessão do dia | Mentor lembra contexto |  |
| 6.4 | Encerramento de sessão | Dizer "por hoje é isso" | `checkpoint_encerramento: true` |  |
| 6.5 | Mensagens gravadas | Qualquer interação | `usr_chat.mensagens` atualizado |  |
| 6.6 | Resposta enviada | Qualquer interação | WhatsApp recebe mensagem |  |

---

## 7. Verificações no Banco

```sql
-- Verificar notificação marcada como respondida
SELECT id, tipo, respondida, respondida_em 
FROM notificacoes_log 
WHERE usuario_id = 'UUID' 
ORDER BY criado_em DESC LIMIT 5;

-- Verificar conversa processada
SELECT id, data_conversa, processada_em, total_interactions 
FROM usr_chat 
WHERE usuario_id = 'UUID' 
ORDER BY data_conversa DESC LIMIT 5;

-- Verificar mensagens da sessão
SELECT id, data_conversa, jsonb_array_length(mensagens) as total_msgs
FROM usr_chat 
WHERE usuario_id = 'UUID' AND data_conversa = CURRENT_DATE;
```

---

## 8. Logs de Execução (n8n)

| Workflow | O que verificar |
|----------|-----------------|
| `mentor_mindquest_v2` | Nodes executados corretamente, sem erros |
| `busca_notificacao` | Retorna dados ou vazio (sem erro) |
| `contexto_completo` | `tem_notificacao_recente` correto |
| `marca_notificacao` | UPDATE executado (afeta 0 ou 1 row) |
| `verifica_encerramento` | Branch correto acionado |
| `call_experts` | Dados formatados corretamente |
| `job_execute_experts` | Busca pendentes, processa, marca |

---

## Notas de Teste

- [ ] Testar com usuário real (produção)
- [ ] Testar com dados simulados (dev)
- [ ] Verificar logs de erro no n8n
- [ ] Monitorar consumo de tokens

---

## Resultado Final

| Categoria | Total | ✓ OK | ✗ Falha |
|-----------|-------|------|---------|
| Micro Resumo | 8 | | |
| Trigger Experts | 8 | | |
| Exclusão Contexto | 3 | | |
| Batch Noturno | 5 | | |
| Notificações | 14 | | |
| Regressão | 6 | | |
| **TOTAL** | **44** | | |

---

**Testado por:** _______________  
**Data:** _______________  
**Versão aprovada:** [ ] Sim  [ ] Não
