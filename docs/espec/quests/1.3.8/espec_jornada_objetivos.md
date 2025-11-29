# MindQuest - Jornada e Objetivos v1.3.8

**Data:** 2025-11-29 14:45  
**Versão:** 1.3.8  
**Status:** Em desenvolvimento incremental

---

## 1. Contexto e Problema

### Problema Central
O MindQuest mede **engajamento no app** (conversas, quests, XP), mas não captura **resultados reais** na vida do usuário.

### Dois Eixos de Progresso

| Eixo | O que mede | Como captura | Status |
|------|-----------|--------------|--------|
| **App (Engajamento)** | Conversas, quests, XP, streak | Automático | ✅ Implementado |
| **Vida Real (Transformação)** | Objetivos alcançados | Feedback do usuário | 🔧 Em desenvolvimento |

### Filosofia MindQuest
> Evolução através da mente/autoconhecimento. Sem trabalhar o autoconhecimento, os outros objetivos podem não avançar.

---

## 2. Decisões Aprovadas

### 2.1 Separação: Jornada vs Ajustes ✅

| Antes (Evoluir) | Depois |
|-----------------|--------|
| Misturava progresso + configurações | **Jornada**: progresso app + vida real |
| | **Ajustes**: configurações (via ⚙️) |

**Acesso aos Ajustes:** Ícone de engrenagem no header da página Jornada.

---

### 2.2 Renomeação do Menu ✅

| Menu Atual | Novo Nome | Foco |
|------------|-----------|------|
| Evoluir | **Jornada** | Celebrar + Medir progresso |

---

### 2.3 Sistema de Objetivos Pessoais ✅

| Regra | Valor | Justificativa |
|-------|-------|---------------|
| Limite de objetivos ativos | Máx. 2 | Foco > dispersão |
| Prazo padrão | 30-60 dias | Curto prazo = mais engajamento |
| Prazos disponíveis | 30, 45, 60 dias | Flexibilidade controlada |
| Campo de detalhamento | Obrigatório (min. 20 caracteres) | Personalização + clareza |
| Renovação | Manual após conclusão/expiração | Usuário decide se quer continuar |

---

## 3. Wireframes Aprovados

### 3.1 Página JORNADA

```
┌─────────────────────────────────────────────┐
│  [← Voltar]                          [⚙️]   │
├─────────────────────────────────────────────┤
│                  JORNADA                    │
│          Sua evolução no MindQuest          │
├─────────────────────────────────────────────┤
│                                             │
│  ══════════ NO APP ══════════               │
│                                             │
│  ┌───────────┬───────────┬───────────┐      │
│  │ Conversas │   Ações   │  Pontos   │      │
│  │    43 ↗   │    9 ↗    │  510 ⭐   │      │
│  │  (toque   │  (toque   │           │      │
│  │   p/ver)  │   p/ver)  │           │      │
│  └───────────┴───────────┴───────────┘      │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Nível 3 · Observador               │    │
│  │  ████████████░░░░░░░░ 550/1050 XP   │    │
│  │  Estágio 1 de 4 · Início da jornada │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ══════════ NA VIDA ══════════              │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  🎯 Meus Objetivos              (2) │ >  │
│  │     Definir e acompanhar metas      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  📊 Check-in Semanal            [!] │ >  │
│  │     Como está seu progresso real?   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  🏆 Conquistas na Vida          (1) │ >  │
│  │     Objetivos que você alcançou     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  📈 Conexão Ações × Objetivos       │ >  │
│  │     Quais ações impactaram cada     │    │
│  │     objetivo                        │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
│  Clareza  │  Mente  │  Ações  │  Jornada   │
└─────────────────────────────────────────────┘
```

### 3.2 Página AJUSTES

