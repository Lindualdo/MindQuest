# Revisão Home v1.2

## Direções Gerais
- Home continua sendo o dash de emoções (autoconhecimento) ocupando a dobra.
- Conversas, Quests e Evolução (card Jornada) viram cards acessados sob demanda via menu/tab inferior.
- Remover chip “Conversas → Quests → Transformação” do header quando o menu estiver ativo.
- Criar footer fixo com ícones próprios: Home, Conversas, Quests, Evolução.
- Cada item do menu carrega um único card full-width, com animação suave de transição.

## Ajustes Visuais Atuais
- Card Diário de Conversas: tipografia maior, espaço extra entre título, streak e barra, benefícios sem fundo.
- Grid semanal distribuída em toda a largura, com destaque coral para o dia atual.
- Palette unificada em tons coral claro para barra/checks/caixa de benefícios.
- Padding lateral reduzido para ganhar área útil no mobile.

## Próximos Passos
1. Implementar estado `activeSection` na `HomeV1_2` controlando qual card renderizar.
2. Desenhar ícones personalizados para o menu (estilo flat, outline coral/azul).
3. Ajustar header para remover chip e reduzir altura quando o footer existir.
4. Fixar altura/estrutura de cada card ativo (ocupando vertical completa com fontes maiores e layout confortável).
5. Validar se cada tab mantém indicadores/resumos mínimos (ex.: badge com streak ou XP).
6. Testar comportamento mobile (gesture, safe-area, evitar sobreposição com footer).
