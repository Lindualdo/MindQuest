import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Lightbulb,
  Compass,
  Target,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';
import { motion } from 'framer-motion';

import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { getSabotadorById, sabotadoresCatalogo } from '@/data/sabotadoresCatalogo';

const SectionList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  if (!items.length) return null;
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="border-b border-white/40 bg-white/80 px-5 py-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      </div>
      <div className="p-5">
        <ul className="space-y-3 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 leading-relaxed">
              <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#F59E0B]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

const InfoTile: React.FC<{ title: string; description: string; icon: React.ReactNode; tone: string }> = ({
  title,
  description,
  icon,
  tone,
}) => (
  <div className={`rounded-2xl border ${tone} px-5 py-4 shadow-sm bg-white/85`}> 
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-white p-2 shadow-sm text-[#F59E0B]">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
        <p className="mt-2 text-sm text-slate-700 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const SabotadoresDashboardPage: React.FC = () => {
  const { dashboardData, setView } = useDashboard();

  const sabotadorId = dashboardData?.sabotadores?.padrao_principal?.id ?? '';
  const sabotador = useMemo(() => getSabotadorById(sabotadorId), [sabotadorId]);
  const overview = sabotadoresCatalogo.overview;

  const handleBack = () => setView('dashboard');

  if (!sabotador) {
    return (
      <div className="mindquest-dashboard min-h-screen pb-10">
        <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
            <button
              onClick={handleBack}
              className="rounded-xl bg-white p-2 shadow transition-all hover:shadow-md"
              aria-label="Voltar para o dashboard"
              type="button"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">{overview.titulo}</p>
              <h1 className="text-lg font-semibold text-slate-800">
                Sabotadores
              </h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 pt-6">
          <Card>
            <p className="text-sm text-slate-600">
              Nenhum sabotador ativo foi identificado. Volte ao dashboard e continue sua jornada para destravar novos padrões.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="mindquest-dashboard min-h-screen pb-12">
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <button
            onClick={handleBack}
            className="rounded-xl bg-white p-2 shadow transition-all hover:shadow-md"
            aria-label="Voltar para o dashboard"
            type="button"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#F59E0B]">{overview.titulo}</p>
            <h1 className="text-lg font-semibold text-slate-800">
              {sabotador.emoji} {sabotador.nome}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-5 px-4 pt-6">
        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/40 bg-white/90 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sabotador mais ativo
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-800">
                {sabotador.emoji} {sabotador.nome}
              </h2>
            </div>
            <div className="rounded-full bg-[#FFF6E4] px-4 py-2 text-sm font-semibold text-[#9A6B00]">
              {sabotador.resumo}
            </div>
          </div>

          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            <InfoTile
              title="Descrição essencial"
              description={sabotador.descricao}
              icon={<Lightbulb size={18} />}
              tone="border-[#FDE1A6]"
            />
            <InfoTile
              title="Função original"
              description={sabotador.funcaoOriginal}
              icon={<Compass size={18} />}
              tone="border-[#FDE1A6]"
            />
            <InfoTile
              title="Impacto imediato"
              description={sabotador.impacto.emSi?.[0] ?? 'Continue conversando para mapear impactos.'}
              icon={<Target size={18} />}
              tone="border-[#FBCFCC]"
            />
            <InfoTile
              title="Primeiro passo sugerido"
              description={sabotador.estrategiasAntidoto?.[0] ?? 'Assim que novas conversas forem registradas sugerimos contramedidas.'}
              icon={<ShieldCheck size={18} />}
              tone="border-[#BEE4D8]"
            />
          </div>
        </Card>

        <SectionList title="Características marcantes" items={sabotador.caracteristicas} />
        <SectionList title="Pensamentos típicos" items={sabotador.pensamentosTipicos} />
        <SectionList title="Sentimentos comuns" items={sabotador.sentimentosComuns} />
        <SectionList title="Mentiras para justificar" items={sabotador.mentirasParaJustificar} />

        <Card className="!p-0 overflow-hidden">
          <div className="border-b border-white/40 bg-white/80 px-5 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Impactos em você e nas relações
            </h3>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <div className="rounded-xl bg-[#FFF6E4] px-4 py-3 text-sm text-[#9A6B00]">
              <p className="text-xs font-semibold uppercase tracking-wide">Em você</p>
              <ul className="mt-2 space-y-2">
                {sabotador.impacto.emSi.map((item) => (
                  <li key={item} className="flex items-start gap-2 leading-relaxed">
                    <HeartPulse className="mt-1 h-4 w-4 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-[#FDECEF] px-4 py-3 text-sm text-[#9F1239]">
              <p className="text-xs font-semibold uppercase tracking-wide">Nos outros</p>
              <ul className="mt-2 space-y-2">
                {sabotador.impacto.nosOutros.map((item) => (
                  <li key={item} className="flex items-start gap-2 leading-relaxed">
                    <HeartPulse className="mt-1 h-4 w-4 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <SectionList title="Estratégias antidoto" items={sabotador.estrategiasAntidoto} />
        <SectionList title="Contextos típicos" items={sabotador.contextosTipicos ?? []} />

        <Card className="!p-0 overflow-hidden">
          <div className="border-b border-white/40 bg-white/80 px-5 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#F59E0B]">
              O que são sabotadores?
            </h3>
          </div>
          <div className="p-5 text-sm text-slate-700 leading-relaxed space-y-3">
            <p>{overview.descricao}</p>
            {overview.origem.map((item) => (
              <div key={item} className="rounded-xl bg-[#FFF6E4] px-4 py-2">
                {item}
              </div>
            ))}
            <p className="rounded-xl bg-white px-4 py-2 text-xs text-slate-500">
              {overview.estrutura.join(' ')}
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SabotadoresDashboardPage;
