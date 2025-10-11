/**
 * ARQUIVO: src/components/dashboard/PanasChart.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * PANAS Chart baseado na Especificação v1.1
 * Afetos positivos/negativos com meta de positividade
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Minus, Target, TrendingUp, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const PanasChart: React.FC = () => {
  const { dashboardData } = useStore();
  const { distribuicao_panas } = dashboardData;
  const [showInfo, setShowInfo] = React.useState(false);

  const categories = [
    {
      key: 'positivas',
      label: 'Positivos',
      value: distribuicao_panas.positivas,
      color: 'bg-green-500',
      icon: Smile,
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'negativas',
      label: 'Desafiador',
      value: distribuicao_panas.negativas,
      color: 'bg-red-500',
      icon: Frown,
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      key: 'neutras',
      label: 'Neutro/Calmo',
      value: distribuicao_panas.neutras,
      color: 'bg-gray-400',
      icon: Minus,
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const metaAtingida = distribuicao_panas.positivas >= distribuicao_panas.meta_positividade;
  const progressoMeta = (distribuicao_panas.positivas / distribuicao_panas.meta_positividade) * 100;

  return (
    <Card className="h-full flex flex-col overflow-visible">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Meus Sentimentos</h3>
          <p className="text-sm text-gray-500">Sentimentos da semana</p>
        </div>
        <div className="relative">
          <button
            type="button"
            aria-label="Informações sobre o painel de sentimentos"
            className="p-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            <Info size={16} />
          </button>
          {showInfo && (
            <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white p-4 text-xs text-gray-600 shadow-2xl z-30">
              <p><strong>Descubra:</strong> qual tipo de sentimento predominou nos últimos 7 dias.</p>
              <p className="mt-1"><strong>Cálculo:</strong> baseado na intensidade das emoções detectadas.</p>
              <p className="mt-1"><strong>Modelo:</strong> PANAS.</p>
            </div>
          )}
        </div>
      </div>
      {/* Barras de distribuição */}
      <div className="space-y-4 mb-6">
        {categories.map((category, index) => (
          <div key={category.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <category.icon className={category.textColor} size={18} />
                </div>
                <span className="font-medium text-gray-700">{category.label}</span>
              </div>
              <span className={`font-bold text-lg ${category.textColor}`}>
                {category.value}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className={`h-full ${category.color} rounded-full relative`}
                initial={{ width: 0 }}
                animate={{ width: `${category.value}%` }}
                transition={{ duration: 1.2, delay: index * 0.2, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-white/30 rounded-full"
                  animate={{ x: [-100, 100] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: index * 0.3 
                  }}
                />
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Meta de Positividade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
      >
        <div className="flex items-center gap-2 mb-3">
          <Target className="text-blue-600" size={20} />
          <span className="font-semibold text-gray-800">Meta de Positividade</span>
          {metaAtingida && <span className="text-lg">🎯</span>}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Meta: {distribuicao_panas.meta_positividade}%
          </span>
          <span className={`text-sm font-semibold ${metaAtingida ? 'text-green-600' : 'text-blue-600'}`}>
            {distribuicao_panas.positivas}% atual
          </span>
        </div>
        
        <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden mb-3">
          <motion.div
            className={`h-full rounded-full ${metaAtingida ? 'bg-green-500' : 'bg-blue-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressoMeta, 100)}%` }}
            transition={{ duration: 1.5, delay: 1 }}
          />
        </div>
        
        <div className="text-center">
          {metaAtingida ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">Meta alcançada! 🏆</span>
            </div>
          ) : (
            <div className="text-sm text-blue-600">
              Faltam {distribuicao_panas.meta_positividade - distribuicao_panas.positivas}% para atingir a meta
            </div>
          )}
        </div>
      </motion.div>

      {/* Status da distribuição */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-auto text-center"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          ${distribuicao_panas.status_meta === 'atingida' ? 'bg-green-100 text-green-800' :
            distribuicao_panas.status_meta === 'progresso' ? 'bg-blue-100 text-blue-800' :
            'bg-orange-100 text-orange-800'}`}
        >
          {distribuicao_panas.status_meta === 'atingida' && '✓ Excelente equilíbrio emocional'}
          {distribuicao_panas.status_meta === 'progresso' && '📈 Progredindo bem'}
          {distribuicao_panas.status_meta === 'atencao' && '⚠️ Foque mais nas emoções positivas'}
        </div>
      </motion.div>
    </Card>
  );
};

export default PanasChart;
