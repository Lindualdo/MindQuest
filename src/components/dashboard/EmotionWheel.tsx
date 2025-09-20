import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { emotionColors, emotionLabels } from '../../data/mockData';
import Card from '../ui/Card';

const EmotionWheel: React.FC = () => {
  const { dashboardData } = useStore();
  const { emocoes_primarias } = dashboardData;

  const emotions = Object.entries(emocoes_primarias);
  const centerX = 120;
  const centerY = 120;
  const radius = 80;

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Roda das Emoções</h3>

      <div className="flex justify-center mb-4">
        <svg width="240" height="240" className="drop-shadow-lg">
          {emotions.map(([emotion, data], index) => {
            const angle = (index * 360) / emotions.length;
            const startAngle = angle - 180 / emotions.length;
            const endAngle = angle + 180 / emotions.length;

            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            const opacity = data.frequencia > 0 ? 0.3 + (data.intensidade / 10) * 0.7 : 0.1;

            return (
              <motion.g key={emotion}>
                <motion.path
                  d={pathData}
                  fill={emotionColors[emotion as keyof typeof emotionColors]}
                  fillOpacity={opacity}
                  stroke="white"
                  strokeWidth="2"
                  initial={{ fillOpacity: 0 }}
                  animate={{ fillOpacity: opacity }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="hover:stroke-4 cursor-pointer transition-all duration-200"
                />

                {data.frequencia > 0 && (
                  <motion.circle
                    cx={centerX + (radius * 0.7) * Math.cos((angle * Math.PI) / 180)}
                    cy={centerY + (radius * 0.7) * Math.sin((angle * Math.PI) / 180)}
                    r="8"
                    fill="white"
                    stroke={emotionColors[emotion as keyof typeof emotionColors]}
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  >
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                  </motion.circle>
                )}

                <text
                  x={centerX + (radius * 0.7) * Math.cos((angle * Math.PI) / 180)}
                  y={centerY + (radius * 0.7) * Math.sin((angle * Math.PI) / 180)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-xs font-medium fill-gray-700 pointer-events-none"
                >
                  {data.frequencia}
                </text>
              </motion.g>
            );
          })}

          {/* Center logo */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r="25"
            fill="url(#centerGradient)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          />
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-sm font-bold fill-white"
          >
            MQ
          </text>

          <defs>
            <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {emotions.map(([emotion, data]) => (
          <div key={emotion} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: emotionColors[emotion as keyof typeof emotionColors] }}
            />
            <span className="text-gray-600 truncate">
              {emotionLabels[emotion as keyof typeof emotionLabels]} ({data.frequencia})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmotionWheel;