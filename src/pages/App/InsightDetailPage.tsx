import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Target,
  BookOpen,
  Link as LinkIcon,
  Loader2,
  Calendar,
  Lightbulb,
  Heart,
  Brain,
  Users
} from 'lucide-react';
import { useDashboard } from '@/store/useStore';
import type { InsightResource } from '@/types/emotions';

const feedbackConfigs: Array<{
  key: 'feedback_positivo' | 'feedback_desenvolvimento' | 'feedback_motivacional';
  label: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
}> = [
  {
    key: 'feedback_positivo',
    label: 'Ponto Forte',
    icon: <Sparkles size={16} />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700'
  },
  {
    key: 'feedback_desenvolvimento',
    label: 'Atenção',
    icon: <Target size={16} />,
    bg: 'bg-amber-50',
    text: 'text-amber-700'
  },
  {
    key: 'feedback_motivacional',
    label: 'Motivação',
    icon: <Lightbulb size={16} />,
    bg: 'bg-indigo-50',
    text: 'text-indigo-700'
  }
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

const formatDateTime = (iso?: string | null) => {
  if (!iso) return 'Data não informada';
  try {
    const date = new Date(iso);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return iso;
  }
};

const ResourceCard: React.FC<{ resource: InsightResource }> = ({ resource }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-semibold text-slate-800">{resource.nome}</h4>
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 capitalize">
        {resource.tipo}
      </span>
    </div>
    <p className="text-sm text-slate-600 mb-3 leading-relaxed">
      {resource.descricao}
    </p>
    <div className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3">
      <BookOpen size={16} className="mt-1 text-indigo-500" />
      <div>
        <span className="font-medium text-indigo-600">Como aplicar:</span>
        <p className="mt-1 leading-relaxed">{resource.aplicacao_pratica}</p>
      </div>
    </div>
  </div>
);

const InsightDetailPage: React.FC = () => {
  const {
    insightDetail,
    insightDetailLoading,
    insightDetailError,
    closeInsightDetail
  } = useDashboard();

  const detail = insightDetail;

  const categoriaInfo = useMemo(() => detail ? categoriaBadge(detail.categoria) : null, [detail]);
  const prioridadeInfo = useMemo(() => detail ? prioridadeBadge(detail.prioridade) : null, [detail]);

  const handleBack = () => {
    closeInsightDetail();
  };

  const handleOpenConversation = () => {
    if (detail?.chat_id) {
      window.open(`#chat/${detail.chat_id}`, '_blank', 'noopener,noreferrer');
    }
  };

  if (insightDetailLoading && !detail) {
    return (
      <div className="mindquest-dashboard min-h-screen flex items-center justify-center px-6">
        <div className="glass-card max-w-md w-full p-6 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-600 text-center">
            Carregando insight detalhado...
          </p>
        </div>
      </div>
    );
  }

  if (insightDetailError || !detail) {
    return (
      <div className="mindquest-dashboard min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-card border border-rose-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4 text-rose-600">
            <AlertCircle size={28} />
            <h2 className="text-lg font-semibold">Não foi possível carregar o insight</h2>
          </div>
          <p className="text-sm text-rose-700 mb-4">
            {insightDetailError || 'Insight não encontrado ou indisponível no momento.'}
          </p>
          <button
            onClick={handleBack}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para o dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mindquest-dashboard min-h-screen pb-8">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-white/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl bg-white shadow hover:shadow-md transition-all"
            aria-label="Voltar para os insights"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div className="leading-tight">
            <p
              className="text-sm font-semibold"
              style={{ color: '#D90368' }}
            >
              MindQuest
            </p>
            <p className="text-xs font-medium text-slate-500">
              Insight destacado
            </p>
            <h1 className="text-lg font-semibold text-slate-800">
              Aprendizados
            </h1>
          </div>
        </div>
      </header> 

      <main className="max-w-4xl mx-auto px-4 pt-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl border border-white/60 shadow-xl overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl">{detail.icone || '💡'}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {categoriaInfo && (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${categoriaInfo.color}`}>
                      {categoriaInfo.icon}
                      {categoriaInfo.label}
                    </span>
                  )}
                  {prioridadeInfo && (
                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${prioridadeInfo.color}`}>
                      <span className={`w-2 h-2 rounded-full ${prioridadeInfo.dot}`} />
                      Prioridade {prioridadeInfo.label}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug">
                  {detail.titulo}
                </h2>
                {detail.resumo_situacao && (
                  <p className="mt-3 text-base text-slate-600 leading-relaxed">
                    {detail.resumo_situacao}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 mb-8 md:grid-cols-3">
              {feedbackConfigs.map((config) => {
                const value = detail[config.key];
                if (!value) return null;
                return (
                  <div
                    key={config.key}
                    className={`rounded-2xl border border-slate-100 p-4 ${config.bg}`}
                  >
                    <div className={`flex items-center gap-2 mb-2 text-sm font-semibold ${config.text}`}>
                      {config.icon}
                      {config.label}
                    </div>
                    <p className={`text-sm leading-relaxed ${config.text.replace('text', 'text-opacity-80')}`}>
                      {value}
                    </p>
                  </div>
                );
              })}
            </div>

            {detail.baseado_em && detail.baseado_em.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Este insight considera:</h3>
                <div className="flex flex-wrap gap-2">
                  {detail.baseado_em.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {detail.recursos_sugeridos && detail.recursos_sugeridos.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={18} className="text-indigo-500" />
                  <h3 className="text-sm font-semibold text-slate-700">
                    Recursos recomendados
                  </h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {detail.recursos_sugeridos.map((resource) => (
                    <ResourceCard key={resource.nome} resource={resource} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Calendar size={16} />
                <span>Criado em {formatDateTime(detail.criado_em)}</span>
              </div>
              {detail.chat_id && (
                <button
                  onClick={handleOpenConversation}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium mq-btn-primary"
                  disabled
                >
                  <LinkIcon size={16} />
                  Ver conversa relacionada
                </button>
              )}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default InsightDetailPage;
