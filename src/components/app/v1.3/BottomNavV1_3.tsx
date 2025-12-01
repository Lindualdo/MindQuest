import { MessageCircle, Brain, Zap, TrendingUp } from 'lucide-react';

type TabId = 'conversar' | 'entender' | 'agir' | 'evoluir';

type Props = {
  active: TabId;
  onConversar: () => void;
  onEntender: () => void;
  onAgir: () => void;
  onEvoluir: () => void;
};

const BottomNavV1_3 = ({
  active,
  onConversar,
  onEntender,
  onAgir,
  onEvoluir,
}: Props) => {
  const baseItemClasses =
    'flex flex-col items-center gap-0.5 flex-1 text-[0.7rem] font-medium';

  const getColor = (tab: TabId) =>
    active === tab ? 'var(--mq-accent)' : 'var(--mq-text)';

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/50 bg-[var(--mq-bg)]/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-md items-center justify-between px-6 py-2">
        <button
          type="button"
          onClick={onConversar}
          className={baseItemClasses}
          style={{ color: getColor('conversar') }}
        >
          <MessageCircle size={18} />
          <span>Conversar</span>
        </button>
        <button
          type="button"
          onClick={onEntender}
          className={baseItemClasses}
          style={{ color: getColor('entender') }}
        >
          <Brain size={18} />
          <span>Entender</span>
        </button>
        <button
          type="button"
          onClick={onAgir}
          className={baseItemClasses}
          style={{ color: getColor('agir') }}
        >
          <Zap size={18} />
          <span>Agir</span>
        </button>
        <button
          type="button"
          onClick={onEvoluir}
          className={baseItemClasses}
          style={{ color: getColor('evoluir') }}
        >
          <TrendingUp size={18} />
          <span>Evoluir</span>
        </button>
      </div>
    </nav>
  );
};

export type { TabId };
export default BottomNavV1_3;

