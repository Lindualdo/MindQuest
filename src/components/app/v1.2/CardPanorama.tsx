import { motion } from 'framer-motion';

type PanoramaItem = {
  titulo: string;
  valor: string;
  descricao: string;
  tag: string;
  estado: 'positivo' | 'alerta' | 'neutro';
};

type Props = {
  itens: PanoramaItem[];
  onExplorar?: () => void;
};

const estadoParaCores: Record<PanoramaItem['estado'], { bg: string; tag: string }> = {
  positivo: { bg: '#F5EBF3', tag: '#3083DC' },
  alerta: { bg: '#FFEDE5', tag: '#D90368' },
  neutro: { bg: '#E8F3F5', tag: '#7EBDC2' },
};

const CardPanorama = ({ itens, onExplorar }: Props) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    className="rounded-3xl border p-5 sm:p-6"
    style={{ backgroundColor: '#FFFFFF', borderColor: '#E4E6EF' }}
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7EBDC2' }}>
          📊 Seu panorama agora
        </p>
        <p className="text-base font-semibold" style={{ color: '#1C2541' }}>
          Humor, energia e sabotador dominante
        </p>
      </div>
      <button
        type="button"
        onClick={onExplorar}
        className="text-sm font-semibold"
        style={{ color: '#3083DC' }}
      >
        Explorar padrões
      </button>
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {itens.map((item) => {
        const cores = estadoParaCores[item.estado];
        return (
          <div
            key={item.titulo}
            className="rounded-2xl p-4"
            style={{ backgroundColor: cores.bg }}
          >
            <p className="text-2xl font-semibold" style={{ color: '#1C2541' }}>
              {item.valor}
            </p>
            <p className="text-sm" style={{ color: '#1C2541' }}>
              {item.titulo}
            </p>
            <p className="text-xs" style={{ color: '#546070' }}>
              {item.descricao}
            </p>
            <span
              className="mt-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ backgroundColor: '#FFFFFF', color: cores.tag }}
            >
              {item.tag}
            </span>
          </div>
        );
      })}
    </div>
  </motion.section>
);

export default CardPanorama;
