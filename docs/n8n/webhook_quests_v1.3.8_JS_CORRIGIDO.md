# Código JavaScript Corrigido - webhook_quests v1.3.8

**Data:** 2025-01-22

**Ajustes no nó "Montar Resposta":**
- Usar `quest_estagio` ao invés de `status === 'concluida'`
- Usar `quest_estagio === 'feito'` para contar concluídas
- Ajustar filtro de `questAtiva` para usar novos status

---

## Código Corrigido

```javascript
// ... (código anterior até calcularXpConcedido) ...

const estado = getItem('Ler Usuarios Conquistas');
const questsRaw = getItems('Listar Usuarios Quest');

// Ajustar filtro para novos status
const questAtiva = questsRaw
  .filter((q) => q.status === 'ativa' || q.status === 'disponivel')
  .sort((a, b) => {
    if (a.status === 'ativa' && b.status !== 'ativa') return -1;
    if (a.status !== 'ativa' && b.status === 'ativa') return 1;
    const dateA = a.atualizado_em ? new Date(a.atualizado_em).getTime() : 0;
    const dateB = b.atualizado_em ? new Date(b.atualizado_em).getTime() : 0;
    return dateB - dateA;
  })[0] || null;

let quest = null;
if (questAtiva) {
  const config = parseJson(questAtiva.config) || {};
  const recorrencias = parseJson(questAtiva.recorrencias) || null;
  const datasConcluidas = questAtiva.datas_concluidas || [];
  const isConversa = isConversaQuest(questAtiva);
  const progresso = calcularProgresso(recorrencias, datasConcluidas, isConversa);
  const xpRecompensa = extractXpRecompensa(questAtiva);
  
  quest = {
    id: questAtiva.instancia_id || questAtiva.meta_codigo || null,
    titulo: questAtiva.titulo || config?.titulo || 'Quest personalizada',
    descricao: questAtiva.descricao || config?.descricao || null,
    status: questAtiva.status || 'disponivel',
    prioridade: questAtiva.prioridade || config?.prioridade || null,
    recorrencia: questAtiva.recorrencia || config?.recorrencia || null,
    progresso,
    xp_recompensa: xpRecompensa,
    ultima_atualizacao: questAtiva.atualizado_em || null,
    ultima_atualizacao_label: humanizeDate(questAtiva.atualizado_em),
  };
}

const totalPersonalizadas = questsRaw.length;
// Usar quest_estagio ao invés de status === 'concluida'
const totalConcluidas = questsRaw.filter((q) => q.quest_estagio === 'feito').length;

let xpBaseTotal = 0;
let xpBonusTotal = 0;
// Usar quest_estagio ao invés de status === 'concluida'
questsRaw.forEach((q) => {
  if (q.quest_estagio === 'feito') {
    const xpConcedido = calcularXpConcedido(q);
    xpBaseTotal += xpConcedido;
  }
});

// ... (resto do código permanece igual) ...

const questsPersonalizadas = questsRaw.map((q) => {
  const xpRecompensa = extractXpRecompensa(q);
  const config = parseJson(q.config) || {};
  const recorrencias = parseJson(q.recorrencias) || null;
  const datasConcluidas = q.datas_concluidas || [];
  const isConversa = isConversaQuest(q);
  const recorrenciasEnriquecidas = enriquecerRecorrencias(recorrencias, datasConcluidas, isConversa);
  const progresso = calcularProgresso(recorrencias, datasConcluidas, isConversa);
  
  return {
    instancia_id: q.instancia_id || q.meta_codigo || null,
    meta_codigo: q.meta_codigo || q.instancia_id || null,
    titulo: q.titulo || config?.titulo || 'Quest personalizada',
    descricao: q.descricao || config?.descricao || null,
    status: q.status || 'disponivel',
    quest_estagio: q.quest_estagio || 'a_fazer', // Incluir quest_estagio
    concluido_em: q.concluido_em || null,
    progresso_meta: progresso.meta,
    progresso_atual: progresso.atual,
    xp_recompensa: xpRecompensa,
    prioridade: q.prioridade || config?.prioridade || null,
    recorrencia: q.recorrencia || config?.recorrencia || null,
    recorrencias: recorrenciasEnriquecidas,
    atualizado_em: q.atualizado_em || null,
    tipo: q.tipo || null,
    catalogo_codigo: q.catalogo_codigo || null,
    config: config,
  };
});

// ... (resto do código permanece igual) ...
```

---

**Última atualização:** 2025-01-22

