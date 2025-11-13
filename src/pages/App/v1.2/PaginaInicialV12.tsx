import CardMomentoAgora from '@/components/app/v1.2/CardMomentoAgora';
import CardQuestDesbloqueada from '@/components/app/v1.2/CardQuestDesbloqueada';
import CardPanorama from '@/components/app/v1.2/CardPanorama';
import CardConversas from '@/components/app/v1.2/CardConversas';
import CardQuests from '@/components/app/v1.2/CardQuests';
import CardJornadaConquistas from '@/components/app/v1.2/CardJornadaConquistas';
import CardInsightsPadroes from '@/components/app/v1.2/CardInsightsPadroes';
import CardResumoSemana from '@/components/app/v1.2/CardResumoSemana';

const noop = () => undefined;

const mock = {
  usuario: {
    nome: 'Ana',
    nivel: 'Nível 3 · Coragem',
    xpAtual: 1450,
    xpMeta: 2200,
    proximoNivel: 'Consistência',
  },
  questDesbloqueada: {
    titulo: 'Nova Quest Ativa',
    descricao: 'Micro-metas diárias para evitar sobrecarga',
    xp: 150,
    ultimaConversa: 'há 3h',
    streak: 1,
    meta: 3,
  },
  panorama: [
    {
      titulo: 'Humor',
      valor: '😌 Calma',
      descricao: 'Sensação estável hoje',
      tag: '↗️ Melhor',
      estado: 'positivo' as const,
    },
    {
      titulo: 'Energia',
      valor: '🔋 75%',
      descricao: 'Reservas altas para agir',
      tag: '⚡ Alta',
      estado: 'neutro' as const,
    },
    {
      titulo: 'Sabotador',
      valor: '🧠 Hiper-vigilância',
      descricao: 'Fique atenta a excessos',
      tag: '⚠️ Ativo',
      estado: 'alerta' as const,
    },
  ],
  conversas: {
    streak: 1,
    recorde: 17,
    progressoAtual: 1,
    progressoMeta: 3,
    dias: [
      { dia: 'QUI', data: '6/11', status: 'feito' as const },
      { dia: 'SEX', data: '7/11', status: 'feito' as const },
      { dia: 'SAB', data: '8/11', status: 'feito' as const },
      { dia: 'DOM', data: '9/11', status: 'falhou' as const },
      { dia: 'SEG', data: '10/11', status: 'feito' as const },
      { dia: 'TER', data: '11/11', status: 'falhou' as const },
      { dia: 'QUA', data: '12/11', status: 'feito' as const },
    ],
    beneficios: [
      '+75 XP base',
      'Novo insight personalizado',
      'Progresso na Quest ativa',
    ],
  },
  quests: {
    questDoDia: {
      titulo: 'Micro-metas para evitar sobrecarga',
      descricao: 'Definir e cumprir 3 micro metas hoje',
      dias: '0/7 dias',
      xp: 150,
      prioridade: 'alta' as const,
      status: 'pendente' as const,
    },
    outras: [
      {
        titulo: 'Prática diária Pomodoro',
        descricao: '',
        dias: '0/7 dias',
        xp: 150,
        prioridade: 'alta' as const,
        status: 'ativa' as const,
      },
      {
        titulo: 'Rotina semanal emocional',
        descricao: '',
        dias: '0/1 dias',
        xp: 150,
        prioridade: 'media' as const,
        status: 'pendente' as const,
      },
    ],
    slots: 1,
  },
  jornada: {
    descricao: 'Aceito experimentar mudanças reais',
    checklist: [
      { texto: '5 quests concluídas', feito: true },
      { texto: '1 desafiadora completa', feito: true },
      { texto: 'Meta 4 ativa (10 conversas)', feito: false },
    ],
    conquistas: [
      { titulo: 'Nova Quest Desbloqueada', descricao: '+150 XP', quando: 'há 3h', deltaXp: '+150 XP' },
      { titulo: '1 Dia de Conversa Seguida', descricao: '', quando: 'hoje', deltaXp: '+75 XP' },
      { titulo: 'Insight Profundo Gerado', descricao: 'Sabotador identificado', quando: 'ontem', deltaXp: '+0 XP' },
    ],
  },
  insights: {
    alerta: {
      titulo: 'Hiper-vigilância detectada',
      descricao: '5 conversas seguidas mencionando preocupação excessiva',
      contador: 7,
    },
    resumo: {
      humorDominante: '😌 Calma (4/7 dias)',
      energiaMedia: 70,
      conversasValidas: 5,
      totalDias: 7,
    },
  },
  resumoSemana: {
    emocoes: [
      { nome: 'Alegria', percentual: 28 },
      { nome: 'Confiança', percentual: 22 },
      { nome: 'Expectativa', percentual: 18 },
      { nome: 'Medo', percentual: 12 },
    ],
    panas: [
      { categoria: 'Positivos', percentual: 65, cor: '#22C55E' },
      { categoria: 'Desafiador', percentual: 30, cor: '#F97316' },
      { categoria: 'Neutro/Calmo', percentual: 5, cor: '#94A3B8' },
    ],
  },
};

