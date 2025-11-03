import {
  AlertTriangle,
  Brain,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import type { Insight } from '@/types/emotions';

export const insightTypeMeta: Record<
  Insight['tipo'],
  { border: string; iconColor: string; badge: string }
> = {
  alerta: {
    border: 'border-l-rose-500',
    iconColor: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
  },
  melhoria: {
    border: 'border-l-orange-500',
    iconColor: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700',
  },
  padrao: {
    border: 'border-l-blue-500',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
  },
  positivo: {
    border: 'border-l-emerald-500',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
};

export const prioridadeBadgeClasses: Record<Insight['prioridade'], string> = {
  alta: 'bg-rose-100 text-rose-700',
  media: 'bg-amber-100 text-amber-700',
  baixa: 'bg-emerald-100 text-emerald-700',
};

export const getInsightIcon = (tipo: Insight['tipo'], categoria: Insight['categoria']) => {
  switch (tipo) {
    case 'positivo':
      return Trophy;
    case 'alerta':
      return AlertTriangle;
    case 'melhoria':
      return Target;
    case 'padrao':
    default: {
      switch (categoria) {
        case 'comportamental':
          return TrendingUp;
        case 'emocional':
          return Heart;
        case 'social':
          return Users;
        case 'cognitivo':
          return Brain;
        default:
          return Lightbulb;
      }
    }
  }
};
