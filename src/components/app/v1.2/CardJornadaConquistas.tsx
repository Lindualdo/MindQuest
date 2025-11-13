import { motion } from 'framer-motion';
import { Trophy, Check, ChevronRight } from 'lucide-react';

type ChecklistItem = {
  texto: string;
  feito: boolean;
};

type Conquista = {
  titulo: string;
  descricao: string;
  quando: string;
  deltaXp: string;
};

type Props = {
  nivelAtual: string;
  xpAtual: number;
  xpMeta: number;
  descricaoNivel: string;
  checklist: ChecklistItem[];
  proximoNivel: string;
  xpRestante: number;
  conquistas: Conquista[];
  onVerHistorico?: () => void;
};

const CardJornadaConquistas = ({
  nivelAtual,
  xpAtual,
  xpMeta,
  descricaoNivel,
  checklist,
  proximoNivel,
  xpRestante,
  conquistas,
  onVerHistorico,
}: Props) => {
  const progresso = Math.min(100, Math.round((xpAtual / xpMeta) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-3xl border p-5 sm:p-6"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E4E6EF' }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase" style={{ color: '#7EBDC2' }}>
            🏆 Jornada & conquistas
          </p>
          <p className="text-base font-semibold" style={{ color: '#1C2541' }}>
            Tudo o que já virou evolução
          </p>
        </div>
        <button
          type="button"
          onClick={onVerHistorico}
          className="inline-flex items-center gap-1 text-sm font-semibold"
          style={{ color: '#3083DC' }}
        >
          Explorar histórico
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: '#E8F3F5' }}>
        <div className="flex items-center gap-3">
          <span className="rounded-2xl p-3" style={{ backgroundColor: '#FFFFFF', color: '#3083DC' }}>
            <Trophy size={26} />
          </span>
          <div>
            <p className="text-xs font-semibold" style={{ color: '#3083DC' }}>
              Nível atual
            </p>
            <p className="text-lg font-semibold" style={{ color: '#1C2541' }}>
              {nivelAtual}
            </p>
            <p className="text-sm" style={{ color: '#1C2541' }}>
              “{descricaoNivel}”
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold" style={{ color: '#1C2541' }}>
            <span>{xpAtual} XP</span>
            <span>{xpMeta} XP</span>
          </div>
          <div className="h-2 rounded-full" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="h-full rounded-full" style={{ width: `${progresso}%`, backgroundColor: '#3083DC' }} />
          </div>
          <div className="space-y-1">
            {checklist.map((item) => (
              <p key={item.texto} className="flex items-center gap-2 text-sm" style={{ color: '#1C2541' }}>
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full border"
                  style={{
                    borderColor: item.feito ? '#4ADE80' : '#C9CFD6',
                    backgroundColor: item.feito ? '#4ADE80' : '#FFFFFF',
                    color: item.feito ? '#FFFFFF' : '#6B7280',
                  }}
                >
                  <Check size={14} />
                </span>
                {item.texto}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl p-4" style={{ backgroundColor: '#F5EBF3' }}>
        <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
          🎯 Próximo nível: {proximoNivel}
        </p>
        <p className="text-sm" style={{ color: '#1C2541' }}>
          Faltam {xpRestante} XP (≈ 5 dias conversando)
        </p>
      </div>

      <div className="mt-5 space-y-2">
        {conquistas.map((conquista) => (
          <div
            key={conquista.titulo}
            className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm"
            style={{ borderColor: '#EAEAEA', color: '#1C2541' }}
          >
            <div>
              <p className="font-semibold">{conquista.titulo}</p>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                {conquista.descricao}
              </p>
            </div>
            <div className="text-right text-xs" style={{ color: '#6B7280' }}>
              <p>{conquista.quando}</p>
              <p className="font-semibold" style={{ color: '#D90368' }}>
                {conquista.deltaXp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default CardJornadaConquistas;
