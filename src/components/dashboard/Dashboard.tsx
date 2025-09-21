import React from 'react';
import { motion } from 'framer-motion';
import PeriodSelector from './PeriodSelector';
import MoodGauge from './MoodGauge';
import PanasChart from './PanasChart';
import EmotionWheel from './EmotionWheel';
import InsightsPanel from './InsightsPanel';
import DailyMoodChart from './DailyMoodChart';
import { useStore } from '../../store/useStore';

const Dashboard: React.FC = () => {
  const { isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-white/50 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-80 bg-white/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Period Selector */}
      <PeriodSelector />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Mood Gauge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MoodGauge />
        </motion.div>

        {/* PANAS Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PanasChart />
        </motion.div>

        {/* Emotion Wheel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <EmotionWheel />
        </motion.div>

        {/* Insights Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <InsightsPanel />
        </motion.div>

        {/* Daily Mood Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DailyMoodChart />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
