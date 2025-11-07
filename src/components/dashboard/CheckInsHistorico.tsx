/**
 * ARQUIVO: src/components/dashboard/CheckInsHistorico.tsx
 * AÇÃO: CRIAR novo componente
 * 
 * Check-ins dos últimos 7 dias conforme especificação v1.1
 * Visualização com emojis e status de resposta
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Flame } from 'lucide-react';
import { useDashboard } from '../../store/useStore';

const clampToPercent = (value: number) => Math.min(Math.max(value, 0), 100);

const parseMetaFromCodigo = (codigo?: string | null) => {
  if (!codigo) return null;
  const match = codigo.match(/(\d+)/);
  if (!match) return null;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeMetaAlvo = (
  sequenciaStatus: Record<string, unknown> | null | undefined,
  codigo?: string | null
) => {
  if (sequenciaStatus && typeof sequenciaStatus === 'object') {
    const alvo = (sequenciaStatus as Record<string, unknown>).alvo_conversas;
    const parsed = Number(alvo);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.trunc(parsed);
    }
  }

  return parseMetaFromCodigo(codigo) ?? 0;
};

const CheckInsHistorico: React.FC = () => {
  const { dashboardData, openResumoConversas, questSnapshot, questLoading } = useDashboard();
  const { checkins_historico } = dashboardData;
  const snapshot = questSnapshot ?? dashboardData?.questSnapshot ?? null;
  const metaAlvo = snapshot
    ? normalizeMetaAlvo(snapshot.sequencia_status as Record<string, unknown> | null, snapshot.meta_sequencia_codigo)
    : 0;
  const sequenciaAtual = snapshot?.sequencia_atual ?? 0;
  const sequenciaRecorde = snapshot ? Math.max(snapshot.sequencia_recorde ?? 0, sequenciaAtual) : 0;
  const progressoPercentual = metaAlvo > 0 ? clampToPercent((sequenciaAtual / metaAlvo) * 100) : 0;

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
    <div
      className="rounded-[28px] border bg-[#E8F3F5] p-5 sm:p-6 lg:p-7 space-y-6 shadow-sm"
      style={{ borderColor: '#AFC9FF' }}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D0E4FF] text-[#3083DC]">
            <Calendar size={20} />
          </span>
          <h3 className="text-xl font-semibold text-[#101828]">Diário de conversas</h3>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
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
                  flex h-12 w-12 items-center justify-center rounded-xl border-2
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
              <div className="text-xs text-[#667085]">{dataLabel}</div>
            </motion.div>
          );
        })}
      </div>

      {(questLoading && !snapshot) ? (
        <div className="rounded-2xl border px-4 py-4 sm:px-5 sm:py-5" style={{ borderColor: '#F2D2B3', backgroundColor: '#E8F3F5' }}>
          <div className="h-16 animate-pulse rounded-xl bg-white/60" />
        </div>
      ) : snapshot ? (
        <div
          className="rounded-2xl border px-4 py-4 sm:px-5 sm:py-5"
          style={{ borderColor: '#F2D2B3', backgroundColor: '#E8F3F5' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[#475467]">
              <Flame size={18} className="text-[#E86114]" />
              Conversas seguidas
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[#98A2B3]">Máx</p>
              <p className="text-sm font-semibold text-[#E86114]">
                {sequenciaRecorde > 0 ? `${sequenciaRecorde} conversa${sequenciaRecorde === 1 ? '' : 's'}` : '—'}
              </p>
            </div>
          </div>

          <p className="mt-4 text-4xl font-bold text-[#1C2541] leading-none">{sequenciaAtual}</p>

          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-[#D9E0E8]">
              <motion.div
                className="h-1.5 rounded-full bg-[#E86114]"
                initial={{ width: 0 }}
                animate={{ width: `${progressoPercentual}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#475467]">
              <span>
                {sequenciaAtual} conversa{sequenciaAtual === 1 ? '' : 's'}
              </span>
              <span>
                Meta {metaAlvo > 0 ? metaAlvo : '?'} conversa{metaAlvo === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="flex justify-end border-t pt-4"
        style={{ borderColor: 'rgba(48, 131, 220, 0.22)' }}
      >
        <button
          type="button"
          onClick={() => openResumoConversas().catch(() => null)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#3083DC] transition hover:text-[#2563EB]"
        >
          Resumos
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default CheckInsHistorico;
