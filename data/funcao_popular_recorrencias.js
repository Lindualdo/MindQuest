/**
 * Função para popular o campo recorrencias ao criar uma quest
 * Use este código em um node Code antes do INSERT em usuarios_quest
 */

const items = $input.all();
const resultado = [];

for (const item of items) {
  const quest = item.json;
  let recorrencias = null;

  // Só popula se for quest recorrente
  if (quest.recorrencia && quest.recorrencia !== 'unica' && quest.prazo_inicio && quest.prazo_fim) {
    const tipo = quest.recorrencia; // 'diaria', 'semanal', etc
    const janela = {
      inicio: quest.prazo_inicio,
      fim: quest.prazo_fim
    };
    
    // Gerar array de dias entre prazo_inicio e prazo_fim
    const inicio = new Date(quest.prazo_inicio + 'T00:00:00Z');
    const fim = new Date(quest.prazo_fim + 'T23:59:59Z');
    const dias = [];
    
    for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
      dias.push({
        data: d.toISOString().split('T')[0],
        status: 'pendente',
        xp_previsto: quest.xp_recompensa || 30,
        concluido_em: null
      });
    }
    
    recorrencias = {
      tipo,
      janela,
      dias
    };
  }

  resultado.push({
    json: {
      ...quest,
      recorrencias
    }
  });
}

return resultado;

