import { RefreshCw } from 'lucide-react';
import mindquestLogo from '@/img/mindquest_logo_vazado_small.png';

type Props = {
  nomeUsuario: string;
  onRefresh?: () => void;
};

const HeaderV1_2 = ({ nomeUsuario, onRefresh }: Props) => (
  <header
    className="sticky top-0 z-40 border-b"
    style={{ backgroundColor: '#E8F3F5', borderColor: 'rgba(28,37,65,0.08)' }}
  >
    <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-2 px-4 py-2">
      <div className="flex items-center gap-2 text-[#1C2541]">
        <img src={mindquestLogo} alt="MindQuest" className="h-10 w-auto" />
        <p className="text-sm font-semibold tracking-tight" style={{ color: '#D90368' }}>MindQuest</p>
      </div>
      <p className="flex-1 text-center text-[0.78rem] font-semibold text-[#1C2541] sm:text-sm">
        Olá, {nomeUsuario}! <span aria-hidden="true">👋</span>
      </p>
      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex items-center justify-center rounded-full border border-[#1C2541]/10 p-1.5 sm:p-2 text-[#1C2541]"
        aria-label="Atualizar"
      >
        <RefreshCw size={16} />
      </button>
    </div>
  </header>
);

export default HeaderV1_2;
