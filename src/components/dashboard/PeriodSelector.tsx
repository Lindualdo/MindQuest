import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { PeriodType } from '../../types/emotions';
import Card from '../ui/Card';

const PeriodSelector: React.FC = () => {
  const { currentPeriod, setPeriod, fetchData } = useStore();

  const periods = [
    { key: 'semana' as PeriodType, label: 'Semana', icon: Calendar },
    { key: 'mes' as PeriodType, label: 'Mês', icon: BarChart3 },
    { key: 'trimestre' as PeriodType, label: 'Trimestre', icon: TrendingUp },
  ];

  const handlePeriodChange = async (period: PeriodType) => {
    setPeriod(period);
    await fetchData(period);
  };

  return (
    <Card className="!p-4" hover={false}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600">Quest Ativo</span>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
            Dia 7 🔥
          </span>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1">
          {periods.map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePeriodChange(key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${currentPeriod === key
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
            >
              <Icon size={16} />
              {label}
            </motion.button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PeriodSelector;