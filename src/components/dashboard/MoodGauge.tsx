/**
 * ARQUIVO: src/components/dashboard/MoodGauge.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * MoodGauge baseado na Especificação v1.1
 * Gauge central (-5 a +5) com indicação de tendência semanal
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info, Clock } from 'lucide-react';
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

  // Normalizar valor de 0 a 10 para 0 a 1 e evitar extrapolações na escala
  const clampedNivel = Math.max(0, Math.min(10, mood_gauge.nivel_atual));
  const normalized = clampedNivel / 10;
  const circumference = Math.PI * GAUGE_RADIUS;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = 0;
  
  // Rotação da agulha (-90° a +90°)
  const pointerRotation = normalized * 180 - 90;
  
  // Determinar cor baseada no nível
  const getGaugeColor = (nivel: number) => {
    if (nivel >= 8) return '#10B981'; // Verde alto
    if (nivel >= 6) return '#F59E0B'; // Amarelo moderado
    if (nivel >= 4) return '#F97316'; // Laranja atenção
    return '#EF4444'; // Vermelho crítico
  };

  const gaugeColor = getGaugeColor(clampedNivel);
  
  // Componente da tendência
  const tendenciaValor = mood_gauge.tendencia_semanal ?? 0;
  const TrendIcon = tendenciaValor > 0 ? TrendingUp : 
                   tendenciaValor < 0 ? TrendingDown : Minus;
  
  const trendColor = tendenciaValor > 0 ? 'text-green-600' : 
                    tendenciaValor < 0 ? 'text-red-600' : 'text-gray-500';

  const trendLabel = `${tendenciaValor > 0 ? '+' : ''}${tendenciaValor.toFixed(1)}%`;

  const handleOpenHistory = async () => {
    console.log('[MoodGauge] abrindo histórico');
    setView('humorHistorico');

    const currentState = typeof useStore.getState === 'function' ? useStore.getState() : null;
    const userId = currentState?.dashboardData?.usuario?.id;

    if (!userId) {
      console.warn('[MoodGauge] usuário não encontrado ao abrir histórico', currentState?.dashboardData);
      return;
    }

    try {
      console.log('[MoodGauge] requisitando histórico para', userId);
      await loadHumorHistorico();
    } catch (error) {
      console.error('Erro ao carregar histórico de humor:', error);
    }
  };

  return (
    <Card className="text-center">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Humor</h3>
        <div className="flex items-center gap-3">
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
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 p-3 bg-white rounded-lg shadow-lg text-xs text-gray-600 z-20">
                <p className="font-semibold text-gray-700 mb-1">Como interpretar</p>
                <p>
                  O valor principal mostra o humor detectado na conversa mais recente. A tendência compara esse valor com a média da última semana para indicar progresso ou queda.
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleOpenHistory}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
            type="button"
          >
            <Clock size={14} /> Histórico
          </button>
          <div className="text-2xl">{mood_gauge.emoji_atual}</div>
        </div>
      </div>

      {/* Gauge SVG */}
      <div className="relative flex justify-center items-center mb-6">
        <svg width={GAUGE_SIZE} height={GAUGE_SIZE * 0.6} className="overflow-visible">
          {/* Background arc - semicírculo completo */}
          <path
            d={`M ${GAUGE_SIZE/2 - GAUGE_RADIUS} ${GAUGE_SIZE/2} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${GAUGE_SIZE/2 + GAUGE_RADIUS} ${GAUGE_SIZE/2}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={GAUGE_STROKE}
            strokeLinecap="round"
          />
          
          {/* Progress arc com gradiente */}
          <defs>
            <linearGradient id={`mood-gauge-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          
          <motion.path
            d={`M ${GAUGE_SIZE/2 - GAUGE_RADIUS} ${GAUGE_SIZE/2} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${GAUGE_SIZE/2 + GAUGE_RADIUS} ${GAUGE_SIZE/2}`}
            fill="none"
            stroke={`url(#mood-gauge-gradient-${gradientId})`}
            strokeWidth={GAUGE_STROKE}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Pointer melhorado */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: pointerRotation }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ transformOrigin: `${GAUGE_SIZE/2}px ${GAUGE_SIZE/2}px` }}
          >
            {/* Base do pointer */}
            <circle
              cx={GAUGE_SIZE/2}
              cy={GAUGE_SIZE/2}
              r={10}
              fill="white"
              stroke={gaugeColor}
              strokeWidth={3}
              className="drop-shadow-md"
            />
            
            {/* Linha do pointer */}
            <line
              x1={GAUGE_SIZE/2}
              y1={GAUGE_SIZE/2}
              x2={GAUGE_SIZE/2}
              y2={GAUGE_SIZE/2 - GAUGE_RADIUS + 20}
              stroke={gaugeColor}
              strokeWidth={4}
              strokeLinecap="round"
              className="drop-shadow-sm"
            />
            
            {/* Ponta do pointer */}
            <circle
              cx={GAUGE_SIZE/2}
              cy={GAUGE_SIZE/2 - GAUGE_RADIUS + 20}
              r={4}
              fill={gaugeColor}
              className="drop-shadow-sm"
            />
          </motion.g>
          
          {/* Scale markers - ajustado para melhor distribuição */}
          {[0, 2.5, 5, 7.5, 10].map((value, index) => {
            const angle = (value / 10) * 180 - 90;
            const radian = ((angle - 90) * Math.PI) / 180;
            
            // Ajustar posições para melhor visualização
            const markerRadius = GAUGE_RADIUS - 15;
            const labelRadius = GAUGE_RADIUS - 30;
            
            const x1 = GAUGE_SIZE/2 + markerRadius * Math.cos(radian);
            const y1 = GAUGE_SIZE/2 + markerRadius * Math.sin(radian);
            const x2 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 5) * Math.cos(radian);
            const y2 = GAUGE_SIZE/2 + (GAUGE_RADIUS - 5) * Math.sin(radian);
            
            return (
              <g key={index}>
                {/* Marcador */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#6B7280"
                  strokeWidth={value === 0 ? 3 : 2}
                  strokeLinecap="round"
                />
                
                {/* Label do valor */}
                <text
                  x={GAUGE_SIZE/2 + labelRadius * Math.cos(radian)}
                  y={GAUGE_SIZE/2 + labelRadius * Math.sin(radian)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-xs font-medium ${value === 5 ? 'fill-gray-800' : 'fill-gray-600'}`}
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
        <div className="text-3xl font-bold" style={{ color: gaugeColor }}>
          {clampedNivel.toFixed(1)}
        </div>
        <div className="text-sm text-gray-600 mt-1">Nível atual</div>
      </motion.div>

      {/* Tendência semanal */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl"
      >
        <TrendIcon className={`${trendColor}`} size={20} />
        <div className="text-sm">
          <span className="font-medium text-gray-700">Tendência:</span>
          <span className={`ml-1 font-semibold ${trendColor}`}>
            {trendLabel} esta semana
          </span>
        </div>
      </motion.div>
    </Card>
  );
};

export default MoodGauge;
