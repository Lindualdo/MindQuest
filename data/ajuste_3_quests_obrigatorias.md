# Ajuste - 3 Quests Obrigatórias

**Data:** 2025-01-22  
**Status:** ✅ Implementado

---

## Regra Implementada

O agente **SEMPRE** gera exatamente **3 quests**:

1. **Quest PERSONALIZADA (custom)** - sempre
   - Criada do zero baseada na conversa atual
   - Não usa catálogo
   - Tem `base_cientifica` completo (formato igual ao catálogo)

2. **Quest SABOTADOR** - sempre
   - Baseada na quest do catálogo relacionada ao sabotador mais ativo
   - Adaptada ao contexto do usuário e situação do sabotador
   - Mantém `catalogo_id` da quest escolhida

3. **Quest TCC/ESTOICISMO** - sempre
   - Baseada na quest do catálogo (TCC ou Estoicismo)
   - Adaptada ao contexto do usuário
   - Mantém `catalogo_id` da quest escolhida

---

## Quest de Reflexão

**NÃO é gerada pelo agente.** A quest de reflexão é criada automaticamente pelo sistema em outro momento/fluxo.

---

## Adaptação ao Estágio

Todas as 3 quests são adaptadas ao `estagio_jornada` do usuário:

- **Estágio 1:** Quest mais simples e direta
- **Estágio 2-4:** Quests mais complexas conforme aumenta

A escolha das quests do catálogo já filtra por estágio no node "Preparar Quest do Catálogo".

---

## Node "Preparar Quest do Catálogo"

Escolhe apenas:
- ✅ Quest do sabotador (sempre)
- ✅ Quest TCC/Estoicismo (sempre)
- ❌ Quest de reflexão (não - criada automaticamente)

---

## Validação

A validação "Aplicar Limites & Dedupe":
- Garante exatamente 3 quests
- Rejeita quests de reflexão (se o agente tentar gerar)
- Valida duplicatas e prioriza quests novas
- Classifica por tipo: personalizada, sabotador, tcc_estoicismo

---

**Ajuste implementado! ✅**

