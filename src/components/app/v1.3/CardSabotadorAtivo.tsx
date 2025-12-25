import { ArrowUpRight } from 'lucide-react';
import { getSabotadorById } from '@/data/sabotadoresCatalogo';
import { IconRenderer } from '@/utils/iconMap';

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
    <section className="mq-card rounded-2xl px-4 py-4" style={{ borderRadius: 24 }}>
      <p className="mq-eyebrow">
        Meu sabotador - Padrão mental
      </p>
      <div className="mt-3 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-4">
        <h3 className="flex items-center gap-2 text-[0.95rem] font-semibold text-[var(--mq-text)]">
          {iconeEmoji && <IconRenderer name={iconeEmoji} size={20} className="text-[var(--mq-primary)]" />}
          <span>{titulo}</span>
        </h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-[var(--mq-text-muted)] line-clamp-2">
          {detalhes}
        </p>
      </div>
      {onSaberMais && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onSaberMais}
            className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[var(--mq-primary)] underline-offset-2 hover:underline"
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
