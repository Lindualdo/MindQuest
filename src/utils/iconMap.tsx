import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Mapeia nomes de ícones (ou emojis antigos) para componentes Lucide
 */
const iconMap: Record<string, LucideIcon | string> = {
  // Sabotadores
  'Scale': LucideIcons.Scale,
  'Compass': LucideIcons.Compass,
  'Handshake': LucideIcons.Handshake,
  'Trophy': LucideIcons.Trophy,
  'ShieldAlert': LucideIcons.ShieldAlert,
  'Brain': LucideIcons.Brain,
  'Ghost': LucideIcons.Ghost,
  'Target': LucideIcons.Target,
  'Wind': LucideIcons.Wind,
  'Zap': LucideIcons.Zap,
  'Smile': LucideIcons.Smile,
  'CircleHelp': LucideIcons.CircleHelp,
  'Lock': LucideIcons.Lock,
  'Hand': LucideIcons.Hand,
  'User': LucideIcons.User,
  'Check': LucideIcons.Check,
  'X': LucideIcons.X,
  'MoreHorizontal': LucideIcons.MoreHorizontal,
  'Minus': LucideIcons.Minus,
  'Mask': LucideIcons.Ghost,
  'Ellipsis': LucideIcons.Ellipsis,
  
  '👋': LucideIcons.Hand,
  '✨': LucideIcons.Sparkles,
  '📊': LucideIcons.BarChart3,
  '🧬': LucideIcons.Dna,
  '💎': LucideIcons.Gem,
  '📅': LucideIcons.Calendar,
  '✅': LucideIcons.CheckCircle2,
  '📉': LucideIcons.TrendingDown,
  '🎖️': LucideIcons.Medal,
  '🌟': LucideIcons.Star,
  '👑': LucideIcons.Crown,
  '🚀': LucideIcons.Rocket,
  '📝': LucideIcons.FileText,
  '💡': LucideIcons.Lightbulb,
  '🚫': LucideIcons.Ban,
  '📍': LucideIcons.MapPin,
  '🔥': LucideIcons.Flame,
  '🎭': LucideIcons.Ghost,
  '🎯': LucideIcons.Target,
  '🪁': LucideIcons.Wind,
  '⚡️': LucideIcons.Zap,
  '⚡': LucideIcons.Zap,
  '🏆': LucideIcons.Trophy,
  '🧠': LucideIcons.Brain,
  '⚖️': LucideIcons.Scale,
  '🧭': LucideIcons.Compass,
  '🤝': LucideIcons.Handshake,
  '🛡️': LucideIcons.ShieldAlert,
  // Áreas de vida
  'Briefcase': LucideIcons.Briefcase,
  'Heart': LucideIcons.Heart,
  'Coins': LucideIcons.Coins,
  'Activity': LucideIcons.Activity,
  'Sprout': LucideIcons.Sprout,
  'Pray': LucideIcons.HandsPraying, // Fallback if name exists
  // Emojis de fallback
  '💼': LucideIcons.Briefcase,
  '💛': LucideIcons.Heart,
  '🙏': LucideIcons.Heart, // Lucide doesn't have a good praying hands icon in standard
  '💰': LucideIcons.Coins,
  '🏃': LucideIcons.Activity,
  '✏️': LucideIcons.Edit3,
  '🎉': LucideIcons.PartyPopper,
};

interface IconRendererProps extends LucideIcons.LucideProps {
  name: string | null | undefined;
  fallback?: React.ReactNode;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, fallback, ...props }) => {
  if (!name) return <>{fallback}</>;
  
  const Icon = iconMap[name];
  
  if (typeof Icon === 'function') {
    return <Icon {...props} />;
  }
  
  // Se não encontrar no mapa, tenta buscar direto no LucideIcons pelo nome
  const DynamicIcon = (LucideIcons as any)[name] as LucideIcon;
  if (DynamicIcon) {
    return <DynamicIcon {...props} />;
  }

  return <>{fallback || name}</>;
};

export default iconMap;

