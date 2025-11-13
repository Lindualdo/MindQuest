import { motion } from 'framer-motion';

type Emocao = {
  nome: string;
  percentual: number;
};

type PanasItem = {
  categoria: string;
  percentual: number;
  cor: string;
};

type Props = {
  emocoes: Emocao[];
  panas: PanasItem[];
  onVerDetalhes?: () => void;
};

const CardResumoSemana = ({ emocoes, panas, onVerDetalhes }: Props) => (
  <motion.section
    initial={{ opacity: 0, y: 48 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="rounded-3xl border p-5 sm:p-6"
    style={{ backgroundColor: '#FFFFFF', borderColor: '#E4E6EF' }}
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase" style={{ color: '#7EBDC2' }}>
          🌈 Resumo emocional
        </p>
        <p className="text-base font-semibold" style={{ color: '#1C2541' }}>
          Últimos 7 dias
        </p>
      </div>
      <button
        type="button"
        onClick={onVerDetalhes}
        className="text-sm font-semibold"
        style={{ color: '#3083DC' }}
      >
        Ver detalhes
      </button>
    </div>

    <div className="mt-5 space-y-4">
      <div className="rounded-2xl p-4" style={{ backgroundColor: '#F5EBF3' }}>
        <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
          Emoções dominantes
        </p>
        <div className="mt-3 space-y-2">
          {emocoes.map((emocao) => (
            <div key={emocao.nome} className="flex items-center justify-between text-sm" style={{ color: '#1C2541' }}>
              <span>{emocao.nome}</span>
              <span>{emocao.percentual}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ backgroundColor: '#E8F3F5' }}>
        <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
          Afetos PANAS
        </p>
        <div className="mt-3 space-y-2 text-sm" style={{ color: '#1C2541' }}>
          {panas.map((item) => (
            <div key={item.categoria} className="flex items-center justify-between">
              <span>{item.categoria}</span>
              <span style={{ color: item.cor }}>{item.percentual}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.section>
);

export default CardResumoSemana;
