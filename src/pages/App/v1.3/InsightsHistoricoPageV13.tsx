import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lightbulb, Loader2, ArrowUpRight } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { format } from 'date-fns';
import { apiService } from '@/services/apiService';

type InsightHistoricoItem = {
  id: string;
  tipo: string;
  categoria: string;
  titulo: string;
  descricao: string;
  icone: string;
  prioridade: string;
  criado_em: string;
};

const InsightsHistoricoPageV13 = () => {
  const { dashboardData, setView, openInsightDetail } = useDashboard();
  const [insights, setInsights] = useState<InsightHistoricoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const userId = dashboardData?.usuario?.id;

  const loadInsights = async () => {
    if (!userId) {
      setError('Usuário não encontrado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getInsightsHistorico(userId);
      setInsights(data);
    } catch (err) {
      console.error('[InsightsHistorico] Erro ao carregar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico de insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      void loadInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleBack = () => {
    setView('dashboard');
    setActiveTab('home');
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

  const handleInsightClick = (insightId: string) => {
    if (insightId) {
      openInsightDetail(insightId).catch(() => null);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541] shadow"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <div className="flex-1 text-right text-[0.7rem] font-semibold uppercase tracking-wide text-[#1C2541]">
            Histórico de Insights
          </div>
        </div>

        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="flex items-start gap-3 border-b border-white/40 bg-white/80 p-5">
            <div className="rounded-2xl bg-[#E0F2FE] p-3">
              <Lightbulb className="text-[#1D4ED8]" size={18} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#1C2541]">Histórico de Insights</h2>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
                <span className="ml-2 text-sm text-[#475569]">Carregando insights...</span>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={loadInsights}
                  className="mt-2 text-xs font-semibold text-red-700 underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!loading && !error && insights.length === 0 && (
              <p className="text-center text-sm text-[#475569]">Nenhum insight encontrado.</p>
            )}

            {!loading && !error && insights.length > 0 && (
              <div className="space-y-3">
                {insights.map((insight) => {
                  const dataInsight = insight.criado_em ? new Date(insight.criado_em) : null;
                  
                  return (
                    <button
                      key={insight.id}
                      type="button"
                      onClick={() => handleInsightClick(insight.id)}
                      className="w-full rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-3 text-left shadow-md transition-all hover:bg-[#D1E7E9] hover:shadow-lg active:scale-[0.98]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-[#1C2541]">
                            {insight.titulo}
                          </h3>
                          {dataInsight && (
                            <p className="mt-1 text-xs text-[#64748B]">
                              {format(dataInsight, 'dd/MM/yyyy')}
                            </p>
                          )}
                          {insight.descricao && (
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#475569]">
                              {insight.descricao}
                            </p>
                          )}
                        </div>
                        <ArrowUpRight className="ml-2 flex-shrink-0 text-[#2563EB]" size={16} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
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

export default InsightsHistoricoPageV13;
