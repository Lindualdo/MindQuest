/**
 * ARQUIVO: src/components/dashboard/CheckInsHistorico.tsx
 * AÇÃO: CRIAR novo componente
 * 
 * Check-ins dos últimos 7 dias conforme especificação v1.1
 * Visualização com emojis e status de resposta
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MessageCircle, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const CheckInsHistorico: React.FC = () => {
  const { dashboardData } = useStore();
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
    const dataLabel = `${index === 6 ? 'hoje ' : ''}(${dataFormatada})`;
    return {
      date,
      label,
      dataLabel,
      checkin
    };
  });

  const checkinsRespondidos = ultimosSeteDias
    .map((dia) => dia.checkin)
    .filter(
      (checkin): checkin is typeof checkins_historico[number] =>
        Boolean(checkin && checkin.status_resposta === 'respondido')
    );
  const totalRespondidos = checkinsRespondidos.length;
  const humorMedio = totalRespondidos > 0
    ? checkinsRespondidos.reduce((acc, checkin) => acc + checkin.humor_autoavaliado, 0) / totalRespondidos
    : 0;
  const humorMedioFormatado = totalRespondidos > 0
    ? Number(humorMedio).toFixed(2)
    : '0.00';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'respondido': return 'bg-green-100 border-green-300';
      case 'perdido': return 'bg-red-100 border-red-300';
      case 'pendente': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'respondido': return '✓';
      case 'perdido': return '✗';
      case 'pendente': return '⏳';
      default: return '?';
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="text-blue-600" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Conversas diárias (7d)</h3>
      </div>

      {/* Grid dos dias */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {ultimosSeteDias.map(({ checkin, label, dataLabel }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            {/* Status do check-in */}
            <div className={`
              w-12 h-12 mx-auto rounded-xl border-2 flex items-center justify-center
              transition-all duration-200 hover:scale-105 cursor-pointer
              ${checkin ? getStatusColor(checkin.status_resposta) : 'bg-gray-50 border-gray-200'}
            `}>
              {checkin ? (
                <div className="text-center">
                  <div className="text-lg leading-none">
                    {checkin.emoji_dia}
                  </div>
                  <div className="text-xs mt-1 font-bold text-gray-600">
                    {getStatusIcon(checkin.status_resposta)}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">
                  <Calendar size={16} />
                </div>
              )}
            </div>
            
            {/* Dia e data */}
            <div className="text-xs font-semibold text-gray-600 mt-2">
              {label.toLowerCase()}
            </div>
            <div className="text-xs text-gray-500">
              {dataLabel}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {totalRespondidos}
          </div>
          <div className="text-xs text-gray-600">Conversas respondidas</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {humorMedioFormatado}
          </div>
          <div className="text-xs text-gray-600">Humor médio</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {dashboardData.gamificacao.streak_checkins_dias}
          </div>
          <div className="text-xs text-gray-600">Sequência ativa</div>
        </div>
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
