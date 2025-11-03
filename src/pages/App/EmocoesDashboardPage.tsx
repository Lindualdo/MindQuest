import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import MoodGauge from '@/components/dashboard/MoodGauge';
import EmotionWheel from '@/components/dashboard/EmotionWheel';
import PanasChart from '@/components/dashboard/PanasChart';
import { useDashboard } from '@/store/useStore';

const EmocoesDashboardPage: React.FC = () => {
  const { setView, periodo, setPeriodo } = useDashboard();

  const handleBack = () => setView('dashboard');

  return (
    <div className="mindquest-dashboard min-h-screen pb-10">
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="rounded-xl bg-white p-2 shadow transition-all hover:shadow-md"
              aria-label="Voltar para o dashboard"
              type="button"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <div>
              <p className="text-sm font-semibold text-[#3083DC] uppercase tracking-wide">
                Painel de emoções
              </p>
              <h1 className="text-lg font-semibold text-slate-800">
                Humor, Roda das Emoções e PANAS
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              type="button"
              onClick={() => setPeriodo('semana')}
              className={`rounded-full px-3 py-1 transition ${
                periodo === 'semana'
                  ? 'bg-[#3083DC] text-white'
                  : 'bg-white hover:bg-[#E8F3F5]'
              }`}
            >
              Semana
            </button>
            <button
              type="button"
              onClick={() => setPeriodo('mes')}
              className={`rounded-full px-3 py-1 transition ${
                periodo === 'mes'
                  ? 'bg-[#3083DC] text-white'
                  : 'bg-white hover:bg-[#E8F3F5]'
              }`}
            >
              Mês
            </button>
            <button
              type="button"
              onClick={() => setPeriodo('trimestre')}
              className={`rounded-full px-3 py-1 transition ${
                periodo === 'trimestre'
                  ? 'bg-[#3083DC] text-white'
                  : 'bg-white hover:bg-[#E8F3F5]'
              }`}
            >
              Trimestre
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 flex max-w-6xl flex-col gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MoodGauge />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EmotionWheel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PanasChart />
        </motion.div>
      </main>
    </div>
  );
};

export default EmocoesDashboardPage;
