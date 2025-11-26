#!/usr/bin/env python3
"""Script para ajustar sw_xp_quest.json para v1.3.8"""

import json
import re

# Ler arquivo
with open('backups/n8n/sw_xp_quest.json', 'r', encoding='utf-8') as f:
    workflow = json.load(f)

# Ajustar cada nó
for node in workflow['nodes']:
    if 'parameters' not in node or 'query' not in node['parameters']:
        continue
    
    query = node['parameters']['query']
    node_id = node.get('id', '')
    node_name = node.get('name', '')
    
    # 1. Buscar Estado e Quests - remover quest_estagio
    if node_id == '1b129742-7484-45b4-be33-4a1e2d9ef815':
        query = re.sub(r',\s*uq\.quest_estagio', '', query)
    
    # 2. Verificar e Criar Quest Inicial - remover campos
    elif node_id == 'df21bd43-d75a-4021-909b-2c3176f77366':
        query = re.sub(r',\s*quest_estagio', '', query)
        query = re.sub(r',\s*concluido_em', '', query)
        query = re.sub(r',\s*recorrencias', '', query)
        query = re.sub(r"uq\.status NOT IN \('cancelada', 'vencida'\)", "uq.status IN ('disponivel', 'ativa')", query)
        # Remover construção de recorrencias
        query = re.sub(r",\s*jsonb_build_object\(\s*'tipo', 'diaria',.*?'dias',.*?\)\s*\)", '', query, flags=re.DOTALL)
    
    # 3. Inserir Instancias - ajustar
    elif node_id == 'd04134ef-f531-4b8d-b93d-9a2b891da8c5':
        query = re.sub(r"COALESCE\(rec->>'status_inicial', 'pendente'\)", "COALESCE(rec->>'status_inicial', 'disponivel')", query)
        query = re.sub(r',\s*quest_estagio', '', query)
        query = re.sub(r',\s*concluido_em', '', query)
        query = re.sub(r',\s*recorrencias', '', query)
        # Remover CTE recorrencias_quest e ajustar INSERT
        query = re.sub(r',\s*rq\.recorrencias', '', query)
        # Adicionar campos de contexto no rows
        if 'NULLIF((rec->>\'area_vida_id\')::uuid' not in query:
            query = re.sub(
                r"(COALESCE\(\s*NULLIF\(\(rec->>'catalogo_id'\)::uuid, NULL\),\s*\(SELECT id FROM buscar_quest_custom\)\s*\) AS catalogo_id)\s*FROM payload,",
                r"\1,\n    NULLIF((rec->>'area_vida_id')::uuid, NULL) AS area_vida_id,\n    NULLIF(rec->>'sabotador_id', '') AS sabotador_id,\n    NULLIF((rec->>'insight_id')::uuid, NULL) AS insight_id\n  FROM payload,",
                query
            )
        # Adicionar campos no INSERT
        if 'area_vida_id' not in query or 'INSERT INTO public.usuarios_quest' in query:
            query = re.sub(
                r"(INSERT INTO public\.usuarios_quest \(\s*id,\s*usuario_id,\s*catalogo_id,\s*status,\s*ativado_em,\s*config\s*\))",
                r"\1,\n    area_vida_id,\n    sabotador_id,\n    insight_id",
                query
            )
            query = re.sub(
                r"(NOW\(\),\s*jsonb_build_object\([^)]+\)\s*\)\s*FROM",
                r"\1,\n    rq.area_vida_id,\n    rq.sabotador_id,\n    rq.insight_id\n  FROM",
                query
            )
        # Remover CTE recorrencias_quest se existir
        query = re.sub(r',\s*recorrencias_quest AS \([^)]+\),\s*', ', ', query, flags=re.DOTALL)
    
    # 4. Buscar Snapshot Final - remover campos
    elif node_id == 'bf3cbc9d-2938-44a0-bd99-1739100110d6':
        query = re.sub(r',\s*uq\.quest_estagio', '', query)
        query = re.sub(r',\s*uq\.concluido_em', '', query)
    
    node['parameters']['query'] = query

# Salvar
with open('backups/n8n/sw_xp_quest.json', 'w', encoding='utf-8') as f:
    json.dump(workflow, f, indent=2, ensure_ascii=False)

print("✅ Arquivo ajustado com sucesso!")

