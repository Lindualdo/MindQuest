/**
 * ARQUIVO: src/components/dashboard/EmotionWheel.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Roda de Emoções baseada em Plutchik conforme especificação v1.1
 * 8 emoções primárias com intensidades detectadas
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const EmotionWheel: React.FC = () => {
  const { dashboardData } = useStore();
  const { roda_emocoes = [] } = dashboardData;
  const [showInfo, setShowInfo] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [wheelSize, setWheelSize] = React.useState(340);
  const SCALE_FACTOR = 1.1;

  React.useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current || typeof window === 'undefined') {
        return;
      }

      const isMobile = window.matchMedia('(max-width: 640px)').matches;

      if (!isMobile) {
        setWheelSize(340);
        return;
      }

      const width = containerRef.current.offsetWidth;
      const paddingAdjustment = 32; // compensação aproximada do padding interno
      const nextSize = Math.min(Math.max(width - paddingAdjustment, 240), 320);
      setWheelSize(nextSize);
    };

    updateSize();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => {
        window.removeEventListener('resize', updateSize);
      };
    }

    return undefined;
  }, []);

  const isCompact = wheelSize < 340;
  const center = wheelSize / 2;
  const baseRadius = isCompact ? wheelSize * 0.33 : 120;
  const baseEmotionRadius = isCompact ? wheelSize * 0.065 : 24;
  const baseLinePadding = isCompact ? wheelSize * 0.015 : 6;
  const baseLabelOffset = isCompact ? wheelSize * 0.07 : 18;
  const baseDashedOffset = isCompact ? wheelSize * 0.045 : 18;
  const baseLabelFontSize = isCompact ? Math.max(11, wheelSize * 0.035) : 12;
  const basePercentFontSize = isCompact ? Math.max(10, wheelSize * 0.03) : 11;
  const baseCenterRadius = isCompact ? wheelSize * 0.042 : 15;

  const radius = baseRadius * SCALE_FACTOR;
  const emotionRadius = baseEmotionRadius * SCALE_FACTOR;
  const linePadding = baseLinePadding * SCALE_FACTOR;
  const labelOffset = baseLabelOffset * SCALE_FACTOR;
  const dashedRadius = radius + baseDashedOffset * SCALE_FACTOR;
  const labelFontSize = baseLabelFontSize * SCALE_FACTOR;
  const percentFontSize = basePercentFontSize * SCALE_FACTOR;
  const centerRadius = baseCenterRadius * SCALE_FACTOR;
  const percentYOffset = wheelSize * 0.006 * SCALE_FACTOR;

  const labelClampPadding = isCompact ? wheelSize * 0.04 : Math.max(labelOffset, emotionRadius * 0.6);
  const labelClampMin = 12 - labelClampPadding;
  const labelClampMax = wheelSize - 12 + labelClampPadding;

  return (
    <Card className="flex flex-col min-h-[360px]">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Roda das emoções</h3>
        <div className="ml-auto relative">
          <button
            type="button"
            aria-label="Informações sobre a roda de emoções"
            className="p-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            <Info size={16} />
          </button>
          {showInfo && (
            <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white p-4 text-xs text-gray-600 shadow-xl">
              <p><strong>Emoções:</strong> análise das conversas da semana.</p>
              <p className="mt-1"><strong>Percentual:</strong> média de intensidade dos últimos 7 dias.</p>
              <p className="mt-1"><strong>Base:</strong> 8 emoções fundamentais (Plutchik simplificado).</p>
            </div>
          )}
        </div>
      </div>

      {/* SVG da Roda */}
      <div ref={containerRef} className="flex flex-1 items-center justify-center pb-4 w-full">
        <svg
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
          className="overflow-visible"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={dashedRadius}
            fill="none"
            stroke="#D9E3FF"
            strokeWidth="1.5"
            strokeDasharray="6,8"
          />
          
          {/* Emoções */}
          {roda_emocoes.map((emocao, index) => {
            const angle = (index * 360) / roda_emocoes.length;
            const radian = (angle * Math.PI) / 180;
            const cosValue = Math.cos(radian);
            const sinValue = Math.sin(radian);
            const circleX = center + radius * cosValue;
            const circleY = center + radius * sinValue;
            const lineX = center + (radius - emotionRadius - linePadding) * cosValue;
            const lineY = center + (radius - emotionRadius - linePadding) * sinValue;

            const labelDistance = emotionRadius + labelOffset;
            const rawLabelX = circleX + labelDistance * cosValue;
            const rawLabelY = circleY + labelDistance * sinValue;

            const labelX =
              Math.min(Math.max(rawLabelX, labelClampMin), labelClampMax);
            const labelY = Math.min(Math.max(rawLabelY, labelClampMin), labelClampMax);

            const percentX = circleX;
            const percentY = circleY + percentYOffset;
            const dominantBaseline = 'middle';

            const tangentAngle = angle + 90;
            let labelRotation = ((tangentAngle + 180) % 360) - 180;
            if (labelRotation > 90) {
              labelRotation -= 180;
            } else if (labelRotation < -90) {
              labelRotation += 180;
            }
            
            // Opacidade baseada na intensidade
            const opacity = (emocao.intensidade / 100) * 0.8 + 0.2;
            
            return (
              <motion.g
                key={emocao.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {/* Linha conectora */}
                <line
                  x1={center}
                  y1={center}
                  x2={lineX}
                  y2={lineY}
                  stroke={emocao.cor}
                  strokeWidth="1.5"
                  opacity={opacity}
                />
                
                {/* Círculo da emoção */}
                <motion.circle
                  cx={circleX}
                  cy={circleY}
                  r={emotionRadius}
                  fill={emocao.cor}
                  opacity={opacity}
                  stroke="white"
                  strokeWidth="3"
                  className="cursor-pointer hover:stroke-gray-300 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
                
                {/* Label */}
                <text
                  transform={`rotate(${labelRotation} ${labelX} ${labelY})`}
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline={dominantBaseline}
                  className="text-[13px] font-medium fill-gray-500 pointer-events-none"
                  style={{ fontSize: `${labelFontSize}px` }}
                >
                  {emocao.nome}
                </text>
                <text
                  x={percentX}
                  y={percentY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-semibold fill-gray-700 pointer-events-none"
                  style={{ fontSize: `${percentFontSize}px` }}
                >
                  {emocao.intensidade}%
                </text>
              </motion.g>
            );
          })}
          
          {/* Centro */}
          <motion.circle
            cx={center}
            cy={center}
            r={centerRadius}
            fill="url(#centerGradient)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
          
          {/* Gradiente para o centro */}
          <defs>
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </Card>
  );
};

export default EmotionWheel;
