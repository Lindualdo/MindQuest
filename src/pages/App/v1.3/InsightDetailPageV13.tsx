import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Target,
  BookOpen,
  Loader2,
  Lightbulb,
  Heart,
  Brain,
  Users,
  Plus,
} from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';
import type { InsightResource } from '@/types/emotions';

const feedbackConfigs: Array<{
  key: 'feedback_positivo' | 'feedback_desenvolvimento' | 'feedback_motivacional';
  label: string;
  icon: React.ReactElement;
  bg: string;
  text: string;
}> = [
  {
    key: 'feedback_positivo',
    label: 'Ponto Forte',
    icon: <Sparkles size={16} />, 
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  {
    key: 'feedback_desenvolvimento',
    label: 'Atenção',
    icon: <Target size={16} />, 
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  {
    key: 'feedback_motivacional',
    label: 'Motivação',
    icon: <Lightbulb size={16} />, 
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
];

const categoriaBadge = (categoria: string) => {
  switch (categoria) {
    case 'emocional':
      return { label: 'Emocional', color: 'bg-rose-100 text-rose-700', icon: <Heart size={14} /> };
    case 'comportamental':
      return { label: 'Comportamental', color: 'bg-sky-100 text-sky-700', icon: <Target size={14} /> };
    case 'social':
      return { label: 'Social', color: 'bg-purple-100 text-purple-700', icon: <Users size={14} /> };
    case 'cognitivo':
      return { label: 'Cognitivo', color: 'bg-indigo-100 text-indigo-700', icon: <Brain size={14} /> };
    default:
      return { label: categoria, color: 'bg-gray-100 text-gray-600', icon: <Lightbulb size={14} /> };
  }
};

const prioridadeBadge = (prioridade: string) => {
  switch (prioridade) {
    case 'alta':
      return { label: 'Alta', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
    case 'media':
      return { label: 'Média', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };
    default:
      return { label: 'Baixa', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
  }
};

const ResourceCard = ({ 
  resource, 
  onCriarQuest,
  criandoQuest,
  disabled
}: { 
  resource: InsightResource;
  onCriarQuest: () => void;
  criandoQuest: boolean;
  disabled?: boolean;
}) => (
  <div className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] p-4 shadow-md">
    <div className="mb-3 flex items-start justify-between gap-2">
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h4 className="text-sm font-semibold text-[#1C2541]">{resource.nome}</h4>
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[0.65rem] font-medium text-[#64748B] capitalize">
            {resource.tipo}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[#475569]">
          {resource.descricao}
        </p>
      </div>
    </div>
    
    <div className="mb-3 flex items-start gap-2 rounded-xl border border-white/60 bg-white/50 p-3 text-sm text-[#1C2541]">
      <BookOpen size={16} className="mt-0.5 flex-shrink-0 text-indigo-500" />
      <div className="flex-1">
        <span className="font-semibold text-indigo-600">Como aplicar:</span>
        <p className="mt-1 leading-relaxed">{resource.aplicacao_pratica}</p>
      </div>
    </div>

    {!disabled && (
      <button
        type="button"
        onClick={onCriarQuest}
        disabled={criandoQuest}
        className="w-full rounded-xl border border-[#B6D6DF] bg-white px-3 py-2 text-xs font-semibold text-[#1C2541] shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
      {criandoQuest ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Criando quest...
        </>
      ) : (
        <>
          <Plus size={14} />
          Criar Quest
        </>
      )}
      </button>
    )}
  </div>
);

const InsightDetailPageV13 = () => {
  const {
    dashboardData,
    insightDetail,
    insightDetailLoading,
    insightDetailError,
    closeInsightDetail,
    setView,
    openConversaResumo,
    criarQuestFromInsight,
    questSnapshot,
    loadQuestSnapshot,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const detail = insightDetail;
  const categoriaInfo = useMemo(() => (detail ? categoriaBadge(detail.categoria) : null), [detail]);
  const prioridadeInfo = useMemo(
    () => (detail ? prioridadeBadge(detail.prioridade) : null),
    [detail],
  );

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [criandoQuest, setCriandoQuest] = useState<string | null>(null);
  
  // Recarregar questSnapshot quando o insight é aberto para atualizar botões
  useEffect(() => {
    const usuarioId = dashboardData?.usuario?.id;
    if (detail?.id && usuarioId) {
      // Forçar recarregamento sempre que o insight for aberto
      loadQuestSnapshot(usuarioId).catch(err => {
        console.error('[InsightDetail] Erro ao recarregar snapshot:', err);
      });
    }
  }, [detail?.id, dashboardData?.usuario?.id, loadQuestSnapshot]);
  
  // Verificar quais resource_index já têm quests criadas para este insight
  const resourceIndexesComQuest = useMemo(() => {
    if (!detail?.id) return new Set<number>();
    const quests = questSnapshot?.quests_personalizadas?.filter(
      q => q.insight_id === detail.id && 
      (q.config as any)?.contexto_origem === 'insight_manual'
    ) ?? [];
    
    const indexes = new Set<number>();
    quests.forEach(q => {
      const resourceIndex = (q.config as any)?.resource_index;
      if (resourceIndex !== undefined && resourceIndex !== null) {
        indexes.add(Number(resourceIndex));
      }
    });
    
    return indexes;
  }, [detail?.id, questSnapshot]);
  
  // Função para verificar se um resource_index específico já tem quest
  const resourceJaTemQuest = (resourceIndex: number) => {
    return resourceIndexesComQuest.has(resourceIndex);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBack = () => {
    closeInsightDetail();
    setView('dashboard');
    setActiveTab('home');
  };

  const handleOpenConversation = () => {
    if (detail?.chat_id) {
      openConversaResumo(String(detail.chat_id)).catch(() => null);
    }
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

  const handleCriarQuestFromResource = async (resource: InsightResource, resourceIndex: number) => {
    if (!detail?.id || !detail?.titulo || criandoQuest) return;
    
    // Verificar se este resource_index específico já tem quest criada
    if (resourceJaTemQuest(resourceIndex)) {
      alert('Você já criou uma quest para esta ação.');
      return;
    }
    
    // Verificar se já foram criadas 2 quests para este insight
    if (resourceIndexesComQuest.size >= 2) {
      alert('Você já criou o máximo de 2 quests para este insight.');
      return;
    }

    setCriandoQuest(resource.nome);
    try {
      const resultado = await criarQuestFromInsight(
        detail.id,
        resource.nome,
        resource.descricao,
        resource.aplicacao_pratica,
        resourceIndex
      );
      
      if (resultado.success) {
        // Recarregar snapshot explicitamente antes de navegar
        const usuarioId = dashboardData?.usuario?.id;
        if (usuarioId) {
          await loadQuestSnapshot(usuarioId);
        }
        // Aguardar um pouco para garantir que o snapshot foi processado
        await new Promise(resolve => setTimeout(resolve, 300));
        // Navegar para o painel de quests
        setActiveTab('quests');
        setView('painelQuests');
      } else if (resultado.error) {
        alert(resultado.error);
      }
    } catch (error) {
      console.error('[handleCriarQuestFromResource] Erro ao criar quest:', error);
      alert('Erro ao criar quest. Tente novamente.');
    } finally {
      setCriandoQuest(null);
    }
  };

  const handleNavConfig = () => {
    setActiveTab('ajustes');
  };

  const renderContent = () => {
    if (insightDetailLoading && !detail) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-600">Carregando insight detalhado...</p>
          </div>
        </div>
      );
    }

    if (insightDetailError || !detail) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-rose-100 bg-white px-5 py-6 shadow"
        >
          <div className="mb-3 flex items-center gap-3 text-rose-600">
            <AlertCircle size={22} />
            <h2 className="text-base font-semibold">Não foi possível carregar o insight</h2>
          </div>
          <p className="text-sm text-rose-700">
            {insightDetailError || 'Insight não encontrado ou indisponível no momento.'}
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 w-full rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
          >
            Voltar
          </button>
        </motion.div>
      );
    }

    const recursosSugeridos: InsightResource[] =
      detail.recursos_sugeridos ?? [];

    return (
      <div className="space-y-4">
        {/* Header: Voltar + Badges */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-[#1C2541] shadow-sm"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <div className="flex items-center gap-2">
            {categoriaInfo && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] ${categoriaInfo.color}`}>
                {categoriaInfo.icon}
                {categoriaInfo.label}
              </span>
            )}
            {prioridadeInfo && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${prioridadeInfo.color}`}>
                <span className={`h-2 w-2 rounded-full ${prioridadeInfo.dot}`} />
                {prioridadeInfo.label}
              </span>
            )}
          </div>
        </div>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-5 py-4 shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#1C2541]">
            {detail.titulo}
          </h2>
        </motion.div>

        {/* Descrição */}
        {detail.descricao && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-5 py-4 shadow-md"
          >
            <p className="text-sm leading-relaxed text-[#475569]">
              {detail.descricao}
            </p>
          </motion.div>
        )}

        {/* Insights (Recursos) */}
        {recursosSugeridos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h3 className="px-1 text-sm font-semibold text-[#1C2541]">
              Insights
            </h3>
            {recursosSugeridos.map((resource, index) => (
              <ResourceCard
                key={`${resource.nome}-${resource.tipo}`}
                resource={resource}
                onCriarQuest={() => handleCriarQuestFromResource(resource, index)}
                criandoQuest={criandoQuest === resource.nome}
                disabled={resourceJaTemQuest(index) || resourceIndexesComQuest.size >= 2}
              />
            ))}
          </motion.div>
        )}

        {/* Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          {feedbackConfigs.map(({ key, label, icon, bg, text }) => {
            const content = detail[key];
            if (!content) return null;
            return (
              <div
                key={key}
                className={`rounded-2xl border border-[#B6D6DF] px-4 py-3 text-sm shadow-md ${bg} ${text}`}
              >
                <div className="mb-1.5 flex items-center gap-2 font-semibold">
                  {icon}
                  <span>{label}</span>
                </div>
                <p className="leading-relaxed text-[#1C2541]">
                  {content}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Link Ver Conversa (por último) */}
        {detail.chat_id && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center pt-2"
          >
            <button
              type="button"
              onClick={handleOpenConversation}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#2563EB] transition-colors"
            >
              Ver conversa
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        {renderContent()}
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
};

export default InsightDetailPageV13;
