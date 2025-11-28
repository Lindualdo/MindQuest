# Wireframe - Tela Objetivos

**Data:** 2025-01-22 20:45

---

## Estrutura da Tela

```
┌─────────────────────────────────────┐
│  [← Voltar]                         │  Header (botão voltar)
│                                     │
│         OBJETIVOS                   │  Título
│   Defina sua meta de transformação  │  Subtítulo
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │  Container formulário
│  │  Meta Principal               │ │  (#E8F3F5)
│  │  ┌─────────────────────────┐ │ │
│  │  │                         │ │ │  Textarea
│  │  │                         │ │ │  (3-4 linhas)
│  │  │                         │ │ │
│  │  └─────────────────────────┘ │ │
│  │                               │ │
│  │  Áreas de Foco                │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │ ☐ Autoconhecimento     │ │ │  Checkboxes
│  │  │ ☐ Produtividade        │ │ │  (múltipla escolha)
│  │  │ ☐ Relacionamentos      │ │ │
│  │  │ ☐ Saúde emocional      │ │ │
│  │  │ ☐ Criatividade         │ │ │
│  │  │ ☐ Equilíbrio geral     │ │ │
│  │  └─────────────────────────┘ │ │
│  │                               │ │
│  │  Prazo Estimado               │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │ ⦿ 30 dias              │ │ │  Radio buttons
│  │  │ ○ 60 dias              │ │ │  (opcional)
│  │  │ ○ 90 dias              │ │ │
│  │  │ ○ Personalizado         │ │ │
│  │  └─────────────────────────┘ │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  [💾 Salvar Objetivo]        │ │  Botão salvar
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Progresso                    │ │  Seção progresso
│  │  ┌─────────────────────────┐ │ │  (se objetivo definido)
│  │  │ Autoconhecimento: 45%  │ │ │
│  │  │ ████████░░░░░░░░░░░░   │ │ │  Barras de progresso
│  │  │                         │ │ │  por área de foco
│  │  │ Produtividade: 30%      │ │ │
│  │  │ ██████░░░░░░░░░░░░░░   │ │ │
│  │  └─────────────────────────┘ │ │
│  │                               │ │
│  │  Quests Relacionadas (3)      │ │  Lista de quests
│  │  • Quest 1 - Autoconhecimento│ │  agrupadas por área
│  │  • Quest 2 - Produtividade   │ │
│  │  • Quest 3 - Saúde emocional│ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
│  [👁️] [🧠] [⚡] [⭐]              │  Bottom Nav
└─────────────────────────────────────┘
```

---

## Componentes Detalhados

### 1. Meta Principal
- **Tipo:** Textarea (3-4 linhas)
- **Placeholder:** "Exemplo: Quero desenvolver mais autoconhecimento e melhorar meus relacionamentos nos próximos 60 dias..."
- **Validação:** Mínimo 10 caracteres

### 2. Áreas de Foco
- **Tipo:** Checkboxes (múltipla escolha)
- **Opções:**
  - Autoconhecimento
  - Produtividade
  - Relacionamentos
  - Saúde emocional
  - Criatividade
  - Equilíbrio geral
- **Validação:** Mínimo 1 selecionado

### 3. Prazo Estimado
- **Tipo:** Radio buttons (opcional)
- **Opções:**
  - 30 dias
  - 60 dias
  - 90 dias
  - Personalizado (input numérico aparece se selecionado)

### 4. Seção Progresso (condicional)
- **Exibição:** Apenas se objetivo já estiver definido
- **Conteúdo:**
  - Barras de progresso por área de foco (%)
  - Lista de quests ativas relacionadas (agrupadas por área)
  - Estatísticas: quests concluídas, conversas, insights

### 5. Botão Salvar
- **Estilo:** Igual ao Perfil Pessoal (azul, ícone de salvar)
- **Ação:** Salvar objetivo e redirecionar para Evoluir após 2s

---

## Estados da Tela

### Estado 1: Sem Objetivo Definido
- Formulário completo visível
- Seção de progresso oculta
- Botão "Salvar Objetivo" habilitado

### Estado 2: Com Objetivo Definido
- Formulário pré-preenchido
- Seção de progresso visível
- Botão "Atualizar Objetivo" (mesmo comportamento)

### Estado 3: Sugestão da IA
- Botão "💡 Sugerir Objetivo" (se usuário não souber o que quer)
- Modal/popup com sugestões baseadas em:
  - Padrões das conversas
  - Sabotadores ativos
  - Áreas de vida mais mencionadas
  - Insights gerados

---

## Fluxo de Navegação

1. Evoluir → Clicar em "Objetivos" → Tela Objetivos
2. Preencher formulário → Salvar → Volta para Evoluir (auto após 2s)
3. Visualizar progresso → Ver quests relacionadas → Clicar em quest → Quest Detail

---

**Última atualização:** 2025-01-22 20:45

