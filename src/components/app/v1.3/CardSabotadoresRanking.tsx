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

const CardSabotadoresRanking = ({ sabotadores, sabotadorAtualId, onBarClick, loading }: Props) => {
  const [showInfo, setShowInfo] = useState(false);

  // Calcular score e ordenar do maior para menor
  const sabotadoresRankeados = useMemo(() => {
    if (!sabotadores || sabotadores.length === 0) return [];

    return sabotadores
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

  // Mensagem quando não há dados
  if (!loading && sabotadoresRankeados.length === 0) {
    return (
      <section className="mq-card rounded-2xl px-4 py-4" style={{ borderRadius: 24 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[var(--mq-text)]">Sabotadores detectados</h3>
            <p className="mq-eyebrow mt-0.5">Padrões mentais identificados</p>
          </div>
        </div>
        <div className="mt-3 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-6 text-center">
          <p className="text-sm text-[var(--mq-text-muted)]">
            Nenhum sabotador detectado ainda.
          </p>
          <p className="mt-2 text-xs text-[var(--mq-text-subtle)]">
            Continue conversando para identificar seus padrões mentais.
          </p>
        </div>
      </section>
    );
  }

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
        <div className="mt-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-[var(--mq-border)] rounded w-24 mb-2" />
              <div className="h-8 bg-[var(--mq-border)] rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Gráfico de barras */}
      {!loading && (
        <div className="mt-3 space-y-3">
          {sabotadoresRankeados.map((sabotador, index) => {
            const isMaisAtivo = sabotador.sabotador_id === maisAtivoId;
            const isAtual = sabotador.sabotador_id === sabotadorAtualId;
            const barWidth = Math.max(10, (sabotador.score / maxScore) * 100);

            return (
              <motion.div
                key={sabotador.sabotador_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                {/* Label com emoji e nome */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{sabotador.emoji}</span>
                    <span 
                      className={`text-xs font-medium ${
                        isMaisAtivo 
                          ? 'text-[var(--mq-primary)] font-semibold' 
                          : 'text-[var(--mq-text)]'
                      }`}
                    >
                      {sabotador.nome}
                    </span>
                    {isMaisAtivo && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[var(--mq-primary)] text-white text-[0.6rem] font-bold uppercase">
                        <TrendingUp size={10} />
                        Mais ativo
                      </span>
                    )}
                    {isAtual && !isMaisAtivo && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[var(--mq-accent)] text-white text-[0.6rem] font-bold uppercase">
                        Atual
                      </span>
                    )}
                  </div>
                  <span className="text-[0.65rem] text-[var(--mq-text-muted)]">
                    {sabotador.total_deteccoes}x · {Math.round(sabotador.intensidade_media)}%
                  </span>
                </div>

                {/* Barra clicável */}
                <button
                  type="button"
                  onClick={() => onBarClick?.(sabotador.sabotador_id)}
                  className="w-full h-9 rounded-xl bg-[var(--mq-bar)] overflow-hidden relative cursor-pointer group-hover:ring-2 group-hover:ring-[var(--mq-primary)] group-hover:ring-opacity-30 transition-all"
                  aria-label={`Ver detalhes de ${sabotador.nome}`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 rounded-xl ${
                      isMaisAtivo
                        ? 'bg-gradient-to-r from-[var(--mq-primary)] to-[var(--mq-accent)]'
                        : 'bg-[var(--mq-primary)]'
                    } ${isMaisAtivo ? 'opacity-100' : 'opacity-70'}`}
                  />
                  {/* Score dentro da barra */}
                  <span 
                    className={`absolute inset-y-0 left-3 flex items-center text-xs font-bold ${
                      barWidth > 25 ? 'text-white' : 'text-[var(--mq-text)]'
                    }`}
                  >
                    {Math.round(sabotador.score)}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Instrução para clicar */}
      {!loading && sabotadoresRankeados.length > 0 && onBarClick && (
        <p className="mt-4 text-center text-[0.7rem] text-[var(--mq-text-subtle)] italic">
          Clique na barra para saber mais sobre cada sabotador...
        </p>
      )}
    </section>
  );
};

export default CardSabotadoresRanking;

