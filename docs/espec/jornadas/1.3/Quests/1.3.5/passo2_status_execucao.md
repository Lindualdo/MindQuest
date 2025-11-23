# Passo 2: Sistema de Estágios da Quest

**Data:** 2025-11-23 11:25  
**Última atualização:** 2025-11-23 11:57  
**Versão:** 1.3.5  
**Status:** ✅ Aprovado - Em implementação

---

## Objetivo

Implementar estágios da quest: `a_fazer` → `fazendo` → `feito`

**⚠️ IMPORTANTE:** Não confundir com "estágios da jornada" (4 estágios baseados em níveis). Este passo é sobre os **estágios da quest** (progresso individual de cada quest).

---

## Nomenclatura

- **Estágios da quest:** Progresso individual (`a_fazer`, `fazendo`, `feito`)
- **Estágios da jornada:** Evolução do usuário (Fundação, Transformação, Integração, Mestria) - mantém como está

---

## O que fazer (Macro)

1. **Adicionar campo `quest_estagio` em `usuarios_quest`**
   - Tipo: `VARCHAR(20)`
   - Valores: `a_fazer`, `fazendo`, `feito`
   - Default: `a_fazer`
   - Constraint: `CHECK (quest_estagio IN ('a_fazer', 'fazendo', 'feito'))`

2. **Adicionar campo `estagio_jornada` em `usuarios`**
   - Tipo: `SMALLINT`
   - Valores: 1, 2, 3, 4 (correspondendo aos 4 estágios da jornada)
   - Default: 1 (Fundação)
   - Cache do estágio atual (evita recalcular sempre)

3. **Lógica de transição dos estágios da quest:**
   - Quest nasce como `a_fazer` (criada pelo sistema/IA)
   - Quando usuário planeja (preenche `recorrencias` JSONB) → muda para `fazendo`
   - Quando todas recorrências concluídas → muda para `feito`

4. **Estrutura mantida:**
   - `usuarios_quest`: Repositório de quests criadas para cada usuário
     - `quest_estagio = 'a_fazer'` inicialmente
     - Quando planejada, `recorrencias` JSONB preenchido → `quest_estagio = 'fazendo'`
   - `conquistas_historico.detalhes`: Execução
     - Um registro por quest
     - `detalhes->ocorrencias[]` com todas as recorrências concluídas
   - `usuarios_conquistas`: Pontuação consolidada (já existe)
     - Atualizado a cada recorrência concluída
     - Relacionamento com `jornada_niveis` para calcular estágio

5. **Atualização de `usuarios.estagio_jornada`:**
   - Calculado baseado em `usuarios_conquistas.xp_total`
   - Mapeamento: Níveis 1-3 → Estágio 1, Níveis 4-5 → Estágio 2, Níveis 6-7 → Estágio 3, Níveis 8-10 → Estágio 4
   - Atualizado a cada recorrência concluída (via consolidação)

6. **Atualizar workflows:**
   - `sw_criar_quest`: criar quests como `a_fazer`
   - `sw_xp_quest`: quando planeja (preenche `recorrencias`), mudar para `fazendo`
   - `webhook_concluir_quest`: quando todas recorrências concluídas, mudar para `feito`
   - `webhook_quests`: filtrar por quest_estágio
   - Consolidação: atualizar `usuarios_conquistas` → calcular `usuarios.estagio_jornada`

7. **Validações:**
   - Quest só pode ser planejada se estiver `a_fazer`
   - Quest só pode ter recorrências concluídas se estiver `fazendo`
   - Quest concluída (`feito`) não pode ser reativada (criar nova instância se necessário)

---

## Dependências

- Nenhuma (pode ser implementado isoladamente)

---

## Impacto

- Mudança em estrutura de dados
- Atualização de workflows n8n
- Possível atualização de frontend (filtros por status)

---

## Dependências

- Nenhuma (pode ser implementado isoladamente)

---

## Impacto

- Mudança em estrutura de dados (2 campos novos: `quest_estagio` e `estagio_jornada`)
- Atualização de workflows n8n
- Baixo impacto nas regras atuais (mantém estrutura existente)
- Possível atualização de frontend (filtros por `quest_estagio`)

---

## Próximos Passos (Implementação)

1. Criar scripts SQL:
   - Adicionar campo `quest_estagio` em `usuarios_quest`
   - Adicionar campo `estagio_jornada` em `usuarios`
   - Criar função para calcular estágio da jornada baseado em XP
   - Atualizar `estagio_jornada` para usuários existentes

2. Atualizar workflows:
   - `sw_criar_quest`: criar como `a_fazer`
   - `sw_xp_quest`: mudar para `fazendo` ao planejar
   - `webhook_concluir_quest`: mudar para `feito` ao concluir todas
   - Consolidação: atualizar `estagio_jornada`

3. Testar transições e validações

---

*Documento atualizado com informações corretas - pronto para implementação*

