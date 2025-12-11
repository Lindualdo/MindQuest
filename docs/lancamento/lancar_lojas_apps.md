# 📱 Documento de Lançamento - App Dashboard IA WhatsApp

**Versão:** 1.0  
**Data:** 11 Dezembro 2025  
**Plataformas:** iOS (App Store) + Android (Google Play)

---

## 🎯 Visão Geral do App

**Descrição:** Dashboard para visualização e gestão de conversas capturadas por IA via WhatsApp, com funcionalidades de anotações e gestão de tarefas automáticas.

**Funcionalidades Principais:**
- Visualização de conversas do WhatsApp processadas por IA
- Anotações em conversas
- Sistema de tarefas geradas automaticamente pela IA
- Conclusão de atividades (checkbox)
- Funcionamento offline (cache local)
- Atualização manual de dados

---

## 🔧 PARTE TÉCNICA

### 1. Preparação do Projeto

#### 1.1 Instalação do Capacitor
```bash
# No diretório do seu webapp
npm install @capacitor/core @capacitor/cli

# Inicializar Capacitor
npx cap init

# Adicionar plataformas
npx cap add ios
npx cap add android
```

#### 1.2 Configuração (capacitor.config.json)
```json
{
  "appId": "com.seudominio.appname",
  "appName": "Nome do App",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}
```

#### 1.3 Plugins Necessários
```bash
# Essenciais
npm install @capacitor/storage          # Cache local
npm install @capacitor/network          # Status conexão
npm install @capacitor/splash-screen    # Tela inicial
npm install @capacitor/status-bar       # Barra de status

# Opcionais (recomendados)
npm install @capacitor/haptics          # Feedback tátil
npm install @capacitor/share            # Compartilhamento
```

### 2. Build e Sincronização

#### 2.1 Build do WebApp
```bash
# Build produção
npm run build

# Sync com plataformas nativas
npx cap sync
```

#### 2.2 Abrir Projetos Nativos
```bash
# iOS (requer Mac)
npx cap open ios

# Android
npx cap open android
```

### 3. Assets Necessários

#### 3.1 Ícones do App
**iOS:**
- 1024x1024px (App Store)
- Vários tamanhos automáticos via Xcode

**Android:**
- 512x512px (Google Play)
- Adaptive icons: foreground + background (108x108dp safe zone)

**Ferramenta recomendada:** 
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

#### 3.2 Splash Screen
- 2732x2732px (centralizados)
- Fundo sólido
- Logo/ícone no centro (safe zone)

#### 3.3 Screenshots
**iOS (obrigatórios):**
- 6.7" (iPhone 14 Pro Max): 1290x2796px
- 6.5" (iPhone 11 Pro Max): 1242x2688px
- 5.5" (iPhone 8 Plus): 1242x2208px
- iPad Pro 12.9": 2048x2732px

**Android (mínimo 2, máximo 8):**
- Qualquer resolução entre 320px e 3840px
- Proporção 16:9 ou 9:16

### 4. Configurações Específicas

#### 4.1 iOS (info.plist)
```xml
<!-- Permissões necessárias -->
<key>NSUserTrackingUsageDescription</key>
<string>Para personalizar sua experiência</string>

<!-- Se usar câmera/fotos -->
<key>NSCameraUsageDescription</key>
<string>Para capturar anotações visuais</string>
```

#### 4.2 Android (AndroidManifest.xml)
```xml
<!-- Permissões necessárias -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Se usar storage -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 5. Testes Pré-Lançamento

**Checklist Técnico:**
- [ ] App abre sem crashes
- [ ] Login funciona
- [ ] Cache offline operacional
- [ ] Anotações salvam corretamente
- [ ] Tarefas marcam como concluídas
- [ ] Atualização manual funciona
- [ ] Transições suaves entre telas
- [ ] Tempo carregamento < 3 segundos
- [ ] Funciona em diferentes tamanhos de tela
- [ ] Rotação de tela (se aplicável)
- [ ] Splash screen aparece
- [ ] Ícone correto instalado

**Dispositivos de Teste:**
- iOS: iPhone 12+, iPad
- Android: Pixel, Samsung (diferentes versões OS)

---

## 📋 PARTE ADMINISTRATIVA

### 1. Contas Necessárias

#### 1.1 Apple Developer Program
- **Custo:** $99/ano
- **URL:** https://developer.apple.com
- **Tempo aprovação:** 24-48h após pagamento
- **Documentos:** Cartão crédito, ID válido

#### 1.2 Google Play Console
- **Custo:** $25 (pagamento único)
- **URL:** https://play.google.com/console
- **Tempo aprovação:** Imediato
- **Documentos:** Cartão crédito, conta Google

### 2. Documentos Legais Obrigatórios

#### 2.1 Política de Privacidade
**Deve conter:**
- Quais dados coleta (conversas, anotações, uso do app)
- Como armazena (cache local no dispositivo)
- Se compartilha dados (provavelmente não)
- Como usuário pode deletar dados
- Contato para dúvidas

**Exemplo estrutura:**
```
1. Dados Coletados
   - Conversas do WhatsApp (apenas leitura)
   - Anotações criadas pelo usuário
   - Status de conclusão de tarefas

