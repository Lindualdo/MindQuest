import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp } from 'lucide-react';
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
      .sort((a, b) => b.score - a.score);
  }, [sabotadores]);

  // Calcular valor máximo para normalização das barras
  const maxScore = useMemo(() => {
    if (sabotadoresRankeados.length === 0) return 100;
    return Math.max(...sabotadoresRankeados.map((s) => s.score));
  }, [sabotadoresRankeados]);

  // Determinar qual é o mais ativo (primeiro da lista ordenada)
  const maisAtivoId = sabotadoresRankeados[0]?.sabotador_id || null;

  return (
    <section className="mq-card rounded-2xl px-4 py-4" style={{ borderRadius: 24 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-[var(--mq-text)]">Sabotadores detectados</h3>
          <p className="mq-eyebrow mt-0.5">Padrões mentais identificados</p>
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
            O ranking é calculado multiplicando a <strong>frequência</strong> (quantas vezes foi detectado) 
            pela <strong>intensidade média</strong>. Quanto maior o valor, mais impacto esse padrão tem no seu dia a dia.
          </p>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-3 flex items-end justify-between gap-2 h-40">
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

      {/* Gráfico de Barras Vertical */}
      {!loading && (
        <div className="mt-4">
          {/* Barras */}
          <div className="flex items-end justify-between gap-1.5 h-36 px-1">
            {sabotadoresRankeados.map((sabotador, index) => {
              const isMaisAtivo = sabotador.sabotador_id === maisAtivoId;
              const isAtual = sabotador.sabotador_id === sabotadorAtualId;
              const barHeight = Math.max(8, (sabotador.score / maxScore) * 100);

              return (
                <motion.button
                  key={sabotador.sabotador_id}
                  type="button"
                  onClick={() => onBarClick?.(sabotador.sabotador_id)}
                  className={`flex-1 flex flex-col items-center justify-end cursor-pointer group relative ${
                    isMaisAtivo ? 'z-10' : ''
                  }`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
                  style={{ transformOrigin: 'bottom' }}
                  aria-label={`${sabotador.nome}: ${Math.round(sabotador.score)} pontos`}
                >
                  {/* Indicador mais ativo */}
                  {isMaisAtivo && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <TrendingUp size={14} className="text-[var(--mq-primary)]" />
                    </div>
                  )}
                  
                  {/* Score no topo */}
                  <span className={`text-[0.6rem] font-semibold mb-1 ${
                    isMaisAtivo ? 'text-[var(--mq-primary)]' : 'text-[var(--mq-text-muted)]'
                  }`}>
                    {Math.round(sabotador.score)}
                  </span>
                  
                  {/* Barra */}
                  <div
                    className={`w-full rounded-t-md transition-all duration-200 ${
                      isMaisAtivo 
                        ? 'bg-[var(--mq-primary)] group-hover:bg-[var(--mq-accent)]' 
                        : isAtual
                          ? 'bg-[var(--mq-accent)] group-hover:bg-[var(--mq-primary)]'
                          : 'bg-[var(--mq-bar)] group-hover:bg-[var(--mq-primary)] group-hover:opacity-80'
                    }`}
                    style={{ height: `${barHeight}%`, minHeight: 8 }}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Labels com emoji abaixo das barras */}
          <div className="flex justify-between gap-1.5 mt-2 px-1">
            {sabotadoresRankeados.map((sabotador) => {
              const isMaisAtivo = sabotador.sabotador_id === maisAtivoId;
              return (
                <div 
                  key={sabotador.sabotador_id} 
                  className="flex-1 flex flex-col items-center"
                >
                  <span className="text-sm">{sabotador.emoji}</span>
                  <span className={`text-[0.5rem] text-center leading-tight mt-0.5 ${
                    isMaisAtivo ? 'text-[var(--mq-primary)] font-semibold' : 'text-[var(--mq-text-subtle)]'
                  }`}>
                    {sabotador.nome.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[0.65rem] text-[var(--mq-text-muted)]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[var(--mq-primary)]" />
              <span>Mais ativo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[var(--mq-bar)]" />
              <span>Detectado</span>
            </div>
          </div>
        </div>
      )}

      {/* Instrução para clicar */}
      {!loading && onBarClick && (
        <p className="mt-4 text-center text-[0.7rem] text-[var(--mq-text-subtle)] italic">
          Clique na barra para saber mais...
        </p>
      )}
    </section>
  );
};

export { mockSabotadoresRanking };
export default CardSabotadoresRanking;
