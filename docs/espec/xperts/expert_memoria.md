# Expert: Memória IA (Perfil Permanente)

> Documentação técnica para extração de fatos permanentes e personalização (rapport).

---

## 1. Visão Geral
Este expert analisa cada conversa para extrair dados permanentes sobre o usuário, alimentando uma "memória de longo prazo" que é usada pelo Mentor para gerar conexão, empatia e raport em conversas futuras.

## 2. Estrutura de Dados (PostgreSQL)

### Tabela: `usuarios`
Adição de metadados de memória assistida.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `sobre_voce` | Text | (Existente) Biografia manual preenchida pelo usuário. |
| `memoria_ia` | JSONB | Novos fatos extraídos automaticamente (Gostos, Dialetos, Fatos Pessoais). |

### Estrutura do JSON `memoria_ia`:
```json
{
  "pessoal": {
    "idade": null,
    "estado_civil": "casado",
    "filhos": ["Pedro (5 anos)"],
    "cidade": "Fortaleza",
    "profissao": "Designer"
  },
  "preferencias": {
    "gostos": ["estoicismo", "café sem açúcar", "rock progressivo"],
    "interesses": ["IA", "astronomia"],
    "dialetos": "Usa muitas gírias cearenses e termos técnicos de design"
  },
  "fatos_marcantes": [
    "Comprou o primeiro carro em Dez/24",
    "Está transicionando de carreira"
  ],
  "ultima_atualizacao": "2025-12-27T10:00:00Z"
}
```

---

## 3. Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| **Chave Única** | `usuario_id` (Campo único por usuário na tabela `usuarios`) |
| **Consolidação** | **Incremental** (O LLM funde o novo conhecimento com o anterior) |
| **Prioridade** | O campo `sobre_voce` (manual) tem precedência em caso de contradição. |
| **Frequência** | Processado a cada conversa finalizada via `sw_expert_v6`. |

### Comportamento de Atualização (UPSERT lógico):
| Campo | Lógica de Mesclagem |
|-------|---------------------|
| `pessoal` | Sobrescreve campos específicos se houver nova informação mais precisa. |
| `preferencias` | Adiciona novos itens ao array (sem duplicar). |
| `dialetos` | Refina a descrição conforme o usuário fala mais. |
| `fatos_marcantes` | Adiciona novos fatos cronologicamente (limite de 10 fatos). |

---

## 4. Workflow n8n (`sw_expert_memoria`)

### Input (Entradas):
- `usuario_id`
- `resumo_conversa` (Delta da conversa atual)
- `sobre_voce` (Contexto declarado pelo usuário)
- `memoria_ia` (Contexto já extraído anteriormente)

### Prompt do Expert:
> "Sua tarefa é atualizar o perfil permanente do usuário.
> Use o campo 'sobre_voce' como fonte primária de verdade.
> Analise o 'resumo_conversa' em busca de novos gostos, dialetos ou informações pessoais permanentes.
> Atualize o objeto 'memoria_ia' existente, mesclando as informações.
> Não apague informações antigas a menos que sejam explicitamente corrigidas na conversa."

### Output (Saídas):
- Objeto JSON consolidado para atualização direta na coluna `memoria_ia`.

---

## 5. Integração com Mentor IA

O workflow `mentor_mindquest` deve realizar um JOIN opcional na tabela `usuarios` no início da sessão para injetar:
1. `sobre_voce` (BIO MANUAL)
2. `memoria_ia` (BIO ASSISTIDA)

**Instrução no System Prompt:**
"Use os dados de 'BIO MANUAL' e 'BIO ASSISTIDA' para personalizar seu tratamento. Use nomes de familiares, prefira termos do dialeto do usuário e cite fatos marcantes para gerar conexão, mas faça de forma natural, sem parecer invasivo."

---

*Última atualização: 2025-12-27*
