# Plano de Refactor - sw_criar_quest

**Data:** 2025-01-22  
**Objetivo:** Refatorar workflow para sempre criar 4 quests por conversa usando catálogo e estágio do usuário

---

## Mudanças Principais

### 1. Sempre criar 4 quests por conversa:
- **Quest 1:** Personalizada (específica para contexto da conversa/usuário)
- **Quest 2:** Relacionada ao sabotador mais ativo (do catálogo)
- **Quest 3:** Quest de conversa reflexão (do catálogo, adaptada)
- **Quest 4:** TCC, estoicismo ou outras (do catálogo, diferentes das anteriores)

### 2. Usar estágio do usuário:
- Buscar `usuarios.estagio_jornada` (1-4)
- Quest do catálogo deve corresponder ao estágio do usuário

### 3. Base científica para quests custom:
- Adicionar campo `base_cientifica` (JSONB) em `usuarios_quest`
- Agente deve preencher base científica para quests personalizadas

### 4. Adaptação de quests do catálogo:
- Mesmo usando catálogo, agente deve adaptar ao contexto da conversa e realidade do usuário

### 5. Atualizar estágio na jornada:
- `sw_calcula_jornada` deve atualizar `usuarios.estagio_jornada` quando XP muda

---

## Passos de Implementação

### Fase 1: Estrutura do Banco
- [ ] Adicionar campo `base_cientifica` (JSONB) em `usuarios_quest`
- [ ] Criar migration SQL

### Fase 2: Atualizar sw_calcula_jornada
- [ ] Adicionar lógica para atualizar `usuarios.estagio_jornada` baseado no nível calculado
- [ ] Mapear nível (1-10) para estágio (1-4)

### Fase 3: Refatorar sw_criar_quest
- [ ] Adicionar node para buscar estágio do usuário
- [ ] Adicionar node para buscar quests do catálogo por categoria/estágio
- [ ] Refatorar prompt do agente para criar 4 quests específicas
- [ ] Atualizar validação para garantir 4 quests
- [ ] Adicionar lógica para adaptar quests do catálogo ao contexto

### Fase 4: Testes e Validação
- [ ] Testar criação das 4 quests
- [ ] Validar base científica em quests custom
- [ ] Validar adaptação de quests do catálogo
- [ ] Validar atualização de estágio

---

## Mapeamento de Estágios

**Estágio 1 (Iniciante):** Níveis 1-3  
**Estágio 2 (Intermediário):** Níveis 4-6  
**Estágio 3 (Avançado):** Níveis 7-9  
**Estágio 4 (Mestre):** Nível 10

---

*Documento criado para planejamento do refactor*

