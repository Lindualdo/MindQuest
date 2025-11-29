import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Zap, CheckCircle2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

// Dados mockados
const mockConexoes = [
  {
    objetivo_id: '1',
    objetivo_titulo: 'Melhorar comunicação no trabalho',
    objetivo_area: 'Carreira',
    acoes: [
      { id: '1', titulo: 'Praticar respiração antes de reuniões', concluidas: 8, total: 12 },
      { id: '2', titulo: 'Anotar pontos principais antes de falar', concluidas: 5, total: 10 },
    ],
  },
  {
    objetivo_id: '2',
    objetivo_titulo: 'Reduzir ansiedade e estresse',
    objetivo_area: 'Saúde',
    acoes: [
      { id: '3', titulo: 'Meditação diária de 10 minutos', concluidas: 15, total: 21 },
      { id: '4', titulo: 'Caminhada matinal', concluidas: 12, total: 18 },
    ],
  },
];

const ConexaoAcoesObjetivosPageV13: React.FC = () => {
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
          <h1 className="mq-page-title">Conexão Ações × Objetivos</h1>
          <p className="mq-page-subtitle">Quais ações impactaram cada objetivo</p>
        </div>

        <div className="space-y-4">
          {mockConexoes.map((conexao, index) => (
            <motion.div
              key={conexao.objetivo_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mq-card p-5"
            >
              {/* Objetivo */}
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-xl bg-[var(--mq-primary-light)]">
                  <Target size={20} className="text-[var(--mq-primary)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[var(--mq-text)] mb-1">
                    {conexao.objetivo_titulo}
                  </h3>
                  <p className="text-xs text-[var(--mq-text-muted)]">{conexao.objetivo_area}</p>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[var(--mq-text-muted)] uppercase tracking-wide">
                  Ações relacionadas
                </p>
                {conexao.acoes.map((acao) => {
                  const percentual = Math.round((acao.concluidas / acao.total) * 100);
                  return (
                    <div key={acao.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Zap size={14} className="text-[var(--mq-primary)]" />
                          <span className="text-sm text-[var(--mq-text)]">{acao.titulo}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[var(--mq-text-muted)]">
                          <CheckCircle2 size={12} />
                          <span>{acao.concluidas}/{acao.total}</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-[var(--mq-bar)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentual}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-[var(--mq-primary)] rounded-full"
                        />
                      </div>
                      <p className="text-xs text-[var(--mq-text-muted)] text-right">
                        {percentual}% concluído
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {mockConexoes.length === 0 && (
          <div className="mq-card p-8 text-center">
            <Target size={48} className="mx-auto mb-4 text-[var(--mq-text-subtle)]" />
            <p className="text-sm text-[var(--mq-text-muted)]">
              Você ainda não tem objetivos ativos.
            </p>
            <p className="text-xs text-[var(--mq-text-subtle)] mt-2">
              Defina objetivos para ver como suas ações contribuem para alcançá-los.
            </p>
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

export default ConexaoAcoesObjetivosPageV13;