const PaginaInicialV12 = () => (
  <div
    className="min-h-screen"
    style={{ backgroundColor: '#F5EBF3' }}
  >
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-24 pt-8">
      <CardMomentoAgora
        nome={mock.usuario.nome}
        nivelAtual={mock.usuario.nivel}
        xpAtual={mock.usuario.xpAtual}
        xpMeta={mock.usuario.xpMeta}
        proximoNivel={mock.usuario.proximoNivel}
        xpRestante={mock.usuario.xpMeta - mock.usuario.xpAtual}
      />

      <CardQuestDesbloqueada
        titulo={mock.questDesbloqueada.titulo}
        descricao={mock.questDesbloqueada.descricao}
        xpRecompensa={mock.questDesbloqueada.xp}
        ultimaConversa={mock.questDesbloqueada.ultimaConversa}
        streakAtual={mock.questDesbloqueada.streak}
        metaStreak={mock.questDesbloqueada.meta}
        onVerQuest={noop}
        onConversar={noop}
      />

      <CardPanorama itens={mock.panorama} onExplorar={noop} />

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2">
        <CardConversas
          streakAtual={mock.conversas.streak}
          recorde={mock.conversas.recorde}
          progressoAtual={mock.conversas.progressoAtual}
          progressoMeta={mock.conversas.progressoMeta}
          dias={mock.conversas.dias}
          beneficios={mock.conversas.beneficios}
          onConversar={noop}
        />
        <CardQuests
          questDoDia={mock.quests.questDoDia}
          outrasQuests={mock.quests.outras}
          slotsDisponiveis={mock.quests.slots}
          onMarcarFeita={noop}
          onExplorar={noop}
        />
      </div>

      <CardJornadaConquistas
        nivelAtual={mock.usuario.nivel}
        xpAtual={mock.usuario.xpAtual}
        xpMeta={mock.usuario.xpMeta}
        descricaoNivel={mock.jornada.descricao}
        checklist={mock.jornada.checklist}
        proximoNivel={mock.usuario.proximoNivel}
        xpRestante={mock.usuario.xpMeta - mock.usuario.xpAtual}
        conquistas={mock.jornada.conquistas}
        onVerHistorico={noop}
      />

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2">
        <CardInsightsPadroes
          alerta={mock.insights.alerta}
          resumo={mock.insights.resumo}
          onVerPadrao={noop}
          onVerAnalise={noop}
        />
        <CardResumoSemana
          emocoes={mock.resumoSemana.emocoes}
          panas={mock.resumoSemana.panas}
          onVerDetalhes={noop}
        />
      </div>
    </div>
  </div>
);

export default PaginaInicialV12;