```
┌─────────────────────────────────────┐
│  [<] Voltar                         │
├─────────────────────────────────────┤
│            AJUSTES                  │
│     "Personalize sua experiência"   │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 👤 Perfil Pessoal        >  │    │
│  │    Nome, foto, preferências │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🎨 Aparência             >  │    │
│  │    Tema e visual            │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🤖 Interações com IA     >  │    │
│  │    Tom e frequência         │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🔒 Segurança             >  │    │
│  │    Senha e privacidade      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ❓ Ajuda e Feedback      >  │    │
│  │    FAQ, suporte, sugestões  │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### 3.3 Fluxo: Criar Objetivo

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEFINIR OBJETIVO                             │
│              "O que você quer conquistar?"                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PASSO 1: Escolha a área da vida                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                            │
│  │ 💼      │ │ 💛      │ │ 🙏      │                            │
│  │Carreira │ │Relaciona│ │Espiritu │                            │
│  └─────────┘ └─────────┘ └─────────┘                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                            │
│  │ 💰      │ │ 🏃      │ │ 🧠      │                            │
│  │Finanças │ │ Saúde   │ │Evolução │                            │
│  └─────────┘ └─────────┘ └─────────┘                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PASSO 2: Escolha o objetivo (ou crie)                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ○ Mudar de emprego                                      │    │
│  │ ○ Mudar de área de atuação                              │    │
│  │ ○ Iniciar meu próprio negócio                           │    │
│  │ ○ Conseguir uma promoção                                │    │
│  │ ● Outro: ______________________________                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PASSO 3: Detalhe seu objetivo                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Quero conseguir a vaga de gerente no meu departamento   │    │
│  │ até março. Preciso melhorar minha comunicação e         │    │
│  │ visibilidade com a diretoria.                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│  Mínimo 20 caracteres                                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PASSO 4: Defina o prazo                                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                            │
│  │ 30 dias │ │ 45 dias │ │ 60 dias │                            │
│  │         │ │    ✓    │ │         │                            │
│  └─────────┘ └─────────┘ └─────────┘                            │
│                                                                 │
│           [ CRIAR OBJETIVO ]                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Catálogo de Áreas e Objetivos

### 4.1 Áreas da Vida (tabela existente: `areas_vida_catalogo`)

| Código | Nome | Ícone |
|--------|------|-------|
| `carreira` | Carreira | 💼 |
| `relacionamentos` | Relacionamentos | 💛 |
| `espiritualidade` | Espiritualidade | 🙏 |
| `financas` | Finanças | 💰 |
| `saude` | Saúde | 🏃 |
| `evolucao` | Evolução Pessoal | 🧠 |

### 4.2 Objetivos por Área (tabela nova: `objetivos_catalogo`)

#### Carreira
- Mudar de emprego
- Mudar de área de atuação
- Iniciar meu próprio negócio
- Conseguir uma promoção
- Melhorar produtividade no trabalho

#### Relacionamentos
- Encontrar alguém para a vida
- Fazer novas amizades
- Melhorar comunicação com parceiro(a)
- Fortalecer laços familiares
- Estabelecer limites saudáveis

#### Espiritualidade
- Explorar uma crença ou filosofia
- Desenvolver prática de meditação
- Encontrar propósito e sentido
- Cultivar gratidão diária

#### Finanças
- Aumentar minha renda
- Controlar gastos e contas
- Começar a investir
- Criar reserva de emergência
- Quitar dívidas

#### Saúde
- Perder peso
- Ganhar massa muscular
- Melhorar qualidade do sono
- Reduzir ansiedade/estresse
- Melhorar exames (colesterol, glicose, etc.)

#### Evolução Pessoal
- Desenvolver autoconhecimento
- Aprender algo novo (idioma, habilidade)
- Ler mais livros
- Superar um medo ou bloqueio
- Desenvolver disciplina e consistência

---

## 5. Estrutura de Dados

### 5.1 Tabela: `objetivos_catalogo` (nova)

```sql
CREATE TABLE objetivos_catalogo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_vida_id UUID REFERENCES areas_vida_catalogo(id),
  codigo VARCHAR(50) NOT NULL UNIQUE,
  titulo VARCHAR(100) NOT NULL,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Tabela: `usuarios_objetivos` (nova)

