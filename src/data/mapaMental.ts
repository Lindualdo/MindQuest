import type { MapaMentalData } from '@/types/emotions';

export const mapaMentalFallback: MapaMentalData = {
  usuarioId: 'fallback-user',
  geradoEm: null,
  areas: [
    {
      area: 'Saúde Emocional',
      assuntos: [
        {
          assunto_central: 'Controle emocional nas operações',
          mudanca_desejada: 'Reduzir reações impulsivas durante trades',
          acoes_praticas: [
            'Respiro e checagem de checklist antes de cada entrada',
            'Registrar emoções após fechar cada operação',
            'Aplicar técnica Pomodoro para limitar exposição'
          ],
          resultado_esperado: 'Executar decisões financeiras com mais calma e consistência',
        },
        {
          assunto_central: 'Rotinas de autocuidado',
          mudanca_desejada: 'Reforçar hábitos que estabilizam humor e energia',
          acoes_praticas: [
            'Iniciar manhã com respiração + alongamento de 5 minutos',
            'Reservar uma noite por semana para descanso profundo',
            'Usar o app para revisar gatilhos emocionais aos domingos'
          ],
          resultado_esperado: 'Manter humor equilibrado para sustentar disciplina diária',
        },
      ],
    },
    {
      area: 'Trabalho e Finanças',
      assuntos: [
        {
          assunto_central: 'Gestão de risco no mercado',
          mudanca_desejada: 'Evitar ciclos de perdas por decisões impulsivas',
          acoes_praticas: [
            'Definir limite de perda diária de 2% e respeitar stops',
            'Encerrar operações após 90 minutos seguidos',
            'Registrar no diário de trading os aprendizados do dia'
          ],
          resultado_esperado: 'Preservar capital e confiança para seguir o plano financeiro',
        },
        {
          assunto_central: 'Lançamento do produto MindQuest',
          mudanca_desejada: 'Concluir entregáveis-chave sem cair no perfeccionismo',
          acoes_praticas: [
            'Fechar backlog semanal com 3 tarefas críticas',
            'Enviar release beta para 3 testers até sexta',
            'Delegar materiais de marketing para parceiro externo'
          ],
          resultado_esperado: 'Avançar com consistência no negócio e gerar receita complementar',
        },
      ],
    },
    {
      area: 'Relacionamentos e Vida Pessoal',
      assuntos: [
        {
          assunto_central: 'Reconexão com a família',
          mudanca_desejada: 'Retomar contato ativo com filhos mesmo à distância',
          acoes_praticas: [
            'Agendar chamada de vídeo fixa aos domingos',
            'Registrar momentos positivos no diário semanal',
            'Explorar datas para viagem ao Brasil no próximo trimestre'
          ],
          resultado_esperado: 'Reforçar laços afetivos e sentir suporte fora do trabalho',
        },
        {
          assunto_central: 'Autocuidado social',
          mudanca_desejada: 'Criar espaço para lazer e amizades locais',
          acoes_praticas: [
            'Participar de um encontro presencial de tecnologia ou IA por mês',
            'Convidar um amigo para caminhada/treino semanal',
            'Desconectar do celular 1h antes de dormir para relaxar'
          ],
          resultado_esperado: 'Reduzir sensação de solidão e recuperar energia emocional',
        },
      ],
    },
    {
      area: 'Saúde Física',
      assuntos: [
        {
          assunto_central: 'Rotina de movimento',
          mudanca_desejada: 'Manter ritmo de treinos mesmo em semanas intensas',
          acoes_praticas: [
            'Agendar treinos fixos de segunda, quarta e sábado',
            'Usar caminhadas curtas após reuniões estressantes',
            'Hidratar 2L por dia com lembrete no app'
          ],
          resultado_esperado: 'Garantir energia constante para executar metas e cuidar da mente',
        },
        {
          assunto_central: 'Higiene do sono',
          mudanca_desejada: 'Dormir antes da meia-noite com qualidade',
          acoes_praticas: [
            'Encerrar telas 30 minutos antes de deitar',
            'Fazer journaling rápido para esvaziar a mente',
            'Usar respiração 4-7-8 quando houver ansiedade noturna'
          ],
          resultado_esperado: 'Acordar com disposição e foco para executar o plano diário',
        },
      ],
    },
  ],
};

export default mapaMentalFallback;
