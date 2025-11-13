import { motion } from 'framer-motion';
import { AlertTriangle, Activity } from 'lucide-react';

type Alerta = {
  titulo: string;
  descricao: string;
  contador: number;
};

type ResumoSemana = {
  humorDominante: string;
  energiaMedia: number;
  conversasValidas: number;
  totalDias: number;
};

type Props = {
  alerta: Alerta;
  resumo: ResumoSemana;
  onVerPadrao?: () => void;
  onVerAnalise?: () => void;
};

const CardInsightsPadroes = ({ alerta, resumo, onVerPadrao, onVerAnalise }: Props) => (
  <motion.section
    initial={{ opacity: 0, y: 44 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
    className="rounded-3xl border p-5 sm:p-6"
    style={{ backgroundColor: '#FFFFFF', borderColor: '#E4E6EF' }}
  >
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
          🧠 Insights & padrões
        </p>
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: '#FFE4E6', color: '#D90368' }}>
          {alerta.contador} alertas
        </span>
      </div>
      <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFEDE5' }}>
        <div className="flex items-start gap-3">
          <AlertTriangle size={24} color="#F59E0B" />
          <div className="space-y-1">
            <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
              {alerta.titulo}
            </p>
            <p className="text-sm" style={{ color: '#1C2541' }}>
              {alerta.descricao}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onVerPadrao}
          className="mt-3 text-sm font-semibold"
          style={{ color: '#3083DC' }}
        >
          Explorar alerta
        </button>
      </div>
      <div className="rounded-2xl p-4" style={{ backgroundColor: '#E8F3F5' }}>
        <div className="flex items-center gap-3">
          <Activity size={24} color="#7EBDC2" />
          <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
            Resumo da semana
          </p>
        </div>
        <div className="mt-3 grid gap-2 text-sm" style={{ color: '#1C2541' }}>
          <p>Humor dominante: {resumo.humorDominante}</p>
          <p>Energia média: {resumo.energiaMedia}%</p>
          <p>Conversas válidas: {resumo.conversasValidas}/{resumo.totalDias}</p>
        </div>
        <button
          type="button"
          onClick={onVerAnalise}
          className="mt-3 text-sm font-semibold"
          style={{ color: '#3083DC' }}
        >
          Ver análise completa
        </button>
      </div>
    </div>
  </motion.section>
);

export default CardInsightsPadroes;
