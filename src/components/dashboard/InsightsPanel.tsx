import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const InsightsPanel: React.FC = () => {
  const { dashboardData } = useStore();
  const { insights } = dashboardData;

  const getInsightIcon = (tipo: string) => {
    switch (tipo) {
      case 'padrao': return Zap;
      case 'melhoria': return Target;
      case 'positivo': return Trophy;
      case 'alerta': return AlertTriangle;
      default: return Zap;
    }
  };

  const getInsightStyle = (tipo: string) => {
    switch (tipo) {
      case 'padrao': return {
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-200'
      };
      case 'melhoria': return {
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600',
        borderColor: 'border-orange-200'
      };
      case 'positivo': return {
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
        borderColor: 'border-green-200'
      };
      case 'alerta': return {
        bgColor: 'bg-red-50',
        iconColor: 'text-red-600',
        borderColor: 'border-red-200'
      };
      default: return {
        bgColor: 'bg-gray-50',
        iconColor: 'text-gray-600',
        borderColor: 'border-gray-200'
      };
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-yellow-600" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Quest Insights</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.tipo);
          const styles = getInsightStyle(insight.tipo);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-l-4 ${styles.bgColor} ${styles.borderColor} hover:shadow-md transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white ${styles.iconColor}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{insight.titulo}</h4>
                    <span className="text-xl">{insight.icone}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {insight.descricao}
                  </p>
                  {insight.tipo === 'positivo' && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        <Trophy size={12} />
                        +10 XP conquistados
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quest Progress */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Quest do Dia</span>
          <span className="text-sm text-gray-500">3/5 ✨</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Continue registrando suas emoções para completar a quest diária!
        </p>
      </div>
    </Card>
  );
};

export default InsightsPanel;