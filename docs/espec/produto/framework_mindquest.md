## 1. Visão Geral - Framework MindQuest

MindQuest é uma plataforma de desenvolvimento pessoal que transforma conversas em ações práticas. Identifica padrões mentais que travam o progresso e oferece micro-ações personalizadas (quests) para mudança comportamental.

## PILAR CENTRAL DO FRAMEWORK
- Conforto mental: Mente sã corpo são
- As ações devem ser direcionadas primeiro para atender este pilar
- Usuário com Humor/energia baixo, sistema foca em acolher e ajudar a melhorar
- Sabotador se manifesta - prioriza contramedias sabotadores
- Emocional ok - foca em ações direcionadas aos objetivos

**CONVERSAR → ENTENDER → AGIR → EVOLUIR**

### CONVERSAR
Usuário conversa com o mentor. Esta é a fase que impulsiona todo o restante do sistema. O mentor conduz conversas guiadas focadas em desenvolvimento pessoal, padrões mentais e objetivos.

### ENTENDER
Com os dados extraídos da conversa, o sistema (experts) detecta: emoções, humor, energia, sabotadores, gera quests e insights. O mentor prepara contexto rico durante a conversa para facilitar este trabalho.

### AGIR
Com as quests geradas e a ação do usuário, o mentor também atua aqui para:
- Validar se o usuário está conseguindo agir
- Detectar dificuldades nas ações ou na mente
- Ajudar a destravar bloqueios

Regras que decidem quais tipos de quest(prioridade) criar
- Mentalidade: se humor <= 5 ou energia <= 5.
- Sabotador (chat): se sabotador_conversa existe e intensidade >= 65.
- Personalizada: se pedido_quest não vazio; ignora limite diário.
- Objetivos: se há objetivos_especificos e resumo menciona “ação/progresso”.
- Sabotador (histórico): se sabotador_historico existe e sobrou slot.

### EVOLUIR
Visão macro: medir se as ações estão levando na direção do objetivo final e da evolução pessoal. O mentor usa conquistas para motivar, celebrar com o usuário e falar sobre seus objetivos configurados.

**Papel do Mentor:** Motor que impulsiona todo o sistema através de conversas guiadas, atuando principalmente em CONVERSAR, mas também apoiando em AGIR e EVOLUIR.