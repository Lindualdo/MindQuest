/**
 * ARQUIVO: src/components/dashboard/InsightsPanel.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 *
 * Painel compacto exibido na home do dashboard com filtros resumidos.
 * A lógica de filtros foi extraída para o hook useInsightsFilters para
 * ser compartilhada com o painel completo de Insights.
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Microscope } from 'lucide-react';

import { useInsightsFilters, getCategoriaLabel } from '@/hooks/useInsightsFilters';
import { useDashboard } from '@/store/useStore';
import type { Insight } from '@/types/emotions';
import InsightsFilterControls, {
  PRIORIDADE_OPTIONS,
  type CategoriaFiltroValue,
  type PrioridadeFiltroValue,
  type TipoFiltroValue,
} from './InsightsFilterControls';
import { getInsightIcon, insightTypeMeta, prioridadeBadgeClasses } from '@/utils/insightsUi';
import Card from '../ui/Card';

const PRIORIDADE_CYCLE_ORDER = PRIORIDADE_OPTIONS.map(({ key }) => key);

const QUICK_TIPO_OPTIONS = [
  { key: 'alerta', label: 'Alertas' },
  { key: 'melhoria', label: 'Melhorias' },
  { key: 'positivo', label: 'Positivos' },
  { key: 'todos', label: 'Todos' },
] as const;

const InsightsPanel: React.FC = () => {
  const { dashboardData, openInsightDetail } = useDashboard();
  const { insights } = dashboardData;

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [showAdvancedInline, setShowAdvancedInline] = useState(false);

  const {
    tipoFiltro,
    prioridadeFiltro,
    categoriaFiltro,
    setTipoFiltro,
    setPrioridadeFiltro,
    setCategoriaFiltro,
    resetFiltros,
    hasActiveFilters,
    summaryText,
    insightEmFoco,
    demaisInsights,
    resumoOptions,
    insightsFiltrados,
  } = useInsightsFilters(insights);

  const prioridadeCycleLabel =
    PRIORIDADE_OPTIONS.find(({ key }) => key === prioridadeFiltro)?.label ?? 'Todas';

  const handlePrioridadeCycle = () => {
    const currentIndex = PRIORIDADE_CYCLE_ORDER.indexOf(prioridadeFiltro);
    const next = PRIORIDADE_CYCLE_ORDER[(currentIndex + 1) % PRIORIDADE_CYCLE_ORDER.length];
    setPrioridadeFiltro(next);
  };

  const tipoResumo = useMemo(() => {
    const counts: Record<string, number> = insights.reduce((acc, insight) => {
      acc[insight.tipo] = (acc[insight.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    counts.todos = insights.length;
    return counts;
  }, [insights]);

  const renderInsightCard = (
    insight: Insight,
    index: number,
    variant: 'focus' | 'list' = 'list'
  ) => {
    const Icon = getInsightIcon(insight.tipo, insight.categoria);
    const meta = insightTypeMeta[insight.tipo];
    const isFocus = variant === 'focus';

    return (
      <motion.div
        key={`${variant}-${insight.id}`}
        initial={{ opacity: 0, x: isFocus ? 0 : -20, y: isFocus ? 10 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: index * 0.08 }}
        onClick={() => openInsightDetail(insight.id)}
        className={`relative rounded-2xl border border-slate-200 bg-white/95 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group ${meta.border}`}
      >
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <div
            className={`rounded-xl bg-slate-50 p-2.5 text-lg ${meta.iconColor} transition-transform duration-200 group-hover:scale-110`}
          >
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-slate-800 truncate">{insight.titulo}</h4>
              <span className="text-xl flex-shrink-0">{insight.icone}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {insight.descricao}
            </p>

            {insight.cta && (
              <div className="mt-3">
                <a
                  href={insight.cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-600 transition-colors"
                  onClick={(event) => event.stopPropagation()}
                >
                  {insight.cta.label}
                </a>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="inline-flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600">
                  {getCategoriaLabel(insight.categoria)}
                </span>
                <span className={`rounded-full px-2 py-1 font-semibold ${prioridadeBadgeClasses[insight.prioridade]}`}>
                  {insight.prioridade === 'alta'
                    ? 'Prioridade alta'
                    : insight.prioridade === 'media'
                      ? 'Prioridade média'
                      : 'Prioridade baixa'}
                </span>
              </div>
              <span>
                {new Date(insight.data_criacao).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                })}
              </span>
            </div>

            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-opacity group-hover:text-slate-700">
              Ver detalhes
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!insights.length) {
    return (
      <Card className="flex flex-col items-center justify-center text-center text-sm text-slate-500">
        <Microscope className="mb-3 h-8 w-8 text-slate-400" />
        <p>Nenhum insight disponível no momento. Continue suas conversas para gerar novos aprendizados.</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="space-y-5 bg-white/85">
        <div className="flex items-center gap-2">
          <Microscope className="text-blue-600" size={22} />
          <h3 className="text-lg font-semibold text-slate-800">Insights</h3>
          <div className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
            {!hasActiveFilters
              ? `${insights.length} insights`
              : `${insightsFiltrados.length}/${insights.length} filtrados`}
          </div>
        </div>

        <div className="space-y-3">
          <div className="md:hidden">
            <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2">
              <div className="flex-1 pr-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                  Filtros ativos
                </p>
                <p className="text-xs font-medium text-slate-700">{summaryText}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(true)}
                className="rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition mq-btn-outline"
              >
                Ajustar
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 shadow-inner overflow-x-auto">
              {QUICK_TIPO_OPTIONS.map(({ key, label }) => {
                const isActive = tipoFiltro === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTipoFiltro(key)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      isActive ? 'mq-btn-primary text-white shadow-sm' : 'mq-link-muted'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrioridadeCycle}
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 shadow-sm hover:bg-amber-100 transition"
              >
                Prioridade: {prioridadeCycleLabel}
              </button>
              <button
                type="button"
                className="hidden md:inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition mq-btn-outline"
                onClick={() => setShowAdvancedInline((prev) => !prev)}
              >
                {showAdvancedInline ? 'Ocultar filtros avançados' : 'Filtros avançados'}
              </button>
              <button
                type="button"
                className="hidden md:inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition mq-btn-outline"
                onClick={() => setIsFilterSheetOpen(true)}
              >
                Painel completo
              </button>
            </div>
          </div>

          {showAdvancedInline && (
          <div className="hidden md:block">
            <InsightsFilterControls
              variant="inline"
              tipoFiltro={tipoFiltro as TipoFiltroValue}
              prioridadeFiltro={prioridadeFiltro as PrioridadeFiltroValue}
              categoriaFiltro={categoriaFiltro as CategoriaFiltroValue}
              tipoResumo={tipoResumo}
              resumoOptions={resumoOptions}
              onTipoFiltroChange={(value) => setTipoFiltro(value)}
              onPrioridadeFiltroChange={(value) => setPrioridadeFiltro(value)}
              onCategoriaFiltroChange={(value) => setCategoriaFiltro(value)}
            />
          </div>
        )}
        </div>

        {insightEmFoco && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-blue-500">
              Insight em foco
            </p>
            {renderInsightCard(insightEmFoco, 0, 'focus')}
          </div>
        )}

        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {demaisInsights.length === 0 ? (
            !insightEmFoco && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 space-y-3">
                <p>Nenhum insight corresponde a esse filtro no momento.</p>
                <button
                  type="button"
                  onClick={resetFiltros}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white mq-btn-primary"
                >
                  Ver principais
                </button>
              </div>
            )
          ) : (
            demaisInsights.map((insight, index) => renderInsightCard(insight, index, 'list'))
          )}
        </div>
      </Card>

      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFilterSheetOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 w-full max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-800">Ajustar filtros</h4>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="text-sm font-semibold mq-link"
              >
                Fechar
              </button>
            </div>

            <InsightsFilterControls
              variant="sheet"
              tipoFiltro={tipoFiltro as TipoFiltroValue}
              prioridadeFiltro={prioridadeFiltro as PrioridadeFiltroValue}
              categoriaFiltro={categoriaFiltro as CategoriaFiltroValue}
              tipoResumo={tipoResumo}
              resumoOptions={resumoOptions}
              onTipoFiltroChange={(value) => setTipoFiltro(value)}
              onPrioridadeFiltroChange={(value) => setPrioridadeFiltro(value)}
              onCategoriaFiltroChange={(value) => setCategoriaFiltro(value)}
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetFiltros}
                className="flex-1 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
              >
                Limpar filtros
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-white mq-btn-primary"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InsightsPanel;
