/**
 * ARQUIVO: src/components/dashboard/InsightsPanel.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Insights Panel baseado na Especificação v1.1
 * Sistema inteligente com categorização por tipo e prioridade
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, Target, Trophy, AlertTriangle, 
  TrendingUp, Brain, Heart, Users, Zap, ChevronRight, Microscope 
} from 'lucide-react';
import { useDashboard } from '../../store/useStore';
import Card from '../ui/Card';

const InsightsPanel: React.FC = () => {
  const { dashboardData, openInsightDetail } = useDashboard();
  const { insights } = dashboardData;
  type InsightItem = typeof insights[number];

  const determineInitialFilters = (list: typeof insights) => {
    if (!Array.isArray(list) || list.length === 0) {
      return { tipo: 'todos' as const, prioridade: 'todas' as const };
    }

    const preferenceOrder: Array<{
      tipo: 'todos' | 'padrao' | 'melhoria' | 'positivo' | 'alerta';
      prioridade: 'todas' | 'alta' | 'media' | 'baixa';
    }> = [
      { tipo: 'alerta', prioridade: 'alta' },
      { tipo: 'alerta', prioridade: 'media' },
      { tipo: 'alerta', prioridade: 'baixa' },
      { tipo: 'melhoria', prioridade: 'alta' },
      { tipo: 'padrao', prioridade: 'alta' },
      { tipo: 'positivo', prioridade: 'alta' },
      { tipo: 'todos', prioridade: 'alta' },
      { tipo: 'todos', prioridade: 'media' },
      { tipo: 'todos', prioridade: 'baixa' },
      { tipo: 'todos', prioridade: 'todas' }
    ];

    for (const combo of preferenceOrder) {
      const matches = list.some((insight) => {
        const tipoMatches = combo.tipo === 'todos' ? true : insight.tipo === combo.tipo;
        const prioridadeMatches = combo.prioridade === 'todas' ? true : insight.prioridade === combo.prioridade;
        return tipoMatches && prioridadeMatches;
      });

      if (matches) {
        return combo;
      }
    }

    return { tipo: 'todos' as const, prioridade: 'todas' as const };
  };

  const initialFilters = determineInitialFilters(insights);

  const [categoriaFiltro, setCategoriaFiltro] = useState<'todos' | string>('todos');
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'padrao' | 'melhoria' | 'positivo' | 'alerta'>(() => initialFilters.tipo);
  const [prioridadeFiltro, setPrioridadeFiltro] = useState<'todas' | 'alta' | 'media' | 'baixa'>(() => initialFilters.prioridade);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [showAdvancedInline, setShowAdvancedInline] = useState(false);

  const getInsightIcon = (tipo: string, categoria: string) => {
    // Priorizar por tipo primeiro
    switch (tipo) {
      case 'positivo': return Trophy;
      case 'alerta': return AlertTriangle;
      case 'melhoria': return Target;
      case 'padrao': 
        // Para padrão, usar ícone baseado na categoria
        switch (categoria) {
          case 'comportamental': return TrendingUp;
          case 'emocional': return Heart;
          case 'social': return Users;
          case 'cognitivo': return Brain;
          default: return Zap;
        }
      default: return Lightbulb;
    }
  };

  const getInsightStyle = (tipo: string, prioridade: string) => {
    const baseStyle = {
      borderColor: '',
      bgColor: '',
      iconColor: '',
      priorityIndicator: ''
    };

    // Cores por tipo
    switch (tipo) {
      case 'positivo':
        baseStyle.bgColor = 'bg-green-50';
        baseStyle.iconColor = 'text-green-600';
        baseStyle.borderColor = 'border-l-green-500';
        break;
      case 'alerta':
        baseStyle.bgColor = 'bg-red-50';
        baseStyle.iconColor = 'text-red-600';
        baseStyle.borderColor = 'border-l-red-500';
        break;
      case 'melhoria':
        baseStyle.bgColor = 'bg-orange-50';
        baseStyle.iconColor = 'text-orange-600';
        baseStyle.borderColor = 'border-l-orange-500';
        break;
      case 'padrao':
        baseStyle.bgColor = 'bg-blue-50';
        baseStyle.iconColor = 'text-blue-600';
        baseStyle.borderColor = 'border-l-blue-500';
        break;
      default:
        baseStyle.bgColor = 'bg-gray-50';
        baseStyle.iconColor = 'text-gray-600';
        baseStyle.borderColor = 'border-l-gray-500';
    }

    // Indicador de prioridade
    switch (prioridade) {
      case 'alta':
        baseStyle.priorityIndicator = 'bg-red-500';
        break;
      case 'media':
        baseStyle.priorityIndicator = 'bg-yellow-500';
        break;
      case 'baixa':
        baseStyle.priorityIndicator = 'bg-green-500';
        break;
    }

    return baseStyle;
  };

  const getCategoriaLabel = (categoria: string) => {
    switch (categoria) {
      case 'comportamental': return 'Comportamental';
      case 'emocional': return 'Emocional';
      case 'social': return 'Social';
      case 'cognitivo': return 'Cognitivo';
      default: return 'Geral';
    }
  };

  const insightsOrdenados = useMemo(() => {
    const prioridadeOrder = { alta: 3, media: 2, baixa: 1 };
    return [...insights].sort((a, b) => {
      const prioridadeA = prioridadeOrder[a.prioridade as keyof typeof prioridadeOrder] || 0;
      const prioridadeB = prioridadeOrder[b.prioridade as keyof typeof prioridadeOrder] || 0;

      if (prioridadeA !== prioridadeB) {
        return prioridadeB - prioridadeA;
      }

      return new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime();
    });
  }, [insights]);

  const insightsFiltrados = useMemo(() => {
    return insightsOrdenados.filter((insight) => {
      const categoriaOk = categoriaFiltro === 'todos' || insight.categoria === categoriaFiltro;
      const tipoOk = tipoFiltro === 'todos' || insight.tipo === tipoFiltro;
      const prioridadeOk = prioridadeFiltro === 'todas' || insight.prioridade === prioridadeFiltro;
      return categoriaOk && tipoOk && prioridadeOk;
    });
  }, [categoriaFiltro, tipoFiltro, prioridadeFiltro, insightsOrdenados]);

  useEffect(() => {
    if (!insights.length) {
      if (tipoFiltro !== 'todos') {
        setTipoFiltro('todos');
      }
      if (prioridadeFiltro !== 'todas') {
        setPrioridadeFiltro('todas');
      }
      if (categoriaFiltro !== 'todos') {
        setCategoriaFiltro('todos');
      }
      if (userHasInteracted) {
        setUserHasInteracted(false);
      }
      return;
    }

    const best = determineInitialFilters(insights);

    if (!userHasInteracted) {
      if (tipoFiltro !== best.tipo) {
        setTipoFiltro(best.tipo);
      }
      if (prioridadeFiltro !== best.prioridade) {
        setPrioridadeFiltro(best.prioridade);
      }
      return;
    }

    if (insightsFiltrados.length === 0) {
      if (
        tipoFiltro !== best.tipo ||
        prioridadeFiltro !== best.prioridade ||
        categoriaFiltro !== 'todos'
      ) {
        setTipoFiltro(best.tipo);
        setPrioridadeFiltro(best.prioridade);
        setCategoriaFiltro('todos');
      }
    }
  }, [
    insights,
    insightsFiltrados.length,
    categoriaFiltro,
    tipoFiltro,
    prioridadeFiltro,
    userHasInteracted
  ]);

  const categoriaResumo = useMemo(() => {
    const counts = insights.reduce<Record<string, number>>((acc, insight) => {
      const categoria = insight.categoria || 'indefinido';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {});

    const orderedCategorias = ['comportamental', 'emocional', 'social', 'cognitivo'];

    const ordered = orderedCategorias
      .filter((categoria) => counts[categoria])
      .map((categoria) => ({
        key: categoria,
        total: counts[categoria],
        label: getCategoriaLabel(categoria)
      }));

    const extras = Object.keys(counts)
      .filter((categoria) => !orderedCategorias.includes(categoria))
      .map((categoria) => ({
        key: categoria,
        total: counts[categoria],
        label: getCategoriaLabel(categoria)
      }));

    return [...ordered, ...extras];
  }, [insights]);

  const resumoOptions = useMemo(
    () => [
      {
        key: 'todos',
        total: insights.length,
        label: 'Todos'
      },
      ...categoriaResumo
    ],
    [categoriaResumo, insights.length]
  );

  const tipoOptions = useMemo(() => [
    { key: 'todos', label: 'Todos', highlight: 'bg-gray-800 text-white' },
    { key: 'alerta', label: 'Alertas', highlight: 'bg-rose-600 text-white' },
    { key: 'melhoria', label: 'Melhorias', highlight: 'bg-orange-500 text-white' },
    { key: 'padrao', label: 'Padrões', highlight: 'bg-blue-600 text-white' },
    { key: 'positivo', label: 'Positivos', highlight: 'bg-green-600 text-white' }
  ] as const, []);

  const quickTipoOptions = useMemo(
    () => [
      { key: 'alerta', label: 'Alertas' },
      { key: 'melhoria', label: 'Melhorias' },
      { key: 'positivo', label: 'Positivos' },
      { key: 'todos', label: 'Todos' }
    ] as const,
    []
  );

  const prioridadeOptions = useMemo(() => [
    { key: 'todas', label: 'Todas', highlight: 'bg-gray-800 text-white' },
    { key: 'alta', label: 'Alta', highlight: 'bg-red-600 text-white' },
    { key: 'media', label: 'Média', highlight: 'bg-yellow-500 text-white' },
    { key: 'baixa', label: 'Baixa', highlight: 'bg-emerald-600 text-white' }
  ] as const, []);

  const prioridadeCycleOrder: Array<typeof prioridadeOptions[number]['key']> = ['todas', 'alta', 'media', 'baixa'];

  const handleTipoFiltroChange = (
    value: 'todos' | 'padrao' | 'melhoria' | 'positivo' | 'alerta'
  ) => {
    setTipoFiltro(value);
    setUserHasInteracted(true);
  };

  const handlePrioridadeFiltroChange = (
    value: 'todas' | 'alta' | 'media' | 'baixa'
  ) => {
    setPrioridadeFiltro(value);
    setUserHasInteracted(true);
  };

  const handlePrioridadeCycle = () => {
    const currentIndex = prioridadeCycleOrder.indexOf(prioridadeFiltro);
    const next = prioridadeCycleOrder[(currentIndex + 1) % prioridadeCycleOrder.length];
    setPrioridadeFiltro(next);
    setUserHasInteracted(true);
  };

  const handleCategoriaFiltroChange = (value: 'todos' | string) => {
    setCategoriaFiltro(value);
    setUserHasInteracted(true);
  };

  const handleResetFiltros = () => {
    const best = determineInitialFilters(insights);
    setTipoFiltro(best.tipo);
    setPrioridadeFiltro(best.prioridade);
    setCategoriaFiltro('todos');
    setUserHasInteracted(false);
  };

  const hasActiveFilters =
    categoriaFiltro !== 'todos' || tipoFiltro !== 'todos' || prioridadeFiltro !== 'todas';

  const tipoSummaryLabel =
    tipoOptions.find(({ key }) => key === tipoFiltro)?.label || 'Todos';
  const prioridadeSummaryLabel =
    prioridadeOptions.find(({ key }) => key === prioridadeFiltro)?.label || 'Todas';
  const categoriaSummaryLabel =
    categoriaFiltro === 'todos' ? null : getCategoriaLabel(categoriaFiltro);

  const summaryParts = [
    tipoSummaryLabel,
    `Prioridade ${prioridadeSummaryLabel}`
  ];
  if (categoriaSummaryLabel) summaryParts.push(categoriaSummaryLabel);

  const summaryText = summaryParts.join(' · ');

  const insightEmFoco = insightsFiltrados[0] ?? null;
  const demaisInsights = insightEmFoco ? insightsFiltrados.slice(1) : insightsFiltrados;

  const prioridadeOptionInfo = prioridadeOptions.find(({ key }) => key === prioridadeFiltro);
  const prioridadeCycleLabel = prioridadeOptionInfo?.label ?? 'Todas';

  const renderInsightCard = (
    insight: InsightItem,
    index: number,
    variant: 'focus' | 'list' = 'list'
  ) => {
    const Icon = getInsightIcon(insight.tipo, insight.categoria);
    const styles = getInsightStyle(insight.tipo, insight.prioridade);
    const isFocus = variant === 'focus';

    const baseClasses = `
      relative rounded-2xl border-l-4 ${styles.bgColor} ${styles.borderColor}
      hover:shadow-md transition-all duration-200 cursor-pointer group
      ${isFocus ? 'p-5' : 'p-4 hover:scale-[1.02]'}
    `;

    return (
      <motion.div
        key={`${variant}-${insight.id}`}
        initial={{ opacity: 0, x: isFocus ? 0 : -20, y: isFocus ? 10 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => openInsightDetail(insight.id)}
        className={baseClasses}
      >
        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${styles.priorityIndicator}`} />

        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-white/80 ${styles.iconColor} group-hover:scale-110 transition-transform`}>
            <Icon size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-gray-800 truncate">
                {insight.titulo}
              </h4>
              <span className="text-xl flex-shrink-0">{insight.icone}</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-3 whitespace-pre-line">
              {insight.descricao}
            </p>

            {insight.cta && (
              <div className="mb-3">
                <a
                  href={insight.cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                  onClick={(event) => event.stopPropagation()}
                >
                  {insight.cta.label}
                </a>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 bg-white/60 px-2 py-1 rounded-full">
                {getCategoriaLabel(insight.categoria)}
              </span>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                  ${insight.prioridade === 'alta' ? 'bg-red-100 text-red-700' :
                    insight.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'}`}
                >
                  {insight.prioridade === 'alta' ? 'Alta' :
                    insight.prioridade === 'media' ? 'Média' : 'Baixa'}
                </span>

                <span className="text-gray-400">
                  {new Date(insight.data_criacao).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs font-semibold opacity-80 group-hover:opacity-100 transition-opacity mq-link">
              <span>Ver detalhes</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderFilterControls = (variant: 'inline' | 'sheet' = 'inline') => {
    const containerClass = variant === 'inline' ? 'space-y-3' : 'space-y-4';
    const gridClasses =
      variant === 'inline'
        ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2'
        : 'grid grid-cols-1 sm:grid-cols-2 gap-2';

    return (
      <div className={containerClass}>
        <div className="flex flex-wrap gap-2">
          {tipoOptions.map(({ key, label, highlight }) => {
            const isActive = tipoFiltro === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTipoFiltroChange(key)}
                className={`
                  inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all
                  ${isActive ? `${highlight} border-transparent shadow-lg shadow-black/10` : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200'}
                `}
                aria-pressed={isActive}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Prioridade
          </span>
          {prioridadeOptions.map(({ key, label, highlight }) => {
            const isActive = prioridadeFiltro === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handlePrioridadeFiltroChange(key)}
                className={`
                  inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all
                  ${isActive ? `${highlight} border-transparent shadow-lg shadow-black/10` : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200'}
                `}
                aria-pressed={isActive}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {variant === 'inline' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-4 border-t border-gray-100"
          >
            <div className={gridClasses}>
              {resumoOptions.map(({ key, total, label }) => {
                const isActive = categoriaFiltro === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCategoriaFiltroChange(key)}
                    className={`
                      w-full rounded-xl border px-3 py-3 text-left text-sm transition-all
                      ${isActive
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-gray-50 text-gray-600 border-transparent hover:bg-blue-50'}
                    `}
                    aria-pressed={isActive}
                  >
                    <div className={`text-lg font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                      {total}
                    </div>
                    <div className={`mt-1 text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {label}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Categorias
            </p>
            <div className={gridClasses}>
              {resumoOptions.map(({ key, total, label }) => {
                const isActive = categoriaFiltro === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCategoriaFiltroChange(key)}
                    className={`
                      w-full rounded-xl border px-3 py-3 text-left text-sm transition-all
                      ${isActive
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-gray-50 text-gray-600 border-transparent hover:bg-blue-50'}
                    `}
                    aria-pressed={isActive}
                  >
                    <div className={`text-lg font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                      {total}
                    </div>
                    <div className={`mt-1 text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card>
      <div className="flex items-center gap-2 mb-6">
        <Microscope className="text-blue-600" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Insights</h3>
        <div className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {!hasActiveFilters
            ? `${insights.length} insights`
            : `${insightsFiltrados.length}/${insights.length} insights`}
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <div className="md:hidden">
          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/40 px-3 py-2">
            <div className="flex-1 pr-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Filtros ativos
              </p>
              <p className="text-sm font-medium text-gray-700">{summaryText}</p>
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
          <div className="inline-flex items-center rounded-full bg-blue-50 p-1 shadow-inner overflow-x-auto">
            {quickTipoOptions.map(({ key, label }) => {
              const isActive = tipoFiltro === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTipoFiltroChange(key)}
                  className={`
                    whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition
                    ${isActive ? 'mq-btn-primary text-white shadow-sm' : 'mq-link-muted'}
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrioridadeCycle}
              className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700 shadow-sm hover:bg-yellow-100 transition"
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
            {renderFilterControls('inline')}
          </div>
        )}
      </div>

      {insightEmFoco && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-2">
            Insight em foco
          </p>
          {renderInsightCard(insightEmFoco, 0, 'focus')}
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {demaisInsights.length === 0 ? (
          !insightEmFoco && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500 space-y-3">
              <p>Nenhum insight corresponde a esse filtro no momento.</p>
              <button
                type="button"
                onClick={handleResetFiltros}
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
          <div className="relative z-50 w-full rounded-t-3xl bg-white p-5 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-gray-800">Ajustar filtros</h4>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="text-sm font-semibold mq-link"
              >
                Fechar
              </button>
            </div>

            {renderFilterControls('sheet')}

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetFiltros}
                className="flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
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
