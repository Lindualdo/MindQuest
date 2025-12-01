import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  Target,
  RefreshCw,
  Sparkles,
  GitBranch,
} from 'lucide-react';

import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import mapaMentalFallback from '@/data/mapaMental';
import { useDashboard } from '@/store/useStore';
import type { MapaMentalAssunto, MapaMentalData } from '@/types/emotions';

const areaPalette = [
  {
    border: 'border-[#F9A8D4]',
    gradient: 'from-[#FFF5FB] to-[#FEEAF4]',
    title: 'text-[#BE185D]',
  },
  {
    border: 'border-[#A5B4FC]',
    gradient: 'from-[#EEF2FF] to-[#E0E7FF]',
    title: 'text-[#312E81]',
  },
  {
    border: 'border-[#FCD34D]',
    gradient: 'from-[#FFFBEB] to-[#FEF3C7]',
    title: 'text-[#92400E]',
  },
  {
    border: 'border-[#6EE7B7]',
    gradient: 'from-[#ECFDF5] to-[#D1FAE5]',
    title: 'text-[#065F46]',
  },
];

const renderAssuntoFlow = (
  assunto: MapaMentalAssunto,
  areaIndex: number,
  assuntoIndex: number,
) => (
  <div
    key={`${areaIndex}-${assuntoIndex}-${assunto.assunto_central}`}
    className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm"
  >
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
          Assunto central
        </p>
        <h3 className="text-base font-semibold text-slate-900">
          {assunto.assunto_central || 'Sem título'}
        </h3>
      </div>
      <span className="rounded-full bg-slate-900/5 px-3 py-1 text-[0.65rem] font-semibold text-slate-500">
        #{assuntoIndex + 1}
      </span>
    </div>

    <div className="mt-4 space-y-3">
      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
          O que quero mudar
        </p>
        <p className="mt-1 text-sm text-slate-700">
          {assunto.mudanca_desejada || 'Objetivo não informado.'}
        </p>
      </div>

      <div className="rounded-2xl border border-[#E0E7FF] bg-gradient-to-r from-[#EEF2FF] to-[#F5F3FF] p-3">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#4C1D95]">
          Ações práticas
        </p>
        {assunto.acoes_praticas?.length ? (
          <ul className="mt-1 space-y-1 text-sm text-[#312E81]">
            {assunto.acoes_praticas.map((acao, idx) => (
              <li key={`${areaIndex}-${assuntoIndex}-acao-${idx}`} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[#4C1D95]" />
                <span>{acao}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-[#312E81] opacity-70">
            Ainda não há ações definidas.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-emerald-700">
          Resultado esperado
        </p>
        <p className="mt-1 text-sm text-emerald-900">
          {assunto.resultado_esperado || 'Defina qual impacto espera alcançar.'}
        </p>
      </div>
    </div>
  </div>
);

const MapaMentalPage: React.FC = () => {
  const {
    dashboardData,
    setView,
    mapaMental,
    mapaMentalLoading,
    mapaMentalError,
    loadMapaMental,
  } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabId>('entender');

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

  const handleBack = () => {
    setView('conversar');
    setActiveTab('conversar');
  };

  const handleNavConversar = () => {
    setActiveTab('conversar');
    setView('conversar');
  };

  const handleNavEntender = () => {
    setActiveTab('entender');
  };

  const handleNavAgir = () => {
    setActiveTab('agir');
    setView('painelQuests');
  };

  const handleNavEvoluir = () => {
    setActiveTab('evoluir');
    setView('evoluir');
  };

  const handleReload = () => {
    void loadMapaMental();
  };

  const resolvedData: MapaMentalData = useMemo(() => {
    if (mapaMental && mapaMental.areas.length > 0) {
      return mapaMental;
    }
    return mapaMentalFallback;
  }, [mapaMental]);

  const showFallbackBanner = !mapaMental && !mapaMentalLoading;

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
            Mapa mental em áreas de vida
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/50 bg-gradient-to-br from-[#FFFFFF] to-[#F4EBFF] p-4 text-[#1C2541] shadow"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[#EDE9FE] p-2 text-[#5B21B6]">
              <Brain size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7C6FE5]">
                Inteligência Emocional Guiada
              </p>
              <h1 className="text-lg font-semibold leading-tight">
                Radar emocional conectado às suas conversas
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Agrupamos seus resumos recentes por áreas-chave para priorizar mudanças, ações e resultados esperados.
              </p>
              {mapaMentalError && (
                <p className="mt-2 text-xs font-semibold text-rose-600">
                  Não foi possível atualizar automaticamente ({mapaMentalError}). Você pode tentar novamente abaixo.
                </p>
              )}
              {showFallbackBanner && (
                <p className="mt-2 text-xs font-semibold text-amber-600">
                  Exibindo exemplos enquanto geramos seu mapa real.
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {resolvedData.areas.map((area) => (
              <span
                key={area.area}
                className="rounded-full bg-white/80 px-3 py-1 text-[0.7rem] font-semibold text-[#4C1D95] shadow-sm"
              >
                {area.area}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReload}
              disabled={mapaMentalLoading}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#C4B5FD] px-3 py-1 text-[0.75rem] font-semibold text-[#4C1D95] transition hover:bg-white disabled:opacity-60"
            >
              <RefreshCw size={14} className={mapaMentalLoading ? 'animate-spin' : ''} />
              Atualizar mapa
            </button>
            {resolvedData.geradoEm && (
              <span className="rounded-2xl border border-white/60 bg-white/70 px-3 py-1 text-[0.7rem] font-semibold text-slate-500">
                Atualizado em {new Date(resolvedData.geradoEm).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </motion.div>

        {mapaMentalLoading && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-sm text-slate-500">
            Gerando seu mapa mental personalizado...
          </div>
        )}

        {resolvedData.areas.map((area, index) => {
          const palette = areaPalette[index] ?? areaPalette[index % areaPalette.length];
          return (
            <motion.section
              key={area.area}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`rounded-3xl border ${palette.border} bg-gradient-to-br ${palette.gradient} p-4 shadow`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Área {index + 1}
                  </p>
                  <h2 className={`text-lg font-semibold ${palette.title}`}>
                    {area.area}
                  </h2>
                </div>
                <span className="rounded-full bg-white/70 px-3 py-1 text-[0.65rem] font-semibold text-slate-600">
                  {area.assuntos.length} focos
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {area.assuntos.map((assunto, assuntoIndex) =>
                  renderAssuntoFlow(assunto, index, assuntoIndex),
                )}
              </div>
            </motion.section>
          );
        })}

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#C7D2FE] bg-white/90 p-4 shadow"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#EEF2FF] p-2 text-[#3730A3]">
              <Target size={18} />
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Prioridades por Área
              </p>
              <h3 className="text-base font-semibold text-slate-800">
                Movimento visual para a próxima semana
              </h3>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {resolvedData.areas.map((area, areaIndex) => (
              <div
                key={`prioridade-${area.area}`}
                className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {area.area}
                  </p>
                </div>
                <div className="mt-2 flex flex-col gap-3">
                  {area.assuntos.slice(0, 2).map((assunto, idx) => (
                    <div key={`prioridade-${areaIndex}-${idx}`} className="rounded-2xl bg-white/90 p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <GitBranch size={14} />
                        {assunto.assunto_central || 'Assunto'}
                      </div>
                      <p className="mt-1 text-[0.8rem] text-slate-600">
                        {assunto.mudanca_desejada || 'Define a mudança desejada.'}
                      </p>
                      {assunto.acoes_praticas?.[0] && (
                        <p className="mt-1 text-[0.75rem] text-slate-500">
                          Próxima ação: {assunto.acoes_praticas[0]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
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

export default MapaMentalPage;
