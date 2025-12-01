import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Sparkles, GitBranch } from 'lucide-react';

import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import mapaMentalFallback from '@/data/mapaMental';
import { useDashboard } from '@/store/useStore';
import type { MapaMentalData } from '@/types/emotions';

const branchColors = ['#33C681', '#4CC4FF', '#FFCA62', '#A78BFA', '#F472B6'];

const MapaMentalVisualPage: React.FC = () => {
  const {
    dashboardData,
    setView,
    mapaMental,
    mapaMentalLoading,
    mapaMentalError,
    loadMapaMental,
  } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabId>('entender');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (!mapaMental && !mapaMentalLoading) {
      void loadMapaMental();
    }
  }, [mapaMental, mapaMentalLoading, loadMapaMental]);

  const resolvedData: MapaMentalData = useMemo(() => {
    if (mapaMental && mapaMental.areas.length > 0) {
      return mapaMental;
    }
    return mapaMentalFallback;
  }, [mapaMental]);

  const handleReload = () => {
    void loadMapaMental();
  };

  const toggleArea = (key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNav = (view: TabId | 'mapaMental' | 'mapaMentalVisual') => {
    if (view === 'mapaMental') {
      setView('mapaMental');
      setActiveTab('entender');
      return;
    }
    if (view === 'mapaMentalVisual') {
      setView('mapaMentalVisual');
      setActiveTab('entender');
      return;
    }
    switch (view) {
      case 'home':
        setActiveTab('conversar');
        setView('conversar');
        break;
      case 'perfil':
        setActiveTab('entender');
        setView('dashEmocoes');
        break;
      case 'quests':
        setActiveTab('agir');
        setView('painelQuests');
        break;
      case 'ajustes':
        setActiveTab('evoluir');
        setView('evoluir');
        break;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B1120] text-slate-100">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 pb-24 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleNav('mapaMental')}
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:bg-white/20"
          >
            <ArrowLeft size={14} />
            Voltar para texto
          </button>
          <button
            type="button"
            onClick={handleReload}
            disabled={mapaMentalLoading}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={14} className={mapaMentalLoading ? 'animate-spin' : ''} />
            Atualizar dados
          </button>
          {mapaMentalError && (
            <span className="text-xs font-semibold text-rose-400">{mapaMentalError}</span>
          )}
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-[#141C30] to-[#10172A] px-6 py-4 shadow-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Mind map</p>
          <h1 className="text-2xl font-semibold text-white">
            Focos de Vida e Plano de Ação de {nomeUsuario}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Expanda os ramos para ver objetivos, ações práticas e resultados esperados.
          </p>
        </div>

        <section className="relative rounded-3xl border border-white/5 bg-[#050A16] px-4 py-8 shadow-2xl">
          <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-gradient-to-b from-white/30 via-white/20 to-transparent" />

          <div className="mx-auto w-fit rounded-2xl bg-[#1E2338] px-6 py-3 text-center shadow-lg shadow-black/40">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.5em] text-slate-400">
              Núcleo
            </p>
            <p className="text-base font-semibold text-white">Áreas de vida e pontos focais</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {resolvedData.areas.map((area, index) => {
              const color = branchColors[index % branchColors.length];
              const isExpanded = expanded[area.area] ?? true;

              return (
                <div
                  key={area.area}
                  className="relative rounded-3xl bg-[#131A2C] p-4 shadow-lg shadow-black/30"
                >
                  <div className="absolute -left-6 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 md:block">
                    <span
                      className="block h-0.5 w-full rounded-full opacity-70"
                      style={{ background: color }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleArea(area.area)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-inner shadow-black/30"
                        style={{ background: color }}
                      >
                        <GitBranch size={18} />
                      </span>
                      <div>
                        <p className="text-[0.55rem] font-semibold uppercase tracking-[0.5em] text-slate-400">
                          Área
                        </p>
                        <h2 className="text-lg font-semibold text-white">{area.area}</h2>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {isExpanded ? 'Ocultar' : 'Expandir'}
                    </span>
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-4 pl-3"
                    >
                      {area.assuntos.map((assunto, assuntoIndex) => (
                        <div
                          key={`${area.area}-${assuntoIndex}`}
                          className="rounded-2xl border border-white/5 bg-[#0B1220] p-3"
                        >
                          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-slate-400">
                            {assunto.assunto_central || 'Assunto focal'}
                          </p>
                          <div className="mt-2 space-y-3 text-sm text-slate-200">
                            <div>
                              <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-500">
                                Mudança desejada
                              </p>
                              <p className="mt-1 text-slate-200">
                                {assunto.mudanca_desejada || '—'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-500">
                                Ações práticas
                              </p>
                              <ul className="mt-1 space-y-1 text-slate-200">
                                {assunto.acoes_praticas?.length ? (
                                  assunto.acoes_praticas.map((acao, acaoIndex) => (
                                    <li key={`${area.area}-${assuntoIndex}-acao-${acaoIndex}`} className="flex gap-2">
                                      <span
                                        className="mt-1 h-1.5 w-1.5 flex-none rounded-full"
                                        style={{ background: color }}
                                      />
                                      <span>{acao}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-slate-500">Sem ações definidas.</li>
                                )}
                              </ul>
                            </div>
                            <div>
                              <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-500">
                                Resultado esperado
                              </p>
                              <p className="mt-1 text-emerald-200">
                                {assunto.resultado_esperado || '—'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNavV1_3
        active={activeTab}
        onHome={() => handleNav('home')}
        onPerfil={() => handleNav('perfil')}
        onQuests={() => handleNav('quests')}
        onConfig={() => handleNav('ajustes')}
      />
    </div>
  );
};

export default MapaMentalVisualPage;
