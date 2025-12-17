# Plano de Melhoria - Notificações de Lembretes
## Versão Executiva

**Data:** 2025-12-05  
**Status:** ✅ Implementado  
**Workflow ID:** `i5VG5rHZ39ytueyu`

---

## Resumo

Reconstrução do workflow de notificações de lembretes com foco em:
- Controle de reenvio (evitar spam)
- Multicanal (push, WhatsApp, SMS, email)
- Performance e escalabilidade

---

## Escopo

| Canal | Status | Ação |
|-------|--------|------|
| Push | ✅ Funcionando | Manter |
| WhatsApp | ✅ Funcionando | Manter via `sw_evolution_send_message_v2` |
| SMS | 🔲 Não implementado | Estruturar (implementar depois) |
| Email | 🔲 Não implementado | Estruturar (implementar depois) |

---

## Problemas Atuais

1. **Reenvio repetido** → Sem log, notificações duplicadas
2. **Performance ruim** → 4 queries por usuário (N+1)
3. **Sem automação** → Apenas trigger manual
4. **Dados multiplicados** → 1 usuário gera 19+ items no merge

---

## Solução Proposta

### Mudanças Principais

| Atual | Novo |
|-------|------|
| 14 nodes | 10 nodes (-30%) |
| 5 queries/usuário | 1 query consolidada |
| Sem controle reenvio | Tabela `notificacoes_log` |
| Trigger manual | Schedule (8h, 13h, 19h) |
| Merge complexo | Lógica linear |

### Fluxo Simplificado

```
Schedule → Query Única → Filtrar Pendências → Switch Canal → Enviar → Gravar Log
```

---

## Benefícios

- **-80% queries** ao banco de dados
- **-30% nodes** no workflow
- **Zero reenvios** duplicados
- **Extensível** para novos canais
- **Auditável** via tabela de log

---

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Quebra de funcionalidade | Mantém subworkflows existentes |
| Perda de dados | Teste em ambiente isolado |
| Falha no schedule | Logs de execução n8n |

**Risco geral:** Baixo

---

## Cronograma

| Fase | Duração |
|------|---------|
| Criar tabela log | 5 min |
| Criar workflow novo | 30 min |
| Testar push + WhatsApp | 15 min |
| Ativar schedule | 5 min |

**Total estimado:** ~1 hora

---

## Próximos Passos

1. ✅ Análise completa (feito)
2. ⏳ Aprovação do plano
3. 🔲 Implementação
4. 🔲 Testes
5. 🔲 Ativação

---

## Aprovação

- [ ] Aprovado para implementação
- [ ] Ajustes necessários (descrever)
- [ ] Rejeitado (motivo)
