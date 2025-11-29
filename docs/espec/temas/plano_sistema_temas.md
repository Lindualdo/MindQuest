# Plano: Sistema de Temas - 4 Variantes (2 Claros + 2 Escuros)

**Data:** 2025-01-29

## Objetivo
Permitir ao usuário escolher entre 4 temas de aparência no menu Evoluir > Aparência.

## Temas Propostos
1. **Claro Padrão** (atual) - #F5EBF3 (Pale Purple)
2. **Claro Alternativo** - Tons mais neutros/azulados
3. **Escuro Padrão** - Dark mode base Space Cadet
4. **Escuro Alternativo** - Dark mode com toques coloridos

## Arquivos a Criar/Modificar

### Novos Arquivos
- `src/data/themes.ts` - Definições dos 4 temas (cores CSS variables)
- `src/pages/App/v1.3/AparenciaPageV13.tsx` - Página de seleção de tema
- `src/utils/themeManager.ts` - Lógica para aplicar tema (localStorage + DOM)

### Arquivos CSS a Modificar
- `src/index.css` - Adicionar classes CSS para cada tema
- `src/components/app/v1.3/styles/mq-v1_3-styles.css` - Ajustar se necessário

### Páginas a Modificar
- `src/pages/App/v1.3/EvoluirPageV13.tsx` - Adicionar onClick no botão Aparência
- `src/App.tsx` - Adicionar rota para 'aparencia'
- `src/store/useStore.ts` - Adicionar estado `selectedTheme` e função `setTheme`

### Componentes que Precisam Suporte a Temas
- Todos os componentes em `src/components/app/v1.3/` - Trocar cores hardcoded por CSS variables
- `src/pages/App/v1.3/HomeV1_3.tsx`
- `src/pages/App/v1.3/PainelQuestsPageV13.tsx`
- `src/pages/App/v1.3/EvoluirPageV13.tsx`
- Outras páginas principais que usam cores fixas

## Estratégia de Implementação

1. **CSS Variables** - Definir paleta de cada tema via CSS custom properties no `:root`
2. **Aplicação via Classe** - Adicionar classe no `<html>` (ex: `theme-light-default`, `theme-dark-alt`)
3. **Persistência** - Salvar preferência no localStorage e carregar no mount do App
4. **Backend (futuro)** - Campo `tema_preferido` na tabela usuarios (sync opcional)

## Estrutura de Cores por Tema

Cada tema define: background, foreground, primary, secondary, accent, borders, cards.
Substituir valores hardcoded por `var(--color-name)` nos componentes.

## Nível de Complexidade

**Complexidade: MÉDIA-ALTA** ⚠️

### Razões:
- **27 arquivos TSX** a modificar (componentes + páginas)
- **118+ ocorrências** de cores hardcoded (`#HEX`, `bg-[#...]`, `text-[#...]`)
- Requer refatoração sistemática de todos os componentes
- Risco de quebrar visual se não mapear todas as cores corretamente

### Estimativa:
- **Setup inicial**: 2-3h (definir temas, CSS, themeManager)
- **Refatoração componentes**: 4-6h (substituir cores hardcoded)
- **Testes e ajustes**: 2-3h
- **Total**: ~8-12 horas

### Dificuldades:
1. Encontrar todas as cores hardcoded (algunas podem estar em style inline)
2. Garantir contraste adequado nos 4 temas
3. Testar visual em cada tema
4. Manter consistência entre componentes

### Mitigações:
- Usar busca por regex para encontrar todas as cores
- Criar arquivo de mapeamento cores → CSS variables
- Testar incrementalmente por componente

