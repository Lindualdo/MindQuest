/**
 * ARQUIVO: src/components/dashboard/SabotadorCard.tsx
 * AÇÃO: CRIAR novo componente
 *
 * Card de sabotadores internos conforme especificação v1.1
 * Destaca o padrão principal com insight e contramedida
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, Info } from 'lucide-react';
import { useDashboard } from '../../store/useStore';
import Card from '../ui/Card';

const SabotadorCard: React.FC = () => {
  const { dashboardData, openSabotadorDetail } = useDashboard();
  const principal = dashboardData?.sabotadores?.padrao_principal;

  if (!principal) {
    return (
      <Card className="flex h-full items-center justify-center text-sm text-gray-500">
        Dados de sabotadores indisponíveis.
      </Card>
    );
  }

  const handleOpenDetail = () => openSabotadorDetail(principal.id);

  return (
    <Card className="h-full flex flex-col overflow-visible">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-5 h-full"
      >
        <div className="flex items-start justify-between gap-4">
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
          <div className="relative">
            <button
              type="button"
              onClick={handleOpenDetail}
              aria-label="Ver detalhes do sabotador"
              className="p-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <Info size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div>
              <p className="text-xs uppercase text-gray-500">Ocorrências</p>
              <p className="text-lg font-semibold text-gray-800">{principal.detectado_em}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-gray-500">Total conversas</p>
              <p className="text-lg font-semibold text-gray-800">{principal.total_conversas}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-white border border-gray-100 rounded-xl flex items-start gap-2">
              <MapPin size={16} className="text-purple-500 mt-1" />
              <div>
                <p className="text-xs uppercase text-gray-500">Contexto principal</p>
                <p className="font-medium text-gray-800">
                  {principal.contexto_principal || 'Ainda observando'}
                </p>
              </div>
            </div>
            <div className="p-3 bg-white border border-gray-100 rounded-xl flex items-start gap-2">
              <Activity size={16} className="text-purple-500 mt-1" />
              <div>
                <p className="text-xs uppercase text-gray-500">Intensidade média</p>
                <p className="font-medium text-gray-800">
                  {principal.intensidade_media ?? '—'}/100
                </p>
              </div>
            </div>
          </div>
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
