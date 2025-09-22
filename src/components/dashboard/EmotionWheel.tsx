/**
 * ARQUIVO: src/components/dashboard/EmotionWheel.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Roda de Emoções baseada em Plutchik conforme especificação v1.1
 * 8 emoções primárias com intensidades detectadas
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const EmotionWheel: React.FC = () => {
  const { dashboardData } = useStore();
  const { roda_emocoes } = dashboardData;

  // Configuração da roda
  const centerX = 120;
  const centerY = 120;
  const radius = 90;
  const emotionRadius = 20;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Brain className="text-purple-600" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Roda Emocional</h3>
        <div className="ml-auto group relative">
          <Info className="text-gray-400 hover:text-gray-600 cursor-help" size={16} />
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
            Baseado no modelo de Plutchik - 8 emoções primárias
          </div>
        </div>
      </div>

      {/* SVG da Roda */}
      <div className="flex justify-center mb-6">
        <svg width="240" height="240" className="overflow-visible">
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 10}
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
                
                {/* Emoji */}
                <text
                  x={x}
                  y={y + 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-lg pointer-events-none select-none"
                >
                  {emocao.emoji}
                </text>
                
                {/* Label */}
                <text
                  x={x}
                  y={y + emotionRadius + 15}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700 pointer-events-none"
                >
                  {emocao.nome}
                </text>
                
                {/* Intensidade */}
                <text
                  x={x}
                  y={y + emotionRadius + 27}
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

      {/* Legenda das emoções mais intensas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-3"
      >
        <h4 className="font-semibold text-gray-800 text-sm mb-3">Emoções Dominantes</h4>
        
        {roda_emocoes
          .sort((a, b) => b.intensidade - a.intensidade)
          .slice(0, 3)
          .map((emocao, index) => (
            <motion.div
              key={emocao.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: emocao.cor }}
                />
                <span className="text-lg">{emocao.emoji}</span>
                <span className="font-medium text-gray-800">{emocao.nome}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">{emocao.intensidade}%</div>
                <div className="text-xs text-gray-500">intensidade</div>
              </div>
            </motion.div>
          ))}
      </motion.div>

      {/* Resumo estatístico */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-6 pt-4 border-t border-gray-100"
      >
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-purple-600">
              {roda_emocoes.find(e => e.intensidade === Math.max(...roda_emocoes.map(em => em.intensidade)))?.emoji}
            </div>
            <div className="text-xs text-gray-600">Mais intensa</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">
              {Math.round(roda_emocoes.reduce((acc, e) => acc + e.intensidade, 0) / roda_emocoes.length)}%
            </div>
            <div className="text-xs text-gray-600">Média geral</div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default EmotionWheel;