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
    'flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[56px] text-[0.75rem] font-semibold transition-colors';

  const getColor = (tab: TabId) =>
    active === tab ? 'var(--mq-accent)' : 'var(--mq-text)';

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--mq-border)] bg-[var(--mq-bg)]/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-4 py-1.5">
        <button
          type="button"
          onClick={onConversar}
          className={baseItemClasses}
          style={{ color: getColor('conversar') }}
        >
          <MessageCircle size={24} strokeWidth={active === 'conversar' ? 2.5 : 2} />
          <span>Conversar</span>
        </button>
        <button
          type="button"
          onClick={onEntender}
          className={baseItemClasses}
          style={{ color: getColor('entender') }}
        >
          <Brain size={24} strokeWidth={active === 'entender' ? 2.5 : 2} />
          <span>Entender</span>
        </button>
        <button
          type="button"
          onClick={onAgir}
          className={baseItemClasses}
          style={{ color: getColor('agir') }}
        >
          <Zap size={24} strokeWidth={active === 'agir' ? 2.5 : 2} />
          <span>Agir</span>
        </button>
        <button
          type="button"
          onClick={onEvoluir}
          className={baseItemClasses}
          style={{ color: getColor('evoluir') }}
        >
          <TrendingUp size={24} strokeWidth={active === 'evoluir' ? 2.5 : 2} />
          <span>Evoluir</span>
        </button>
      </div>
    </nav>
  );
};

export type { TabId };
export default BottomNavV1_3;

