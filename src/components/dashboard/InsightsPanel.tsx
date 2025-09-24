/**
 * ARQUIVO: src/components/dashboard/InsightsPanel.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Insights Panel baseado na Especificação v1.1
 * Sistema inteligente com categorização por tipo e prioridade
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, Target, Trophy, AlertTriangle, 
  TrendingUp, Brain, Heart, Users, Zap 
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const InsightsPanel: React.FC = () => {
  const { dashboardData } = useStore();
  const { insights } = dashboardData;

  const getInsightIcon = (tipo: string, categoria: string) => {
    // Priorizar por tipo primeiro
    switch (tipo) {
      case 'positivo': return Trophy;
      case 'alerta': return AlertTriangle;
      case 'melhoria': return Target;
      case 'padrao': 
        // Para padrão, usar ícone baseado na categoria
        switch (categoria) {
          case 'comportamental': return TrendingUp;
          case 'emocional': return Heart;
          case 'social': return Users;
          case 'cognitivo': return Brain;
          default: return Zap;
        }
      default: return Lightbulb;
    }
  };

  const getInsightStyle = (tipo: string, prioridade: string) => {
    const baseStyle = {
      borderColor: '',
      bgColor: '',
      iconColor: '',
      priorityIndicator: ''
    };

    // Cores por tipo
    switch (tipo) {
      case 'positivo':
        baseStyle.bgColor = 'bg-green-50';
        baseStyle.iconColor = 'text-green-600';
        baseStyle.borderColor = 'border-l-green-500';
        break;
      case 'alerta':
        baseStyle.bgColor = 'bg-red-50';
        baseStyle.iconColor = 'text-red-600';
        baseStyle.borderColor = 'border-l-red-500';
        break;
      case 'melhoria':
        baseStyle.bgColor = 'bg-orange-50';
        baseStyle.iconColor = 'text-orange-600';
        baseStyle.borderColor = 'border-l-orange-500';
        break;
      case 'padrao':
        baseStyle.bgColor = 'bg-blue-50';
        baseStyle.iconColor = 'text-blue-600';
        baseStyle.borderColor = 'border-l-blue-500';
        break;
      default:
        baseStyle.bgColor = 'bg-gray-50';
        baseStyle.iconColor = 'text-gray-600';
        baseStyle.borderColor = 'border-l-gray-500';
    }

    // Indicador de prioridade
    switch (prioridade) {
      case 'alta':
        baseStyle.priorityIndicator = 'bg-red-500';
        break;
      case 'media':
        baseStyle.priorityIndicator = 'bg-yellow-500';
        break;
      case 'baixa':
        baseStyle.priorityIndicator = 'bg-green-500';
        break;
    }

    return baseStyle;
  };

  const getCategoriaLabel = (categoria: string) => {
    switch (categoria) {
      case 'comportamental': return '🎯 Comportamental';
      case 'emocional': return '❤️ Emocional';
      case 'social': return '👥 Social';
      case 'cognitivo': return '🧠 Cognitivo';
      default: return '💡 Geral';
    }
  };

  // Ordenar insights por prioridade e data
  const insightsOrdenados = [...insights].sort((a, b) => {
    const prioridadeOrder = { 'alta': 3, 'media': 2, 'baixa': 1 };
    const prioridadeA = prioridadeOrder[a.prioridade as keyof typeof prioridadeOrder] || 0;
    const prioridadeB = prioridadeOrder[b.prioridade as keyof typeof prioridadeOrder] || 0;
    
    if (prioridadeA !== prioridadeB) {
      return prioridadeB - prioridadeA;
    }
    
    return new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime();
  });

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="text-yellow-600" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Insights Inteligentes</h3>
        <div className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {insights.length} insights
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {insightsOrdenados.map((insight, index) => {
          const Icon = getInsightIcon(insight.tipo, insight.categoria);
          const styles = getInsightStyle(insight.tipo, insight.prioridade);

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-4 rounded-xl border-l-4 ${styles.bgColor} ${styles.borderColor}
                hover:shadow-md transition-all duration-200 cursor-pointer
                hover:scale-[1.02] group
              `}
            >
              {/* Indicador de prioridade */}
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${styles.priorityIndicator}`} />
              
              <div className="flex items-start gap-3">
                {/* Ícone */}
                <div className={`p-2 rounded-lg bg-white/80 ${styles.iconColor} group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Cabeçalho */}
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800 truncate">
                      {insight.titulo}
                    </h4>
                    <span className="text-xl flex-shrink-0">{insight.icone}</span>
                  </div>
                  
                  {/* Descrição */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 whitespace-pre-line">
                    {insight.descricao}
                  </p>

                  {insight.cta && (
                    <div className="mb-3">
                      <a
                        href={insight.cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                      >
                        {insight.cta.label}
                      </a>
                    </div>
                  )}
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 bg-white/60 px-2 py-1 rounded-full">
                      {getCategoriaLabel(insight.categoria)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${insight.prioridade === 'alta' ? 'bg-red-100 text-red-700' :
                          insight.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'}`}
                      >
                        {insight.prioridade === 'alta' ? '🔥 Alta' :
                         insight.prioridade === 'media' ? '⚡ Média' : '💚 Baixa'}
                      </span>
                      
                      <span className="text-gray-400">
                        {new Date(insight.data_criacao).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer com estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 pt-4 border-t border-gray-100"
      >
        <div className="grid grid-cols-4 gap-2 text-center">
          {['positivo', 'melhoria', 'padrao', 'alerta'].map((tipo) => {
            const count = insights.filter(i => i.tipo === tipo).length;
            const emoji = tipo === 'positivo' ? '🏆' : 
                         tipo === 'melhoria' ? '🎯' :
                         tipo === 'padrao' ? '💡' : '⚠️';
            
            return (
              <div key={tipo} className="p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  <span>{emoji}</span>
                  <span className="capitalize">{tipo}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </Card>
  );
};

export default InsightsPanel;
