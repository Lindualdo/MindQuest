import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Minus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const PanasChart: React.FC = () => {
  const { dashboardData } = useStore();
  const { distribuicao_panas } = dashboardData;

  const categories = [
    {
      key: 'positivas',
      label: 'Emoções Positivas',
      value: distribuicao_panas.positivas,
      color: 'bg-green-500',
      icon: Smile,
      textColor: 'text-green-600'
    },
    {
      key: 'negativas',
      label: 'Emoções Negativas',
      value: distribuicao_panas.negativas,
      color: 'bg-red-500',
      icon: Frown,
      textColor: 'text-red-600'
    },
    {
      key: 'neutras',
      label: 'Estado Neutro',
      value: distribuicao_panas.neutras,
      color: 'bg-gray-400',
      icon: Minus,
      textColor: 'text-gray-600'
    },
  ];

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Distribuição Emocional</h3>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={category.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <category.icon className={category.textColor} size={20} />
                <span className="font-medium text-gray-700">{category.label}</span>
              </div>
              <span className={`font-bold ${category.textColor}`}>
                {category.value}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full ${category.color} rounded-full relative`}
                initial={{ width: 0 }}
                animate={{ width: `${category.value}%` }}
                transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/30 rounded-full"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {distribuicao_panas.positivas}%
          </div>
          <div className="text-sm text-gray-600">Positividade Total</div>
          <div className="text-xs text-gray-500 mt-1">
            {distribuicao_panas.positivas >= 60 ? '🏆 Meta alcançada!' : '🎯 Foco nas emoções positivas'}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PanasChart;