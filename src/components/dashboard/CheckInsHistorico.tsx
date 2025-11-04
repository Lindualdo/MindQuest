/**
 * ARQUIVO: src/components/dashboard/CheckInsHistorico.tsx
 * AÇÃO: CRIAR novo componente
 * 
 * Check-ins dos últimos 7 dias conforme especificação v1.1
 * Visualização com emojis e status de resposta
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
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

  const formatDateDisplay = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

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
    const label = diaSemana;
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
      wrapper: 'bg-green-50 border-green-200',
      icon: '✓',
      iconColor: 'text-green-600',
    },
    perdido: {
      wrapper: 'bg-slate-100 border-slate-200',
      icon: '✗',
      iconColor: 'text-slate-500',
    },
    pendente: {
      wrapper: 'bg-slate-100 border-slate-200',
      icon: '⏳',
      iconColor: 'text-slate-500',
    },
    default: {
      wrapper: 'bg-slate-100 border-slate-200',
      icon: '—',
      iconColor: 'text-slate-400',
    },
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3083DC1A] text-[#3083DC]">
            <Calendar size={20} />
          </span>
          <h3 className="text-xl font-semibold text-[#101828]">Histórico de conversas</h3>
        </div>

        <button
          type="button"
          onClick={() => openResumoConversas().catch(() => null)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#3083DC] transition hover:text-[#2563EB]"
        >
          Resumo
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3">
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
              className="flex flex-col items-center gap-2 text-center"
            >
              <div
                className={`
                  flex h-14 w-14 items-center justify-center rounded-2xl border-2
                  transition-all duration-200
                  ${statusConfig.wrapper}
                `}
              >
                <span className={`text-base font-semibold ${statusConfig.iconColor}`}>
                  {statusConfig.icon}
                </span>
              </div>
              <div className="text-sm font-semibold text-[#101828] uppercase">
                {label.slice(0, 3)}
              </div>
              <div className="text-xs text-[#667085]">
                {dataLabel}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckInsHistorico;
