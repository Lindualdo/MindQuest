# Quests de Sabotadores - Regras de Criação

**Data:** 2025-12-02  
**Status:** Definição executiva  
**Versão:** 1.0

---

## Contexto

Sabotadores são o pilar central do MindQuest — são eles que travam o progresso das pessoas. As quests de sabotadores existem especificamente para combatê-los e precisam de atenção e profundidade.

---

## Regras de Criação de Quests

### 1. Foco Principal: Top 3 Históricos
- Sempre trabalhar os **3 sabotadores mais ativos** do histórico do usuário
- Cálculo do "mais ativo" conforme doc `sabotador_mais_ativo_regras.md` (score = frequência × intensidade média)

### 2. Quantidade de Quests por Conversa
- **Regra padrão:** gerar **1 quest** para um dos top 3 históricos
- **Exceção:** se detectado sabotador atual (maior intensidade na conversa) **diferente** dos top 3 → gerar **até 2 quests**
  - 1 quest para top 3 (histórico)
  - 1 quest para o atual (novo/emergente)

### 3. Não Duplicar
- Se o sabotador atual já estiver entre os top 3 → gerar apenas 1 quest (não duplica)

---

## Fontes de Dados

| Fonte | Uso |
|-------|-----|
| `usuarios_sabotadores` | Sabotador atual da conversa (insight + contramedida contextualizados) |
| Score histórico (frequência × intensidade) | Top 3 sabotadores mais ativos |

---

## Próximos Passos

1. Definir qual agente cria a quest (expert em sabotadores vs agente de quests)
2. Definir se usa insight/contramedida da conversa ou do catálogo
3. Implementação técnica

---

## Referências

- `sabotador_mais_ativo_regras.md` — cálculo do score de atividade
- `usuarios_sabotadores` — tabela com insight/contramedida da conversa

