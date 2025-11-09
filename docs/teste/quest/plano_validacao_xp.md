# Plano de Teste para Validação de XPs

## Objetivo
Garantir que os registros em banco reflitam corretamente as regras de XP definidas para conversas, sequências e quests personalizadas.

## Escopo
- Verificação de XP gerado por conversas (base por evento e bônus de sequência)
- Verificação de XP gerado por quests personalizadas (conclusões únicas e recorrentes)
- Consistência entre XP acumulado e níveis da jornada

## Tabelas e validações

| Tabela | O que validar | Dados esperados |
|--------|---------------|-----------------|
| `quest_estado_usuario` | Campos `xp_total`, `total_xp_hoje`, `sequencia_atual`, `sequencia_recorde`, `meta_sequencia_codigo`, `proxima_meta_codigo`, `ultima_conversa_em`, `sequencia_status` | XP total soma conversas + quests; sequência atual/recorde coerentes; metas ativas alinhadas ao número de conversas consecutivas. |
| `usr_chat` | Conversas registradas por usuário (datas e timestamps) | Cada conversa nova deve gerar 75 XP; múltiplas conversas no mesmo dia adicionam XP para cada evento. |
| `quest_instancias` | Status e progresso das quests personalizadas | Status `concluída` adiciona 150 XP; instâncias recorrentes somam +30 XP por ciclo (máx. 21 por `modelo_id`). |
| `quest_modelos` | Configuração de recorrência (`config.recorrencia`) | Tipo definido precisa refletir o cálculo aplicado (única vs. recorrente). |
| `jornada_niveis` x `quest_estado_usuario` | Faixa de XP e nível atual | `nivel_atual`, `titulo_nivel`, `xp_proximo_nivel` condizem com a faixa onde `xp_total` está. |
| `quest_estado_usuario` x registros diários | Reconciliação de `total_xp_hoje` e `total_quests_concluidas` | Somatório diário de conversas + quests bate com campos agregados do estado do usuário. |

## Casos de teste

1. **Conversa única**: registrar uma conversa nova e confirmar +75 XP e sequência = 1.
2. **Múltiplas conversas no dia**: três conversas no mesmo dia → +225 XP e sequência +3.
3. **Quebra de sequência**: inserir um dia sem conversa para verificar reset e incremento de `reinicios`.
4. **Bônus de sequência**: completar metas 3/5/7 etc. e garantir bônus de 40/60/90 XP só quando a meta é alcançada.
5. **Quest única concluída**: mudar uma instância para `concluída` e validar +150 XP no estado.
6. **Quest recorrente**: concluir a mesma recorrente várias vezes e verificar +30 XP extras por ciclo até o 21º.
7. **Limite de recorrência**: após 21 repetições, confirmar que o bônus extra não ultrapassa 630 XP.
8. **Reconciliação diária**: comparar `total_xp_hoje` com somatório de conversas/quests do dia.
9. **Mudança de nível**: usuários próximos às bordas de faixa (ex.: 4.999 → 5.001 XP) devem atualizar `nivel_atual` corretamente.
10. **Fila de metas**: ao concluir uma meta, `meta_sequencia_codigo` muda para a completada e `proxima_meta_codigo` aponta para o próximo alvo (ex.: M3 → M4).

## Observações
- Executar em ambiente de teste ou usar snapshots para conferência.
- Não é necessário rodar queries aqui; apenas apontar que cada checagem deve confrontar os dados reais com as regras descritas em `docs/espec/jornadas/jornada_mindquest_1.2.md`.
- Registrar evidências (prints/tabelas) para cada caso validado.
