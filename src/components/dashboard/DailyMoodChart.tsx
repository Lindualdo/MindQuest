import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const MAX_INTENSITY = 10;

const formatMood = (value: number) => (value > 0 ? `+${value}` : `${value}`);

const getTone = (value: number) => {
  if (value >= 2) {
    return {
      bar: 'from-emerald-400 to-emerald-500',
      text: 'text-emerald-600',
      accent: 'text-emerald-500'
    };
  }
  if (value >= 0) {
    return {
      bar: 'from-sky-400 to-blue-500',
      text: 'text-sky-600',
      accent: 'text-sky-500'
    };
  }
  if (value >= -2) {
    return {
      bar: 'from-amber-400 to-amber-500',
      text: 'text-amber-600',
      accent: 'text-amber-500'
    };
  }
  return {
    bar: 'from-rose-400 to-rose-500',
    text: 'text-rose-600',
    accent: 'text-rose-500'
  };
};

const DailyMoodChart: React.FC = () => {
  const { dashboardData } = useStore();
  const dailyMood = dashboardData.humor_diario ?? [];

  const averageMood = useMemo(() => {
    if (!dailyMood.length) return 0;
    return dailyMood.reduce((acc, curr) => acc + curr.humorMedio, 0) / dailyMood.length;
  }, [dailyMood]);

  const bestDay = useMemo(() => {
    if (!dailyMood.length) return null;
    return dailyMood.reduce((prev, curr) => (curr.humorMedio > prev.humorMedio ? curr : prev), dailyMood[0]);
  }, [dailyMood]);

  return (
    <Card className="relative overflow-hidden">
      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Humor Diário</h3>
            <p className="text-sm text-gray-500">Distribuição das emoções nos últimos 7 dias</p>
          </div>
          <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-gray-500 shadow-inner">
            Intensidade (0 — {MAX_INTENSITY})
          </div>
        </div>

        <div className="space-y-4">
          {dailyMood.map((item, index) => {
            const intensity = Math.max(0, Math.min(item.intensidade, MAX_INTENSITY));
            const intensityPercent = (intensity / MAX_INTENSITY) * 100;
            const tone = getTone(item.humorMedio);

            return (
              <motion.div
                key={`${item.dia}-${item.emocaoPredominante}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                viewport={{ once: true, amount: 0.4 }}
                className="grid grid-cols-1 gap-3 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur sm:grid-cols-[120px,1fr,110px] sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-semibold text-gray-600">
                    {item.dia}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{item.emocaoPredominante}</div>
                    <div className={clsx('text-xs font-medium', tone.accent)}>
                      {formatMood(item.humorMedio)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                      <span>Intensidade</span>
                      <span>{intensity}/10</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <motion.div
                        className={clsx('h-full rounded-full bg-gradient-to-r shadow-[0_0_8px_rgba(79,70,229,0.25)]', tone.bar)}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: intensityPercent / 100 }}
                        transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                        style={{ transformOrigin: 'left center' }}
                      />
                    </div>
                  </div>

                  <div className={clsx('text-right text-sm font-semibold', tone.text)}>
                    {formatMood(item.humorMedio)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-5 text-center shadow-inner">
          <div className="text-2xl font-bold text-blue-600">
            {formatMood(Number(averageMood.toFixed(1)))}
          </div>
          <div className="text-sm font-medium text-gray-600">Humor médio semanal</div>
          {bestDay && (
            <div className="mt-2 text-xs font-semibold text-gray-500">
              Dia {bestDay.dia}: {bestDay.emocaoPredominante} ({bestDay.intensidade}/10)
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DailyMoodChart;
