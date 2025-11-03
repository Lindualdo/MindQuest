import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import SabotadorCard from '@/components/dashboard/SabotadorCard';
import { useDashboard } from '@/store/useStore';

const SabotadoresDashboardPage: React.FC = () => {
  const { setView } = useDashboard();

  return (
    <div className="mindquest-dashboard min-h-screen pb-10">
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
          <button
            onClick={() => setView('dashboard')}
            className="rounded-xl bg-white p-2 shadow transition-all hover:shadow-md"
            aria-label="Voltar para o dashboard"
            type="button"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#F59E0B]">
              Painel de sabotadores
            </p>
            <h1 className="text-lg font-semibold text-slate-800">
              Padrões mentais ativos e contramedidas
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SabotadorCard />
        </motion.div>
      </main>
    </div>
  );
};

export default SabotadoresDashboardPage;
