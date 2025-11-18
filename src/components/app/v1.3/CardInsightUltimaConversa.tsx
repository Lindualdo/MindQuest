import { ArrowUpRight } from 'lucide-react';
import type { InsightCardData } from '@/types/emotions';

type Props = {
  data?: InsightCardData | null;
  loading?: boolean;
  onSaberMais?: (insightId: string | null) => void;
};

const fallbackInsight: InsightCardData = {
  insight_id: null,
  titulo: 'Gerenciar o peso emocional da urgência financeira 🔥',
  descricao:
    'Aldo vive pressão intensa para gerar renda e sente desgaste emocional acumulado. Sugira micro-pausas de respiração antes das decisões financeiras críticas.',
  prioridade: 'alta',
  categoria: 'emocional',
  tipo: 'alerta',
  chat_id: null,
  data_conversa: null,
  data_label: null,
};

const CardInsightUltimaConversa = ({ data, loading, onSaberMais }: Props) => {
  const insight = data ?? fallbackInsight;
  const title = loading ? 'Carregando insight...' : insight.titulo;
  const description = loading
    ? 'Estamos analisando a última conversa para trazer um insight acionável.'
    : insight.descricao || fallbackInsight.descricao;

  return (
    <section
      className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-4 shadow-md"
      style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
    >
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#2F76D1]">
        Insight da última conversa
      </p>
      <div className="mt-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-4 py-4">
        <h3 className="text-[0.95rem] font-semibold text-[#111827]">
          {title}
        </h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-[#4B5563] line-clamp-2">
          {description}
        </p>
      </div>
      {onSaberMais && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => onSaberMais(insight?.insight_id ?? null)}
            className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#2563EB] underline-offset-2 hover:underline disabled:opacity-50"
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
