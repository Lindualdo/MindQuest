# Regras de Cálculo de Energia

**Data:** 2025-12-17  
**Status:** Ativo  
**Versão:** 2.0

## Cálculo Atual

**Método:** PANAS (Positive and Negative Affect Schedule)

### Fórmula

```
energia_nivel = percentual_positiva / 10
```

Onde `percentual_positiva` = % de emoções positivas do total detectado.

### Classificação de Emoções

| Categoria | Emoções (emocao_id) |
|-----------|---------------------|
| **Positiva** | joy, trust, anticipation |
| **Negativa** | sadness, fear, anger, disgust |
| **Neutra** | surprise |

### Filtros

- Intensidade >= 45
- Todo histórico do usuário

### Escala Final

| % Positiva | Energia (1-10) |
|------------|----------------|
| 80% | 8 |
| 60% | 6 |
| 50% | 5 |
| 40% | 4 |

### Fonte de Dados

- **Tabela:** `usuarios_emocoes`
- **Campo:** `emocao_id`, `intensidade`

## Query de Referência

```sql
SELECT 
  usuario_id,
  CASE WHEN COUNT(*) > 0
    THEN ROUND((COUNT(*) FILTER (
      WHERE LOWER(emocao_id) IN ('joy','trust','anticipation')
    )::numeric / COUNT(*)::numeric) * 100, 1)
    ELSE 60 END AS percentual_positiva
FROM usuarios_emocoes
WHERE intensidade >= 45
GROUP BY usuario_id
```

## Uso em Notificações

**Gatilho TCC/Estoicismo:** `energia_nivel <= 5` (percentual_positiva <= 50%)
