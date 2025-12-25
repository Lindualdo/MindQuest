import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lightbulb, ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { apiService } from '@/services/apiService';
import type { OcorrenciaSabotador } from '@/types/emotions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SabotadorOcorrenciasPage: React.FC = () => {
  const { dashboardData, setView, selectedSabotadorId, sabotadorDetailReturnView, openConversaResumo } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabId>('entender');
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaSabotador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sabotadorId = selectedSabotadorId ?? dashboardData?.sabotadores?.padrao_principal?.id ?? '';
  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId || !sabotadorId) {
      setError('Dados insuficientes para carregar ocorrências');
      setLoading(false);
      return;
    }

    const loadOcorrencias = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getOcorrenciasSabotador(userId, sabotadorId);
        setOcorrencias(response.ocorrencias || []);
      } catch (err) {
        console.error('Erro ao carregar ocorrências:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar ocorrências');
      } finally {
        setLoading(false);
      }
    };

    void loadOcorrencias();
  }, [userId, sabotadorId]);

  const handleBack = () => {
    const returnView = sabotadorDetailReturnView ?? 'dashboard';
    if (returnView === 'dashboard') {
      setView('conversar');
      setActiveTab('conversar');
    } else if (returnView === 'dashEmocoes') {
      setView('sabotadorDetail');
      setActiveTab('entender');
    } else {
      setView('conversar');
      setActiveTab('conversar');
    }
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
    setView('evoluir');
  };

  const handleVerConversa = (chatId: string | null) => {
    if (!chatId) return;
    openConversaResumo(chatId);
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3
        nomeUsuario={dashboardData?.usuario?.nome_preferencia ?? 'Usuário'}
        onBack={handleBack}
      />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">

        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Ocorrências</h1>
          <p className="mq-page-subtitle">Histórico de detecções deste sabotador</p>
        </div>

        {loading && (
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-text-muted)]">Carregando ocorrências...</p>
          </Card>
        )}

        {error && (
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-error)]">{error}</p>
          </Card>
        )}

        {!loading && !error && ocorrencias.length === 0 && (
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-text-muted)]">
              Nenhuma ocorrência registrada para este sabotador.
            </p>
          </Card>
        )}

        {!loading && !error && ocorrencias.length > 0 && (
          <div className="space-y-4">
            {ocorrencias.map((ocorrencia) => (
              <Card key={ocorrencia.id} className="mq-card">
                <div className="space-y-4">
                  {ocorrencia.data_ocorrencia && (
                    <div className="text-xs text-[var(--mq-text-muted)]">
                      {format(new Date(ocorrencia.data_ocorrencia), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  )}

                  {ocorrencia.contexto_principal && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-1">
                        Contexto
                      </p>
                      <p className="text-sm text-[var(--mq-text)]">{ocorrencia.contexto_principal}</p>
                    </div>
                  )}

                  {ocorrencia.insight_atual && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={16} className="text-[var(--mq-primary)]" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-primary)]">
                          Insight
                        </p>
                      </div>
                      <p className="text-sm text-[var(--mq-text)] leading-relaxed">
                        {ocorrencia.insight_atual}
                      </p>
                    </div>
                  )}

                  {ocorrencia.contramedida_ativa && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={16} className="text-[var(--mq-success)]" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-success)]">
                          Contramedida
                        </p>
                      </div>
                      <p className="text-sm text-[var(--mq-text)] leading-relaxed">
                        {ocorrencia.contramedida_ativa}
                      </p>
                    </div>
                  )}

                  {ocorrencia.intensidade_media && (
                    <div className="text-xs text-[var(--mq-text-muted)]">
                      Intensidade: <strong>{Number(ocorrencia.intensidade_media).toFixed(1)}%</strong>
                    </div>
                  )}

                  {ocorrencia.chat_id && (
                    <button
                      type="button"
                      onClick={() => handleVerConversa(ocorrencia.chat_id)}
                      className="flex items-center gap-2 text-sm font-semibold text-[var(--mq-primary)] hover:underline mt-2"
                    >
                      <MessageSquare size={16} />
                      Ver resumo da conversa
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
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

export default SabotadorOcorrenciasPage;

