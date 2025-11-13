  # Merge Jornada — Diferenças e Propostas

Base de comparação
- Atual (origem): `docs/espec/quest/jornadas_mindquest.md`
- Revisão (nova): `docs/espec/quest/jornada_revisao.md`
- Escopo: níveis, critérios de avanço e sistema de XP.

Alinhamentos
- 10 níveis e faixas de XP idênticas (0–500 … 16.000+).
- Metas-chave batem (N1 1 quest básica; N4 21 dias; N9 projeto; N10 evolução contínua).
- Sistema de XP coincide: Conversas, Personalizadas, Sequência, Marcos e Filosofia.

Diferenças (o que a revisão simplificou)
- Removeu critérios mensuráveis por nível (metas de sequência 5/7/10/… conversas; contagem de quests; sabotadores).
- Excluiu blocos “Quests Disponíveis”, “Conquistas”, “Recompensas”, “Transformação”.
- Não traz “Resumo por nível”, “Princípios”, “Implementação técnica”, “Mensagens de transição”.
- Terminologia: revisão usa “Faixa de XP”/“Diretriz”; atual usa “XP necessário”/“Meta Principal”/“Critérios”.

Gaps a decidir (produto x comunicação)
- Critérios quantitativos no doc público? (ex.: N2 = Meta Sequência 3 + 3 sabotadores + 3 quests)
- Incluir exemplos de quests por nível ou manter só visão rápida?
- Recompensas/badges: neste doc ou separado no catálogo de gamificação?
- N10 usar “Diretriz” (revisão) ou manter “Meta Principal + critérios” (atual)?

Proposta de merge (recomendado)
- Camadas de leitura:
  - Visão Rápida: níveis + faixa de XP + meta‑síntese (texto da revisão).
  - Detalhado: critérios objetivos + conquistas + recompensas + transformação (do atual).
- Padronizar termos: “XP necessário”, “Meta Principal”, “Critérios para avançar”, “Conquistas”, “Recompensas”.
- Sistema de XP: manter tabelas completas (Conversas, Personalizadas, Sequência, Marcos) + Filosofia.
- Apêndices: “Princípios”, “Implementação técnica”, “Mensagens de transição”.

Sugestões concretas
- Consolidar em `docs/jornada_MindQuest_merged.md` com âncoras: `#nivel-1` … `#nivel-10`.
- Em cada nível, header curto + 5 blocos padrão: Faixa de XP • Meta Principal • Critérios • Conquistas • Recompensas.
- Inserir referência à meta de sequência por nível (M2, M3, … M8) para reforçar hábito.
- Manter a Filosofia do XP e as tabelas exatamente como na revisão (valores iguais à versão atual).

Próximos passos
- Validar se critérios quantitativos permanecem públicos ou só internos.
- Confirmar badges/recompensas por nível (doc público x catálogo interno).
- Aprovado o formato, eu gero `docs/jornada_MindQuest_merged.md` consolidado.
