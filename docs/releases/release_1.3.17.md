# Release 1.3.17

**Data:** 2025-12-03 16:35
**Última atualização:** 2025-12-03 16:35

## Resumo

Implementação completa da **página de configurações de notificações** com base de dados, webhook de gravação e alteração de campos de horário para período do dia (manhã, tarde, noite).

---

## 🚀 Novas Funcionalidades

### Página de Notificações

| Funcionalidade | Descrição |
|----------------|-----------|
| **Configurações de conversas IA** | Ativar/desativar conversas direcionadas via WhatsApp |
| **Período preferido** | Seleção de período do dia (manhã, tarde, noite) |
| **Tipos de mensagens** | Configuração de mensagens motivacionais, alertas sobre sabotadores e resumo semanal |
| **Lembretes e alertas** | Configuração de lembretes para conversas diárias, quests e conquistas |
| **Canais de notificação** | Seleção múltipla de canais (WhatsApp, E-mail, Push, SMS) |
| **Persistência** | Dados salvos no banco de dados via webhook n8n |

### Base de Dados

| Tabela | Descrição |
|--------|-----------|
| **notificacoes** | Tabela para armazenar configurações de notificações por usuário |
| **Campos principais** | `conversas_ia_periodo`, `lembretes_periodo`, `lembretes_canais[]` |
| **Constraint** | UNIQUE(usuario_id) - uma configuração por usuário |
| **Validação** | CHECK constraint para períodos válidos (manha, tarde, noite) |

### API e Webhook n8n

| Componente | Descrição |
|-------------|-----------|
| **api/notificacoes.ts** | Endpoint proxy para GET e POST de notificações |
| **webhook_notificacoes** | Workflow n8n com GET (buscar) e POST (salvar) |
| **Validação** | Validação de períodos e campos obrigatórios |
| **Upsert** | INSERT com ON CONFLICT para atualizar configurações existentes |

---

## 🔧 Melhorias

### Interface (UI)

| Melhoria | Descrição |
|----------|-----------|
| **Período do dia** | Substituição de campos de horário (HH:mm) por seleção de período |
| **Selects padronizados** | Dropdowns com opções: Manhã, Tarde, Noite |
| **Feedback visual** | Mensagens de sucesso/erro ao salvar configurações |
| **Layout responsivo** | Seguindo padrão v1.3 com HeaderV1_3 e BottomNavV1_3 |

### Backend

| Melhoria | Descrição |
|----------|-----------|
| **Valores padrão** | Retorno de valores padrão quando usuário não tem configurações |
| **Validação de período** | Validação no n8n para garantir períodos válidos |
| **Tratamento de erros** | Configuração de onError nos webhooks |

---

## 🐛 Correções

| Correção | Impacto |
|----------|---------|
| **Campos de horário** | Migração de TIME para VARCHAR com CHECK constraint |
| **Valores padrão** | Ajuste de valores padrão de horário para período |
| **Validação n8n** | Adição de validação de períodos no nó POST |

---

## 📝 Arquivos Criados/Modificados

### Backend
- `api/notificacoes.ts` (novo)
- Tabela `notificacoes` no banco de dados (criada)
- Workflow n8n `webhook_notificacoes` (criado)

### Frontend
- `src/pages/App/v1.3/NotificacoesPageV13.tsx` (modificado - horário → período)

### Documentação
- `data/teste_notificacoes_logs.md` (novo - logs de teste)

---

## 🧪 Testes Realizados

### Teste de Integração

| Teste | Status | Detalhes |
|-------|--------|----------|
| **GET notificações** | ✅ Sucesso | Execução 146435 - 82ms |
| **POST notificações** | ✅ Sucesso | Execução 146436 - 183ms |
| **Validação banco** | ✅ Sucesso | Período atualizado de "manha" para "tarde" |
| **Frontend** | ✅ Sucesso | Selects renderizando corretamente |

**Usuário de teste:** `d949d81c-9235-41ce-8b3b-6b5d593c5e24`

---

## 📊 Estrutura de Dados

### Tabela notificacoes

