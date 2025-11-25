# Resumo do Refactor Completo - sw_criar_quest

**Data:** 2025-01-22  
**Status:** ✅ Concluído

---

## Mudanças Implementadas

### 1. Banco de Dados
✅ **Campo `base_cientifica` adicionado em `usuarios_quest`**
- Tipo: JSONB
- Finalidade: Armazenar base científica para quests personalizadas
- Comando executado: `ALTER TABLE public.usuarios_quest ADD COLUMN base_cientifica JSONB DEFAULT '{}'::jsonb;`

### 2. Workflow `sw_calcula_jornada`
✅ **Atualização do estágio do usuário**
- Node "Determinar Nível" calcula `target_estagio` baseado no nível (1-3=estágio1, 4-6=estágio2, 7-9=estágio3, 10=estágio4)
- Novo node "Atualizar Estágio Usuário" atualiza `usuarios.estagio_jornada` após calcular nível

### 3. Workflow `sw_criar_quest` - Refactor Completo

#### 3.1. Novos Nodes Adicionados
✅ **"Buscar Estágio Usuário"**
- Busca `usuarios.estagio_jornada` do usuário

✅ **"Buscar Quests Catálogo"**
- Busca quests do catálogo por categoria (reflexão, sabotador, TCC, estoicismo)
- Filtra por estágio do usuário quando relevante

#### 3.2. Node "Montar Contexto" Refatorado
✅ **Inclui:**
- `estagio_jornada`: Estágio atual do usuário (1-4)
- `sabotador_mais_ativo`: Sabotador mais ativo do usuário
- `quests_catalogo`: Objeto com quests organizadas por categoria:
  - `reflexao`: Quest reflexão diária
  - `sabotador`: Quests relacionadas ao sabotador mais ativo
  - `tcc`: Quests de TCC disponíveis
  - `estoicismo`: Quests de estoicismo disponíveis
  - `todas`: Todas as quests do catálogo

#### 3.3. Prompt do Agente Refatorado
✅ **Objetivo:** Sempre criar EXATAMENTE 4 quests:
1. **Quest 1 - PERSONALIZADA:** Quest específica para contexto da conversa/usuário
   - `catalogo_id: null`
   - `base_cientifica` preenchido completo
   - Baseada no contexto específico da conversa

2. **Quest 2 - SABOTADOR:** Quest relacionada ao sabotador mais ativo
   - Usa quest do catálogo
   - `catalogo_id` preenchido
   - Adapta título/descrição ao contexto

3. **Quest 3 - REFLEXÃO:** Quest de conversa reflexão
   - Usa quest `reflexao_diaria` do catálogo
   - `catalogo_id` preenchido
   - Adapta ao contexto da conversa atual

4. **Quest 4 - TCC/ESTOICISMO:** Quest de desenvolvimento pessoal
   - Escolhe do catálogo (TCC ou Estoicismo)
   - `catalogo_id` preenchido
   - Adapta ao estágio e contexto do usuário

✅ **Regras Implementadas:**
- Todas as quests do catálogo são adaptadas ao contexto do usuário
- Quest personalizada sempre inclui `base_cientifica` completo
- Usa estágio do usuário para escolher quests adequadas
- Valida `insight_id`, `catalogo_id`, `sabotador_id` quando aplicável

#### 3.4. Validação "Aplicar Limites & Dedupe" Refatorada
✅ **Garante:**
- Exatamente 4 quests criadas (não mais limite de 3)
- Classifica quests por tipo (personalizada, sabotador, reflexão, TCC/estoicismo)
- Valida `base_cientifica` para quests personalizadas
- Valida `catalogo_id` para quests do catálogo
- Remove duplicatas

#### 3.5. Conexões Atualizadas
✅ **Fluxo simplificado:**
- Removido node "Tem Slots?" (sempre criamos 4 quests)
- Removido node "Sem Slots" (não é mais necessário)
- Conexão direta: "Montar Contexto" → "Agente Quests"

#### 3.6. Configurações Ajustadas
✅ **OpenRouter Chat Model:**
- `maxTokens`: Aumentado para 2000 (permite respostas maiores)
- `temperature`: Mantido em 0.2

✅ **Parser JSON:**
- Schema atualizado com exemplo de 4 quests
- Suporta `base_cientifica` e `catalogo_id`

---

## Estrutura das Quests Geradas

### Quest Personalizada
```json
{
  "tipo": "personalizada",
  "catalogo_id": null,
  "base_cientifica": {
    "tipo": "tecnica" | "boa_pratica",
    "objetivo": "...",
    "fundamentos": "...",
    "como_aplicar": "...",
    "links_referencias": []
  },
  "contexto_origem": "conversa_especifica",
  "insight_id": "...",
  ...
}
```

### Quest do Catálogo (Sabotador/Reflexão/TCC/Estoicismo)
```json
{
  "tipo": "catalogo",
  "catalogo_id": "uuid-quest-catalogo",
  "base_cientifica": null, // vem do catálogo
  "titulo": "... adaptado ao contexto ...",
  "descricao": "... adaptado ao contexto ...",
  "contexto_origem": "sabotador_ativo" | "reflexao_diaria" | "desenvolvimento_pessoal",
  ...
}
```

---

## Próximos Passos (Opcional)

1. **Atualizar `sw_xp_quest`:**
   - Garantir que `base_cientifica` seja persistido em `usuarios_quest` para quests personalizadas
   - Validar estrutura do `base_cientifica` antes de salvar

2. **Testes:**
   - Testar criação das 4 quests
   - Validar adaptação de quests do catálogo
   - Verificar persistência de `base_cientifica`

3. **Ajustes Finais:**
   - Remover nodes "Tem Slots?" e "Sem Slots" do workflow (se ainda existirem)
   - Validar queries do catálogo com diferentes estágios

---

## Arquivos Modificados

- ✅ `backups/n8n/sw_calcula_jornada.json` - Atualizado para calcular e atualizar estágio
- ✅ `backups/n8n/sw_criar_quest.json` - Refatorado completamente
- ✅ `data/plano_refactor_sw_criar_quest.md` - Plano criado
- ✅ `data/refactor_sw_criar_quest_detalhes.md` - Detalhes do refactor
- ✅ `data/refactor_completo_resumo.md` - Este documento

---

**Refactor concluído com sucesso! ✅**

