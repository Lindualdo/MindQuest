import { useEffect, useMemo, useState } from 'react';
import type { Insight, TipoInsight } from '@/types/emotions';

type Prioridade = 'todas' | Insight['prioridade'];
type Categoria = 'todos' | Insight['categoria'];
type TipoFiltro = 'todos' | TipoInsight;

export interface InsightFilterState {
  tipoFiltro: TipoFiltro;
  prioridadeFiltro: Prioridade;
  categoriaFiltro: Categoria;
  searchTerm: string;
  countsByTipo: Record<'todos' | Insight['tipo'], number>;
  setTipoFiltro: (value: TipoFiltro) => void;
  setPrioridadeFiltro: (value: Prioridade) => void;
  setCategoriaFiltro: (value: Categoria) => void;
  setSearchTerm: (value: string) => void;
  resetFiltros: () => void;
  hasActiveFilters: boolean;
  summaryText: string;
  insightsOrdenados: Insight[];
  baseInsightsFiltrados: Insight[];
  insightsFiltrados: Insight[];
  insightEmFoco: Insight | null;
  demaisInsights: Insight[];
  categoriaResumo: Array<{ key: string; total: number; label: string }>;
  resumoOptions: Array<{ key: string; total: number; label: string }>;
}

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export const getCategoriaLabel = (categoria: string) => {
  switch (categoria) {
    case 'comportamental':
      return 'Comportamental';
    case 'emocional':
      return 'Emocional';
    case 'social':
      return 'Social';
    case 'cognitivo':
      return 'Cognitivo';
    default:
      return 'Geral';
  }
};

export const determineInitialFilters = (list: Insight[]): {
  tipo: TipoFiltro;
  prioridade: Prioridade;
} => {
  if (!Array.isArray(list) || list.length === 0) {
    return { tipo: 'todos', prioridade: 'todas' };
  }

  const preferenceOrder: Array<{ tipo: TipoFiltro; prioridade: Prioridade }> = [
    { tipo: 'alerta', prioridade: 'alta' },
    { tipo: 'alerta', prioridade: 'media' },
    { tipo: 'alerta', prioridade: 'baixa' },
    { tipo: 'melhoria', prioridade: 'alta' },
    { tipo: 'padrao', prioridade: 'alta' },
    { tipo: 'positivo', prioridade: 'alta' },
    { tipo: 'todos', prioridade: 'alta' },
    { tipo: 'todos', prioridade: 'media' },
    { tipo: 'todos', prioridade: 'baixa' },
    { tipo: 'todos', prioridade: 'todas' },
  ];

  for (const combo of preferenceOrder) {
    const matches = list.some((insight) => {
      const tipoMatches = combo.tipo === 'todos' ? true : insight.tipo === combo.tipo;
      const prioridadeMatches =
        combo.prioridade === 'todas' ? true : insight.prioridade === combo.prioridade;
      return tipoMatches && prioridadeMatches;
    });

    if (matches) {
      return combo;
    }
  }

  return { tipo: 'todos', prioridade: 'todas' };
};

