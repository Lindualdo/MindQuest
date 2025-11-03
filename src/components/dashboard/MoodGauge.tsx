/**
 * ARQUIVO: src/components/dashboard/MoodGauge.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * MoodGauge baseado na Especificação v1.1
 * Gauge central (-5 a +5) com indicação de tendência semanal
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info, Clock} from 'lucide-react';
import useStore from '../../store/useStore';
import Card from '../ui/Card';

const GAUGE_SIZE = 280;
const GAUGE_RADIUS = 100;
const GAUGE_STROKE = 16;

const MoodGauge: React.FC = () => {
  const { dashboardData, setView, loadHumorHistorico } = useStore();
  const { mood_gauge } = dashboardData;
  const gradientId = React.useId();
  const [showInfo, setShowInfo] = React.useState(false);

  const rawNivel = Number(mood_gauge?.nivel_atual);
  const hasValidNivel = Number.isFinite(rawNivel);
  const clampedNivel = hasValidNivel ? Math.max(0, Math.min(10, rawNivel)) : 0;
  const normalized = hasValidNivel ? clampedNivel / 10 : 0;
  const circumference = Math.PI * GAUGE_RADIUS;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = 0;
  
  // Rotação da agulha (-90° a +90°)
  const pointerLength = GAUGE_RADIUS - 20;
  const pointerAngle = hasValidNivel
    ? Math.PI - normalized * Math.PI
    : Math.PI;
  const pointerEndX = GAUGE_SIZE / 2 + pointerLength * Math.cos(pointerAngle);
  const pointerEndY = GAUGE_SIZE / 2 - pointerLength * Math.sin(pointerAngle);
  const pointerOpacity = hasValidNivel ? 1 : 0.35;
  
  // Determinar cor baseada no nível
  const getGaugeColor = (nivel: number) => {
    if (nivel >= 8) return '#10B981'; // Verde alto
    if (nivel >= 6) return '#F59E0B'; // Amarelo moderado
    if (nivel >= 4) return '#F97316'; // Laranja atenção
    return '#EF4444'; // Vermelho crítico
  };

  const gaugeColor = hasValidNivel ? getGaugeColor(clampedNivel) : '#9CA3AF';
  
  // Humor médio do período para exibição
  const humorMedio = dashboardData.metricas_periodo?.humor_medio ?? null;

  const handleOpenHistory = async () => {
    setView('humorHistorico');

    const currentState = typeof useStore.getState === 'function' ? useStore.getState() : null;
    const userId = currentState?.dashboardData?.usuario?.id;

    if (!userId) {
      console.warn('[MoodGauge] usuário não encontrado ao abrir histórico', currentState?.dashboardData);
      return;
    }

    try {
      await loadHumorHistorico();
    } catch (error) {
      console.error('Erro ao carregar histórico de humor:', error);
    }
  };

  return (
    <Card className="text-center">
      <div className="flex items-center gap-3 mb-6">  
        <h3 className="text-xl font-semibold text-gray-800">Humor</h3>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleOpenHistory}
            className="flex items-center gap-1 text-xs font-semibold transition mq-link"
            type="button"
          >
            <Clock size={14} /> Histórico
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowInfo((prev) => !prev)}
              className="p-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              aria-label="Informações sobre o indicador de humor"
            >
              <Info size={16} />
            </button>
            {showInfo && (
              <div className="absolute right-0 mt-3 w-72 p-4 bg-white rounded-xl shadow-xl text-xs text-gray-600 z-20">
                <p className="font-semibold text-gray-700 mb-1">Como ler o gauge</p>
                <p><strong>Humor Atual:</strong> humor última conversa (0-10).</p>
                <p className="mt-2"><strong>Média</strong> Seu humor nos últimos 7 dias.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gauge SVG */}
      <div className="relative mb-6 mx-auto" style={{ width: GAUGE_SIZE, height: GAUGE_SIZE / 2 + 40 }}>
        <svg width={GAUGE_SIZE} height={GAUGE_SIZE / 2 + 40} viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE / 2 + 40}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="33%" stopColor="#F97316" />
              <stop offset="66%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Arco de fundo */}
          <path
            d={`M ${GAUGE_SIZE/2 - GAUGE_RADIUS} ${GAUGE_SIZE/2} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${GAUGE_SIZE/2 + GAUGE_RADIUS} ${GAUGE_SIZE/2}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={GAUGE_STROKE}
            strokeLinecap="round"
          />

          {/* Arco colorido */}
          <motion.path
            d={`M ${GAUGE_SIZE/2 - GAUGE_RADIUS} ${GAUGE_SIZE/2} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${GAUGE_SIZE/2 + GAUGE_RADIUS} ${GAUGE_SIZE/2}`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={GAUGE_STROKE}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Agulha */}
          <motion.line
            key={`pointer-line-${hasValidNivel ? 'data' : 'empty'}`}
            x1={GAUGE_SIZE / 2}
            y1={GAUGE_SIZE / 2}
            initial={{
              x2: GAUGE_SIZE / 2 - pointerLength,
              y2: GAUGE_SIZE / 2,
            }}
            animate={{
              x2: pointerEndX,
              y2: pointerEndY,
              stroke: gaugeColor,
            }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            stroke={gaugeColor}
            strokeWidth={4}
            strokeOpacity={pointerOpacity}
            strokeLinecap="round"
          />
          <motion.circle
            key={`pointer-base-${hasValidNivel ? 'data' : 'empty'}`}
            cx={GAUGE_SIZE / 2}
            cy={GAUGE_SIZE / 2}
            r={9}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: pointerOpacity,
              fill: gaugeColor,
            }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            fill={gaugeColor}
          />

          {/* Marcadores de escala */}
          {[0, 2.5, 5, 7.5, 10].map((value) => {
            const angle = (value / 10) * 180 - 90;
            const radian = ((angle - 90) * Math.PI) / 180;
            const x1 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 20) * Math.cos(radian);
            const y1 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 20) * Math.sin(radian);
            const x2 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 10) * Math.cos(radian);
            const y2 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 10) * Math.sin(radian);
            
            const labelX = GAUGE_SIZE/2 + (GAUGE_RADIUS - 35) * Math.cos(radian);
            const labelY = GAUGE_SIZE/2 + (GAUGE_RADIUS - 35) * Math.sin(radian);

            return (
              <g key={value}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#6B7280"
                  strokeWidth={2}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  className={`${value === clampedNivel ? 'font-bold fill-gray-800' : 'fill-gray-600'}`}
                >
                  {value}
                </text>

                {/* Marcadores menores entre os principais */}
                {value < 10 && (
                  <g>
                    {[-1.25, 1.25].map((offset) => {
                      const subValue = value + offset;
                      if (subValue >= 0 && subValue <= 10 && ![0, 2.5, 5, 7.5, 10].includes(Number(subValue.toFixed(2)))) {
                        const subAngle = (subValue / 10) * 180 - 90;
                        const subRadian = ((subAngle - 90) * Math.PI) / 180;
                        const subX1 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 12) * Math.cos(subRadian);
                        const subY1 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 12) * Math.sin(subRadian);
                        const subX2 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 5) * Math.cos(subRadian);
                        const subY2 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 5) * Math.sin(subRadian);
                        
                        return (
                          <line
                            key={offset}
                            x1={subX1}
                            y1={subY1}
                            x2={subX2}
                            y2={subY2}
                            stroke="#9CA3AF"
                            strokeWidth={1}
                          />
                        );
                      }
                      return null;
                    })}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Valor atual */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-4"
      >
        {/* Emoji removido conforme novo padrão */}
        <div className="text-3xl font-bold" style={{ color: gaugeColor }}>
          {hasValidNivel ? clampedNivel.toFixed(1) : '--'}
        </div>
        <div className="text-sm text-gray-600 mt-1">Humor atual</div>
      </motion.div>

      {/* Humor Médio com tendência */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl"
      >
        {(() => {
          const tendencia = dashboardData?.mood_gauge?.tendencia_semanal ?? 0;
          const isUp = tendencia > 0;
          const isDown = tendencia < 0;
          const colorClass = isUp
            ? 'text-green-700'
            : isDown
              ? 'text-[#D90368]'
              : 'text-gray-700';
          const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
          const medio = typeof humorMedio === 'number' ? humorMedio.toFixed(1) : '--';
          return (
            <div className={`flex items-center gap-2 text-sm ${colorClass}`}>
              <Icon size={16} />
              <span className="font-semibold">Humor Médio: </span>
              <span className="font-bold">{medio}</span>
            </div>
          );
        })()}
      </motion.div>
    </Card>
  );
};

export default MoodGauge;
