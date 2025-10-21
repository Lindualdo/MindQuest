/**
 * ARQUIVO: src/components/dashboard/PanasChart.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * PANAS Chart baseado na Especificação v1.1
 * Afetos positivos/negativos com meta de positividade
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Minus, Info, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Card from '../ui/Card';

const PanasChart: React.FC = () => {
  const { dashboardData, setView } = useStore();
  const { distribuicao_panas } = dashboardData;
  const [showInfo, setShowInfo] = React.useState(false);

  const categories = [
    {
      key: 'positivas',
      label: 'Positivos',
      value: distribuicao_panas.positivas,
      color: 'bg-green-400',
      icon: Smile,
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'negativas',
      label: 'Desafiador',
      value: distribuicao_panas.negativas,
      color: 'bg-rose-400',
      icon: Frown,
      textColor: 'text-rose-600',
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

  const handleLearnMore = () => {
    setView('panasDetail');
  };

  return (
    <Card className="flex h-full flex-col overflow-visible">
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

            <div className="w-full rounded-full h-4 overflow-hidden bg-gray-100">
              <motion.div
                className={`h-full ${category.color} rounded-full relative`}
                initial={{ width: 0 }}
                animate={{ width: `${category.value}%` }}
                transition={{ duration: 1.2, delay: index * 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex justify-center">
        <button
          type="button"
          onClick={handleLearnMore}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2"
        >
          Saiba mais sobre o PANAS
          <ArrowRight size={16} />
        </button>
      </div>
    </Card>
  );
};

export default PanasChart;
