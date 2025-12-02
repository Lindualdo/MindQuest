import { RefreshCw, Settings } from 'lucide-react';
import mindquestLogo from '@/img/mindquest_logo_vazado_small.png';
import { useDashboard } from '@/store/useStore';

type Props = {
  nomeUsuario: string;
  onRefresh?: () => void;
};

const HeaderV1_3 = ({ nomeUsuario, onRefresh }: Props) => {
  const { setView, refreshData } = useDashboard();

  const handleSettings = () => {
    setView('ajustes');
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      await refreshData();
    }
  };

  return (
  <header
    className="sticky top-0 z-40 border-b border-[var(--mq-border-subtle)] bg-[var(--mq-surface)]"
  >
    <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-2 px-4 py-2">
      <div className="flex items-center gap-2 text-[var(--mq-text)]">
        <img src={mindquestLogo} alt="MindQuest" className="h-10 w-auto" />
        <p className="text-sm font-semibold tracking-tight text-[var(--mq-accent)]">MindQuest</p>
      </div>
      <p className="flex-1 text-center text-[0.78rem] font-semibold text-[var(--mq-text)] sm:text-sm">
        Olá, {nomeUsuario}! <span aria-hidden="true">👋</span>
      </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSettings}
            className="inline-flex items-center justify-center p-1 text-[var(--mq-text)] hover:opacity-70 transition-opacity"
            aria-label="Ajustes"
          >
            <Settings size={22} />
          </button>
      <button
        type="button"
        onClick={handleRefresh}
            className="inline-flex items-center justify-center p-1 text-[var(--mq-text)] hover:opacity-70 transition-opacity"
        aria-label="Atualizar"
      >
        <RefreshCw size={22} />
      </button>
        </div>
    </div>
  </header>
);
};

export default HeaderV1_3;

