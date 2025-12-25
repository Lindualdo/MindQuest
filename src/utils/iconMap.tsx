import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
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
  'Check': LucideIcons.Check,
  'X': LucideIcons.X,
  'MoreHorizontal': LucideIcons.MoreHorizontal,
  'Minus': LucideIcons.Minus,
  'Ellipsis': LucideIcons.Ellipsis,
  'HandHelping': LucideIcons.HandHelping,
  'Sparkles': LucideIcons.Sparkles,
  'BarChart3': LucideIcons.BarChart3,
  'Dna': LucideIcons.Dna,
  'Gem': LucideIcons.Gem,
  'Calendar': LucideIcons.Calendar,
  'CheckCircle2': LucideIcons.CheckCircle2,
  'TrendingDown': LucideIcons.TrendingDown,
  'Medal': LucideIcons.Medal,
  'Star': LucideIcons.Star,
  'Crown': LucideIcons.Crown,
  'Rocket': LucideIcons.Rocket,
  'FileText': LucideIcons.FileText,
  'Lightbulb': LucideIcons.Lightbulb,
  'Ban': LucideIcons.Ban,
  'MapPin': LucideIcons.MapPin,
  'Flame': LucideIcons.Flame,
  'Briefcase': LucideIcons.Briefcase,
  'Heart': LucideIcons.Heart,
  'Coins': LucideIcons.Coins,
  'Activity': LucideIcons.Activity,
  'Sprout': LucideIcons.Sprout,
  'Edit3': LucideIcons.Edit3,
  'PartyPopper': LucideIcons.PartyPopper,
  'MessageCircle': LucideIcons.MessageCircle,
};

// Mapeamento de emojis para nomes de ícones
const emojiToIcon: Record<string, string> = {
  '👋': 'Hand',
  '✨': 'Sparkles',
  '📊': 'BarChart3',
  '🧬': 'Dna',
  '💎': 'Gem',
  '📅': 'Calendar',
  '✅': 'CheckCircle2',
  '📉': 'TrendingDown',
  '🎖️': 'Medal',
  '🌟': 'Star',
  '👑': 'Crown',
  '🚀': 'Rocket',
  '📝': 'FileText',
  '💡': 'Lightbulb',
  '🚫': 'Ban',
  '📍': 'MapPin',
  '🔥': 'Flame',
  '🎭': 'Ghost',
  '😢': 'Ghost',
  '🎯': 'Target',
  '🪁': 'Wind',
  '🙈': 'Wind',
  '⚡️': 'Zap',
  '⚡': 'Zap',
  '🏆': 'Trophy',
  '🧠': 'Brain',
  '⚖️': 'Scale',
  '🧭': 'Compass',
  '🤝': 'Handshake',
  '🛡️': 'ShieldAlert',
  '👀': 'ShieldAlert',
  '💼': 'Briefcase',
  '💛': 'Heart',
  '🙏': 'HandHelping',
  '💰': 'Coins',
  '🏃': 'Activity',
  '✏️': 'Edit3',
  '🎉': 'PartyPopper',
};

interface IconRendererProps extends LucideIcons.LucideProps {
  name: string | null | undefined;
  fallback?: React.ReactNode;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, fallback, ...props }) => {
  if (!name) return <>{fallback}</>;
  
  // Se for um emoji, resolve para o nome do ícone
  const iconName = emojiToIcon[name] || name;
  const Icon = iconMap[iconName];
  
  if (Icon) {
    return <Icon {...props} />;
  }
  
  // Tenta buscar direto no LucideIcons se não estiver no mapa
  const DynamicIcon = (LucideIcons as any)[iconName];
  if (DynamicIcon) {
    return <DynamicIcon {...props} />;
  }

  return <>{fallback || name}</>;
};
