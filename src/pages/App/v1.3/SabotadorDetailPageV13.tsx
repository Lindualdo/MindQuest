import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Target, HeartPulse, ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { getSabotadorById, sabotadoresCatalogo } from '@/data/sabotadoresCatalogo';
import { apiService } from '@/services/apiService';
import type { OcorrenciaSabotador } from '@/types/emotions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SectionList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  if (!items.length) return null;
  return (
    <Card className="!p-4 mq-card">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-[var(--mq-text)]">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-accent-light)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const SabotadorDetailPageV13: React.FC = () => {
  const { dashboardData, setView, selectedSabotadorId, sabotadorDetailReturnView } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabId>('entender');
  const [ultimaOcorrencia, setUltimaOcorrencia] = useState<OcorrenciaSabotador | null>(null);
  const [ocorrenciaLoading, setOcorrenciaLoading] = useState(false);
  const [ocorrenciaError, setOcorrenciaError] = useState<string | null>(null);

  const sabotadorId =
    selectedSabotadorId ?? dashboardData?.sabotadores?.padrao_principal?.id ?? '';
  const sabotador = useMemo(() => getSabotadorById(sabotadorId), [sabotadorId]);
  const overview = sabotadoresCatalogo.overview;
  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId || !sabotadorId) {
      return;
    }

    const loadUltimaOcorrencia = async () => {
      try {
        setOcorrenciaLoading(true);
        setOcorrenciaError(null);
        const response = await apiService.getOcorrenciasSabotador(userId, sabotadorId);
        // A primeira ocorrência é a mais recente (já vem ordenada DESC)
        setUltimaOcorrencia(response.ocorrencias?.[0] || null);
      } catch (err) {
        console.error('Erro ao carregar última ocorrência:', err);
        setOcorrenciaError(err instanceof Error ? err.message : 'Erro ao carregar ocorrência');
      } finally {
        setOcorrenciaLoading(false);
      }
    };

    void loadUltimaOcorrencia();
  }, [userId, sabotadorId]);

  const handleBack = () => {
    const returnView = sabotadorDetailReturnView ?? 'dashboard';
    if (returnView === 'dashboard') {
      setView('conversar');
      setActiveTab('conversar');
    } else if (returnView === 'dashEmocoes') {
      setView('dashEmocoes');
      setActiveTab('entender');
    } else if (returnView === 'conexaoAcoesSabotadores') {
      setView('conexaoAcoesSabotadores');
      setActiveTab('evoluir');
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

  if (!sabotador) {
    return (
      <div className="mq-app-v1_3 flex min-h-screen flex-col">
        <HeaderV1_3 nomeUsuario={dashboardData?.usuario?.nome_preferencia ?? 'Aldo'} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-text-muted)]">
              Não encontramos informações adicionais sobre este sabotador. Volte ao dashboard e tente novamente.
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[var(--mq-primary)] underline-offset-2 hover:underline"
            >
              Voltar
              <ArrowLeft size={14} />
            </button>
          </Card>
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
  }

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={dashboardData?.usuario?.nome_preferencia ?? 'Aldo'} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="mq-btn-back"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Card 1: Informações do Sabotador */}
        <Card className="!p-0 overflow-hidden mq-card" hover={false}>
          <div className="flex flex-col gap-3 px-5 py-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[var(--mq-primary)]">
              Sabotador
            </p>
            <h1 className="text-lg font-semibold text-[var(--mq-text)]">
              Meu padrão mental: {sabotador.nome}
            </h1>
            <p className="text-sm leading-relaxed text-[var(--mq-text-muted)]">
              {sabotador.descricao}
            </p>
          </div>
        </Card>

        {/* Card 2: Última Ocorrência */}
        {ocorrenciaLoading && (
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-text-muted)]">Carregando ocorrência...</p>
          </Card>
        )}

        {ocorrenciaError && (
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-error)]">{ocorrenciaError}</p>
          </Card>
        )}

        {!ocorrenciaLoading && !ocorrenciaError && ultimaOcorrencia && (
          <Card className="mq-card">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)]">
                  Última ocorrência
                </p>
                {ultimaOcorrencia.data_ocorrencia && (
                  <span className="text-xs text-[var(--mq-text-muted)]">
                    {format(new Date(ultimaOcorrencia.data_ocorrencia), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                )}
              </div>
              
              {ultimaOcorrencia.resumo_conversa && (
                <p className="text-sm text-[var(--mq-text)] leading-relaxed line-clamp-3">
                  {ultimaOcorrencia.resumo_conversa}
                </p>
              )}

              <button
                type="button"
                onClick={() => setView('sabotadorOcorrencias')}
                className="flex items-center gap-2 text-sm font-semibold text-[var(--mq-primary)] hover:underline mt-2"
              >
                <MessageSquare size={16} />
                Ver histórico de ocorrências
                <ExternalLink size={14} />
              </button>
            </div>
          </Card>
        )}

        {!ocorrenciaLoading && !ocorrenciaError && !ultimaOcorrencia && (
          <Card className="mq-card">
            <p className="text-sm text-[var(--mq-text-muted)]">
              Nenhuma ocorrência registrada para este sabotador.
            </p>
          </Card>
        )}

        <div className="space-y-4">
          <SectionList title="Características marcantes" items={sabotador.caracteristicas} />
          <SectionList title="Pensamentos típicos" items={sabotador.pensamentosTipicos} />
          <SectionList title="Sentimentos comuns" items={sabotador.sentimentosComuns} />
          <SectionList title="Mentiras usadas para justificar" items={sabotador.mentirasParaJustificar} />
          <Card className="!p-5 mq-card">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-4">Impacto</h3>
            <div className="flex flex-col gap-4 text-sm text-[var(--mq-text)]">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--mq-accent)]">
                  <Target size={16} className="text-[var(--mq-accent)]" />
                  Em você
                </p>
                <ul className="mt-2 space-y-2">
                  {sabotador.impacto.emSi.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-accent-light)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--mq-error)]">
                  <HeartPulse size={16} className="text-[var(--mq-error)]" />
                  Nos outros
                </p>
                <ul className="mt-2 space-y-2">
                  {sabotador.impacto.nosOutros.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-error-light)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
          <Card className="!p-5 mq-card">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-3">Estratégias antídoto</h3>
            <div className="space-y-3">
              {sabotador.estrategiasAntidoto.map((estrategia) => (
                <div key={estrategia} className="flex items-start gap-2 text-sm text-[var(--mq-text)]">
                  <ShieldCheck size={16} className="mt-0.5 text-[var(--mq-success)]" />
                  <span>{estrategia}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="!p-5 mq-card">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)] mb-4">Conceito</h3>
            <div className="space-y-5 text-sm leading-relaxed text-[var(--mq-text)]">
              <p>{overview.descricao}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-accent)]">Como esse padrão surgiu</p>
                <p className="mt-2 text-[var(--mq-text)]">{sabotador.funcaoOriginal}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-primary)]">Origem do conceito</p>
                <ul className="mt-2 space-y-2">
                  {overview.origem.map((texto) => (
                    <li key={texto} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-primary-light)]" />
                      <span>{texto}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-primary)]">Estrutura</p>
                <ul className="mt-2 space-y-2">
                  {overview.estrutura.map((texto) => (
                    <li key={texto} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-primary-light)]" />
                      <span>{texto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
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

export default SabotadorDetailPageV13;
