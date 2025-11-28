import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Filter,
  ListFilter,
  Search,
  XCircle,
} from 'lucide-react';

import { useInsightsFilters, getCategoriaLabel } from '@/hooks/useInsightsFilters';
import InsightsFilterControls from '@/components/dashboard/InsightsFilterControls';
import {
  PRIORIDADE_OPTIONS,
  type CategoriaFiltroValue,
  type PrioridadeFiltroValue,
  type TipoFiltroValue,
} from '@/components/dashboard/insightsFilterOptions';
import { useDashboard } from '@/store/useStore';
import type { Insight } from '@/types/emotions';
import { getInsightIcon, insightTypeMeta, prioridadeBadgeClasses } from '@/utils/insightsUi';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';

const TAB_OPTIONS = [
  { key: 'alerta', label: 'Alertas' },
  { key: 'melhoria', label: 'Melhorias' },
  { key: 'positivo', label: 'Positivos' },
  { key: 'todos', label: 'Todos' },
] as const;

const PRIORIDADE_CYCLE_ORDER = PRIORIDADE_OPTIONS.map(({ key }) => key);

const InsightsDashboardPageV13: React.FC = () => {
  const { dashboardData, setView, openInsightDetail, isLoading } = useDashboard();
  const insights = dashboardData?.insights ?? [];

  useEffect(() => {
    console.log('[InsightsDashboard] Componente montado', { 
      insightsCount: insights.length,
      hasDashboardData: !!dashboardData,
      isLoading 
    });
  }, [insights.length, dashboardData, isLoading]);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  // Insights já devem estar carregados via dashboardData inicial
  // Não carregar aqui para evitar loop infinito (refreshData não carrega insights)

  const {
    tipoFiltro,
    prioridadeFiltro,
    categoriaFiltro,
    searchTerm,
    setTipoFiltro,
    setPrioridadeFiltro,
    setCategoriaFiltro,
    setSearchTerm,
    resetFiltros,
    hasActiveFilters,
    summaryText,
    insightEmFoco,
    demaisInsights,
    insightsFiltrados,
    resumoOptions,
    countsByTipo,
    baseInsightsFiltrados,
  } = useInsightsFilters(insights);

  const prioridadeCycleLabel =
    PRIORIDADE_OPTIONS.find(({ key }) => key === prioridadeFiltro)?.label ?? 'Todas';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBack = () => {
    setView('dashboard');
    setActiveTab('home');
  };

  const handlePrioridadeCycle = () => {
    const currentIndex = PRIORIDADE_CYCLE_ORDER.indexOf(prioridadeFiltro);
    const next = PRIORIDADE_CYCLE_ORDER[(currentIndex + 1) % PRIORIDADE_CYCLE_ORDER.length];
    setPrioridadeFiltro(next);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
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

  const renderInsightCard = (
    insight: Insight,
    index: number,
    variant: 'focus' | 'list' = 'list'
  ) => {
    const Icon = getInsightIcon(insight.tipo, insight.categoria);
    const meta = insightTypeMeta[insight.tipo];
    const isFocus = variant === 'focus';

    return (
      <motion.article
        key={`${variant}-${insight.id}`}
        initial={{ opacity: 0, y: isFocus ? 16 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        onClick={() => {
          setView('insightDetail');
          openInsightDetail(insight.id);
        }}
        className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${meta.border}`}
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
          <div className={`rounded-2xl bg-slate-50 p-3 text-xl ${meta.iconColor}`}>
            <Icon size={22} />
          </div>

          <div className="flex-1 space-y-3">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-800">{insight.titulo}</h2>
                <span className="text-2xl">{insight.icone}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                  {getCategoriaLabel(insight.categoria)}
                </span>
                <span className={`rounded-full px-3 py-1 font-semibold ${prioridadeBadgeClasses[insight.prioridade]}`}>
                  {insight.prioridade === 'alta'
                    ? 'Prioridade alta'
                    : insight.prioridade === 'media'
                      ? 'Prioridade média'
                      : 'Prioridade baixa'}
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-500">
                  {new Date(insight.data_criacao).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </span>
              </div>
            </header>

            <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
              {insight.descricao}
            </p>

            {insight.cta && (
              <div>
                <a
                  href={insight.cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-emerald-600 transition-colors"
                  onClick={(event) => event.stopPropagation()}
                >
                  {insight.cta.label}
                </a>
              </div>
            )}

            <footer className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <span>{insight.tipo === 'padrao' ? 'Padrão detectado' : `Insight ${insight.tipo}`}</span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                Abrir detalhes
              </span>
            </footer>
          </div>
        </div>
      </motion.article>
    );
  };

  const filtersSection = (
    <InsightsFilterControls
      variant="inline"
      tipoFiltro={tipoFiltro as TipoFiltroValue}
      prioridadeFiltro={prioridadeFiltro as PrioridadeFiltroValue}
      categoriaFiltro={categoriaFiltro as CategoriaFiltroValue}
      countsByTipo={countsByTipo}
      resumoOptions={resumoOptions}
      onTipoFiltroChange={(value) => setTipoFiltro(value)}
      onPrioridadeFiltroChange={(value) => setPrioridadeFiltro(value)}
      onCategoriaFiltroChange={(value) => setCategoriaFiltro(value)}
    />
  );

  // Mostrar loading enquanto carrega dados
  if (isLoading && !insights.length) {
    return (
      <div className="mq-app-v1_3 flex min-h-screen flex-col bg-[#F5EBF3]">
        <HeaderV1_3 nomeUsuario={nomeUsuario} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
          <Card>
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold text-[#1C2541]">Carregando insights...</p>
            </div>
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

  if (!insights.length) {
    return (
      <div className="mq-app-v1_3 flex min-h-screen flex-col bg-[#F5EBF3]">
        <HeaderV1_3 nomeUsuario={nomeUsuario} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
          <Card>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#1C2541]">Painel de Insights</p>
              <p className="text-sm text-[#475569]">
                Nenhum insight disponível no momento. Volte ao dashboard principal para continuar a jornada.
              </p>
              <button
                type="button"
                onClick={handleBack}
                className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#2563EB] underline-offset-2 hover:underline"
              >
                Voltar
                <ArrowLeft size={14} />
              </button>
            </div>
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
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3083DC]">
                Painel de insights
              </p>
              <h1 className="text-lg font-semibold text-[#1C2541]">
                Principais aprendizados e próximos passos
              </h1>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
              {insightsFiltrados.length} de {baseInsightsFiltrados.length}
            </div>
          </div>

          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {TAB_OPTIONS.map(({ key, label }) => {
                  const isActive = tipoFiltro === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTipoFiltro(key)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-[#3083DC] text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                      <span className="ml-2 rounded-full bg-white/30 px-2 py-0.5 text-xs font-semibold">
                        {countsByTipo[key] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3">
                <div className="relative w-full">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Pesquisar por título, descrição ou categoria"
                    className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#3083DC] focus:outline-none focus:ring-2 focus:ring-[#3083DC33]"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-1 text-slate-500 hover:text-slate-700"
                      aria-label="Limpar busca"
                    >
                      <XCircle size={16} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handlePrioridadeCycle}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 shadow-sm transition hover:bg-amber-100"
                  >
                    <Filter size={14} />
                    Prioridade: {prioridadeCycleLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters((prev) => !prev)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100"
                  >
                    <ListFilter size={14} />
                    {showAdvancedFilters ? 'Ocultar filtros avançados' : 'Filtros avançados'}
                  </button>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="rounded-2xl border border-dashed border-[#3083DC]/30 bg-[#3083DC]/5 px-4 py-3 text-xs text-slate-600">
                  {summaryText}
                </div>
              )}

              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                >
                  {filtersSection}
                </motion.div>
              )}
            </div>
          </Card>

          {insightEmFoco && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3083DC]">
                  Insight em foco
                </p>
                <button
                  type="button"
                  onClick={() => resetFiltros()}
                  className="text-xs font-semibold text-slate-500 underline decoration-dotted underline-offset-4 hover:text-slate-700"
                >
                  Ver principais
                </button>
              </div>
              {renderInsightCard(insightEmFoco, 0, 'focus')}
            </motion.section>
          )}

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-4"
          >
            {demaisInsights.length === 0 ? (
              <Card>
                <div className="space-y-3 text-center text-sm text-slate-500">
                  <p>Nenhum insight corresponde aos filtros selecionados.</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={resetFiltros}
                      className="inline-flex items-center gap-2 rounded-full bg-[#3083DC] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#2562a8]"
                    >
                      Restaurar filtros
                    </button>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Limpar busca
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              demaisInsights.map((insight, index) => renderInsightCard(insight, index, 'list'))
            )}
          </motion.section>
        </div>
      </main>

      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterSheetOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 w-full max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-800">Ajustar filtros</h4>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="text-sm font-semibold text-[#3083DC]"
              >
                Fechar
              </button>
            </div>

            <InsightsFilterControls
              variant="sheet"
              tipoFiltro={tipoFiltro as TipoFiltroValue}
              prioridadeFiltro={prioridadeFiltro as PrioridadeFiltroValue}
              categoriaFiltro={categoriaFiltro as CategoriaFiltroValue}
              countsByTipo={countsByTipo}
              resumoOptions={resumoOptions}
              onTipoFiltroChange={(value) => setTipoFiltro(value)}
              onPrioridadeFiltroChange={(value) => setPrioridadeFiltro(value)}
              onCategoriaFiltroChange={(value) => setCategoriaFiltro(value)}
            />

            <div className="mt-6 flex items-center justify-between gap-3">
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
                className="flex-1 rounded-full bg-[#3083DC] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#2562a8]"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

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

export default InsightsDashboardPageV13;

