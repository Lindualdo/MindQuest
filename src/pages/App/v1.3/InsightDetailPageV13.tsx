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
} from 'lucide-react';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
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

const InsightDetailPageV13 = () => {
  const {
    dashboardData,
    insightDetail,
    insightDetailLoading,
    insightDetailError,
    closeInsightDetail,
    setView,
    openConversaResumo,
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
          {categoriaInfo && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] ${categoriaInfo.color}`}>
              {categoriaInfo.icon}
              {categoriaInfo.label}
            </span>
          )}
        </div>

        <h2 className="text-lg font-semibold text-[#1C2541]">
          {detail.titulo}
        </h2>
        <p className="mt-2 text-sm text-[#475569]">
          {detail.descricao}
        </p>
        {(prioridadeInfo || detail.prioridade) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {prioridadeInfo && (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.7rem] font-semibold ${prioridadeInfo.color}`}
              >
                <span className={`h-2 w-2 rounded-full ${prioridadeInfo.dot}`} />
                Prioridade {prioridadeInfo.label}
              </span>
            )}
          </div>
        )}

        {detail.chat_id && (
          <button
            type="button"
            onClick={handleOpenConversation}
            className="mt-3 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-[#2563EB]"
          >
            Ver conversa
          </button>
        )}

        <div className="mt-4 space-y-3">
          {feedbackConfigs.map(({ key, label, icon, bg, text }) => {
            const content = detail[key];
            if (!content) return null;
            return (
              <div key={key} className={`rounded-2xl px-3 py-2 text-sm ${bg} ${text}`}>
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  {icon}
                  <span>{label}</span>
                </div>
                <p className="leading-relaxed text-[#1C2541]">
                  {content}
                </p>
              </div>
            );
          })}
        </div>

        {recursosSugeridos.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-sm font-semibold text-[#1C2541]">
              Recursos recomendados
            </p>
            {recursosSugeridos.map((resource) => (
              <ResourceCard
                key={`${resource.nome}-${resource.tipo}`}
                resource={resource}
              />
            ))}
          </div>
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

export default InsightDetailPageV13;
