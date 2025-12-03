import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Info, Brain } from 'lucide-react';
import { getPerfilById } from '@/data/bigFiveCatalogo';
import type { TracoOrdenado } from '@/types/emotions';

export interface PerfilBigFiveRankingItem {
  traco_id: string;
  nome_pt: string;
  score: number; // 0-100
}

type Props = {
  tracos: TracoOrdenado[];
  tracoAtualId?: string | null;
  onBarClick?: (tracoId: string) => void;
  loading?: boolean;
};

// Mapeamento de nomes antigos para novos
const mapearNomeTraco = (nomeOriginal: string): string => {
  const mapeamento: Record<string, string> = {
    'Conscienciosidade': 'Disciplina',
    'Abertura à Experiência': 'Curiosidade',
    'Abertura': 'Curiosidade',
    'Neuroticismo': 'Instabilidade',
    'Amabilidade': 'Gentileza',
    'Extroversão': 'Sociabilidade',
  };
  return mapeamento[nomeOriginal] || nomeOriginal;
};

// Mock com traços para visualização
const mockTracosRanking: PerfilBigFiveRankingItem[] = [
  { traco_id: 'conscientiousness', nome_pt: 'Disciplina', score: 84 },
  { traco_id: 'openness', nome_pt: 'Curiosidade', score: 69 },
  { traco_id: 'neuroticism', nome_pt: 'Instabilidade', score: 66 },
];

const CardPerfilBigFiveRanking = ({ tracos, tracoAtualId, onBarClick, loading }: Props) => {
  const [showInfo, setShowInfo] = useState(false);

  // Processar traços e ordenar do maior para menor
  const tracosRankeados = useMemo(() => {
    const dados = tracos.length > 0 
      ? tracos.map(t => ({
          traco_id: t.nome,
          nome_pt: mapearNomeTraco(t.nome_pt),
          score: Math.round(t.score),
        }))
      : mockTracosRanking;

    return dados
      .sort((a, b) => b.score - a.score) // Ordenar por score (maior para menor)
      .slice(0, 3); // Top 3 apenas
  }, [tracos]);

  // Calcular valor máximo para escala do eixo Y (sempre 100 para percentual)
  const maxScore = 100;

  // Gerar marcadores do eixo Y (0, 20, 40, 60, 80, 100)
  const yAxisMarkers = useMemo(() => {
    return [100, 80, 60, 40, 20, 0];
  }, []);

  // Determinar qual é o maior (primeiro da lista ordenada)
  const maiorScoreId = tracosRankeados[0]?.traco_id || null;

  return (
    <section className="mq-card rounded-2xl px-4 py-4" style={{ borderRadius: 24 }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--mq-text)]">Padrões de comportamento</h3>
          <p className="mq-eyebrow mt-1">Seus traços de personalidade</p>
        </div>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="p-1.5 rounded-full bg-[var(--mq-card)] text-[var(--mq-primary)] hover:bg-[var(--mq-card)] transition-colors"
        >
          <Info size={16} />
        </button>
      </div>

      {/* Info expandível */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 rounded-xl bg-[var(--mq-card)] p-3 text-xs text-[var(--mq-text-muted)]"
        >
          <p className="font-semibold mb-1">O que é o Big Five?</p>
          <p>
            Modelo de personalidade baseado em 5 dimensões fundamentais que influenciam seu comportamento e preferências. 
            Cada traço varia de 0 a 100, mostrando sua intensidade em cada dimensão.
          </p>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-3 flex items-end justify-between gap-2 h-44">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 animate-pulse">
              <div 
                className="bg-[var(--mq-border)] rounded-t-md" 
                style={{ height: `${20 + Math.random() * 80}%` }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Gráfico de Barras/Colunas */}
      {!loading && (
        <div className="mt-4">
          <div className="flex">
            {/* Eixo Y - Labels */}
            <div className="flex flex-col justify-between pr-2 text-right" style={{ height: 160 }}>
              {yAxisMarkers.map((value) => (
                <span key={value} className="text-[0.6rem] text-[var(--mq-text-subtle)] leading-none">
                  {value}
                </span>
              ))}
            </div>

            {/* Área do gráfico */}
            <div className="flex-1 relative">
              {/* Grid lines horizontais */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {yAxisMarkers.map((value) => (
                  <div 
                    key={value} 
                    className="border-b border-dashed border-[var(--mq-border)] opacity-30" 
                  />
                ))}
              </div>

              {/* Barras */}
              <div className="flex items-end justify-between gap-1 relative" style={{ height: 160 }}>
                {tracosRankeados.map((traco, index) => {
                  const isMaior = traco.traco_id === maiorScoreId;
                  const isAtual = traco.traco_id === tracoAtualId;
                  const barHeight = Math.max(4, (traco.score / maxScore) * 100);
                  const catalogInfo = getPerfilById(traco.traco_id);

                  return (
                    <motion.button
                      key={traco.traco_id}
                      type="button"
                      onClick={() => onBarClick?.(traco.traco_id)}
                      className={`flex-1 cursor-pointer group relative`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
                      style={{ transformOrigin: 'bottom', height: '100%' }}
                      aria-label={`${traco.nome_pt}: ${traco.score}%`}
                    >
                      <div className="h-full flex items-end justify-center relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                          <div className="bg-[var(--mq-text)] text-[var(--mq-bg)] rounded-lg px-3 py-2 text-xs shadow-lg whitespace-nowrap">
                            <div className="font-semibold mb-1">{traco.nome_pt}</div>
                            <div className="space-y-0.5">
                              <div>Score: <strong>{traco.score}%</strong></div>
                              {catalogInfo?.resumo && (
                                <div className="border-t border-[var(--mq-bg)] border-opacity-20 pt-0.5 mt-0.5 text-[10px] max-w-[200px]">
                                  {catalogInfo.resumo}
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--mq-text)]" />
                          </div>
                        </div>

                        <div
                          className={`w-full max-w-[28px] rounded-t-md transition-all duration-200 relative ${
                            isMaior 
                              ? 'bg-[var(--mq-primary)] group-hover:brightness-110' 
                              : isAtual
                                ? 'bg-[var(--mq-accent)] group-hover:bg-[var(--mq-primary)]'
                                : 'bg-[#7dd3fc] group-hover:bg-[var(--mq-primary)]'
                          }`}
                          style={{ height: `${barHeight}%`, minHeight: 4 }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Eixo X - Labels dos traços */}
          <div className="flex mt-2">
            {/* Espaço para alinhamento com eixo Y */}
            <div className="pr-2" style={{ width: 24 }} />
            
            {/* Labels dos traços */}
            <div className="flex-1 flex justify-between gap-1">
              {tracosRankeados.map((traco) => {
                const isMaior = traco.traco_id === maiorScoreId;
                return (
                  <div 
                    key={traco.traco_id} 
                    className="flex-1 flex flex-col items-center"
                  >
                    <span className={`text-xs text-center leading-tight break-words w-full px-0.5 ${
                      isMaior ? 'text-[var(--mq-primary)] font-semibold' : 'text-[var(--mq-text-subtle)]'
                    }`}>
                      {traco.nome_pt}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Frase conceitual e instrução */}
      {!loading && (
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--mq-text-muted)] mb-2">
            Personalidade influencia comportamento e preferências
          </p>
          {onBarClick && (
            <p className="text-sm font-semibold text-[var(--mq-primary)]">
              Toque na barra para saber mais...
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export { mockTracosRanking };
export default CardPerfilBigFiveRanking;

