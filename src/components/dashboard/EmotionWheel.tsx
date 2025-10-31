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
  const { roda_emocoes } = dashboardData;
  const [showInfo, setShowInfo] = React.useState(false);

  // Configuração da roda
  const centerX = 170;
  const centerY = 170;
  const radius = 120;
  const emotionRadius = 24;
  const linePadding = 6;

  return (
    <Card className="flex flex-col min-h-[420px]">
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
      <div className="flex flex-1 items-center justify-center pb-4">
        <svg width="340" height="340" className="overflow-visible">
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 18}
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
            const circleX = centerX + radius * cosValue;
            const circleY = centerY + radius * sinValue;
            const lineX = centerX + (radius - emotionRadius - linePadding) * cosValue;
            const lineY = centerY + (radius - emotionRadius - linePadding) * sinValue;
            const labelX = circleX + (emotionRadius + 22) * cosValue;
            const labelY = circleY + (emotionRadius + 22) * sinValue;
            const percentX = circleX;
            const percentY = circleY + 2;
            const textAnchor = Math.abs(cosValue) < 0.25 ? 'middle' : cosValue > 0 ? 'start' : 'end';
            const nameDy = sinValue < -0.4 ? -6 : sinValue > 0.4 ? 12 : 6;
            const dominantBaseline = Math.abs(sinValue) < 0.25 ? 'middle' : sinValue > 0 ? 'hanging' : 'ideographic';
            
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
                  x1={centerX}
                  y1={centerY}
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
                  x={labelX}
                  y={labelY}
                  textAnchor={textAnchor}
                  dominantBaseline={dominantBaseline}
                  dy={String(nameDy)}
                  className="text-[13px] font-medium fill-gray-700 pointer-events-none"
                >
                  {emocao.nome}
                </text>
                <text
                  x={percentX}
                  y={percentY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[11px] font-semibold fill-gray-700 pointer-events-none"
                >
                  {emocao.intensidade}%
                </text>
              </motion.g>
            );
          })}
          
          {/* Centro */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r="15"
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
