/**
 * ARQUIVO: src/components/dashboard/CheckInsHistorico.tsx
 * AÇÃO: CRIAR novo componente
 * 
 * Check-ins dos últimos 7 dias conforme especificação v1.1
 * Visualização com emojis e status de resposta
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const CheckInsHistorico: React.FC = () => {
  const { dashboardData, openResumoConversas } = useStore();
  const { checkins_historico } = dashboardData;

  const diasSemanaExtenso = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const parseDate = (value?: string | null) => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day)
    ) {
      return null;
    }
    return new Date(year, month - 1, day);
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}`;

  const checkinsPorData = new Map<string, typeof checkins_historico[number]>();
  checkins_historico.forEach((checkin) => {
    if (checkin?.data_checkin) {
      checkinsPorData.set(checkin.data_checkin, checkin);
    }
  });

  const dataMaisRecente = (() => {
    if (checkins_historico.length === 0) {
      return new Date();
    }
    let referencia = parseDate(checkins_historico[0].data_checkin) ?? new Date();
    for (const checkin of checkins_historico) {
      const parsed = parseDate(checkin.data_checkin);
      if (parsed && parsed > referencia) {
        referencia = parsed;
      }
    }
    return referencia;
  })();

  const ultimosSeteDias = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(dataMaisRecente);
    date.setDate(dataMaisRecente.getDate() - (6 - index));
    const dateKey = formatDateKey(date);
    const checkin = checkinsPorData.get(dateKey) || null;
    const diaSemana = diasSemanaExtenso[date.getDay()];
    const dataFormatada = formatDateDisplay(date);
    const label = diaSemana.toLowerCase();
    const dataLabel = dataFormatada;
    return {
      date,
      label,
      dataLabel,
      checkin
    };
  });

  const STATUS_CONFIG = {
    respondido: {
      wrapper: 'bg-[#E6F4EA] border-[#34C759]',
      icon: '✓',
      iconColor: 'text-[#047857]',
    },
    perdido: {
      wrapper: 'bg-white border-[#CBD5E1]',
      icon: '✕',
      iconColor: 'text-[#94A3B8]',
    },
    pendente: {
      wrapper: 'bg-[#F8FAFC] border-[#CBD5E1]',
      icon: '…',
      iconColor: 'text-[#94A3B8]',
    },
    default: {
      wrapper: 'bg-white border-[#E2E8F0]',
      icon: '—',
      iconColor: 'text-[#CBD5E1]',
    },
  } as const;

  return (
    <Card
      hover={false}
      className="!border-none !bg-transparent shadow-none p-0"
    >
      <div className="flex items-center gap-3 mb-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3083DC1A] text-[#3083DC]">
          <Calendar size={20} />
        </span>
        <h3 className="text-xl font-semibold text-[#101828]">Histórico de conversas</h3>
      </div>

      {/* Grid dos dias */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7 mb-6">
        {ultimosSeteDias.map(({ checkin, label, dataLabel }, index) => {
          const statusConfig = checkin
            ? STATUS_CONFIG[checkin.status_resposta as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.default
            : STATUS_CONFIG.default;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              {/* Status do check-in */}
              <div
                className={`
                  flex h-16 w-16 items-center justify-center rounded-2xl border-2
                  transition-all duration-200
                  ${statusConfig.wrapper}
                `}
              >
                <div className={`text-lg font-semibold ${statusConfig.iconColor}`}>
                  {statusConfig.icon}
                </div>
              </div>
              
              {/* Dia e data */}
              <div className="text-sm font-semibold text-[#101828]">
                {label}
              </div>
              <div className="text-xs text-[#667085]">
                {dataLabel || '—'}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-end border-t border-[#E4E7EC] pt-4">
        <button
          type="button"
          onClick={() => openResumoConversas().catch(() => null)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#3083DC] transition hover:text-[#2563EB]"
        >
          Resumo
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Último check-in detalhado */}
      {checkins_historico[0] && checkins_historico[0].status_resposta === 'respondido' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.8 }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <MessageCircle className="text-blue-600 mt-1" size={16} />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800 mb-1">
                Última Conversa
              </div>
              <div className="text-xs text-gray-600 mb-2 flex items-center gap-2">
                <Clock size={12} />
                {checkins_historico[0].horario_resposta}
              </div>
              {checkins_historico[0].resposta_texto && (
                <div className="text-sm text-gray-700 italic">
                  "{checkins_historico[0].resposta_texto}"
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default CheckInsHistorico;
