# Pergunta: Cálculo de Intensidade Média do Sabotador

**Contexto:**
No sistema MindQuest, estamos identificando o "sabotador mais ativo" de um usuário baseado em:
- Quantidade de detecções (total de registros)
- Quantidade de conversas afetadas
- Intensidade média

**Situação Atual:**
Cada registro de detecção de sabotador na tabela `usuarios_sabotadores` possui um campo `intensidade_media` (valor numérico, ex: 50, 65, 85).

**Dúvida:**
Para determinar o "sabotador mais ativo", qual é a forma correta de calcular a intensidade média quando um mesmo sabotador aparece em múltiplos registros?

**Opções disponíveis:**

1. **Média Aritmética Simples** (`AVG(intensidade_media)`)
   - Soma todos os valores de `intensidade_media` e divide pela quantidade de registros
   - Exemplo: Se o sabotador "Inquieto" tem 24 registros com valores variando entre 50-85, calcula a média de todos esses valores
   - Resultado: 69.17 (média de 24 registros)

2. **Valor Máximo** (`MAX(intensidade_media)`)
   - Pega o maior valor de `intensidade_media` entre todos os registros
   - Exemplo: Entre os 24 registros, retorna 85 (o maior valor encontrado)
   - Resultado: 85

3. **Valor do Registro Mais Recente**
   - Pega o valor de `intensidade_media` do registro com data mais recente
   - Exemplo: Retorna o valor do último registro criado/atualizado
   - Resultado: 65 (valor do registro mais recente)

4. **Outra forma de cálculo?**
   - Se houver uma abordagem mais adequada do ponto de vista psicológico

**Exemplo prático:**
- Sabotador "Inquieto": 24 detecções
- Valores de intensidade_media: variam entre 50 e 85
- Registro mais recente: intensidade_media = 65
- Valor máximo encontrado: 85
- Média aritmética: 69.17

**Pergunta:**
Qual dessas abordagens (ou outra) é mais adequada do ponto de vista psicológico para representar a "intensidade média" de um sabotador quando ele aparece em múltiplas detecções ao longo do tempo? A média aritmética reflete melhor o impacto geral, ou o valor máximo/mais recente é mais relevante para identificar o sabotador mais ativo?

