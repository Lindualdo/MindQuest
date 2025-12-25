# Release v1.3.30 — Padronização de Navegação, Performance e Ícones

Esta versão foca na melhoria da experiência de navegação mobile (padrão iOS), na otimização drástica de performance inicial e na padronização visual substituindo emojis por ícones Lucide.

## 🚀 Melhorias de Performance
- **Otimização de Assets:** O logo original de 10MB foi substituído por uma versão otimizada de 215KB (redução de 98% no peso do arquivo).
- **Remoção de Arquivos:** Remoção do asset pesado original do repositório (`logo_redonda.png`).

## 📱 Interface e Navegação (Padrão iOS)
- **Header Dinâmico:** O componente `HeaderV1_3` agora suporta navegação nativa. Sempre que uma sub-tela é aberta, o logo é substituído pelo botão `< Voltar`.
- **Hierarquia Visual:** A saudação do usuário permanece centralizada no header durante a navegação, seguindo as *Human Interface Guidelines* da Apple.
- **Limpeza de UI:** Removidos botões "Voltar" redundantes de dentro das telas de conteúdo, ganhando mais espaço vertical útil.
- **Padronização Sistêmica:** Atualização de todas as páginas (incluindo "Ações por Sabotadores", "Mapa Mental", etc.) para seguir o novo padrão de navegação.

## 💎 Padronização Visual (Iconografia)
- **Substituição de Emojis:** Substituição sistemática de emojis por ícones da biblioteca Lucide em toda a aplicação.
- **Centralização de Ícones:** Criação do utilitário `IconRenderer` em `src/utils/iconMap.tsx` para gerenciar dinamicamente os ícones dos sabotadores, áreas da vida e estados do sistema.
- **Variantes de Emojis:** Implementado mapeamento de variantes de emojis vindas do banco de dados (ex: `😢` e `🙈`) para garantir que todos os sabotadores apareçam com ícones consistentes.
- **Consistência:** Interface mais limpa e profissional, alinhada com padrões modernos de design de aplicativos.

## 🛠 Arquivos Modificados
- `src/components/app/v1.3/HeaderV1_3.tsx`: Implementação da lógica de navegação.
- `src/pages/App/v1.3/`: Atualização de todas as telas de detalhe e sub-telas para novo padrão de navegação e ícones.
- `src/utils/iconMap.tsx`: Novo utilitário para mapeamento de ícones.
- `src/utils/dataAdapter.ts`: Atualização da adaptação de dados para usar nomes de ícones em vez de emojis.
- `src/data/`: Atualização de catálogos e mock data para suporte à nova iconografia.
- `src/img/`: Inclusão de `logo_redonda_small.png` e remoção da versão pesada.

---
**Status:** Implementado e Comitado.

