# Frontend - Referência Rápida

**Data:** 2025-01-22 15:30

## Stack

- **React 18** + TypeScript
- **Vite** (build)
- **Tailwind CSS** (styling)
- **Framer Motion** (animações)
- **Zustand** (estado global)

## Estrutura v1.3

```
src/
├── pages/App/v1.3/          # Páginas principais
├── components/app/v1.3/     # Componentes v1.3
└── store/                   # Estado global (Zustand)
```

## Template de Página

```tsx
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';

const MinhaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('evoluir');

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />
      
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button type="button" onClick={handleBack} className="mq-btn-back">
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>
        
        {/* Título */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Título</h1>
          <p className="mq-page-subtitle">Subtítulo</p>
        </div>
        
        {/* Conteúdo */}
      </main>

      <BottomNavV1_3
        active={activeTab}
        onConversar={handleNavConversar}
        onEntender={handleNavEntender}
        onAgir={handleNavAgir}
        onEvoluir={handleNavEvoluir}
      />
    </div>
  );
};
```

## Classes CSS

| Classe | Uso |
|--------|-----|
| `mq-app-v1_3` | Container raiz |
| `mq-card` | Cards |
| `mq-btn-back` | Botão voltar |
| `mq-page-title` | Título da página |
| `mq-page-subtitle` | Subtítulo |

## Variáveis CSS (Tema)

**SEMPRE usar variáveis** (suporte tema claro/escuro):

```css
var(--mq-bg)            /* Fundo principal */
var(--mq-card)          /* Fundo de cards */
var(--mq-text)          /* Texto principal */
var(--mq-text-muted)    /* Texto secundário */
var(--mq-primary)       /* Cor primária */
var(--mq-border)        /* Bordas */
var(--mq-bar)           /* Barras de progresso */
```

**❌ NUNCA usar cores hardcoded** (`#1a1a2e`, `bg-gray-800`)

## Handlers de Navegação

```tsx
const handleNavConversar = () => {
  setActiveTab('conversar');
  setView('conversar');
};

const handleNavEntender = () => {
  setActiveTab('entender');
  setView('dashEmocoes');
};

const handleNavAgir = () => {
  setActiveTab('agir');
  setView('painelQuests');
};

const handleNavEvoluir = () => {
  setActiveTab('evoluir');
  setView('jornada');
};
```

## Regras

1. **SEMPRE** incluir `HeaderV1_3` no topo
2. **SEMPRE** incluir `BottomNavV1_3` no rodapé
3. **SEMPRE** usar `max-w-md` no main (mobile-first)
4. **SEMPRE** usar `pb-24` no main (espaço para menu)
5. **SEMPRE** usar variáveis CSS para cores

---

**Economia de tokens:** Este documento tem ~300 tokens vs ~2.000 tokens da documentação completa.

