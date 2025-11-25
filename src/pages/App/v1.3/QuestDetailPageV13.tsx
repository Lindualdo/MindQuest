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
  ExternalLink,
} from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';
import { format } from 'date-fns';

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

const QuestDetailPageV13 = () => {
  const {
    dashboardData,
    questDetail,
    questDetailLoading,
    questDetailError,
    closeQuestDetail,
    setView,
    concluirQuest,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const detail = questDetail;
  const prioridadeInfo = useMemo(() => (detail?.prioridade ? prioridadeBadge(detail.prioridade) : null), [detail]);
  const complexidadeInfo = useMemo(() => complexidadeBadge(detail?.complexidade ?? 0), [detail]);
  const categoriaInfo = useMemo(() => (detail?.catalogo?.categoria ? categoriaBadge(detail.catalogo.categoria) : null), [detail]);

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
      setTimeout(() => {
        handleBack();
      }, 500);
    } catch (error) {
      console.error('Erro ao concluir quest:', error);
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

    const podeConcluir = detail.status === 'pendente' || detail.status === 'ativa';
    const baseCientifica = detail.catalogo?.base_cientifica;

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
            {categoriaInfo && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${categoriaInfo.color}`}>
                {categoriaInfo.icon}
                {categoriaInfo.label}
              </span>
            )}
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

        {/* Benefícios */}
        {baseCientifica?.objetivo && (
          <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-emerald-900">
              <Sparkles size={16} />
              <span>Benefícios</span>
            </div>
            <p className="leading-relaxed text-emerald-800">
              {baseCientifica.objetivo}
            </p>
          </div>
        )}

        {/* Referências Científicas */}
        {baseCientifica?.fundamentos && (
          <div className="mb-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
              <BookOpen size={16} />
              <span>Fundamentos Científicos</span>
            </div>
            <p className="leading-relaxed text-blue-800">
              {baseCientifica.fundamentos}
            </p>
          </div>
        )}

        {/* Como Aplicar */}
        {baseCientifica?.como_aplicar && (
          <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-amber-900">
              <Target size={16} />
              <span>Como Aplicar</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-amber-800">
              {baseCientifica.como_aplicar}
            </p>
          </div>
        )}

        {/* Links de Referências */}
        {baseCientifica?.links_referencias && baseCientifica.links_referencias.length > 0 && (
          <div className="mb-4 rounded-2xl bg-purple-50 px-4 py-3 text-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-purple-900">
              <ExternalLink size={16} />
              <span>Referências</span>
            </div>
            <ul className="space-y-2">
              {baseCientifica.links_referencias.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-purple-700 underline underline-offset-2 hover:text-purple-900"
                  >
                    {link}
                    <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Informações Adicionais */}
        {(detail.catalogo?.tempo_estimado_min || detail.catalogo?.dificuldade) && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Informações Adicionais
            </p>
            <div className="space-y-1">
              {detail.catalogo.tempo_estimado_min && (
                <p className="text-xs text-slate-600">
                  <span className="font-medium">Tempo estimado:</span> {detail.catalogo.tempo_estimado_min} minutos
                </p>
              )}
              {detail.catalogo.dificuldade && (
                <p className="text-xs text-slate-600">
                  <span className="font-medium">Dificuldade:</span> {detail.catalogo.dificuldade === 1 ? 'Fácil' : detail.catalogo.dificuldade === 2 ? 'Média' : 'Alta'}
                </p>
              )}
            </div>
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

        {/* Sabotador */}
        {detail.sabotador && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sabotador Relacionado
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{detail.sabotador.nome}</p>
            {detail.sabotador.descricao && (
              <p className="mt-1 text-xs text-slate-600">{detail.sabotador.descricao}</p>
            )}
            {detail.sabotador.contramedidas_sugeridas && detail.sabotador.contramedidas_sugeridas.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-slate-700">Contramedidas:</p>
                <ul className="mt-1 space-y-1">
                  {detail.sabotador.contramedidas_sugeridas.map((contramedida, idx) => (
                    <li key={idx} className="text-xs text-slate-600">• {contramedida}</li>
                  ))}
                </ul>
              </div>
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

export default QuestDetailPageV13;
