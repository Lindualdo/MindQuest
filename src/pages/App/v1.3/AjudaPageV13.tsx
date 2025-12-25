import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Brain, 
  Zap, 
  TrendingUp,
  Sparkles,
  BookOpen,
  Target,
  Trophy,
  LineChart,
  Lightbulb,
  CheckCircle2,
  Bell,
  Calendar,
  Heart,
  Shield,
  Users,
  Smile,
  Battery
} from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import { useDashboard } from '@/store/useStore';

type SectionId = 'conversar' | 'entender' | 'agir' | 'evoluir';

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const sectionColors: Record<SectionId, { bg: string; accent: string; icon: string }> = {
  conversar: {
    bg: 'bg-sky-50',
    accent: 'text-sky-600',
    icon: 'bg-sky-100 text-sky-600'
  },
  entender: {
    bg: 'bg-emerald-50',
    accent: 'text-emerald-600',
    icon: 'bg-emerald-100 text-emerald-600'
  },
  agir: {
    bg: 'bg-amber-50',
    accent: 'text-amber-600',
    icon: 'bg-amber-100 text-amber-600'
  },
  evoluir: {
    bg: 'bg-fuchsia-50',
    accent: 'text-fuchsia-600',
    icon: 'bg-fuchsia-100 text-fuchsia-600'
  }
};

const sectionsData: Record<SectionId, { title: string; emoji: string; features: Feature[] }> = {
  conversar: {
    title: 'Conversar',
    emoji: '🗣️',
    features: [
      { icon: <MessageCircle size={18} />, title: 'Mentor IA', desc: 'Converse sobre sua vida e objetivos' },
      { icon: <Sparkles size={18} />, title: 'Reflexão Diária', desc: 'Check-in guiado toda manhã' },
      { icon: <BookOpen size={18} />, title: 'Resumos', desc: 'Revise conversas e faça anotações' },
      { icon: <Lightbulb size={18} />, title: 'Insights', desc: 'Receba descobertas personalizadas' },
    ]
  },
  entender: {
    title: 'Entender',
    emoji: '🧠',
    features: [
      { icon: <Smile size={18} />, title: 'Humor', desc: 'Acompanhe seu humor ao longo do tempo' },
      { icon: <Battery size={18} />, title: 'Energia', desc: 'Monitore seus níveis de energia' },
      { icon: <Heart size={18} />, title: 'Roda de Emoções', desc: 'Visualize seu estado emocional' },
      { icon: <Shield size={18} />, title: 'Padrão de Pensamento', desc: 'Identifique sabotadores que te limitam' },
      { icon: <Users size={18} />, title: 'Padrão de Personalidade', desc: 'Conheça seus traços Big Five' },
    ]
  },
  agir: {
    title: 'Agir',
    emoji: '⚡',
    features: [
      { icon: <Target size={18} />, title: 'Quests', desc: 'Receba micro-ações personalizadas' },
      { icon: <CheckCircle2 size={18} />, title: 'Conclusão', desc: 'Marque quests como concluídas' },
      { icon: <Zap size={18} />, title: 'XP e Níveis', desc: 'Ganhe pontos e suba de nível' },
      { icon: <Calendar size={18} />, title: 'Recorrências', desc: 'Configure quests diárias ou semanais' },
    ]
  },
  evoluir: {
    title: 'Evoluir',
    emoji: '📈',
    features: [
      { icon: <Target size={18} />, title: 'Objetivos', desc: 'Configure até 3 metas ativas' },
      { icon: <TrendingUp size={18} />, title: 'Progresso', desc: 'Acompanhe sua evolução' },
      { icon: <Bell size={18} />, title: 'Notificações', desc: 'Lembretes de progresso' },
      { icon: <Trophy size={18} />, title: 'Conquistas', desc: 'Celebre suas vitórias' },
    ]
  }
};

const AjudaPageV13: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const [activeSection, setActiveSection] = useState<SectionId>('conversar');
  const [activeTab, setActiveTab] = useState<TabId>('evoluir');

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBack = () => {
    setView('ajustes');
  };

  const handleNavConversar = () => {
    setActiveTab('conversar');
    setView('conversar');
  };

  const handleNavEntender = () => {
    setActiveTab('entender');
    setView('dashEmocoes');
  };

  const handleNavAgir = () => {
    setActiveTab('agir');
    setView('painelQuests');
  };

  const handleNavEvoluir = () => {
    setActiveTab('evoluir');
    setView('jornada');
  };

  const sections: SectionId[] = ['conversar', 'entender', 'agir', 'evoluir'];
  const sectionIcons: Record<SectionId, React.ReactNode> = {
    conversar: <MessageCircle size={18} />,
    entender: <Brain size={18} />,
    agir: <Zap size={18} />,
    evoluir: <TrendingUp size={18} />
  };

  const currentSection = sectionsData[activeSection];
  const currentColors = sectionColors[activeSection];

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} onBack={handleBack} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Header com Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="mq-page-title">Como Funciona</h1>
          <p className="mt-2 text-base font-semibold text-[var(--mq-accent)]">
            "Mente clara, resultados reais."
          </p>
        </motion.div>

        {/* Tabs de Seção */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex gap-1 rounded-2xl bg-[var(--mq-surface)] p-1.5"
        >
          {sections.map((section) => {
            const isActive = activeSection === section;
            const colors = sectionColors[section];
            return (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`
                  flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-semibold
                  transition-all duration-200
                  ${isActive 
                    ? `${colors.bg} ${colors.accent} shadow-sm` 
                    : 'text-[var(--mq-text-muted)] hover:bg-[var(--mq-card)]/50'
                  }
                `}
              >
                {sectionIcons[section]}
                <span className="capitalize">{section}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Conteúdo da Seção */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Título da Seção */}
            <div className={`mb-4 rounded-2xl ${currentColors.bg} p-4`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentSection.emoji}</span>
                <div>
                  <h2 className={`text-lg font-bold ${currentColors.accent}`}>
                    {currentSection.title}
                  </h2>
                  <p className="text-xs text-[var(--mq-text-muted)]">
                    {activeSection === 'conversar' && 'Diálogo com Mentor IA'}
                    {activeSection === 'entender' && 'Análise automatizada'}
                    {activeSection === 'agir' && 'Execução de micro-ações'}
                    {activeSection === 'evoluir' && 'Visão macro de progresso'}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {currentSection.features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.05 }}
                  className="mq-card overflow-hidden"
                >
                  <div className="flex items-start gap-3 p-4">
                    <div className={`rounded-xl p-2.5 ${currentColors.icon}`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[var(--mq-text)]">
                        {feature.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-[var(--mq-text-muted)]">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-[var(--mq-text-subtle)]">
            MindQuest v1.3 — Autoconhecimento que vira ação
          </p>
        </motion.div>
      </main>

      <BottomNavV1_3
        active={activeTab}
        onConversar={handleNavConversar}
        onEntender={handleNavEntender}
        onAgir={handleNavAgir}
        onEvoluir={handleNavEvoluir}
      />
    </div>
  );
};

export default AjudaPageV13;

