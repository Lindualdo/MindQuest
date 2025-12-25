# 🍎 Plano de Lançamento: Apple App Store

## 1. Conversão Técnica (Hybrid Wrapper)
Como o MindQuest é uma aplicação React/Vite, utilizaremos o Capacitor para encapsular o código web em um binário nativo.

- [ ] **Configuração do Capacitor:** Instalar e configurar `@capacitor/ios` no projeto.
- [ ] **Tratamento de Safe Areas:** Ajustar CSS para evitar que elementos de UI (Header/BottomNav) fiquem sob o Notch ou a barra home do iPhone.
- [ ] **Geração de Assets:** Criar ícone do app e Splash Screen em todos os tamanhos exigidos pela Apple (usando o `capacitor-assets`).
- [ ] **Acesso a Recursos Nativos:** Configurar permissões para Push Notifications e Haptics (vibração).

## 2. Conformidade UI/UX (Apple HIG)
A Apple exige que o app pareça e se comporte como um cidadão nativo do ecossistema iOS.

- [ ] **Navegação:** Validar se todas as sub-telas possuem o botão "Voltar" no Header (padrão já iniciado na v1.3.30).
- [ ] **Dark Mode:** Garantir consistência total do tema escuro em todos os modais e componentes.
- [ ] **Feedback Tátil:** Adicionar vibrações leves (Haptics) ao completar Quests ou interagir com botões principais.
- [ ] **Apple Sign-In:** Implementar obrigatoriamente o "Sign in with Apple" se houver outros métodos de login social.

## 3. Requisitos Legais e Conta

- [ ] **Apple Developer Program:** Criar e ativar a conta de desenvolvedor (USD 99/ano).
- [ ] **Política de Privacidade:** Hospedar uma página pública com os termos de privacidade e uso de dados (obrigatório).
- [ ] **Exclusão de Conta:** Adicionar funcionalidade dentro do app para o usuário excluir seus dados (exigência da Apple).

## 4. Preparação da Loja (App Store Connect)

- [ ] **Screenshots:** Capturar telas em alta resolução para iPhones de 6.7" e 5.5".
- [ ] **Metadados:** Redigir descrição, palavras-chave e suporte técnico em português e inglês (opcional).
- [ ] **TestFlight:** Submeter versão Beta para testes com usuários reais e validação de bugs em dispositivos físicos.

## 5. Submissão e Revisão

- [ ] **App Review:** Enviar para a revisão da Apple.
- [ ] **Correções:** Ajustar possíveis "rejections" baseadas em regras de design ou funcionalidade.
- [ ] **Lançamento:** Publicação oficial na loja.
