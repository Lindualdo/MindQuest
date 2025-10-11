import React, { useMemo } from 'react';
import { ArrowLeft, Lightbulb, Compass, Target, HeartPulse, ShieldCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import { useDashboard } from '../store/useStore';
import { getSabotadorById, sabotadoresCatalogo } from '../data/sabotadoresCatalogo';

const SectionList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  if (!items.length) return null;
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="border-b border-white/40 bg-white/70 px-5 py-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          {title}
        </h3>
      </div>
      <div className="p-5">
        <ul className="space-y-2 text-sm text-gray-700">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-purple-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

const SabotadorDetailPage: React.FC = () => {
  const {
    dashboardData,
    setView,
    selectedSabotadorId,
  } = useDashboard();

  const sabotadorId = selectedSabotadorId ?? dashboardData?.sabotadores?.padrao_principal?.id ?? '';
  const sabotador = useMemo(() => getSabotadorById(sabotadorId), [sabotadorId]);

  if (!sabotador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600"
            type="button"
          >
            <ArrowLeft size={18} /> Voltar
          </button>

          <Card>
            <p className="text-sm text-gray-600">
              Não encontramos informações adicionais sobre este sabotador. Volte ao dashboard e tente novamente.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const overview = sabotadoresCatalogo.overview;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600"
          type="button"
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/40 bg-white/80 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {overview.titulo}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-gray-800">
                {sabotador.emoji} {sabotador.nome}
              </h2>
            </div>
            <div className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
              {sabotador.resumo}
            </div>
          </div>

          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
                <Lightbulb className="mt-1 text-purple-600" size={18} />
                <div>
                  <p className="text-xs uppercase text-purple-600 font-semibold">Descrição essencial</p>
                  <p className="mt-1 text-sm text-purple-700 leading-relaxed">{sabotador.descricao}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <Compass className="mt-1 text-blue-600" size={18} />
                <div>
                  <p className="text-xs uppercase text-blue-600 font-semibold">Função original</p>
                  <p className="mt-1 text-sm text-blue-700 leading-relaxed">{sabotador.funcaoOriginal}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Card className="h-full">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Conceito rápido
                </h3>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {overview.descricao}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {overview.origem.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-indigo-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SectionList title="Características marcantes" items={sabotador.caracteristicas} />
          <SectionList title="Pensamentos típicos" items={sabotador.pensamentosTipicos} />
          <SectionList title="Sentimentos comuns" items={sabotador.sentimentosComuns} />
          <SectionList title="Mentiras usadas para justificar" items={sabotador.mentirasParaJustificar} />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card className="!p-0 overflow-hidden">
            <div className="border-b border-white/40 bg-white/70 px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Impacto
              </h3>
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
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Estratégias de neutralização
              </h3>
            </div>
            <div className="flex flex-col gap-4 p-5 text-sm text-gray-700">
              <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                <ShieldCheck className="mt-1 text-emerald-600" size={18} />
                <div>
                  <p className="text-xs font-semibold uppercase text-emerald-600">Passos sugeridos</p>
                  <ul className="mt-2 space-y-2">
                    {sabotador.estrategiasAntidoto.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {sabotador.contextosTipicos && (
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">Contextos onde costuma aparecer</p>
                  <ul className="mt-2 space-y-2">
                    {sabotador.contextosTipicos.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-slate-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SabotadorDetailPage;
