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
  const centerX = 160;
  const centerY = 160;
  const radius = 120;
  const emotionRadius = 24;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Roda Emocional</h3>
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
      <div className="flex justify-center">
        <svg width="320" height="320" className="overflow-visible">
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 12}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Emoções */}
          {roda_emocoes.map((emocao, index) => {
            const angle = (index * 360) / roda_emocoes.length;
            const radian = (angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(radian);
            const y = centerY + radius * Math.sin(radian);
            
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
                  x2={x}
                  y2={y}
                  stroke={emocao.cor}
                  strokeWidth="2"
                  opacity={opacity}
                />
                
                {/* Círculo da emoção */}
                <motion.circle
                  cx={x}
                  cy={y}
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
                  x={x}
                  y={y + emotionRadius + 18}
                  textAnchor="middle"
                  className="text-sm font-medium fill-gray-700 pointer-events-none"
                >
                  {emocao.nome}
                </text>
                <text
                  x={x}
                  y={y + emotionRadius + 32}
                  textAnchor="middle"
                  className="text-xs fill-gray-500 pointer-events-none"
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
