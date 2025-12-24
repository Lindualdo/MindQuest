### Visão Geral (Executiva) — Pilar Primordial
- **Conforto mental primeiro**: humor/energia baixos → acolher; emocional ok → agir nos objetivos.

### Tipos de Quest — Prioridade (ordem de decisão)
- **Personalizada**: pedido explícito no chat; **passa na frente** e **ignora onboarding/limite diário**.
- **Mentalidade**: criar se **humor ≤ 5 ou energia ≤ 5** (suporte imediato).
- **Sabotadores (chat atual)**: criar se sabotador **detectado no chat atual** (contramedida).
- **Objetivos**: criar se há objetivo cadastrado **e** o chat **menciona o objetivo**.

### Limites de segurança (anti-burnout)
- **Diário**: no máximo **2 quests/dia** (exceto personalizada por pedido).
- **Total**: no máximo **15 ativas/disponíveis**; acima disso **bloqueia criação**.

### Deduplicação (evitar quests repetidas)
- **No HUB (roteamento)**: não rotear tipo se já existe similar em `quests_existentes`.
  - mentalidade: categorias `tcc/estoicismo/boa_pratica_geral`; sabotador: `contramedida_sabotador`.
- **No especialista (catálogo)**: filtra catálogo já usado + similaridade de título + cooldown.
  - mentalidade: evita repetição recente (≈14 dias) e similaridade > 0.5.
  - sabotador: cooldown do mesmo sabotador (≈7 dias) e evita `catalogo_id` já usado.

### Uso do Catálogo por tipo (de onde vem “quest diferente”)
- **Mentalidade/Sabotador**: escolhem a base em `quests_catalogo` e adaptam ao contexto.
- **Objetivos/Personalizada**: geram “custom” (`quest_custom`); evitam duplicar por títulos existentes.