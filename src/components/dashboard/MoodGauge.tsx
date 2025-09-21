import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const GAUGE_SIZE = 220;
const GAUGE_HEIGHT = 140;
const GAUGE_RADIUS = 90;
const GAUGE_STROKE = 18;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const MoodGauge: React.FC = () => {
  const { dashboardData } = useStore();
  const { humor_medio, variacao_anterior } = dashboardData;

  const gradientId = React.useId();
  const normalized = clamp((humor_medio + 5) / 10, 0, 1);
  const circumference = Math.PI * GAUGE_RADIUS;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - normalized * circumference;
  const pointerRotation = normalized * 180 - 90;
  const deltaIsPositive = variacao_anterior >= 0;
  const TrendIcon = deltaIsPositive ? TrendingUp : TrendingDown;

  const moodInfo = React.useMemo(() => {
    if (humor_medio >= 3) {
      return {
        level: 'Excelente',
        badgeBg: 'rgba(34,197,94,0.12)',
        badgeColor: 'rgba(22,163,74,1)',
      };
    }
    if (humor_medio >= 1) {
      return {
        level: 'Bom',
        badgeBg: 'rgba(16,185,129,0.14)',
        badgeColor: 'rgba(5,150,105,1)',
      };
    }
    if (humor_medio >= -1) {
      return {
        level: 'Neutro',
        badgeBg: 'rgba(234,179,8,0.12)',
        badgeColor: 'rgba(202,138,4,1)',
      };
    }
    if (humor_medio >= -3) {
      return {
        level: 'Baixo',
        badgeBg: 'rgba(249,115,22,0.12)',
        badgeColor: 'rgba(234,88,12,1)',
      };
    }
    return {
      level: 'Crítico',
      badgeBg: 'rgba(248,113,113,0.14)',
      badgeColor: 'rgba(220,38,38,1)',
    };
  }, [humor_medio]);

  return (
    <Card className="relative overflow-hidden text-center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/90 via-white to-blue-50/40" />

      <div className="relative flex flex-col items-center gap-6">
        <h3 className="text-xl font-semibold text-gray-800">Nível de Humor</h3>

        <div
          className="relative"
          style={{ width: GAUGE_SIZE, height: GAUGE_HEIGHT }}
        >
          <svg
            className="absolute inset-0"
            viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_HEIGHT}`}
            fill="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="30%" stopColor="#f97316" />
                <stop offset="55%" stopColor="#eab308" />
                <stop offset="80%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            <path
              d={`M ${GAUGE_SIZE / 2 - GAUGE_RADIUS} ${GAUGE_RADIUS + 20} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${GAUGE_SIZE / 2 + GAUGE_RADIUS} ${GAUGE_RADIUS + 20}`}
              stroke="#e5e7eb"
              strokeWidth={GAUGE_STROKE}
              strokeLinecap="round"
            />

            <motion.path
              d={`M ${GAUGE_SIZE / 2 - GAUGE_RADIUS} ${GAUGE_RADIUS + 20} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${GAUGE_SIZE / 2 + GAUGE_RADIUS} ${GAUGE_RADIUS + 20}`}
              stroke={`url(#${gradientId})`}
              strokeWidth={GAUGE_STROKE}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            />
          </svg>

          <div className="absolute inset-0 flex items-end justify-center pb-6">
            <motion.div
              className="w-1.5 rounded-full bg-slate-600 shadow-sm"
              style={{ height: GAUGE_RADIUS - 18, transformOrigin: 'bottom center' }}
              initial={{ rotate: -90 }}
              animate={{ rotate: pointerRotation }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </div>

          <div className="absolute inset-x-8 bottom-2 flex justify-between text-xs font-medium text-gray-400">
            <span>-5</span>
            <span>0</span>
            <span>+5</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="space-y-3"
        >
          <div className="text-4xl font-bold text-gray-900">
            {humor_medio > 0 ? '+' : ''}{humor_medio.toFixed(1)}
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm"
            style={{ backgroundColor: moodInfo.badgeBg, color: moodInfo.badgeColor }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: moodInfo.badgeColor }}
            />
            Level: {moodInfo.level}
          </div>
        </motion.div>

        <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-gray-600 shadow-inner">
          <TrendIcon className={deltaIsPositive ? 'text-emerald-500' : 'text-rose-500'} size={18} />
          <span className={deltaIsPositive ? 'text-emerald-600' : 'text-rose-600'}>
            {deltaIsPositive ? '+' : ''}{variacao_anterior.toFixed(1)} XP
          </span>
          <span className="text-gray-500">vs período anterior</span>
        </div>
      </div>
    </Card>
  );
};

export default MoodGauge;
