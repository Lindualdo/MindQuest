# Especificação de Gamificação · Reinício das Metas de Sequência

Este documento consolida as decisões de gamificação para o novo ciclo de testes. Ele substitui especificações anteriores e serve como referência única para produto, engenharia e dados.

## Espec Gamificação

- **Objetivo central**: conduzir o usuário a realizar pelo menos uma conversa guiada por dia com o assistente. Toda a progressão e recompensas orbitam esse hábito.
- **Escala de streaks**: cada degrau só fica ativo após a conclusão do anterior; ao quebrar a sequência diária, o desafio volta para a Meta 1, mas os registros históricos (XP, conquistas e melhor streak) permanecem.

| Meta | Dias Seguidos | Descrição resumida | XP sugerido | Desbloqueia |
|------|---------------|--------------------|-------------|-------------|
| 1    | 3             | Primeira mini sequência consistente | 80  | Meta 2 |
| 2    | 5             | Consolida o hábito iniciado | 100 | Meta 3 |
| 3    | 7             | Semana completa de conversas | 130 | Meta 4 |
| 4    | 10            | Segunda semana com ritmo contínuo | 170 | Meta 5 |
| 5    | 15            | Meio mês sem interrupções | 220 | Meta 6 |
| 6    | 20            | Estabilização do hábito | 280 | Meta 7 |
| 7    | 25            | Consolidação avançada | 350 | Meta 8 |
| 8    | 30            | Marco principal de consistência | 450 | Marca ciclo; reinicia em 3 dias |

- **Regras de reset**:
  - Ao detectar ausência de conversa em um dia, `streak_conversas_dias` volta para 0 e o alvo ativo retorna à Meta 1 (3 dias).
  - `melhor_streak` guarda o recorde histórico.
  - Conquistas de streak são exibidas como “insígnias únicas” com um contador de quantas vezes foram completadas.
- **Quests personalizadas (habits)**:
  - São geradas após cada conversa com base no sabotador dominante ou insight detectado.
  - Estrutura: gatilho claro (situação/emoção), comportamento esperado, duração curta (3, 5 ou 7 dias), feedback diário.
  - Não competem com a trilha principal; complementam o hábito diário.
- **Eventos especiais** (opcionais):
  - Desafios temáticos de duração limitada, sem impacto na escada principal. Pautados por campanhas ou datas-chave.

## Espec de Negócio

- **Valor para o usuário**:
  - Clareza: “uma conversa por dia” como norte; metas de streak traduzem progresso tangível.
  - Personalização: missões baseadas nos sabotadores e contextos emocionais sugerem hábitos aplicáveis ao dia a dia.
  - Reconhecimento contínuo: recordes preservados, contadores de repetições e recompensas graduais incentivam retomada rápida após falhas.
- **Valor para o produto**:
  - Métrica mestra: taxa de conversas diárias por usuário.
  - Indicadores complementares: quantidade de metas concluídas por faixa, tempo até retomada após quebra, adesão às quests personalizadas.
  - Segmentação: identificar padrões de sabotador mais recorrentes e efeito das missões personalizadas na manutenção do streak.
- **Diretrizes de experiência**:
  - O painel deve mostrar três números principais: streak atual, recorde histórico e meta vigente.
  - Conquistas repetidas são agregadas (ex.: “Streak 7 dias · alcançada 3 vezes”).
  - Quando o usuário quebra a sequência, mensagem motivadora + sugestão da Meta 1 (“volte para 3 dias seguidos”) mantendo atalho para retomar desafios longos se desejar.

## Espec Técnica

### Catálogo de Quests (`docs/data/quest_catalog.json`)
- Atualizar categorias para `habit_core` (streaks), `habit_deep` (personalizadas), `onboarding`, `event`.
- Registrar as oito metas como entradas `streak_003`, `streak_005`, …, `streak_030` com `gatilho_tipo = "dias_consecutivos"`, `repeticao = "unica"`, `ordem_inicial` crescente, `xp_recompensa` conforme tabela.
- Quests personalizadas terão `tipo = "personalizada"`, `gatilho_tipo` conforme a ação (ex.: `habito_repeticoes`, `contexto_emocional`), e parâmetros extras em um campo `config`.
- Arquivar ou comentar quests “daily_*” enquanto o assistente de reflexão já cobre esse fluxo.

### Relação Usuário × Quest (`docs/data/usuarios_quest.json`)
- Manter campos atuais e incluir:
  - `meta_codigo`: referência estável da meta (ex.: `streak_010`).
  - `janela_inicio` e `janela_fim`: delimitação temporal para missões personalizadas.
  - `contexto_origem`: sabotador, insight ou evento que originou a quest.
  - `reiniciada_em` (timestamp opcional) para registrar resets de streak.
  - `tentativas`: contador de vezes que o usuário abriu a mesma meta.
- Regra: apenas uma entrada ativa para `habit_core`; resets encerram o registro vigente (`status = "reiniciada"`) e criam nova instância para a Meta 1.

### Consolidados de Gamificação (`docs/data/gamificacao.json`)
- Novos campos:
  - `streak_meta_atual`: código da meta ativa (ex.: `streak_003`).
  - `streak_meta_proximo`: próximo alvo caso conclua a atual (ex.: `streak_005`).
  - `streak_meta_status`: objeto simples `{ alvoDias: 5, estado: "ativo", reinicios: 2, completado_em: null }`.
  - `habitos_ativos`: lista com `id_quest`, `titulo`, `progresso_pct`.
- `conquistas_desbloqueadas` passa a incluir `tipo_meta` e `valor_meta` para reconstruir dashboards sem depender do nome textual.
- XP e níveis continuam, mas os bônus das novas metas devem ser refletidos em `total_xp_ganho_hoje` e históricos.

### Outras Considerações
- **Reset da sequência**: serviços que calculam o streak devem atualizar `usuarios_quest`, `gamificacao` e gerar evento de auditoria.
- **APIs**: endpoints que alimentam o dashboard devem retornar `streak_meta_atual`, `streak_meta_proximo`, contagem de conquistas de streak (agrupada) e quests personalizadas ativas.
- **Dashboard**: o componente de gamificação mostrará barra com alvo alinhado a `streak_meta_atual`, além de resumo das missões personalizadas.
- **Backups**: como o ambiente está em teste, manter exportação automática após aplicar as alterações estruturais para permitir rollback rápido.

---

Próximos passos: implementar alterações nas tabelas (drop/create ou migration), atualizar regras de cálculo na camada de serviço e alinhar o dashboard aos novos campos.

- Script de referência com o reset completo das tabelas: `docs/sql/schema_gamificacao_reset.sql`.
