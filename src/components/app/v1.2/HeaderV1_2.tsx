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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 px-4 py-2">
      <div className="flex w-full items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <img src={mindquestLogo} alt="MindQuest" className="h-10 w-auto" />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight" style={{ color: '#D90368' }}>MindQuest</p>
            <p className="text-xs font-medium tracking-tight" style={{ color: '#1C2541' }}>
              mente clara, resultados reais
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#1C2541]">
          <p className="text-[0.75rem] sm:text-sm font-semibold" style={{ color: '#1C2541' }}>
            Olá, {nomeUsuario}! <span aria-hidden="true">👋</span>
          </p>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center p-2"
            aria-label="Atualizar"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      <FraseTransformacao />
    </div>
  </header>
);

export default HeaderV1_2;
