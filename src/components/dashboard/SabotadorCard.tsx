/**
 * ARQUIVO: src/components/dashboard/SabotadorCard.tsx
 * AÇÃO: CRIAR novo componente
 *
 * Card de sabotadores internos conforme especificação v1.1
 * Destaca o padrão principal com insight e contramedida
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const SabotadorCard: React.FC = () => {
  const { dashboardData } = useStore();
  const { sabotadores } = dashboardData;
  const { padrao_principal: principal } = sabotadores;

  return (
    <Card className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-5 h-full"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Padrão principal
          </span>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {principal.emoji}
            </span>
            <div>
              <p className="text-sm text-gray-500 uppercase">Sabotador mais ativo</p>
              <p className="text-2xl font-bold text-gray-800">
                {principal.nome.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl p-4">
          Detectado em <strong className="text-gray-800">{principal.detectado_em}</strong> de{' '}
          <strong className="text-gray-800">{principal.total_conversas}</strong> conversas
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 uppercase flex items-center gap-2">
            💡 Insight da semana
          </p>
          <p className="mt-2 text-gray-700 italic">
            &ldquo;{principal.insight_contexto}&rdquo;
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Apelido interno: <span className="font-medium text-gray-700">{principal.apelido}</span>
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mt-auto">
          <p className="text-sm font-semibold text-purple-700 flex items-center gap-2">
            ✨ Contramedida sugerida
          </p>
          <p className="mt-2 text-sm text-purple-600 leading-relaxed">
            {principal.contramedida}
          </p>
        </div>
      </motion.div>
    </Card>
  );
};

export default SabotadorCard;
