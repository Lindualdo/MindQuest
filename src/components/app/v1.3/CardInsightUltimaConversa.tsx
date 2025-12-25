import { ArrowUpRight, Flame } from 'lucide-react';
import type { InsightCardData } from '@/types/emotions';

type Props = {
  data?: InsightCardData | null;
  loading?: boolean;
  onSaberMais?: (insightId: string | null) => void;
  onHistorico?: () => void;
};

const fallbackInsight: InsightCardData = {
  insight_id: null,
  titulo: 'Gerenciar o peso emocional da urgência financeira',
  descricao:
    'Aldo vive pressão intensa para gerar renda e sente desgaste emocional acumulado. Sugira micro-pausas de respiração antes das decisões financeiras críticas.',
  prioridade: 'alta',
  categoria: 'emocional',
  tipo: 'alerta',
  chat_id: null,
  data_conversa: null,
  data_label: null,
};

const CardInsightUltimaConversa = ({ data, loading, onSaberMais, onHistorico }: Props) => {
  const insight = data ?? fallbackInsight;
  const title = loading ? 'Carregando insight...' : insight.titulo;
  const description = loading
    ? 'Estamos analisando a última conversa para trazer um insight acionável.'
    : insight.descricao || fallbackInsight.descricao;

  return (
    <section className="mq-card rounded-2xl px-4 py-4" style={{ borderRadius: 24 }}>
      <div className="flex items-center justify-between">
        <p className="mq-eyebrow">
          Insight da última conversa
        </p>
        {onHistorico && (
          <button
            type="button"
            onClick={onHistorico}
            className="text-[0.65rem] font-medium text-[var(--mq-primary)] hover:underline"
          >
            Histórico &gt;
          </button>
        )}
      </div>
      <div className="mt-3 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-4">
        <h3 className="text-[0.95rem] font-semibold text-[var(--mq-text)]">
          {title}
        </h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-[var(--mq-text-muted)] line-clamp-2">
          {description}
        </p>
      </div>
      {onSaberMais && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => onSaberMais(insight?.insight_id ?? null)}
            className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[var(--mq-primary)] underline-offset-2 hover:underline disabled:opacity-50"
            disabled={loading}
          >
            Saber mais
            <ArrowUpRight size={12} />
          </button>
        </div>
      )}
    </section>
  );
};

export default CardInsightUltimaConversa;
