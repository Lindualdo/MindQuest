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

  // Mapear dias da semana
  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  
  // Garantir que temos 7 dias (preencher com vazios se necessário)
  const ultimosSeteDias = Array(7).fill(null).map((_, index) => {
    return checkins_historico[index] || null;
  });

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
        <h3 className="text-xl font-semibold text-gray-800">Check-ins (7d)</h3>
      </div>

      {/* Grid dos dias */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {ultimosSeteDias.map((checkin, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            {/* Dia da semana */}
            <div className="text-xs font-medium text-gray-500 mb-2">
              {diasSemana[index]}
            </div>
            
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
            
            {/* Score de humor */}
            {checkin && checkin.status_resposta === 'respondido' && (
              <div className="text-xs font-semibold text-gray-600 mt-1">
                {checkin.humor_autoavaliado}/10
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {checkins_historico.filter(c => c.status_resposta === 'respondido').length}
          </div>
          <div className="text-xs text-gray-600">Respondidos</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {checkins_historico.reduce((acc, c) => 
              c.status_resposta === 'respondido' ? acc + c.humor_autoavaliado : acc, 0
            ) / checkins_historico.filter(c => c.status_resposta === 'respondido').length || 0}
          </div>
          <div className="text-xs text-gray-600">Média</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {dashboardData.gamificacao.streak_checkins_dias}
          </div>
          <div className="text-xs text-gray-600">Streak</div>
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
                Último check-in
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