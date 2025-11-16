import { Home, Settings, Target, User } from 'lucide-react';

type TabId = 'home' | 'perfil' | 'quests' | 'config';

type Props = {
  active: TabId;
  onHome: () => void;
  onPerfil: () => void;
  onQuests: () => void;
  onConfig: () => void;
};

const BottomNavV1_3 = ({
  active,
  onHome,
  onPerfil,
  onQuests,
  onConfig,
}: Props) => {
  const baseItemClasses =
    'flex flex-col items-center gap-0.5 flex-1 text-[0.7rem] font-medium';

  const getColor = (tab: TabId) =>
    active === tab ? '#D90368' : '#1C2541';

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/50 bg-[#F5EBF3]/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-md items-center justify-between px-6 py-2">
        <button
          type="button"
          onClick={onHome}
          className={baseItemClasses}
          style={{ color: getColor('home') }}
        >
          <Home size={18} />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={onPerfil}
          className={baseItemClasses}
          style={{ color: getColor('perfil') }}
        >
          <User size={18} />
          <span>Perfil</span>
        </button>
        <button
          type="button"
          onClick={onQuests}
          className={baseItemClasses}
          style={{ color: getColor('quests') }}
        >
          <Target size={18} />
          <span>Quests</span>
        </button>
        <button
          type="button"
          onClick={onConfig}
          className={baseItemClasses}
          style={{ color: getColor('config') }}
        >
          <Settings size={18} />
          <span>Config</span>
        </button>
      </div>
    </nav>
  );
};

export type { TabId };
export default BottomNavV1_3;

