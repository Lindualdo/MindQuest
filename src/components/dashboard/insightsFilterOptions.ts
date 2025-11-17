import type { Insight } from '@/types/emotions';

export const TIPO_OPTIONS = [
  { key: 'todos', label: 'Todos', highlight: 'bg-slate-900 text-white' },
  { key: 'alerta', label: 'Alertas', highlight: 'bg-rose-600 text-white' },
  { key: 'melhoria', label: 'Melhorias', highlight: 'bg-orange-500 text-white' },
  { key: 'padrao', label: 'Padrões', highlight: 'bg-blue-600 text-white' },
  { key: 'positivo', label: 'Positivos', highlight: 'bg-emerald-600 text-white' },
] as const;

export const PRIORIDADE_OPTIONS = [
  { key: 'todas', label: 'Todas', highlight: 'bg-slate-900 text-white' },
  { key: 'alta', label: 'Alta', highlight: 'bg-rose-600 text-white' },
  { key: 'media', label: 'Média', highlight: 'bg-amber-500 text-white' },
  { key: 'baixa', label: 'Baixa', highlight: 'bg-emerald-600 text-white' },
] as const;

export type TipoFiltroValue = (typeof TIPO_OPTIONS)[number]['key'];
export type PrioridadeFiltroValue = (typeof PRIORIDADE_OPTIONS)[number]['key'];
export type CategoriaFiltroValue = 'todos' | Insight['categoria'];
