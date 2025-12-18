## Lembretes de Notificações (Conversa e Quests) — Regras de Negócio

### Objetivo
- Reengajar o usuário diariamente sem pressionar, alternando **conversa** e **ação (quests)**.

### Canais
- O sistema só envia pelos canais habilitados pelo usuário (ex.: WhatsApp, Push).
- O envio só ocorre se houver dados mínimos do canal (ex.: número WhatsApp / token push).

### Controle de duplicidade (por dia)
- **Não enviar o mesmo tipo de lembrete mais de 1 vez por dia**, por canal:
  - Ex.: no mesmo dia, no máximo 1 `quest_*` no WhatsApp e 1 `quest_*` no Push.

---

## 1) Lembrete de Conversa (Diário)

### Janela
- Enviado no período da manhã (regra atual: **09:00**).

### Elegibilidade
- Usuário com lembretes ativos e lembrete de conversa habilitado.
- Usuário **não conversou no dia**.
- Usuário **não recebeu lembrete de conversa no dia**.

### Segmentação
- **Primeira conversa**: usuário ainda não teve conversa com o Mentor.
- **Conversa**: usuário já conversou anteriormente.

### Regras de conteúdo
- Objetivo: **raport + curiosidade + convite** (conversa humana).
- Deve:
  - usar o nome do usuário;
  - conectar com algo real de contexto recente (quando existir);
  - terminar com pergunta aberta curta.
- Não deve:
  - sugerir quests/ações;
  - dar “solução pronta” ou conselho técnico;
  - ser genérica.

---

## 2) Lembrete de Quests (Diário)

### Janela
- Enviado no período da tarde (regra atual: **15:00**).

### Elegibilidade
- Usuário com lembretes ativos e lembrete de quests habilitado.
- Usuário **não recebeu lembrete de quest no dia**.

### Quest do dia (seleção automática)
- O sistema escolhe a quest do dia; o Mentor **não escolhe**.
- Rotação de categorias (ordem fixa):
  - **TCC → Estoicismo → Sabotador → Personalizada → Objetivo**.
- Regra de fallback:
  - se não houver quest na categoria da vez, pular para a próxima categoria disponível.
- Regra de bem-estar:
  - se humor **ou** energia estiverem baixos, priorizar quests de **bem-estar** (TCC/Estoicismo).

### Resumo de quests do usuário (antes do incentivo)
- A mensagem deve incluir um resumo claro e objetivo **apenas com títulos**, separado em:
  - **A fazer (disponível)**
  - **Fazendo (ativo)**

### Incentivo após o resumo
- Após o resumo, a mensagem deve:
  - sugerir e incentivar a **Quest do dia** (a selecionada);
  - justificar a importância em linguagem simples (benefício prático + fundamento sem termos técnicos);
  - respeitar o momento do usuário (sem cobrança).

### Regras de conteúdo
- Deve:
  - ser direta (poucas frases) e com CTA claro;
  - usar termos: **desafio**, **tarefa** ou **missão**.
- Não deve:
  - mencionar termos técnicos (ex.: “TCC”, “sabotador”, métricas de humor/energia);
  - trocar a quest do dia por outra;
  - listar descrições/IDs no resumo (somente títulos).
