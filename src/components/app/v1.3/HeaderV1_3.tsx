import { RefreshCw, Settings, ChevronLeft } from 'lucide-react';
import mindquestLogo from '@/img/logo_redonda_small.png';
import { useDashboard } from '@/store/useStore';

type Props = {
  nomeUsuario: string;
  onRefresh?: () => void;
  onBack?: () => void;
  backLabel?: string;
};

const HeaderV1_3 = ({ nomeUsuario, onRefresh, onBack, backLabel = 'Voltar' }: Props) => {
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
        <div className="flex min-w-[100px] items-center gap-2 text-[var(--mq-text)]">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-0.5 text-[var(--mq-primary)] hover:opacity-70 transition-opacity"
            >
              <ChevronLeft size={24} />
              <span className="text-sm font-medium">{backLabel}</span>
            </button>
          ) : (
            <>
              <img src={mindquestLogo} alt="MindQuest" className="h-10 w-auto" />
              <p className="hidden text-sm font-semibold tracking-tight text-[var(--mq-accent)] xs:block">MindQuest</p>
            </>
          )}
        </div>

        <p className="flex-1 truncate text-center text-[0.78rem] font-semibold text-[var(--mq-text)] sm:text-sm">
          Olá, {nomeUsuario}! <span aria-hidden="true">👋</span>
        </p>

        <div className="flex min-w-[100px] items-center justify-end gap-2">
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

