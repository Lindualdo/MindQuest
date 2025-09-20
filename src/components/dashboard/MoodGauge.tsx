import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const MoodGauge: React.FC = () => {
  const { dashboardData } = useStore();
  const { humor_medio, variacao_anterior } = dashboardData;

  // Converter escala -5/+5 para percentual 0-100
  const percentage = ((humor_medio + 5) / 10) * 100;
  const angle = (percentage / 100) * 180;

  const getMoodLevel = (humor: number) => {
    if (humor >= 3) return { level: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-500' };
    if (humor >= 1) return { level: 'Bom', color: 'text-emerald-600', bgColor: 'bg-emerald-500' };
    if (humor >= -1) return { level: 'Neutro', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    if (humor >= -3) return { level: 'Baixo', color: 'text-orange-600', bgColor: 'bg-orange-500' };
    return { level: 'Crítico', color: 'text-red-600', bgColor: 'bg-red-500' };
  };

  const moodInfo = getMoodLevel(humor_medio);

  return (
    <Card className="text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Nível de Humor</h3>

      {/* Gauge Visual */}
      <div className="relative w-48 h-24 mx-auto mb-6">
        {/* Background arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <motion.path
            d="M 20 80 A 80 80 0 0 1 180 80"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (percentage / 100) * 251.2 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute top-16 left-1/2 w-1 h-12 bg-gray-700 rounded-full origin-bottom"
          style={{ transformOrigin: 'bottom center' }}
          initial={{ rotate: -90 }}
          animate={{ rotate: angle - 90 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* Mood Value */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="mb-4"
      >
        <div className="text-4xl font-bold text-gray-800 mb-2">
          {humor_medio > 0 ? '+' : ''}{humor_medio.toFixed(1)}
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${moodInfo.bgColor} text-white font-medium`}>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          Level: {moodInfo.level}
        </div>
      </motion.div>

      {/* Variation */}
      <div className="flex items-center justify-center gap-2">
        {variacao_anterior > 0 ? (
          <TrendingUp className="text-green-500" size={20} />
        ) : (
          <TrendingDown className="text-red-500" size={20} />
        )}
        <span className={`font-medium ${variacao_anterior > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {variacao_anterior > 0 ? '+' : ''}{variacao_anterior.toFixed(1)} XP
        </span>
        <span className="text-gray-500 text-sm">vs período anterior</span>
      </div>
    </Card>
  );
};

export default MoodGauge;