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
    <Card className="!p-0 overflow-hidden">
      <div className="border-b border-white/40 bg-white/70 px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600">{title}</h3>
      </div>
      <div className="p-4">
        <ul className="space-y-2 text-sm text-gray-700">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-purple-200" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

const SabotadorDetailPageV13: React.FC = () => {
  const { dashboardData, setView, selectedSabotadorId } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabId>('perfil');

  const sabotadorId =
    selectedSabotadorId ?? dashboardData?.sabotadores?.padrao_principal?.id ?? '';
  const sabotador = useMemo(() => getSabotadorById(sabotadorId), [sabotadorId]);
  const overview = sabotadoresCatalogo.overview;

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
  };

  if (!sabotador) {
    return (
      <div className="mq-app-v1_3 flex min-h-screen flex-col bg-[#F5EBF3]">
        <HeaderV1_3 nomeUsuario={dashboardData?.usuario?.nome_preferencia ?? 'Aldo'} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
          <Card>
            <p className="text-sm text-[#475569]">
              Não encontramos informações adicionais sobre este sabotador. Volte ao dashboard e tente novamente.
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#2563EB] underline-offset-2 hover:underline"
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
    <div className="mq-app-v1_3 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_3 nomeUsuario={dashboardData?.usuario?.nome_preferencia ?? 'Aldo'} />

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
        </div>

        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="flex flex-col gap-3 border-b border-white/40 bg-white/80 px-5 py-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#2F76D1]">
              Sabotador
            </p>
            <h1 className="text-lg font-semibold text-[#1C2541]">
              Meu padrão mental: {sabotador.nome}
            </h1>
            <p className="text-sm leading-relaxed text-[#475569]">
              {sabotador.descricao}
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <SectionList title="Características marcantes" items={sabotador.caracteristicas} />
          <SectionList title="Pensamentos típicos" items={sabotador.pensamentosTipicos} />
          <SectionList title="Sentimentos comuns" items={sabotador.sentimentosComuns} />
          <SectionList title="Mentiras usadas para justificar" items={sabotador.mentirasParaJustificar} />
          <Card className="!p-0 overflow-hidden">
            <div className="border-b border-white/40 bg-white/70 px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Impacto</h3>
            </div>
            <div className="flex flex-col gap-4 p-5 text-sm text-gray-700">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                  <Target size={16} className="text-purple-500" />
                  Em você
                </p>
                <ul className="mt-2 space-y-2">
                  {sabotador.impacto.emSi.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-purple-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-rose-600">
                  <HeartPulse size={16} className="text-rose-500" />
                  Nos outros
                </p>
                <ul className="mt-2 space-y-2">
                  {sabotador.impacto.nosOutros.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-rose-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
          <Card className="!p-0 overflow-hidden">
            <div className="border-b border-white/40 bg-white/70 px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Estratégias antídoto</h3>
            </div>
            <div className="space-y-3 p-5">
              {sabotador.estrategiasAntidoto.map((estrategia) => (
                <div key={estrategia} className="flex items-start gap-2 text-sm text-gray-700">
                  <ShieldCheck size={16} className="mt-0.5 text-emerald-500" />
                  <span>{estrategia}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="!p-0 overflow-hidden">
            <div className="border-b border-white/40 bg-white/70 px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Conceito</h3>
            </div>
            <div className="space-y-5 p-5 text-sm leading-relaxed text-gray-700">
              <p>{overview.descricao}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#9333EA]">Como esse padrão surgiu</p>
                <p className="mt-2 text-[#334155]">{sabotador.funcaoOriginal}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0EA5E9]">Origem do conceito</p>
                <ul className="mt-2 space-y-2">
                  {overview.origem.map((texto) => (
                    <li key={texto} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-sky-200" />
                      <span>{texto}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">Estrutura</p>
                <ul className="mt-2 space-y-2">
                  {overview.estrutura.map((texto) => (
                    <li key={texto} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-200" />
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
