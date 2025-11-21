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
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';
import type { InsightResource } from '@/types/emotions';
import { format } from 'date-fns';

const feedbackConfigs: Array<{
  key: 'feedback_positivo' | 'feedback_desenvolvimento' | 'feedback_motivacional';
  label: string;
  icon: React.ReactElement;
  bg: string;
  text: string;
}> = [
  {
    key: 'feedback_positivo',
    label: 'Por que é importante?',
    icon: <Sparkles size={16} />, 
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  {
    key: 'feedback_desenvolvimento',
    label: 'Como praticar?',
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

const categoriaBadge = (categoria?: string) => {
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
      return { label: categoria || 'Geral', color: 'bg-gray-100 text-gray-600', icon: <Lightbulb size={14} /> };
  }
};

const prioridadeBadge = (prioridade?: string) => {
  switch (prioridade) {
    case 'alta':
      return { label: 'Alta', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
    case 'media':
      return { label: 'Média', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };
    default:
      return { label: 'Baixa', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
  }
};

const complexidadeBadge = (complexidade: number) => {
  if (complexidade >= 4) {
    return { label: 'Alta', color: 'bg-red-100 text-red-700' };
  } else if (complexidade >= 2) {
    return { label: 'Média', color: 'bg-amber-100 text-amber-700' };
  }
  return { label: 'Baixa', color: 'bg-emerald-100 text-emerald-700' };
};

const ResourceCard = ({ resource }: { resource: InsightResource }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center justify-between">
      <h4 className="text-sm font-semibold text-slate-800">{resource.nome}</h4>
      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 capitalize">
        {resource.tipo}
      </span>
    </div>
    <p className="mb-3 text-sm leading-relaxed text-slate-600">
      {resource.descricao}
    </p>
    <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
      <BookOpen size={16} className="mt-1 text-indigo-500" />
      <div>
        <span className="font-medium text-indigo-600">Como aplicar:</span>
        <p className="mt-1 leading-relaxed">{resource.aplicacao_pratica}</p>
      </div>
    </div>
  </div>
);

const QuestDetailPageV13 = () => {
  const {
    dashboardData,
    questDetail,
    questDetailLoading,
    questDetailError,
    closeQuestDetail,
    setView,
    concluirQuest,
    openInsightDetail,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const detail = questDetail;
  const categoriaInfo = useMemo(() => (detail?.insight?.categoria ? categoriaBadge(detail.insight.categoria) : null), [detail]);
  const prioridadeInfo = useMemo(() => (detail?.prioridade ? prioridadeBadge(detail.prioridade) : null), [detail]);
  const complexidadeInfo = useMemo(() => complexidadeBadge(detail?.complexidade ?? 0), [detail]);

  const [activeTab, setActiveTab] = useState<TabId>('home');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBack = () => {
    closeQuestDetail();
    setView('painelQuests');
    setActiveTab('quests');
  };

  const handleConcluirQuest = async () => {
    if (!detail?.id) return;
    const hoje = format(new Date(), 'yyyy-MM-dd');
    try {
      await concluirQuest(detail.id, hoje);
      // Aguardar um pouco e voltar
      setTimeout(() => {
        handleBack();
      }, 500);
    } catch (error) {
      console.error('Erro ao concluir quest:', error);
    }
  };

  const handleOpenInsight = () => {
    if (detail?.insight?.id) {
      openInsightDetail(detail.insight.id);
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

  const handleNavConfig = () => {
    setActiveTab('ajustes');
  };

  const renderContent = () => {
    if (questDetailLoading && !detail) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-600">Carregando detalhes da quest...</p>
          </div>
        </div>
      );
    }

    if (questDetailError || !detail) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-rose-100 bg-white px-5 py-6 shadow"
        >
          <div className="mb-3 flex items-center gap-3 text-rose-600">
            <AlertCircle size={22} />
            <h2 className="text-base font-semibold">Não foi possível carregar a quest</h2>
          </div>
          <p className="text-sm text-rose-700">
            {questDetailError || 'Quest não encontrada ou indisponível no momento.'}
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

    const recursosSugeridos: InsightResource[] = detail.insight?.recursos_sugeridos ?? [];
    const podeConcluir = detail.status === 'pendente' || detail.status === 'ativa';
    const insightPrioridadeInfo = detail.insight?.prioridade ? prioridadeBadge(detail.insight.prioridade) : null;

    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-5 shadow"
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541]"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <div className="flex gap-2">
            {detail.area_vida && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[0.7rem] font-semibold text-blue-700">
                {detail.area_vida.nome}
              </span>
            )}
            {prioridadeInfo && (
              <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${prioridadeInfo.color}`}>
                <span className={`h-2 w-2 rounded-full ${prioridadeInfo.dot}`} />
                {prioridadeInfo.label}
              </span>
            )}
            {complexidadeInfo && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${complexidadeInfo.color}`}>
                {complexidadeInfo.label}
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-[#1C2541]">
            {detail.titulo}
          </h2>
          {detail.descricao && (
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
              {detail.descricao}
            </p>
          )}
          {detail.xp_recompensa && (
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700">
              <Sparkles size={14} />
              +{detail.xp_recompensa} XP
            </div>
          )}
        </div>

        {/* Por que é importante? */}
        {detail.insight?.feedback_positivo && (
          <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Sparkles size={16} />
              <span>Por que é importante?</span>
            </div>
            <p className="leading-relaxed text-[#1C2541]">
              {detail.insight.feedback_positivo}
            </p>
          </div>
        )}

        {/* Como praticar? */}
        {recursosSugeridos.length > 0 && (
          <div className="mb-4 space-y-3">
            <p className="text-sm font-semibold text-[#1C2541]">
              Como praticar?
            </p>
            {recursosSugeridos.map((resource) => (
              <ResourceCard
                key={`${resource.nome}-${resource.tipo}`}
                resource={resource}
              />
            ))}
          </div>
        )}

        {detail.insight?.feedback_desenvolvimento && (
          <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Target size={16} />
              <span>Orientação</span>
            </div>
            <p className="leading-relaxed text-[#1C2541]">
              {detail.insight.feedback_desenvolvimento}
            </p>
          </div>
        )}

        {/* Motivação */}
        {detail.insight?.feedback_motivacional && (
          <div className="mb-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-4 py-4 text-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-indigo-700">
              <Lightbulb size={16} />
              <span>Motivação</span>
            </div>
            <p className="leading-relaxed italic text-indigo-900">
              {detail.insight.feedback_motivacional}
            </p>
          </div>
        )}

        {/* Link para insight completo */}
        {detail.insight && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={handleOpenInsight}
              className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#2563EB] underline-offset-2 hover:underline"
            >
              Saber mais sobre este insight
              <ArrowUpRight size={12} />
            </button>
          </div>
        )}

        {/* Área de vida */}
        {detail.area_vida && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Área de vida
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{detail.area_vida.nome}</p>
            {detail.area_vida.descricao && (
              <p className="mt-1 text-xs text-slate-600">{detail.area_vida.descricao}</p>
            )}
          </div>
        )}

        {/* Botão Concluir - em destaque */}
        {podeConcluir && (
          <button
            type="button"
            onClick={handleConcluirQuest}
            className="w-full rounded-2xl bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={20} />
              Concluir Quest
            </div>
          </button>
        )}
      </motion.section>
    );
  };

  return (
    <div className="mq-app-v1_2 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />

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

export default QuestDetailPageV13;