2. Armazenamento
   - Dados armazenados localmente no dispositivo
   - Cache offline para funcionamento sem internet
   - Sincronização manual controlada pelo usuário

3. Compartilhamento
   - Não compartilhamos seus dados com terceiros
   - Dados não são enviados para nossos servidores

4. Seus Direitos
   - Deletar conta e dados a qualquer momento
   - Exportar suas anotações

5. Contato
   - Email: privacidade@seudominio.com
```

**Hospedagem:** Criar página no seu site (ex: seudominio.com/privacidade)

#### 2.2 Termos de Uso (Recomendado)
- Propósito do app
- Responsabilidades do usuário
- Limitações de responsabilidade
- Lei aplicável

**Hospedagem:** seudominio.com/termos

### 3. Informações para App Store (Apple)

#### 3.1 App Store Connect - Dados Básicos
**Nome do App:**
- Máximo 30 caracteres
- Único na App Store

**Subtítulo:**
- Máximo 30 caracteres
- Descrição curta atraente

**Palavras-chave:**
- Máximo 100 caracteres
- Separadas por vírgula
- Ex: "dashboard,whatsapp,ia,tarefas,produtividade,anotacoes"

**Categoria Principal:**
- Sugestão: Produtividade
- Secundária: Negócios ou Utilitários

#### 3.2 Descrição do App
**Estrutura recomendada (máximo 4000 caracteres):**
```
[Parágrafo de abertura - problema que resolve]
Gerencie suas conversas e tarefas do WhatsApp de forma inteligente...

[Funcionalidades principais]
• Visualize conversas organizadas
• Adicione anotações importantes
• Gerencie tarefas automaticamente criadas
• Funciona offline

[Benefícios]
✓ Aumento de produtividade
✓ Organização centralizada
✓ Acesso rápido offline

[Privacidade]
Seus dados ficam apenas no seu dispositivo...
```

#### 3.3 Informações de Privacidade (Obrigatório)
**Declarar na App Store Connect:**
- **Dados coletados:** Nenhum (se não enviar para servidor)
- **Rastreamento:** Não rastreia
- **Dados vinculados ao usuário:** Especificar anotações (se aplicável)

#### 3.4 Conta de Teste (Obrigatório)
**Fornecer à Apple:**
- Username: testuser@seudominio.com
- Password: Senha123!teste
- **IMPORTANTE:** Deve funcionar e ter dados de exemplo

**Instruções de teste:**
```
1. Fazer login com as credenciais fornecidas
2. Visualizar conversas de exemplo
3. Adicionar anotação em qualquer conversa
4. Marcar uma tarefa como concluída
5. Testar atualização manual de dados
```

#### 3.5 Informações de Contato
- Nome completo
- Email de suporte: suporte@seudominio.com
- URL marketing (opcional): seudominio.com
- URL política privacidade: seudominio.com/privacidade

### 4. Informações para Google Play

#### 4.1 Play Console - Dados Básicos
**Nome do App:**
- Máximo 50 caracteres

**Descrição Curta:**
- Máximo 80 caracteres
- Ex: "Dashboard inteligente para WhatsApp com IA, anotações e tarefas"

**Descrição Completa:**
- Máximo 4000 caracteres
- Mesma estrutura da App Store

**Categoria:**
- Produtividade

**Tags:**
- Produtividade, Negócios, Ferramentas

#### 4.2 Classificação de Conteúdo
**Questionário Google Play:**
- Violência: Não
- Conteúdo sexual: Não
- Linguagem inadequada: Não
- Drogas: Não
- **Classificação resultante:** Livre

#### 4.3 Público-alvo
- Idade mínima: 13+ (ou 18+ se dados sensíveis)
- Faixa principal: 18-34 anos (ajustar conforme seu público)

#### 4.4 Política de Dados
**Declarar:**
- Coleta dados: Sim (anotações locais)
- Compartilha dados: Não
- Dados sensíveis: Não
- Link política: seudominio.com/privacidade

### 5. Processo de Submissão

#### 5.1 iOS - App Store Connect

**Passo a passo:**
1. **Xcode:** Archive > Distribute App > App Store Connect
2. **App Store Connect:** 
   - Criar novo app
   - Preencher todas informações acima
   - Upload screenshots
   - Selecionar build
   - Responder questionário privacidade
   - **Enviar para revisão**

**Tempo revisão:** 24h - 7 dias (média 48h)

**Status possíveis:**
- Waiting for Review
- In Review
- Pending Developer Release (aprovado!)
- Rejected (ler feedback e corrigir)

#### 5.2 Android - Google Play Console

**Passo a passo:**
1. **Android Studio:** Build > Generate Signed Bundle/APK
2. **Play Console:**
   - Criar novo app
   - Preencher informações
   - Upload screenshots
   - Upload AAB (Android App Bundle)
   - Completar questionário conteúdo
   - **Enviar para revisão**

**Tempo revisão:** Algumas horas - 2 dias

**Trilha de teste (opcional mas recomendado):**
- Internal testing (imediato)
- Closed testing (teste beta)
- Production (lançamento final)

### 6. Preparação para Rejeição

#### 6.1 Motivos Comuns (Apple)

**Guideline 4.2 - Minimum Functionality:**
- "App parece só um website"
- **Solução:** Destacar funcionalidades offline e nativas

**Guideline 2.1 - Performance:**
- "App trava ou tem bugs"
- **Solução:** Testar exaustivamente antes

**Guideline 5.1.1 - Privacy:**
- "Falta política de privacidade clara"
- **Solução:** Link visível e conteúdo completo

**Guideline 2.3 - Metadata:**
- "Screenshots não representam o app"
- **Solução:** Screenshots reais do app funcionando

#### 6.2 Como Responder Rejeição

**Template de resposta:**
```
Olá equipe de revisão,

