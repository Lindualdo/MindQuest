/**
 * ARQUIVO: src/components/dashboard/Dashboard.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Dashboard principal baseado na Especificação v1.1.6
 * Layout com todos os componentes atualizados
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import CheckInsHistorico from './CheckInsHistorico';
import QuestPanel from './QuestPanel';
import { useDashboard } from '../../store/useStore';

type SectionVisual = {
  border: string;
  iconColor: string;
};

const SECTION_STYLES: Record<string, SectionVisual> = {
  conversations: {
    border: '#AFC9FF',
    iconColor: '#3083DC',
  },
  emotions: {
    border: '#F8B7DA',
    iconColor: '#EC4899',
  },
  sabotadores: {
    border: '#F9D97E',
    iconColor: '#F59E0B',
  },
  insights: {
    border: '#9FDBB5',
    iconColor: '#10B981',
  },
};

const Dashboard: React.FC = () => {
  const {
    isLoading,
    dashboardData,
    setView,
  } = useDashboard();

  const insights = dashboardData.insights ?? [];

  const alertInsightsCount = insights.filter((insight) => insight.tipo === 'alerta').length;

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
      <div className="space-y-6">
        {/* Histórico de conversas */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-[28px]"
        >
          <CheckInsHistorico />
        </motion.section>

        {/* Gamificação */}
        <section id="gamificacao" className="rounded-[28px]">
          <QuestPanel />
        </section>

        {/* Emoções */}
        <section
          id="emocoes"
          style={{ borderColor: SECTION_STYLES.emotions.border }}
          className="rounded-[28px] border bg-[#E8F3F5] p-4 sm:p-5"
        >
          <button
            type="button"
            onClick={() => setView('dashEmocoes')}
            className="flex w-full items-center justify-between gap-4 rounded-[22px] bg-[#E8F3F5] px-5 py-4 transition-colors hover:bg-[#DAE9EE]"
          >
            <div className="flex items-center gap-4">
              <Heart color={SECTION_STYLES.emotions.iconColor} />
              <div className="text-left">
                <h3 className="text-base font-semibold text-[#1C2541]">Emoções</h3>
                <p className="text-sm text-[#1C2541]/60">Humor, energia e emoções</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#94A3B8]" />
          </button>
        </section>

        <section
          id="sabotadores"
          style={{ borderColor: SECTION_STYLES.sabotadores.border }}
          className="rounded-[28px] border bg-[#E8F3F5] p-4 sm:p-5"
        >
          <button
            type="button"
            onClick={() => setView('dashSabotadores')}
            className="flex w-full items-center justify-between gap-4 rounded-[22px] bg-[#E8F3F5] px-5 py-4 transition-colors hover:bg-[#DAE9EE]"
          >
            <div className="flex items-center gap-4">
              <AlertTriangle color={SECTION_STYLES.sabotadores.iconColor} />
              <div className="text-left">
                <h3 className="text-base font-semibold text-[#1C2541]">Sabotadores</h3>
                <p className="text-sm text-[#1C2541]/60">Padrões mentais ativos</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#94A3B8]" />
          </button>
        </section>

        <section
          id="insights"
          style={{ borderColor: SECTION_STYLES.insights.border }}
          className="rounded-[28px] border bg-[#E8F3F5] p-4 sm:p-5"
        >
          <button
            type="button"
            onClick={() => setView('dashInsights')}
            className="flex w-full items-center justify-between gap-4 rounded-[22px] bg-[#E8F3F5] px-5 py-4 transition-colors hover:bg-[#DAE9EE]"
          >
            <div className="flex items-center gap-4">
              <Lightbulb color={SECTION_STYLES.insights.iconColor} />
              <div className="text-left">
                <h3 className="text-base font-semibold text-[#1C2541]">Insights</h3>
                <p className="text-sm text-[#1C2541]/60">
                  {insights.length}/75 insights disponíveis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {alertInsightsCount > 0 && (
                <span className="rounded-full bg-[#FEE2E2] px-3 py-1 text-xs font-semibold text-[#DC2626]">
                  {alertInsightsCount} alerta{alertInsightsCount > 1 ? 's' : ''}
                </span>
              )}
              <ChevronRight size={18} className="text-[#94A3B8]" />
            </div>
          </button>
        </section>
      </div>
    </motion.div>
  );
};

export default Dashboard;