```sql
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  conversas_ia_ativo BOOLEAN DEFAULT true,
  conversas_ia_periodo VARCHAR(10) DEFAULT 'manha' CHECK (conversas_ia_periodo IN ('manha', 'tarde', 'noite')),
  conversas_ia_motivacionais BOOLEAN DEFAULT true,
  conversas_ia_sabotadores BOOLEAN DEFAULT true,
  conversas_ia_resumo_semanal BOOLEAN DEFAULT true,
  lembretes_ativo BOOLEAN DEFAULT true,
  lembretes_periodo VARCHAR(10) DEFAULT 'manha' CHECK (lembretes_periodo IN ('manha', 'tarde', 'noite')),
  lembretes_conversas_diarias BOOLEAN DEFAULT true,
  lembretes_quests BOOLEAN DEFAULT true,
  lembretes_conquistas BOOLEAN DEFAULT true,
  lembretes_canais TEXT[] DEFAULT ARRAY['whatsapp'],
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id)
);
```

### Interface TypeScript

```typescript
type PeriodoDia = 'manha' | 'tarde' | 'noite';
type CanalNotificacao = 'whatsapp' | 'email' | 'push' | 'sms';

interface NotificacoesData {
  conversas_ia_ativo: boolean;
  conversas_ia_periodo: PeriodoDia;
  conversas_ia_motivacionais: boolean;
  conversas_ia_sabotadores: boolean;
  conversas_ia_resumo_semanal: boolean;
  lembretes_ativo: boolean;
  lembretes_periodo: PeriodoDia;
  lembretes_conversas_diarias: boolean;
  lembretes_quests: boolean;
  lembretes_conquistas: boolean;
  lembretes_canais: CanalNotificacao[];
}
```

---

## 🎯 Próximos Passos

### Implementar Rotinas de Notificação

**Objetivo:** Criar rotinas para ler as configurações de notificações e executar o envio de notificações aos usuários conforme suas preferências.

#### Tarefas Principais

1. **Job Agendado (Cron)**
   - Criar workflow n8n com trigger de agendamento (Schedule Trigger)
   - Executar periodicamente (ex: a cada hora ou em horários específicos)
   - Ler configurações de notificações de todos os usuários ativos

2. **Filtro por Período**
   - Verificar período preferido do usuário (manhã, tarde, noite)
   - Executar notificações apenas no período correto
   - Considerar timezone do usuário (futuro)

3. **Tipos de Notificações**

   **Conversas Direcionadas da IA (WhatsApp):**
   - Mensagens motivacionais
   - Alertas sobre sabotadores detectados
   - Resumo semanal

   **Lembretes:**
   - Conversas diárias pendentes
   - Quests pendentes
   - Conquistas e mudanças de nível

4. **Canais de Notificação**
   - WhatsApp: Integração com API de WhatsApp
   - E-mail: Envio via SMTP/API de e-mail
   - Push: Notificações push (PWA/App)
   - SMS: Integração com API de SMS

5. **Lógica de Execução**
   - Verificar se notificação já foi enviada hoje (evitar duplicatas)
   - Respeitar preferências do usuário (ativo/inativo)
   - Log de notificações enviadas
   - Tratamento de erros e retry

#### Estrutura Sugerida

```
workflow_job_notificacoes
├── Schedule Trigger (executar a cada hora)
├── Buscar Usuários Ativos
├── Para cada usuário:
│   ├── Buscar Configurações de Notificações
│   ├── Verificar Período Atual
│   ├── Verificar Se Deve Notificar
│   ├── Preparar Conteúdo da Notificação
│   ├── Enviar por Canal(s) Configurado(s)
│   └── Registrar Log de Envio
└── Finalizar
```

#### Considerações Técnicas

- **Performance:** Processar em lotes (batch) para muitos usuários
- **Rate Limiting:** Respeitar limites de APIs externas (WhatsApp, SMS)
- **Falhas:** Implementar retry e dead letter queue
- **Monitoramento:** Logs detalhados de execução e métricas

---

## 📊 Estatísticas

- **Commits:** 4
- **Arquivos novos:** 2 (api/notificacoes.ts, data/teste_notificacoes_logs.md)
- **Arquivos modificados:** 2 (NotificacoesPageV13.tsx, release_1.3.16.md)
- **Funcionalidades principais:** 1 (Página de notificações completa)
- **Workflows n8n:** 1 (webhook_notificacoes)
- **Tabelas criadas:** 1 (notificacoes)

---

**Última atualização:** 2025-12-03 16:35