Obrigado pelo feedback. Fizemos as seguintes correções:

1. [Descrever correção específica]
2. [Evidência da mudança]
3. [Como testar a correção]

O build [número] corrige todos os pontos levantados.

Atenciosamente,
[Seu nome]
```

### 7. Pós-Lançamento

#### 7.1 Monitoramento Primeira Semana
- [ ] Verificar reviews/comentários diariamente
- [ ] Monitorar crashes (Firebase Crashlytics)
- [ ] Analytics de uso
- [ ] Taxa de retenção D1, D7

#### 7.2 Atualizações
**Apple:**
- Mesmo processo de submissão
- Revisão a cada update

**Google:**
- Atualizações mais rápidas
- Pode usar staged rollout (lançamento gradual)

#### 7.3 Suporte
**Canais necessários:**
- Email suporte (responder em 24-48h)
- Respostas a reviews (importante!)
- FAQ no site

---

## 📊 CRONOGRAMA ESTIMADO

| Etapa | Tempo | Responsável |
|-------|-------|-------------|
| Preparação técnica (Capacitor) | 2-3 dias | Dev |
| Criação de assets (ícones, screenshots) | 1-2 dias | Design |
| Documentos legais (privacidade, termos) | 1 dia | Admin/Legal |
| Testes em dispositivos | 2-3 dias | QA |
| Criação contas Apple/Google | 1-2 dias | Admin |
| Submissão App Store | 15 min | Dev |
| Submissão Google Play | 15 min | Dev |
| **Aguardar aprovação Apple** | **1-7 dias** | - |
| **Aguardar aprovação Google** | **0-2 dias** | - |
| **TOTAL (melhor caso)** | **~2 semanas** | - |
| **TOTAL (com rejeições)** | **3-4 semanas** | - |

---

## ✅ CHECKLIST FINAL PRÉ-SUBMISSÃO

### Técnico
- [ ] Build produção funcionando perfeitamente
- [ ] Todos os plugins instalados e testados
- [ ] Cache offline operacional
- [ ] Ícones em todas resoluções
- [ ] Splash screen configurado
- [ ] Screenshots de qualidade (todas plataformas)
- [ ] Testado em múltiplos dispositivos
- [ ] Sem crashes ou bugs críticos
- [ ] Performance < 3s carregamento

### Administrativo - Apple
- [ ] Conta Apple Developer ativa
- [ ] Nome do app decidido e disponível
- [ ] Descrição completa (4000 chars)
- [ ] Palavras-chave definidas
- [ ] Screenshots (todos tamanhos obrigatórios)
- [ ] Política privacidade publicada (URL)
- [ ] Conta de teste funcional criada
- [ ] Questionário privacidade preenchido
- [ ] Email suporte configurado
- [ ] Categoria selecionada

### Administrativo - Google
- [ ] Conta Google Play Console ativa
- [ ] Nome do app decidido
- [ ] Descrição curta (80 chars)
- [ ] Descrição completa (4000 chars)
- [ ] Screenshots (mínimo 2)
- [ ] Ícone 512x512px
- [ ] Política privacidade publicada (URL)
- [ ] Questionário conteúdo preenchido
- [ ] Classificação etária definida
- [ ] Email suporte configurado

### Legal
- [ ] Política de privacidade completa
- [ ] Termos de uso (se aplicável)
- [ ] Ambos acessíveis via URL pública
- [ ] Conformidade LGPD/GDPR (se aplicável)

---

## 🆘 RECURSOS DE AJUDA

**Documentação:**
- Capacitor: https://capacitorjs.com/docs
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Policies: https://play.google.com/about/developer-content-policy/

**Ferramentas:**
- Gerador de ícones: https://www.appicon.co/
- Screenshot design: Figma ou Canva
- Teste de dispositivos: BrowserStack, TestFlight (iOS)

**Comunidades:**
- Capacitor Discord
- Stack Overflow
- Reddit: r/iOSProgramming, r/androiddev

---

## 📞 CONTATOS IMPORTANTES

**Suporte técnico:**
- Capacitor: Discord/GitHub Issues
- Apple: developer.apple.com/support
- Google: support.google.com/googleplay/android-developer

**Emergências pós-lançamento:**
- Apple: expedited review (casos urgentes)
- Google: support ticket

---

**Última atualização:** Dezembro 2025  
**Próxima revisão:** Após primeiro lançamento