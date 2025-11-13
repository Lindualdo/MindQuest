import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

type Quest = {
  titulo: string;
  descricao: string;
  dias: string;
  xp: number;
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'ativa';
};

type Props = {
  questDoDia: Quest;
  outrasQuests: Quest[];
  slotsDisponiveis: number;
  onMarcarFeita?: () => void;
  onExplorar?: () => void;
};

const prioridadeParaCor: Record<Quest['prioridade'], string> = {
  alta: '#D90368',
  media: '#F59E0B',
  baixa: '#0F9D58',
};

const CardQuests = ({
  questDoDia,
  outrasQuests,
  slotsDisponiveis,
  onMarcarFeita,
  onExplorar,
}: Props) => (
  <motion.section
    initial={{ opacity: 0, y: 36 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25 }}
    className="rounded-3xl border p-5 sm:p-6"
    style={{ backgroundColor: '#FFFFFF', borderColor: '#E4E6EF' }}
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase" style={{ color: '#7EBDC2' }}>
          🎯 Quests ativas
        </p>
        <p className="text-base font-semibold" style={{ color: '#1C2541' }}>
          Foque nas missões essenciais
        </p>
      </div>
      <button
        type="button"
        onClick={onExplorar}
        className="inline-flex items-center gap-1 text-sm font-semibold"
        style={{ color: '#3083DC' }}
      >
        Explorar conquistas
        <ChevronRight size={16} />
      </button>
    </div>

    <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: '#E8F3F5' }}>
      <p className="text-xs font-semibold" style={{ color: '#3083DC' }}>
        ⚡ Quest do dia
      </p>
      <h3 className="mt-2 text-lg font-semibold" style={{ color: '#1C2541' }}>
        {questDoDia.titulo}
      </h3>
      <p className="text-sm" style={{ color: '#1C2541' }}>
        {questDoDia.descricao}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ color: '#1C2541' }}>
        <span className="rounded-full px-3 py-1" style={{ backgroundColor: '#FFFFFF' }}>
          +{questDoDia.xp} XP
        </span>
        <span className="rounded-full px-3 py-1" style={{ backgroundColor: '#FFFFFF' }}>
          📅 {questDoDia.dias}
        </span>
        <span
          className="rounded-full px-3 py-1 font-semibold"
          style={{ backgroundColor: '#FFFFFF', color: prioridadeParaCor[questDoDia.prioridade] }}
        >
          {questDoDia.prioridade.toUpperCase()}
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onMarcarFeita}
          className="w-full rounded-full px-4 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: '#D90368' }}
        >
          Marcar feita
        </button>
        <button
          type="button"
          onClick={onExplorar}
          className="w-full rounded-full border px-4 py-3 text-sm font-semibold"
          style={{ borderColor: '#3083DC', color: '#3083DC' }}
        >
          Explorar quest
        </button>
      </div>
    </div>

    <div className="mt-5 space-y-2">
      {outrasQuests.map((quest) => (
        <div
          key={quest.titulo}
          className="rounded-2xl border px-4 py-3"
          style={{ borderColor: '#EAEAEA', color: '#1C2541' }}
        >
          <div className="flex flex-col gap-1 text-sm">
            <p className="font-semibold">{quest.titulo}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              {quest.dias}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span>+{quest.xp} XP</span>
              <span style={{ color: prioridadeParaCor[quest.prioridade] }}>
                {quest.prioridade.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: '#F5EBF3' }}>
      <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1C2541' }}>
        <Sparkles size={16} color="#D90368" /> Slots disponíveis: {slotsDisponiveis}/3
      </p>
      <p className="text-xs" style={{ color: '#6B7280' }}>
        Nova quest será sugerida na próxima conversa
      </p>
    </div>
  </motion.section>
);

export default CardQuests;
