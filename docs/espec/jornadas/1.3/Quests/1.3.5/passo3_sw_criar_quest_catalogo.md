# Passo 3: Atualizar sw_criar_quest para Usar Catálogo

**Data:** 2025-11-23 11:25  
**Versão:** 1.3.5  
**Status:** Planejamento - Aguardando aprovação

---

## Objetivo

IA consulta catálogo baseado no **estágio da jornada** do usuário (4 estágios baseados em níveis)

**⚠️ IMPORTANTE:** Aqui usamos os **estágios da jornada** (Fundação, Transformação, Integração, Mestria) para filtrar quests do catálogo.

---

## O que fazer (Macro)

1. **Consultar nível do usuário:**
   - Buscar nível atual via `jornada_niveis`
   - Obter XP e nível do usuário

2. **Mapear nível → estágio da jornada:**
   - Níveis 1-3 → **Estágio 1: Fundação**
   - Níveis 4-5 → **Estágio 2: Transformação**
   - Níveis 6-7 → **Estágio 3: Integração**
   - Níveis 8-10 → **Estágio 4: Mestria**

3. **Filtrar `quests_catalogo` por estágio:**
   - Query que retorna quests apropriadas ao estágio
   - Considerar também: sabotador ativo, áreas da vida, contexto

4. **IA personaliza quests do catálogo:**
   - Adapta quests do catálogo (não cria do zero)
   - Mantém estrutura base, personaliza texto/contexto
   - Sempre preencher `catalogo_id` (ou `quest_custom` se totalmente personalizada)

5. **Atualizar prompt do agente:**
   - Incluir quests do catálogo filtradas por estágio
   - Orientar para adaptar, não criar do zero

---

## Dependências

- Catálogo populado (✅ já feito)
- Estágios da jornada definidos (✅ já documentado)

---

## Impacto

- Mudança significativa em `sw_criar_quest`
- Quests mais consistentes e baseadas em ciência
- Quests apropriadas ao nível de evolução do usuário

---

## Próximos Passos (Após Aprovação)

- Detalhar query de filtro por estágio
- Atualizar prompt do agente
- Definir lógica de personalização
- Testar geração de quests

---

*Documento macro - detalhamento será feito na execução*

