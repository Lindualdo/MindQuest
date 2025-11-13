import { Menu, RefreshCw } from 'lucide-react';
import mindquestLogo from '@/img/mindquest_logo_vazado_small.png';

type Props = {
  onRefresh?: () => void;
};

const HeaderV1_2 = ({ onRefresh }: Props) => (
  <header
    className="sticky top-0 z-40 border-b"
    style={{ backgroundColor: '#E8F3F5', borderColor: 'rgba(28,37,65,0.08)' }}
  >
    <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-2.5 px-4 py-2">
      <div className="flex items-center gap-2.5">
        <img src={mindquestLogo} alt="MindQuest" className="h-8 w-auto" />
        <div className="leading-tight">
          <p className="text-[13px] font-semibold" style={{ color: '#D90368' }}>MindQuest</p>
          <p className="text-[10px] font-medium tracking-tight" style={{ color: '#1C2541' }}>
            mente clara, resultados reais
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[#1C2541]">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center justify-center p-2"
          aria-label="Atualizar"
        >
          <RefreshCw size={16} />
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center p-2"
          aria-label="Menu"
        >
          <Menu size={16} />
        </button>
      </div>
    </div>
  </header>
);

export default HeaderV1_2;
