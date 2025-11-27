# Proposta de UX - Painel de Quests v1.3.8

**Data:** 2025-01-22  
**Versão:** 1.3.8

---

## Problemas Identificados

1. **Card de progresso duplicado** - Home e Painel têm cards similares
2. **Barras de progresso confusas** - 3 níveis sem hierarquia clara
3. **Navegação por dia não funcional** - Clicar no dia não filtra quests
4. **Transição Fazendo → Feito** - Não está clara após conclusão

---

## Proposta de Solução

### 1. Remover Barra Semanal Horizontal do Painel

**Justificativa:**
- Redundante com as barras verticais diárias
- Ocupa espaço desnecessário
- Foco deve ser na navegação diária

**Ação:**
- Remover a barra horizontal "2/11" do painel
- Manter apenas as barras verticais como navegação

---

### 2. Transformar Barras Diárias em Navegador Principal

**Funcionalidades:**
- **Clicar no dia** → Filtra quests daquele dia nas abas
- **Indicador visual** → Destaque do dia selecionado (borda azul + escala)
- **Contador do dia** → Mostrar "X de Y concluídas" acima das abas
- **Feedback visual** → Animação ao selecionar dia

**Visual:**
```
┌─────────────────────────────────────┐
│  QUESTS DA SEMANA                    │
│                                       │
│  [DOM] [SEG] [TER] [QUA] [QUI] [SEX] │
│   0     0     0     2    [3]   3      │
│   │     │     │     ██   [██]  ██     │ ← Barras verticais
│  23/11  24/11 25/11 26/11 [27/11] 28/11
│                                       │
│  ← QUA está selecionado (destaque)    │
└─────────────────────────────────────┘
```

---

### 3. Filtrar Quests por Dia Selecionado

**Comportamento:**
- Ao selecionar um dia, as abas mostram apenas quests daquele dia
- Indicador acima das abas: "Quests de 27/11 - 2 de 3 concluídas"
- Se não houver quests no dia, mostrar mensagem apropriada

**Exemplo:**
```
┌─────────────────────────────────────┐
│  Quests de 27/11                    │
│  2 de 3 concluídas                  │
│                                      │
│  [A Fazer] [Fazendo] [Feito]        │
│                                      │
│  ┌──────────────────────────────┐  │
│  │ Quest 1 (do dia 27/11)       │  │
│  │ [Concluir]                    │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

### 4. Transição Fazendo → Feito

**Fluxo:**
1. Usuário está na aba "Fazendo"
2. Clica em "Concluir" em uma quest
3. Quest desaparece de "Fazendo" (animação fade out)
4. Quest aparece em "Feito" (animação fade in)
5. Barra diária atualiza automaticamente
6. Contador do dia atualiza: "3 de 3 concluídas"

**Feedback Visual:**
- Animação de transição suave
- Atualização imediata da barra diária
- Mensagem de confirmação opcional: "Quest concluída! +10 XP"

---

## Estrutura Proposta

### Componente: Navegador Semanal (Simplificado)

```typescript
// Apenas barras verticais, sem barra horizontal
<WeeklyDayNavigator
  dias={diasSemana}
  selectedDate={selectedDate}
  onSelectDay={handleSelectDay}
  // Mostra progresso visual por dia
/>
```

### Componente: Filtro por Dia

```typescript
// Filtra quests por dia selecionado
const questsDoDia = useMemo(() => {
  const dataStr = format(selectedDate, 'yyyy-MM-dd');
  return questsPorEstagio.filter(quest => {
    // Verificar se quest tem recorrência na data selecionada
    return quest.recorrencias?.dias?.some(dia => 
      normalizeDateStr(dia.data) === dataStr
    );
  });
}, [questsPorEstagio, selectedDate]);
```

### Componente: Indicador do Dia

```typescript
// Mostra resumo do dia selecionado
<DaySummary
  date={selectedDate}
  totalQuests={questsDoDia.length}
  concluidas={questsDoDia.filter(q => q.status === 'concluida').length}
/>
```

---

## Benefícios

1. **Navegação clara** - Usuário entende que clicar no dia mostra quests daquele dia
2. **Menos redundância** - Remove barra semanal horizontal do painel
3. **Foco no dia** - Interface orientada a ação diária
4. **Feedback imediato** - Transições claras Fazendo → Feito
5. **Progresso visual** - Barras diárias mostram progresso rapidamente

---

## Próximos Passos

1. ✅ Remover barra horizontal do painel
2. ✅ Implementar filtro por dia nas abas
3. ✅ Adicionar indicador do dia selecionado
4. ✅ Melhorar transição Fazendo → Feito
5. ✅ Adicionar animações de feedback

---

**Última atualização:** 2025-01-22

