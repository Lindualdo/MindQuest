import { motion } from 'framer-motion';
import { Sparkles, Target, CheckCircle2 } from 'lucide-react';

type Props = {
  titulo: string;
  descricao: string | null;
  progressoAtual: number;
  progressoMeta: number;
  xpRecompensa: number;
  beneficios: string[];
  prioridade?: string | null;
  recorrencia?: string | null;
  ultimaAtualizacaoLabel?: string | null;
  status?: string | null;
  onAbrirPainel?: () => void;
};

const CardQuestAtiva = ({
  titulo,
  descricao,
  progressoAtual,
  progressoMeta,
  xpRecompensa,
  beneficios,
  prioridade,
  recorrencia,
  ultimaAtualizacaoLabel,
  status,
  onAbrirPainel,
}: Props) => {
  const meta = Math.max(progressoMeta, 1);
  const atual = Math.min(progressoAtual, meta);
  const percentual = Math.min(100, Math.round((atual / meta) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="mq-card-v1_2 p-5"
      style={{
        backgroundColor: '#F0FAF6',
        borderColor: 'rgba(126,189,194,0.2)',
        boxShadow: '0 8px 16px rgba(126,189,194,0.08)',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className="mq-eyebrow-v1_2 inline-flex items-center gap-1 rounded-full px-4 py-1 uppercase"
          style={{ backgroundColor: '#FFFFFF', color: '#7EBDC2', boxShadow: '0 4px 12px rgba(126,189,194,0.18)' }}
        >
          <Sparkles size={14} color="#D90368" />
          Quest ativa
        </div>
        {status && (
          <span className="text-[0.7rem] font-semibold uppercase tracking-wide" style={{ color: '#7EBDC2' }}>
            {status}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl border-2"
            style={{ borderColor: '#7EBDC2', backgroundColor: '#FFFFFF', color: '#7EBDC2', boxShadow: '0 6px 14px rgba(126,189,194,0.18)' }}
          >
            <Target size={18} />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="mq-card-heading-v1_2 text-[0.95rem]">{titulo}</h3>
            {descricao && (
              <p className="mq-card-meta-v1_2 text-[0.8rem]" style={{ color: '#4F5779' }}>
                {descricao}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="mq-bar-track-v1_2" style={{ backgroundColor: 'rgba(126,189,194,0.25)' }}>
            <div
              className="mq-bar-fill-v1_2"
              style={{ width: `${percentual}%`, backgroundColor: '#7EBDC2' }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[0.75rem] font-medium" style={{ color: '#1C2541' }}>
            <span>
              {atual}/{meta} passos
            </span>
            <span>{percentual}%</span>
          </div>
          {recorrencia && (
            <p className="mq-card-meta-v1_2 mt-0.5 text-[0.7rem]">
              Recorrência: {recorrencia}
            </p>
          )}
          {ultimaAtualizacaoLabel && (
            <p className="mq-card-meta-v1_2 text-[0.7rem]">
              Atualizado {ultimaAtualizacaoLabel}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-[#F8D7DA] bg-[#FFF3F5] px-4 py-3">
          <div className="flex items-center gap-2 text-[0.8rem] font-semibold text-[#D6336C]">
            <CheckCircle2 size={16} />
            Recompensas da próxima conclusão
          </div>
          <ul className="mt-2 space-y-1 pl-4 text-[0.75rem]" style={{ color: '#1C2541' }}>
            <li>+{xpRecompensa} XP bônus</li>
            {beneficios.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onAbrirPainel}
          className="mq-link-inline-v1_2 text-[0.75rem] sm:text-[0.85rem]"
        >
          Abrir painel de quests <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.section>
  );
};

export default CardQuestAtiva;
