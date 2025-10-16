/**
 * ARQUIVO: src/components/dashboard/GamificacaoPanel.tsx
 * AÇÃO: CRIAR novo componente
 * 
 * Sistema de gamificação completo conforme especificação v1.1
 * XP, níveis, streaks, conquistas e quest diária
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Star, Flame, Award, ArrowRight } from 'lucide-react';
import { useDashboard } from '../../store/useStore';
import type { GamificacaoConquista } from '../../types/emotions';
import Card from '../ui/Card';

const GamificacaoPanel: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const { gamificacao } = dashboardData;

  // Calcular progresso para próximo nível
  const xpTarget = Math.max(gamificacao.xp_proximo_nivel, gamificacao.xp_total || 0, 1);
  const xpParaProximoNivel = Math.max(xpTarget - gamificacao.xp_total, 0);
  const progressoNivel = (gamificacao.xp_total / xpTarget) * 100;

  const conquistasRecentes = useMemo(() => {
    const ordenar = (entradaA: GamificacaoConquista, entradaB: GamificacaoConquista) => {
      const dataA = entradaA.desbloqueada_em ? new Date(entradaA.desbloqueada_em).getTime() : 0;
      const dataB = entradaB.desbloqueada_em ? new Date(entradaB.desbloqueada_em).getTime() : 0;
      return dataB - dataA;
    };

    return [...(gamificacao.conquistas_desbloqueadas || [])]
      .sort(ordenar)
      .slice(0, 4);
  }, [gamificacao.conquistas_desbloqueadas]);

  const getQuestStatusColor = (status: string) => {
    switch (status) {
      case 'completa': return 'bg-green-500';
      case 'parcial': return 'bg-yellow-500';
      case 'pendente': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-yellow-600" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Gamificação</h3>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {/* XP e Nível */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Star className="text-purple-600" size={20} />
                <span className="font-semibold text-gray-800">
                  {gamificacao.titulo_nivel || `Nível ${gamificacao.nivel_atual}`}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {gamificacao.xp_total} XP
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressoNivel, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            
            <div className="text-xs text-gray-500 mt-1 text-center">
              {xpParaProximoNivel} XP para o próximo nível
            </div>
          </div>

          {/* Quest Diária */}
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-blue-600" size={20} />
              <span className="font-semibold text-gray-800">Quest Diária</span>
              <div className={`w-3 h-3 rounded-full ${getQuestStatusColor(gamificacao.quest_diaria_status)}`} />
            </div>
            
            <div className="text-sm text-gray-700 mb-3">
              {gamificacao.quest_diaria_descricao}
            </div>
            
            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${gamificacao.quest_diaria_progresso}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            
            <div className="text-xs text-blue-600 mt-2 text-center">
              {gamificacao.quest_diaria_progresso}% completa
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl"
          >
            <Flame className="text-orange-600" size={24} />
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {gamificacao.streak_conversas_dias}
              </div>
              <div className="text-sm text-gray-600">Dias seguidos</div>
            </div>
          </motion.div>

          {/* Conquistas */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Award className="text-yellow-600" size={20} />
                <span className="font-semibold text-gray-800">Conquistas Recentes</span>
              </div>
              {gamificacao.conquistas_desbloqueadas.length > 0 && (
                <button
                  type="button"
                  onClick={() => setView('conquistas')}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Ver todas
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
            
            {gamificacao.conquistas_desbloqueadas.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
                Nenhuma conquista desbloqueada ainda. Complete a quest diária para começar!
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {conquistasRecentes.map((conquista, index) => (
                  <motion.div
                    key={conquista.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                    className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                  >
                    <div className="text-center space-y-1">
                      <div className="text-xl">{conquista.emoji || '🏆'}</div>
                      <div className="text-xs font-semibold text-gray-800">
                        {conquista.nome}
                      </div>
                      <div className="text-[11px] text-gray-600">
                        +{conquista.xp_bonus} XP • {conquista.desbloqueada_em ? new Date(conquista.desbloqueada_em).toLocaleDateString('pt-BR') : 'Data pendente'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Contador total de conquistas */}
            <div className="text-center mt-4 p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">
                <strong>{gamificacao.conquistas_desbloqueadas.length}</strong> conquistas desbloqueadas
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GamificacaoPanel;
