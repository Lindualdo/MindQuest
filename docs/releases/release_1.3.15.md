# Release v1.3.15 — Padronização de Navegação e Performance

Esta versão foca na melhoria da experiência de navegação mobile (padrão iOS) e na otimização drástica de performance inicial.

## 🚀 Melhorias de Performance
- **Otimização de Assets:** O logo original de 10MB foi substituído por uma versão otimizada de 215KB (redução de 98% no peso do arquivo).
- **Remoção de Arquivos:** Remoção do asset pesado original do repositório.

## 📱 Interface e Navegação (Padrão iOS)
- **Header Dinâmico:** O componente `HeaderV1_3` agora suporta navegação nativa. Sempre que uma sub-tela é aberta, o logo é substituído pelo botão `< Voltar`.
- **Hierarquia Visual:** A saudação do usuário permanece centralizada no header durante a navegação, seguindo as *Human Interface Guidelines* da Apple.
- **Limpeza de UI:** Removidos botões "Voltar" redundantes de dentro das telas de conteúdo, ganhando mais espaço vertical útil.

## 🛠 Arquivos Modificados
- `src/components/app/v1.3/HeaderV1_3.tsx`: Implementação da lógica de navegação.
- `src/pages/App/v1.3/`: Atualização de +20 telas de detalhe e sub-telas (Quests, Ajustes, Sabotadores, Humor, Evolução, Mapa Mental, Insights, etc).
- `src/img/`: Inclusão de `logo_redonda_small.png` e remoção da versão pesada.

---
**Status:** Implementado e Comitado.
