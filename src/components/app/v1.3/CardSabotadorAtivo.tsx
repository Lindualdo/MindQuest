import { ArrowUpRight } from 'lucide-react';
import { getSabotadorById } from '@/data/sabotadoresCatalogo';

type Props = {
  sabotadorId?: string | null;
  nome?: string | null;
  emoji?: string | null;
  descricao?: string | null;
  onSaberMais?: () => void;
};

const CardSabotadorAtivo = ({ sabotadorId, nome, emoji, descricao, onSaberMais }: Props) => {
  const catalogEntry = sabotadorId ? getSabotadorById(sabotadorId) : undefined;

  const titulo = nome?.trim() || catalogEntry?.nome || 'Nenhum sabotador em destaque';
  const iconeEmoji = emoji ?? catalogEntry?.emoji ?? null;
  const descricaoProp = descricao?.trim();
  const detalhes =
    catalogEntry?.resumo ||
    catalogEntry?.descricao ||
    descricaoProp ||
    'Continue conversando para detectar padrões e sabotadores ativos.';

  return (
    <section className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-4 shadow-md" style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}>
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#2F76D1]">
        Meu sabotador - Padrão mental
      </p>
      <div className="mt-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-4 py-4">
        <h3 className="flex items-center gap-2 text-[0.95rem] font-semibold text-[#111827]">
          {iconeEmoji && <span>{iconeEmoji}</span>}
          <span>{titulo}</span>
        </h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-[#4B5563] line-clamp-2">
          {detalhes}
        </p>
      </div>
      {onSaberMais && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onSaberMais}
            className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#2563EB] underline-offset-2 hover:underline"
          >
            Saber mais
            <ArrowUpRight size={12} />
          </button>
        </div>
      )}
    </section>
  );
};

export default CardSabotadorAtivo;
