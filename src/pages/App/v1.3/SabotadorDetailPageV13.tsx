import React, { useMemo, useState } from 'react';
import { ArrowLeft, Target, HeartPulse, ShieldCheck } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { getSabotadorById, sabotadoresCatalogo } from '@/data/sabotadoresCatalogo';

const SectionList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  if (!items.length) return null;
  return (
    <Card className="!p-0 overflow-hidden mq-card">
      <div className="border-b border-[var(--mq-border-subtle)] bg-[var(--mq-card)] px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--mq-text-muted)]">{title}</h3>
      </div>
      <div className="p-4">
        <ul className="space-y-2 text-sm text-[var(--mq-text)]">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--mq-accent-light)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

const SabotadorDetailPageV13: React.FC = () => {
  const { dashboardData, setView, selectedSabotadorId, sabotadorDetailReturnView } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabId>('perfil');

  const sabotadorId =
    selectedSabotadorId ?? dashboardData?.sabotadores?.padrao_principal?.id ?? '';
  const sabotador = useMemo(() => getSabotadorById(sabotadorId), [sabotadorId]);
  const overview = sabotadoresCatalogo.overview;

  const handleBack = () => {
    const returnView = sabotadorDetailReturnView ?? 'dashboard';
    if (returnView === 'dashboard') {
      setView('dashboard');
      setActiveTab('home');
    } else if (returnView === 'dashEmocoes') {
      setView('dashEmocoes');
      setActiveTab('perfil');
    } else {
      setView('dashboard');
      setActiveTab('home');
    }
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
          onHome={handleNavHome}
          onPerfil={handleNavPerfil}
          onQuests={handleNavQuests}
          onConfig={handleNavConfig}
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

        <div className="space-y-4">
          <SectionList title="Características marcantes" items={sabotador.caracteristicas} />
          <SectionList title="Pensamentos típicos" items={sabotador.pensamentosTipicos} />
          <SectionList title="Sentimentos comuns" items={sabotador.sentimentosComuns} />
          <SectionList title="Mentiras usadas para justificar" items={sabotador.mentirasParaJustificar} />
          <Card className="!p-0 overflow-hidden mq-card">
            <div className="border-b border-[var(--mq-border-subtle)] bg-[var(--mq-card)] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--mq-text-muted)]">Impacto</h3>
            </div>
            <div className="flex flex-col gap-4 p-5 text-sm text-[var(--mq-text)]">
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
          <Card className="!p-0 overflow-hidden mq-card">
            <div className="border-b border-[var(--mq-border-subtle)] bg-[var(--mq-card)] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--mq-text-muted)]">Estratégias antídoto</h3>
            </div>
            <div className="space-y-3 p-5">
              {sabotador.estrategiasAntidoto.map((estrategia) => (
                <div key={estrategia} className="flex items-start gap-2 text-sm text-[var(--mq-text)]">
                  <ShieldCheck size={16} className="mt-0.5 text-[var(--mq-success)]" />
                  <span>{estrategia}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="!p-0 overflow-hidden mq-card">
            <div className="border-b border-[var(--mq-border-subtle)] bg-[var(--mq-card)] px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--mq-text-muted)]">Conceito</h3>
            </div>
            <div className="space-y-5 p-5 text-sm leading-relaxed text-[var(--mq-text)]">
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
        onHome={handleNavHome}
        onPerfil={handleNavPerfil}
        onQuests={handleNavQuests}
        onConfig={handleNavConfig}
      />
    </div>
  );
};

export default SabotadorDetailPageV13;
