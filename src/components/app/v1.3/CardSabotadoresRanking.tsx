import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { getSabotadorById } from '@/data/sabotadoresCatalogo';
import { IconRenderer } from '@/utils/iconMap';

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

  // Função para remover prefixo "hiper-" do nome
  const formatarNome = (nome: string): string => {
    return nome.replace(/^hiper[-_]?/i, '');
  };

  // Calcular score e ordenar do maior para menor
  const sabotadoresRankeados = useMemo(() => {
    if (sabotadores.length === 0) return [];
    
    return sabotadores
      .map((s) => {
        const catalogEntry = getSabotadorById(s.sabotador_id);
        const nomeOriginal = catalogEntry?.nome || s.sabotador_id;
        // Usar score_impacto da API se disponível, senão calcular localmente
        const score = (s as any).score_impacto ?? (s.total_deteccoes * s.intensidade_media);
        return {
          ...s,
          score,
          nome: formatarNome(nomeOriginal),
          emoji: catalogEntry?.emoji || 'Ghost',
          resumo: catalogEntry?.resumo || '',
        };
      })
      .sort((a, b) => b.score - a.score) // Ordenar por score (frequência × intensidade)
      .slice(0, 5); // Top 5 apenas
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

  // Se não tem dados e não está carregando, não renderiza (APÓS todos os hooks)
  if (!loading && sabotadores.length === 0) {
    return null;
  }

  // Determinar qual é o mais ativo (primeiro da lista ordenada)
  const maisAtivoId = sabotadoresRankeados[0]?.sabotador_id || null;

  return (
    <section className="mq-card rounded-2xl px-4 py-4" style={{ borderRadius: 24 }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--mq-text)]">Padrões de pensamentos</h3>
          <p className="mq-eyebrow mt-1">Entenda como te sabotam</p>
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
            O ranking considera tanto a <strong>frequência</strong> (quantas vezes foi detectado) 
            quanto a <strong>intensidade média</strong> de cada sabotador. 
            Quanto maior a combinação dessas duas métricas, maior o impacto no seu bem-estar.
          </p>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-3 flex items-end justify-between gap-2 h-44">
          {[1, 2, 3, 4, 5].map((i) => (
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
                  // Garantir que intensidade_media seja número
                  const intensidadeMedia = Number(sabotador.intensidade_media) || 0;
                  const scoreImpacto = sabotador.score ?? (sabotador.total_deteccoes * intensidadeMedia);

                  return (
                    <motion.button
                      key={sabotador.sabotador_id}
                      type="button"
                      onClick={() => onBarClick?.(sabotador.sabotador_id)}
                      className={`flex-1 cursor-pointer group relative`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
                      style={{ transformOrigin: 'bottom', height: '100%' }}
                      aria-label={`${sabotador.nome}: ${sabotador.total_deteccoes} detecções`}
                    >
                      <div className="h-full flex items-end justify-center relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                          <div className="bg-[var(--mq-text)] text-[var(--mq-bg)] rounded-lg px-3 py-2 text-xs shadow-lg whitespace-nowrap">
                            <div className="font-semibold mb-1">{sabotador.nome}</div>
                            <div className="space-y-0.5">
                              <div>Detecções: <strong>{sabotador.total_deteccoes}</strong></div>
                              <div>Intensidade: <strong>{intensidadeMedia.toFixed(1)}%</strong></div>
                              <div className="border-t border-[var(--mq-bg)] border-opacity-20 pt-0.5 mt-0.5">
                                Score: <strong>{Number(scoreImpacto).toFixed(0)}</strong>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--mq-text)]" />
                          </div>
                        </div>

                        <div
                          className={`w-full max-w-[28px] rounded-t-md transition-all duration-200 relative ${
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
                    <span className={`text-xs text-center leading-tight break-words w-full px-0.5 ${
                      isMaisAtivo ? 'text-[var(--mq-primary)] font-semibold' : 'text-[var(--mq-text-subtle)]'
                    }`}>
                      {sabotador.nome}
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
            Pensamentos geram emoções que movem suas ações
          </p>
          {onBarClick && (
            <p className="text-sm font-bold text-[var(--mq-highlight)]">
              Toque na barra para saber mais...
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default CardSabotadoresRanking;