```sql
CREATE TABLE usuarios_objetivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  area_vida_id UUID NOT NULL REFERENCES areas_vida_catalogo(id),
  objetivo_catalogo_id UUID REFERENCES objetivos_catalogo(id), -- NULL se customizado
  titulo VARCHAR(100) NOT NULL,
  detalhamento TEXT NOT NULL,
  prazo_dias INT NOT NULL CHECK (prazo_dias IN (30, 45, 60)),
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_limite DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' 
    CHECK (status IN ('ativo', 'alcancado', 'expirado', 'cancelado')),
  alcancado_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Constraint: máximo 2 objetivos ativos por usuário
CREATE UNIQUE INDEX idx_usuarios_objetivos_limite 
  ON usuarios_objetivos (usuario_id) 
  WHERE status = 'ativo';
-- Nota: usar trigger para validar limite de 2
```

---

## 6. Conexão: Objetivo → Quest → Progresso

### 6.1 Fluxo Conceitual

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  OBJETIVO   │────▶│   QUESTS    │────▶│  PROGRESSO  │
│             │     │             │     │             │
│ • Área vida │     │ • Área vida │     │ • Concluída │
│ • Prazo     │     │ • Tipo      │     │ • XP ganho  │
│ • Detalhe   │     │ • XP        │     │ • Objetivo  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  CHECK-IN   │
                    │  SEMANAL    │
                    │             │
                    │ "Você fez X │
                    │  ações para │
                    │  [objetivo]"│
                    └─────────────┘
```

### 6.2 Regras de Vinculação (a implementar)

| Momento | O que acontece |
|---------|----------------|
| Criação de objetivo | Sistema vincula `area_vida_id` ao objetivo |
| Criação de quest | IA considera objetivos ativos do usuário |
| Conclusão de quest | Sistema verifica se `area_vida_id` coincide com objetivo ativo |
| Check-in semanal | Sistema mostra: "Você fez X ações para [objetivo]" |
| Objetivo alcançado | Usuário marca manualmente |

---

## 7. Pontos Pendentes (a explorar depois)

### 7.1 Acompanhamento de Objetivos
- [ ] Wireframe da tela de acompanhamento
- [ ] Visualização do progresso por objetivo
- [ ] Indicadores visuais de prazo restante

### 7.2 Check-in Semanal
- [ ] Wireframe da tela de check-in
- [ ] Perguntas do check-in (escala 1-5? emoji?)
- [ ] Frequência e notificações
- [ ] Integração com fluxo existente (após conversa? domingo?)

### 7.3 Conquistas na Vida
- [ ] Wireframe da tela de conquistas
- [ ] Celebração visual ao marcar objetivo como alcançado
- [ ] Histórico de objetivos alcançados

### 7.4 Conexão Ações × Objetivos
- [ ] Wireframe da visualização
- [ ] Lógica de contagem: apenas quests da mesma área?
- [ ] Peso diferente por tipo de quest?

### 7.5 Criação de Quest (alteração futura)
- [ ] Como IA vai considerar objetivos ativos?
- [ ] Priorização de quests alinhadas com objetivos?
- [ ] Campo `objetivo_id` na tabela `usuarios_quest`?

### 7.6 Duas Moedas de Valor
- [ ] XP (app) — já implementado
- [ ] Objetivos Alcançados (vida real) — como visualizar?
- [ ] Badge ou contador especial para objetivos?

---

## 8. Próximos Passos de Implementação

### Fase 1: Estrutura Base
1. Criar tabelas `objetivos_catalogo` e `usuarios_objetivos`
2. Popular catálogo de objetivos por área
3. Criar página Jornada (separar de Evoluir)
4. Criar página Ajustes (engrenagem)

### Fase 2: Objetivos
5. Implementar fluxo de criação de objetivo
6. Validar limite de 2 objetivos ativos
7. Criar webhook/API para CRUD de objetivos

### Fase 3: Conexão (futuro)
8. Alterar criação de quest para considerar objetivos
9. Implementar check-in semanal
10. Implementar visualização de conexão ações × objetivos

---

**Última atualização:** 2025-11-29 14:45

