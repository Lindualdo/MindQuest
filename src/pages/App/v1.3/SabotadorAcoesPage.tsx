import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Target, CheckCircle2, Clock, XCircle } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { apiService } from '@/services/apiService';
import type { AcaoSabotador } from '@/types/emotions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SabotadorAcoesPage: React.FC = () => {
  const { dashboardData, setView, selectedSabotadorId, sabotadorDetailReturnView } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabId>('entender');
  const [acoes, setAcoes] = useState<AcaoSabotador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sabotadorId = selectedSabotadorId ?? dashboardData?.sabotadores?.padrao_principal?.id ?? '';
  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId || !sabotadorId) {
      setError('Dados insuficientes para carregar ações');
      setLoading(false);
      return;
    }

    const loadAcoes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getAcoesSabotador(userId, sabotadorId);
        setAcoes(response.acoes || []);
      } catch (err) {
        console.error('Erro ao carregar ações:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar ações');
      } finally {
        setLoading(false);
      }
    };

    void loadAcoes();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativa':
        return <CheckCircle2 size={18} className="text-[var(--mq-success)]" />;
      case 'disponivel':
        return <Clock size={18} className="text-[var(--mq-primary)]" />;
      case 'inativa':
        return <XCircle size={18} className="text-[var(--mq-text-muted)]" />;
      default:
        return <Target size={18} className="text-[var(--mq-text-muted)]" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'Ativa';
      case 'disponivel':
        return 'Disponível';
      case 'inativa':
        return 'Inativa';
      default:
        return status;
    }
  };

  const acoesAgrupadas = useMemo(() => {
    const grupos: Record<string, AcaoSabotador[]> = {
      ativa: [],
      disponivel: [],
      inativa: [],
    };

    acoes.forEach((acao) => {
      const grupo = grupos[acao.status] || grupos.inativa;
      grupo.push(acao);
    });

    return grupos;
  }, [acoes]);

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3
        nomeUsuario={dashboardData?.usuario?.nome_preferencia ?? 'Usuário'}
        onBack={handleBack}
      />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">

        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Ações relacionadas</h1>
          <p className="mq-page-subtitle">Quests para trabalhar este sabotador</p>
        </div>

        {loading && (
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-text-muted)]">Carregando ações...</p>
          </Card>
        )}

        {error && (
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-error)]">{error}</p>
          </Card>
        )}

        {!loading && !error && acoes.length === 0 && (
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-text-muted)]">
              Nenhuma ação disponível para este sabotador no momento.
            </p>
          </Card>
        )}

        {!loading && !error && acoes.length > 0 && (
          <div className="space-y-4">
            {acoesAgrupadas.ativa.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">
                  Ações Ativas
                </h2>
                <div className="space-y-3">
                  {acoesAgrupadas.ativa.map((acao) => (
                    <Card key={acao.id} className="mq-card">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(acao.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-[var(--mq-text)]">{acao.titulo}</h3>
                            <span className="text-xs text-[var(--mq-text-muted)]">
                              {getStatusLabel(acao.status)}
                            </span>
                          </div>
                          {acao.descricao && (
                            <p className="text-sm text-[var(--mq-text-muted)] mb-2">{acao.descricao}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-[var(--mq-text-subtle)]">
                            {acao.xp_recompensa && (
                              <span>XP: {acao.xp_recompensa}</span>
                            )}
                            {acao.ativado_em && (
                              <span>
                                Ativada em:{' '}
                                {format(new Date(acao.ativado_em), "dd 'de' MMM", { locale: ptBR })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {acoesAgrupadas.disponivel.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">
                  Ações Disponíveis
                </h2>
                <div className="space-y-3">
                  {acoesAgrupadas.disponivel.map((acao) => (
                    <Card key={acao.id} className="mq-card">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(acao.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-[var(--mq-text)]">{acao.titulo}</h3>
                            <span className="text-xs text-[var(--mq-text-muted)]">
                              {getStatusLabel(acao.status)}
                            </span>
                          </div>
                          {acao.descricao && (
                            <p className="text-sm text-[var(--mq-text-muted)] mb-2">{acao.descricao}</p>
                          )}
                          {acao.xp_recompensa && (
                            <span className="text-xs text-[var(--mq-text-subtle)]">
                              XP: {acao.xp_recompensa}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {acoesAgrupadas.inativa.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">
                  Ações Inativas
                </h2>
                <div className="space-y-3">
                  {acoesAgrupadas.inativa.map((acao) => (
                    <Card key={acao.id} className="mq-card opacity-60">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(acao.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-[var(--mq-text)]">{acao.titulo}</h3>
                            <span className="text-xs text-[var(--mq-text-muted)]">
                              {getStatusLabel(acao.status)}
                            </span>
                          </div>
                          {acao.descricao && (
                            <p className="text-sm text-[var(--mq-text-muted)] mb-2">{acao.descricao}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
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

export default SabotadorAcoesPage;

