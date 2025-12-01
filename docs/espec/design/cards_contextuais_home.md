# Cards Contextuais na Home (Conversar)

**Data:** 2025-12-01
**Status:** Planejado

---

## Conceito

Cards dinâmicos que aparecem na home baseados no comportamento do usuário, incentivando descoberta de funcionalidades ("Feature Discovery").

## Regras de Exibição

| Card | Trigger (quando aparecer) | Copy sugerida |
|------|---------------------------|---------------|
| **Entenda seus padrões** | Após 3+ conversas sem acessar "Entender" | "Você já identificou seu sabotador? Descubra o que te trava." |
| **Hora de agir** | Quests pendentes há 2+ dias | "3 micro-ações esperando por você. Qual vai ser a primeira?" |
| **Veja sua evolução** | Após subir de nível ou ganhar XP significativo | "🎉 Você avançou! Confira sua jornada." |
| **Defina seus objetivos** | Usuário sem objetivos cadastrados | "O que você quer conquistar? Defina sua direção." |
| **Parabéns!** | Após completar streak de 7 dias | "7 dias seguidos conversando! Você está criando um hábito." |

## Prioridade de Exibição

1. Mostrar **no máximo 1 card** por vez (evitar poluição)
2. Priorizar por impacto:
   - Celebração (parabéns) > Ação pendente > Descoberta de feature
3. Não repetir o mesmo card em 24h após ser fechado/clicado

## Design

```
┌─────────────────────────────────────────┐
│  🧠  Entenda seus padrões               │
│                                         │
│  Você já identificou seu sabotador?     │
│  Descubra o que te trava.               │
│                                         │
│  [Descobrir →]              [✕ Fechar]  │
└─────────────────────────────────────────┘
```

## Implementação

### Dados necessários (backend)
- `dias_sem_acessar_entender`: número de dias
- `quests_pendentes_ha_mais_de_2_dias`: count
- `subiu_nivel_recente`: boolean
- `tem_objetivos`: boolean
- `streak_atual`: número de dias consecutivos

### Componente
- `CardContextual.tsx` — componente reutilizável
- Armazenar estado de "fechado" em localStorage por 24h

## Próximos Passos

1. [ ] Definir quais triggers implementar primeiro
2. [ ] Criar endpoint no backend para retornar trigger ativo
3. [ ] Implementar componente CardContextual
4. [ ] Integrar na página Conversar

---

**Nota:** Esta funcionalidade foi planejada durante a reestruturação dos menus (v1.3.9).

