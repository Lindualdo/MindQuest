# Quests Faltantes — Categoria TCC

**Data:** 2025-01-22 14:30  
**Categoria:** TCC (Terapia Cognitivo-Comportamental)  
**Status:** Quest faltante no banco de dados

---

## 1. Treinamento de Habilidades Sociais (Preparação) ⭐⭐⭐

**Quest estruturante:**
- Antes de interação social importante:
  - Definir 1 objetivo claro (ex: "ouvir mais", "expressar opinião")
  - Preparar 1 frase de abertura ou resposta
  - Visualizar interação positiva
- Tempo: 3-5 minutos

**Impacto neurocientífico:**
- Reduz ansiedade social
- Fortalece memória de trabalho
- Cria sensação de preparação

**Impacto TCC:**
- Reduz evitação social
- Melhora assertividade
- Aumenta confiança em interações

**Base científica:**
- TCC: Técnica de preparação e ensaio comportamental
- Neurociência: Reduz ativação da amígdala (medo social), fortalece córtex pré-frontal (planejamento)

**Estrutura sugerida para `quests_catalogo`:**
```json
{
  "codigo": "tcc_habilidades_sociais",
  "titulo": "Treinamento de Habilidades Sociais - Preparação",
  "descricao": "Preparar-se para interações sociais importantes definindo objetivos claros e visualizando interações positivas",
  "categoria": "tcc",
  "base_cientifica": {
    "tipo": "tecnica",
    "objetivo": "Reduz ansiedade social e aumentar confiança em interações através de preparação estruturada",
    "fundamentos": "TCC: Técnica de preparação e ensaio comportamental. Neurociência: Reduz ativação da amígdala (medo social), fortalece córtex pré-frontal (planejamento), cria sensação de preparação que reduz ansiedade antecipatória",
    "como_aplicar": "Antes de interação social importante:\n1. Definir 1 objetivo claro (ex: 'ouvir mais', 'expressar opinião', 'fazer pergunta específica')\n2. Preparar 1 frase de abertura ou resposta\n3. Visualizar interação positiva (imaginando sucesso)\n4. Durante a interação, lembrar do objetivo definido\n5. Após a interação, reconhecer o que funcionou bem",
    "links_referencias": []
  },
  "tempo_estimado_min": 5,
  "dificuldade": 2,
  "xp": 10
}
```

---

*Documento criado para identificar quests TCC faltantes no banco de dados*

