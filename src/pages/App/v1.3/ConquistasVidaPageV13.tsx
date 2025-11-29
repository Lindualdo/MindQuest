import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Calendar } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

// Dados mockados
const mockConquistas = [
  {
    id: '1',
    titulo: 'Melhorar comunicação no trabalho',
    area: 'Carreira',
    alcancado_em: '2025-11-15',
    detalhamento: 'Consegui ter conversas mais assertivas com minha equipe e apresentar ideias com mais confiança.',
  },
];

const ConquistasVidaPageV13: React.FC = () => {
  const {
    dashboardData,
    setView,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBack = () => {
    setView('jornada');
  };

  const handleNavHome = () => {
    setActiveTab('home');
    setView('dashboard');
  };

  const handleNavPerfil = () => {
    setActiveTab('perfil');
    setView('dashEmocoes');
  };

  const handleNavQuests = () => {
    setActiveTab('quests');
    setView('painelQuests');
  };

  const handleNavConfig = () => {
    setActiveTab('ajustes');
    setView('jornada');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="mq-btn-back"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Conquistas na Vida</h1>
          <p className="mq-page-subtitle">Objetivos que você alcançou</p>
        </div>

        {mockConquistas.length === 0 ? (
          <div className="mq-card p-8 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-[var(--mq-text-subtle)]" />
            <p className="text-sm text-[var(--mq-text-muted)]">
              Você ainda não marcou nenhum objetivo como alcançado.
            </p>
            <p className="text-xs text-[var(--mq-text-subtle)] mt-2">
              Continue trabalhando nos seus objetivos!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockConquistas.map((conquista, index) => (
              <motion.div
                key={conquista.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mq-card p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-[var(--mq-warning-light)]">
                    <Trophy size={20} className="text-[var(--mq-warning)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[var(--mq-text)] mb-1">
                      {conquista.titulo}
                    </h3>
                    <p className="text-xs text-[var(--mq-text-muted)]">{conquista.area}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-[var(--mq-text)]">{conquista.detalhamento}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--mq-text-muted)]">
                  <Calendar size={14} />
                  <span>Alcançado em {formatDate(conquista.alcancado_em)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BottomNavV1_3
        active={activeTab}
        onHome={handleNavHome}
        onPerfil={handleNavPerfil}
        onQuests={handleNavQuests}
        onConfig={handleNavConfig}
      />
    </div>
  );
};

export default ConquistasVidaPageV13;

