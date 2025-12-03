import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { getSabotadorById } from '@/data/sabotadoresCatalogo';

export interface SabotadorRankingItem {
  sabotador_id: string;
  total_deteccoes: number;
  intensidade_media: number;
  // Campos opcionais do contexto
  insight_atual?: string | null;
  contramedida_ativa?: string | null;
  contexto_principal?: string | null;
}

type Props = {
  sabotadores: SabotadorRankingItem[];
  sabotadorAtualId?: string | null;
  onBarClick?: (sabotadorId: string) => void;
  loading?: boolean;
};

// Mock com todos os 9 sabotadores para visualização (exported)
const mockSabotadoresRanking: SabotadorRankingItem[] = [
  { sabotador_id: 'hiper_realizador', total_deteccoes: 16, intensidade_media: 70 },
  { sabotador_id: 'inquieto', total_deteccoes: 25, intensidade_media: 65 },
  { sabotador_id: 'hipervigilante', total_deteccoes: 10, intensidade_media: 62 },
  { sabotador_id: 'critico', total_deteccoes: 8, intensidade_media: 55 },
  { sabotador_id: 'controlador', total_deteccoes: 5, intensidade_media: 50 },
  { sabotador_id: 'insistente', total_deteccoes: 4, intensidade_media: 45 },
  { sabotador_id: 'prestativo', total_deteccoes: 3, intensidade_media: 40 },
  { sabotador_id: 'vitima', total_deteccoes: 2, intensidade_media: 35 },
  { sabotador_id: 'esquivo', total_deteccoes: 1, intensidade_media: 30 },
];

const CardSabotadoresRanking = ({ sabotadores, sabotadorAtualId, onBarClick, loading }: Props) => {
  const [showInfo, setShowInfo] = useState(false);

  // Calcular score e ordenar do maior para menor
  const sabotadoresRankeados = useMemo(() => {
    const dados = sabotadores.length > 0 ? sabotadores : mockSabotadoresRanking;

    return dados
      .map((s) => {
        const catalogEntry = getSabotadorById(s.sabotador_id);
        const score = s.total_deteccoes * s.intensidade_media;
        return {
          ...s,
          score,
          nome: catalogEntry?.nome || s.sabotador_id,
          emoji: catalogEntry?.emoji || '🎭',
          resumo: catalogEntry?.resumo || '',
        };
      })
      .sort((a, b) => b.total_deteccoes - a.total_deteccoes);
  }, [sabotadores]);

  // Calcular valor máximo para escala do eixo Y
  const maxDeteccoes = useMemo(() => {
    if (sabotadoresRankeados.length === 0) return 10;
    const max = Math.max(...sabotadoresRankeados.map((s) => s.total_deteccoes));
    // Arredondar para cima para próximo múltiplo de 5
    return Math.ceil(max / 5) * 5;
  }, [sabotadoresRankeados]);

  // Gerar marcadores do eixo Y
  const yAxisMarkers = useMemo(() => {
    const step = Math.ceil(maxDeteccoes / 5);
    return Array.from({ length: 6 }, (_, i) => i * step).reverse();
  }, [maxDeteccoes]);

  // Determinar qual é o mais ativo (primeiro da lista ordenada)
  const maisAtivoId = sabotadoresRankeados[0]?.sabotador_id || null;

  return (
    <section className="mq-card rounded-2xl px-4 py-4" style={{ borderRadius: 24 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-[var(--mq-text)]">Padrão mental</h3>
          <p className="mq-eyebrow mt-0.5">Sabotadores</p>
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
          <p className="font-semibold mb-1">Como funciona o ranking?</p>
          <p>
            O gráfico mostra quantas vezes cada sabotador foi detectado nas suas conversas. 
            Quanto maior a barra, mais frequente é esse padrão de pensamento.
          </p>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-3 flex items-end justify-between gap-2 h-44">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
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
                {sabotadoresRankeados.map((sabotador, index) => {
                  const isMaisAtivo = sabotador.sabotador_id === maisAtivoId;
                  const isAtual = sabotador.sabotador_id === sabotadorAtualId;
                  const barHeight = Math.max(4, (sabotador.total_deteccoes / maxDeteccoes) * 100);

                  return (
                    <motion.button
                      key={sabotador.sabotador_id}
                      type="button"
                      onClick={() => onBarClick?.(sabotador.sabotador_id)}
                      className={`flex-1 cursor-pointer group`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
                      style={{ transformOrigin: 'bottom', height: '100%' }}
                      aria-label={`${sabotador.nome}: ${sabotador.total_deteccoes} detecções`}
                    >
                      <div className="h-full flex items-end justify-center">
                        <div
                          className={`w-full max-w-[28px] rounded-t-md transition-all duration-200 ${
                            isMaisAtivo 
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

          {/* Eixo X - Labels dos sabotadores */}
          <div className="flex mt-2">
            {/* Espaço para alinhamento com eixo Y */}
            <div className="pr-2" style={{ width: 24 }} />
            
            {/* Labels dos sabotadores */}
            <div className="flex-1 flex justify-between gap-1">
              {sabotadoresRankeados.map((sabotador) => {
                const isMaisAtivo = sabotador.sabotador_id === maisAtivoId;
                return (
                  <div 
                    key={sabotador.sabotador_id} 
                    className="flex-1 flex flex-col items-center"
                  >
                    <span className={`text-[0.5rem] text-center leading-tight truncate w-full ${
                      isMaisAtivo ? 'text-[var(--mq-primary)] font-semibold' : 'text-[var(--mq-text-subtle)]'
                    }`}>
                      {sabotador.nome.split(' ')[0].substring(0, 8)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Instrução para clicar */}
      {!loading && onBarClick && (
        <p className="mt-4 text-center text-sm font-semibold text-[var(--mq-primary)]">
          Toque na barra para saber mais...
        </p>
      )}
    </section>
  );
};

export { mockSabotadoresRanking };
export default CardSabotadoresRanking;
