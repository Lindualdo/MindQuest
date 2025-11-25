# Refactor Detalhado - sw_criar_quest

**Data:** 2025-01-22  
**Status:** Em progresso

## Resumo das Mudanças Necessárias

### 1. Campo `base_cientifica` adicionado em `usuarios_quest`
✅ Concluído

### 2. Atualizar `sw_calcula_jornada` para atualizar `usuarios.estagio_jornada`
✅ Parcial - Node "Atualizar Estágio Usuário" adicionado, mas código JS do "Determinar Nível" precisa calcular estágio

### 3. Refatorar `sw_criar_quest` para sempre criar 4 quests:

#### 3.1. Adicionar nodes necessários:
- [ ] Node "Buscar Estágio Usuário" - buscar `usuarios.estagio_jornada`
- [ ] Node "Buscar Quests Catálogo" - buscar quests do catálogo por categoria/estágio
- [ ] Node "Buscar Reflexão Diária" - buscar quest `reflexao_diaria` do catálogo

#### 3.2. Atualizar "Montar Contexto":
- [ ] Incluir `estagio_jornada` do usuário
- [ ] Incluir quests do catálogo (sabotador, reflexão, TCC, estoicismo)
- [ ] Identificar sabotador mais ativo
- [ ] Mudar limite de 3 para 4 quests

#### 3.3. Refatorar prompt do "Agente Quests":
- [ ] Modificar para sempre criar exatamente 4 quests:
  - Quest 1: Personalizada (contexto da conversa)
  - Quest 2: Sabotador mais ativo (do catálogo, adaptada)
  - Quest 3: Reflexão diária (do catálogo, adaptada)
  - Quest 4: TCC/estoicismo/outras (do catálogo, adaptada)
- [ ] Incluir informações de estágio do usuário
- [ ] Incluir quests do catálogo disponíveis
- [ ] Instruir para adaptar quests do catálogo ao contexto
- [ ] Instruir para preencher `base_cientifica` em quests custom

#### 3.4. Atualizar "Aplicar Limites & Dedupe":
- [ ] Garantir exatamente 4 quests (remover limite de 3)
- [ ] Validar `catalogo_id` se fornecido
- [ ] Validar `base_cientifica` para quests custom
- [ ] Garantir que todas as 4 quests sejam criadas

#### 3.5. Remover node "Tem Slots?":
- [ ] Sempre criar as 4 quests, independente de slots

---

## Estrutura das 4 Quests Esperadas

### Quest 1: Personalizada
```json
{
  "tipo": "personalizada",
  "catalogo_id": null,
  "titulo": "...",
  "descricao": "...",
  "base_cientifica": {
    "tipo": "...",
    "objetivo": "...",
    "fundamentos": "...",
    "como_aplicar": "...",
    "links_referencias": []
  },
  "insight_id": "...",
  "contexto_origem": "conversa_especifica"
}
```

### Quest 2: Sabotador
```json
{
  "tipo": "catalogo",
  "catalogo_id": "...",
  "titulo": "...", // adaptado do catálogo
  "descricao": "...", // adaptado do catálogo
  "base_cientifica": null, // vem do catálogo
  "sabotador_id": "...",
  "contexto_origem": "sabotador_ativo"
}
```

### Quest 3: Reflexão
```json
{
  "tipo": "catalogo",
  "catalogo_id": "...", // reflexao_diaria
  "titulo": "...", // adaptado
  "descricao": "...", // adaptado
  "contexto_origem": "reflexao_diaria"
}
```

### Quest 4: TCC/Estoicismo
```json
{
  "tipo": "catalogo",
  "catalogo_id": "...",
  "categoria": "tcc" | "estoicismo",
  "titulo": "...", // adaptado
  "descricao": "...", // adaptado
  "contexto_origem": "desenvolvimento_pessoal"
}
```

---

*Documento criado para guiar o refactor passo a passo*

