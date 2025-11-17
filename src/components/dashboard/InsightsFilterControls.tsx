import React from 'react';
import type { Insight } from '@/types/emotions';
import {
  TIPO_OPTIONS,
  PRIORIDADE_OPTIONS,
  type TipoFiltroValue,
  type PrioridadeFiltroValue,
  type CategoriaFiltroValue,
} from './insightsFilterOptions';

type Props = {
  variant?: 'inline' | 'sheet';
  tipoFiltro: TipoFiltroValue;
  prioridadeFiltro: PrioridadeFiltroValue;
  categoriaFiltro: CategoriaFiltroValue;
  countsByTipo: Record<'todos' | Insight['tipo'], number>;
  resumoOptions: Array<{ key: string; total: number; label: string }>;
  onTipoFiltroChange: (value: TipoFiltroValue) => void;
  onPrioridadeFiltroChange: (value: PrioridadeFiltroValue) => void;
  onCategoriaFiltroChange: (value: CategoriaFiltroValue) => void;
};

const InsightsFilterControls: React.FC<Props> = ({
  variant = 'inline',
  tipoFiltro,
  prioridadeFiltro,
  categoriaFiltro,
  countsByTipo,
  resumoOptions,
  onTipoFiltroChange,
  onPrioridadeFiltroChange,
  onCategoriaFiltroChange,
}) => {
  const containerClass = variant === 'inline' ? 'space-y-3' : 'space-y-4';
  const gridClasses =
    variant === 'inline'
      ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2'
      : 'grid grid-cols-1 sm:grid-cols-2 gap-2';

  return (
    <div className={containerClass}>
      <div className="flex flex-wrap gap-2">
        {TIPO_OPTIONS.map(({ key, label, highlight }) => {
          const isActive = tipoFiltro === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onTipoFiltroChange(key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? `${highlight} border-transparent shadow-lg shadow-black/10`
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
              }`}
              aria-pressed={isActive}
              >
                {label}
                <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-semibold">
                  {countsByTipo[key] ?? 0}
                </span>
              </button>
            );
          })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Prioridade
        </span>
        {PRIORIDADE_OPTIONS.map(({ key, label, highlight }) => {
          const isActive = prioridadeFiltro === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onPrioridadeFiltroChange(key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? `${highlight} border-transparent shadow-lg shadow-black/10`
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
              }`}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Categorias
        </p>
        <div className={gridClasses}>
          {resumoOptions.map(({ key, total, label }) => {
            const isActive = categoriaFiltro === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onCategoriaFiltroChange(key as CategoriaFiltroValue)}
                className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 border-transparent hover:bg-blue-50'
                }`}
                aria-pressed={isActive}
              >
                <div className={`text-lg font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {total}
                </div>
                <div
                  className={`mt-1 text-xs font-semibold uppercase tracking-wide ${
                    isActive ? 'text-white/80' : 'text-slate-500'
                  }`}
                >
                  {label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InsightsFilterControls;
