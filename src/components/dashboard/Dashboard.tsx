/**
 * ARQUIVO: src/components/dashboard/Dashboard.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Dashboard principal baseado na Especificação v1.1
 * Layout com todos os componentes atualizados
 */

import React from 'react';
import { motion } from 'framer-motion';
import PeriodSelector from './PeriodSelector';
import MoodGauge from './MoodGauge';
import CheckInsHistorico from './CheckInsHistorico';
import PanasChart from './PanasChart';
import EmotionWheel from './EmotionWheel';
import InsightsPanel from './InsightsPanel';
import GamificacaoPanel from './GamificacaoPanel';
import SabotadorCard from './SabotadorCard';
import { useStore } from '../../store/useStore';

const Dashboard: React.FC = () => {
  const { isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="h-16 bg-white/50 rounded-2xl animate-pulse" />
        
        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-white/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PeriodSelector />
      </motion.div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Humor atual */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-6 lg:col-span-6"
        >
          <MoodGauge />
        </motion.div>

        {/* Roda emocional */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-6 lg:col-span-6"
        >
          <EmotionWheel />
        </motion.div>

        {/* Sentimentos (PANAS) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-6 lg:col-span-6"
        >
          <PanasChart />
        </motion.div>

        {/* Sabotador principal */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="md:col-span-6 lg:col-span-6"
        >
          <SabotadorCard />
        </motion.div>

        {/* Histórico de conversas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-12"
        >
          <CheckInsHistorico />
        </motion.div>

        {/* Gamificação */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-12"
        >
          <GamificacaoPanel />
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-12"
        >
          <InsightsPanel />
        </motion.div>
      </div>

      {/* Footer com informações da versão */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-xs text-gray-400 py-4"
      >
        MindQuest v1.1 - Sistema híbrido de detecção emocional
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
