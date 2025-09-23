/**
 * ARQUIVO: src/components/dashboard/GamificacaoPanel.tsx
 * AÇÃO: CRIAR novo componente
 * 
 * Sistema de gamificação completo conforme especificação v1.1
 * XP, níveis, streaks, conquistas e quest diária
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Star, Flame, Award } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const GamificacaoPanel: React.FC = () => {
  const { dashboardData } = useStore();
  const { gamificacao } = dashboardData;

  // Calcular progresso para próximo nível
  const xpParaProximoNivel = gamificacao.proximo_nivel_xp - gamificacao.xp_total;
  const progressoNivel = (gamificacao.xp_total / gamificacao.proximo_nivel_xp) * 100;

  // Mapear conquistas para ícones
  const conquistasMap: Record<string, { icon: string; nome: string; descricao: string }> = {
    'primeira_semana': {
      icon: '🎯',
      nome: 'Primeira Semana',
      descricao: 'Completou a primeira semana de conversas diárias'
    },
    'streak_7_dias': {
      icon: '🔥',
      nome: 'Streak de Fogo',
      descricao: '7 dias consecutivos de conversas'
    },
    'explorador_emocoes': {
      icon: '🌈',
      nome: 'Explorador Emocional',
      descricao: 'Identificou todas as 8 emoções primárias'
    },
    'consistencia_bronze': {
      icon: '🥉',
      nome: 'Consistência Bronze',
      descricao: '30 dias de monitoramento'
    },
    'reflexao_profunda': {
      icon: '🧠',
      nome: 'Reflexão Profunda',
      descricao: 'Adicionou observações em 10 conversas'
    }
  };

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
              <div className="flex items-center gap-2">
                <Star className="text-purple-600" size={20} />
                <span className="font-semibold text-gray-800">Nível {gamificacao.nivel_atual}</span>
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
                {gamificacao.streak_checkins_dias}
              </div>
              <div className="text-sm text-gray-600">conversas seguidas</div>
            </div>
          </motion.div>

          {/* Conquistas */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-yellow-600" size={20} />
              <span className="font-semibold text-gray-800">Conquistas Recentes</span>
            </div>
            
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {gamificacao.conquistas_desbloqueadas.slice(-4).map((conquistaId, index) => {
                const conquista = conquistasMap[conquistaId];
                if (!conquista) return null;
                
                return (
                  <motion.div
                    key={conquistaId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.8 }}
                    className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">{conquista.icon}</div>
                      <div className="text-xs font-semibold text-gray-800 mb-1">
                        {conquista.nome}
                      </div>
                      <div className="text-xs text-gray-600 leading-tight">
                        {conquista.descricao}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
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
