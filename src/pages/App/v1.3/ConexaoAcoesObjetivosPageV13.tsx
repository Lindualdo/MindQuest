import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Zap, CheckCircle2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

interface Quest {
  id: string;
  titulo: string;
  tipo_impacto: 'direto' | 'indireto';
  concluidas: number;
  total: number;
  percentual: number;
}

interface Objetivo {
  id: string;
  titulo: string;
  is_padrao: boolean;
  area: {
    nome: string;
    icone: string;
  };
  quests: Quest[];
}

const ConexaoAcoesObjetivosPageV13: React.FC = () => {
  const { dashboardData, setView } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const userId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const loadData = async () => {
      if (!userId) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/conexao-objetivos?user_id=${userId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || 'Erro ao carregar dados');
          setLoading(false);
          return;
        }

        setObjetivos(data.objetivos || []);
        setError(null);
      } catch (err) {
        console.error('[ConexaoObjetivos] Erro:', err);
        setError('Erro ao conectar ao serviço');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleBack = () => {
    setView('evoluir');
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
    setView('evoluir');
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button type="button" onClick={handleBack} className="mq-btn-back">
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Conexão Ações × Objetivos</h1>
          <p className="mq-page-subtitle">Quais ações impactaram cada objetivo</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--mq-primary)] border-t-transparent" />
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="mq-card p-6 text-center border border-red-500/30 bg-red-500/10 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Conteúdo */}
        {!loading && !error && (
          <div className="space-y-4">
            {objetivos.length === 0 ? (
              <div className="mq-card p-8 text-center">
                <Target size={48} className="mx-auto mb-4 text-[var(--mq-text-subtle)]" />
                <p className="text-sm text-[var(--mq-text-muted)]">
                  Você ainda não tem objetivos ativos.
                </p>
                <p className="text-xs text-[var(--mq-text-subtle)] mt-2">
                  Defina objetivos para ver como suas ações contribuem para alcançá-los.
                </p>
              </div>
            ) : (
              objetivos.map((objetivo, index) => (
                <motion.div
                  key={objetivo.id}
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
                        {objetivo.titulo}
                      </h3>
                      <p className="text-xs text-[var(--mq-text-muted)]">{objetivo.area.nome}</p>
                    </div>
                  </div>

                  {/* Ações */}
                  {objetivo.quests.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-[var(--mq-text-muted)] uppercase tracking-wide">
                        Ações relacionadas
                      </p>
                      {objetivo.quests.map((quest) => (
                        <div key={quest.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <Zap size={14} className="text-[var(--mq-primary)]" />
                              <span className="text-sm text-[var(--mq-text)]">{quest.titulo}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[var(--mq-text-muted)]">
                              <CheckCircle2 size={12} />
                              <span>{quest.concluidas}/{quest.total}</span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-[var(--mq-bar)] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${quest.percentual}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-full bg-[var(--mq-primary)] rounded-full"
                            />
                          </div>
                          <p className="text-xs text-[var(--mq-text-muted)] text-right">
                            {quest.percentual}% concluído
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--mq-text-subtle)] italic">
                      Nenhuma ação vinculada ainda
                    </p>
                  )}
                </motion.div>
              ))
            )}
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