export const useInsightsFilters = (
  insights: Insight[],
  options?: { initialSearch?: string }
): InsightFilterState => {
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [searchTerm, setSearchTermState] = useState(options?.initialSearch ?? '');

  const initialFilters = useMemo(() => determineInitialFilters(insights), [insights]);

  const [tipoFiltro, setTipoFiltroState] = useState<TipoFiltro>(initialFilters.tipo);
  const [prioridadeFiltro, setPrioridadeFiltroState] = useState<Prioridade>(
    initialFilters.prioridade
  );
  const [categoriaFiltro, setCategoriaFiltroState] = useState<Categoria>('todos');

  useEffect(() => {
    if (!insights.length) {
      if (tipoFiltro !== 'todos') setTipoFiltroState('todos');
      if (prioridadeFiltro !== 'todas') setPrioridadeFiltroState('todas');
      if (categoriaFiltro !== 'todos') setCategoriaFiltroState('todos');
      if (searchTerm) setSearchTermState('');
      if (userHasInteracted) setUserHasInteracted(false);
      return;
    }

    const best = determineInitialFilters(insights);

    if (!userHasInteracted) {
      if (tipoFiltro !== best.tipo) setTipoFiltroState(best.tipo);
      if (prioridadeFiltro !== best.prioridade) setPrioridadeFiltroState(best.prioridade);
      return;
    }
  }, [
    categoriaFiltro,
    insights,
    prioridadeFiltro,
    searchTerm,
    tipoFiltro,
    userHasInteracted,
  ]);

  const insightsOrdenados = useMemo(() => {
    const prioridadeOrder: Record<Insight['prioridade'], number> = {
      alta: 3,
      media: 2,
      baixa: 1,
    };

    return [...insights].sort((a, b) => {
      const prioridadeA = prioridadeOrder[a.prioridade] || 0;
      const prioridadeB = prioridadeOrder[b.prioridade] || 0;

      if (prioridadeA !== prioridadeB) {
        return prioridadeB - prioridadeA;
      }

      return new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime();
    });
  }, [insights]);

  const normalizedSearch = normalizeText(searchTerm.trim());

  const {
    baseInsightsFiltrados,
    insightsFiltrados,
    countsByTipo,
  } = useMemo(() => {
    const baseList: Insight[] = [];
    const filteredList: Insight[] = [];
    const counts: Record<'todos' | Insight['tipo'], number> = {
      todos: 0,
      alerta: 0,
      melhoria: 0,
      padrao: 0,
      positivo: 0,
    };

    const matchesSearch = (insight: Insight) => {
      if (!normalizedSearch) return true;

      const haystack = [
        insight.titulo,
        insight.descricao,
        insight.categoria,
        insight.tipo,
        insight.icone,
        insight.cta?.label ?? '',
        insight.cta?.url ?? '',
      ]
        .filter(Boolean)
        .map((value) => normalizeText(String(value)));

      return haystack.some((value) => value.includes(normalizedSearch));
    };

    insightsOrdenados.forEach((insight) => {
      const categoriaOk = categoriaFiltro === 'todos' || insight.categoria === categoriaFiltro;
      const prioridadeOk =
        prioridadeFiltro === 'todas' || insight.prioridade === prioridadeFiltro;

      if (!categoriaOk || !prioridadeOk || !matchesSearch(insight)) {
        return;
      }

      baseList.push(insight);
      counts.todos += 1;
      counts[insight.tipo] += 1;

      const tipoOk = tipoFiltro === 'todos' || insight.tipo === tipoFiltro;
      if (tipoOk) {
        filteredList.push(insight);
      }
    });

    return {
      baseInsightsFiltrados: baseList,
      insightsFiltrados: filteredList,
      countsByTipo: counts,
    };
  }, [
    categoriaFiltro,
    insightsOrdenados,
    normalizedSearch,
    prioridadeFiltro,
    tipoFiltro,
  ]);

  const hasActiveFilters =
    categoriaFiltro !== 'todos' ||
    tipoFiltro !== 'todos' ||
    prioridadeFiltro !== 'todas' ||
    Boolean(normalizedSearch);

  useEffect(() => {
    if (!insights.length) return;
    if (normalizedSearch) return;

    const best = determineInitialFilters(insights);
    if (insightsFiltrados.length === 0) {
      if (
        tipoFiltro !== best.tipo ||
        prioridadeFiltro !== best.prioridade ||
        categoriaFiltro !== 'todos'
      ) {
        setTipoFiltroState(best.tipo);
        setPrioridadeFiltroState(best.prioridade);
        setCategoriaFiltroState('todos');
        setUserHasInteracted(false);
      }
    }
  }, [
    categoriaFiltro,
    insights,
    insightsFiltrados.length,
    normalizedSearch,
    prioridadeFiltro,
    tipoFiltro,
  ]);

  const categoriaResumo = useMemo(() => {
    const counts = baseInsightsFiltrados.reduce<Record<string, number>>((acc, insight) => {
      const categoria = insight.categoria || 'indefinido';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {});

    const orderedCategorias: Insight['categoria'][] = [
      'comportamental',
      'emocional',
      'social',
      'cognitivo',
    ];

    const ordered = orderedCategorias
      .filter((categoria) => counts[categoria])
      .map((categoria) => ({
        key: categoria,
        total: counts[categoria],
        label: getCategoriaLabel(categoria),
      }));

    const extras = Object.keys(counts)
      .filter((categoria) => !orderedCategorias.includes(categoria as Insight['categoria']))
      .map((categoria) => ({
        key: categoria,
        total: counts[categoria],
        label: getCategoriaLabel(categoria),
      }));

    return [...ordered, ...extras];
  }, [baseInsightsFiltrados]);

  const resumoOptions = useMemo(
    () => {
      const total = baseInsightsFiltrados.length;
      return [
        {
          key: 'todos',
          total,
          label: 'Todos',
        },
        ...categoriaResumo,
      ];
    },
    [baseInsightsFiltrados.length, categoriaResumo]
  );

  const tipoSummaryLabel = (() => {
    switch (tipoFiltro) {
      case 'alerta':
        return 'Alertas';
      case 'melhoria':
        return 'Melhorias';
      case 'padrao':
        return 'Padrões';
      case 'positivo':
        return 'Positivos';
      default:
        return 'Todos';
    }
  })();

  const prioridadeSummaryLabel = (() => {
    switch (prioridadeFiltro) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Média';
      case 'baixa':
        return 'Baixa';
      default:
        return 'Todas';
    }
  })();

  const categoriaSummaryLabel =
    categoriaFiltro === 'todos' ? null : getCategoriaLabel(categoriaFiltro);

  const summaryParts = [tipoSummaryLabel, `Prioridade ${prioridadeSummaryLabel}`];
  if (categoriaSummaryLabel) summaryParts.push(categoriaSummaryLabel);
  if (normalizedSearch) summaryParts.push(`Busca: “${searchTerm.trim()}”`);

  const summaryText = summaryParts.join(' · ');

  const insightEmFoco = insightsFiltrados[0] ?? null;
  const demaisInsights = insightEmFoco ? insightsFiltrados.slice(1) : insightsFiltrados;

  const setTipoFiltro = (value: TipoFiltro) => {
    setUserHasInteracted(true);
    setTipoFiltroState(value);
  };

  const setPrioridadeFiltro = (value: Prioridade) => {
    setUserHasInteracted(true);
    setPrioridadeFiltroState(value);
  };

  const setCategoriaFiltro = (value: Categoria) => {
    setUserHasInteracted(true);
    setCategoriaFiltroState(value);
  };

  const setSearchTerm = (value: string) => {
    setUserHasInteracted(true);
    setSearchTermState(value);
  };

  const resetFiltros = () => {
    const best = determineInitialFilters(insights);
    setTipoFiltroState(best.tipo);
    setPrioridadeFiltroState(best.prioridade);
    setCategoriaFiltroState('todos');
    setSearchTermState('');
    setUserHasInteracted(false);
  };

  return {
    tipoFiltro,
    prioridadeFiltro,
    categoriaFiltro,
    searchTerm,
    countsByTipo,
    setTipoFiltro,
    setPrioridadeFiltro,
    setCategoriaFiltro,
    setSearchTerm,
    resetFiltros,
    hasActiveFilters,
    summaryText,
    insightsOrdenados,
    baseInsightsFiltrados,
    insightsFiltrados,
    insightEmFoco,
    demaisInsights,
    categoriaResumo,
    resumoOptions,
  };
};
