type InsightResumo = {
  titulo: string;
  descricao: string;
};

type Props = {
  insight?: InsightResumo;
  onExplorarInsights?: () => void;
};

const mockInsight: InsightResumo = {
  titulo: 'Gerenciar o peso emocional da urgência financeira 🔥',
  descricao:
    'Aldo vive pressão intensa para gerar renda e sente desgaste emocional acumulado. Sugira micro-pausas de respiração antes das decisões financeiras críticas.',
};

const CardInsightUltimaConversa = ({ insight = mockInsight, onExplorarInsights }: Props) => (
  <section
    className="rounded-2xl bg-white px-4 py-4 shadow-md"
    style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
  >
    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#2F76D1]">
      Insight da última conversa
    </p>
    <div className="mt-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-4 py-4">
      <h3 className="text-[0.95rem] font-semibold text-[#111827]">
        {insight.titulo}
      </h3>
      <p className="mt-2 text-[0.82rem] leading-relaxed text-[#4B5563]">
        {insight.descricao}
      </p>
    </div>
    {onExplorarInsights && (
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onExplorarInsights}
          className="text-[0.8rem] font-semibold text-[#2563EB]"
        >
          Explorar Insights →
        </button>
      </div>
    )}
  </section>
);

export default CardInsightUltimaConversa;
