import { RefreshCw } from 'lucide-react';
import FraseTransformacao from '@/components/app/v1.2/FraseTransformacao';
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-1.5 px-4 py-1.5">
      <div className="flex w-full flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-1 items-center gap-2.5 text-[#1C2541]">
          <img src={mindquestLogo} alt="MindQuest" className="h-9 w-auto" />
          <div className="flex flex-wrap items-center gap-1 leading-tight">
            <p className="text-sm font-semibold tracking-tight" style={{ color: '#D90368' }}>MindQuest</p>
            <span className="text-xs font-medium tracking-tight text-[#1C2541] opacity-80">
              mente clara, resultados reais
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[#1C2541]">
          <p className="text-[0.72rem] font-semibold sm:text-sm" style={{ color: '#1C2541' }}>
            Olá, {nomeUsuario}! <span aria-hidden="true">👋</span>
          </p>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center rounded-full border border-[#1C2541]/10 p-1.5 sm:p-2"
            aria-label="Atualizar"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <FraseTransformacao />
      </div>
    </div>
  </header>
);

export default HeaderV1_2;
