import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import type { QuestPersonalizadaResumo } from '@/types/emotions';

type QuestTab = 'pendentes' | 'concluidas';

const PainelQuestsPageV13: React.FC = () => {
  const {
    dashboardData,
    questSnapshot,
    questLoading,
    questError,
    questsCard,
    questsCardLoading,
    questsCardError,
    loadQuestSnapshot,
    loadQuestsCard,
    concluirQuest,
    setView,
  } = useDashboard();

  const usuarioId = dashboardData?.usuario?.id;
  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<QuestTab>('pendentes');
  const [activeNavTab, setActiveNavTab] = useState<TabId>('quests');
  const hasRequestedSnapshot = useRef(false);
  const hasRequestedCard = useRef(false);

  // Carregar dados
  useEffect(() => {
    if (!usuarioId) {
      hasRequestedSnapshot.current = false;
      hasRequestedCard.current = false;
      return;
    }
    if (questSnapshot) {
      hasRequestedSnapshot.current = true;
      return;
    }
    if (questLoading) return;
    if (hasRequestedSnapshot.current) return;
    hasRequestedSnapshot.current = true;
    void loadQuestSnapshot(usuarioId);
  }, [usuarioId, questSnapshot, questLoading, loadQuestSnapshot]);

  useEffect(() => {
    if (!usuarioId) {
      hasRequestedCard.current = false;
      return;
    }
    if (questsCard) {
      hasRequestedCard.current = true;
      return;
    }
    if (questsCardLoading) return;
    if (hasRequestedCard.current) return;
    hasRequestedCard.current = true;
    void loadQuestsCard(usuarioId);
  }, [usuarioId, questsCard, questsCardLoading, loadQuestsCard]);

  useEffect(() => {
    hasRequestedSnapshot.current = false;
    hasRequestedCard.current = false;
  }, [usuarioId]);

  // Calcular semana corrente (domingo a sábado)
  const semanaAtual = useMemo(() => {
    const hoje = new Date();
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 0 }); // 0 = domingo
    const fimSemana = endOfWeek(hoje, { weekStartsOn: 0 });
    return { inicioSemana, fimSemana, hoje };
  }, []);

  // Filtrar quests da semana corrente
  const questsDaSemana = useMemo(() => {
    const todasQuests = questSnapshot?.quests_personalizadas ?? [];
    
    return todasQuests.filter((quest) => {
      // Para concluídas: verifica se foi concluída nesta semana
      if (quest.concluido_em) {
        try {
          const dataConclusao = parseISO(quest.concluido_em);
          return isWithinInterval(dataConclusao, {
            start: semanaAtual.inicioSemana,
            end: semanaAtual.fimSemana,
          });
        } catch {
          return false;
        }
      }
      
      // Para pendentes: inclui todas as pendentes (independente da data)
      // pois podem ser ativas durante a semana
      return quest.status !== 'concluida' && !quest.concluido_em;
    });
  }, [questSnapshot, semanaAtual]);

  // Separar pendentes e concluídas
  const pendentes = useMemo(
    () =>
      questsDaSemana.filter(
        (quest) => quest.status !== 'concluida' && !quest.concluido_em,
      ),
    [questsDaSemana],
  );

  const concluidas = useMemo(
    () =>
      questsDaSemana
        .filter((quest) => quest.status === 'concluida' || quest.concluido_em)
        .sort((a, b) => {
          const dataA = a.concluido_em ? new Date(a.concluido_em).getTime() : 0;
          const dataB = b.concluido_em ? new Date(b.concluido_em).getTime() : 0;
          return dataB - dataA;
        }),
    [questsDaSemana],
  );

  // Resumo consolidado
  const resumo = useMemo(() => {
    const totalPendentes = pendentes.length;
    const totalConcluidas = concluidas.length;
    const totalQuests = totalPendentes + totalConcluidas;
    
    // Calcular pontos da semana
    const pontosConcluidas = concluidas.reduce((acc, quest) => {
      const xp = quest.xp_recompensa ?? questsCard?.recompensas?.xp_base ?? 30;
      return acc + xp;
    }, 0);
    
    const snapshot = questsCard?.snapshot;
    const xpBaseTotal = snapshot?.xp_base_total ?? 0;
    const xpBonusTotal = snapshot?.xp_bonus_total ?? 0;
    
    return {
      totalQuests,
      totalPendentes,
      totalConcluidas,
      pontosSemana: pontosConcluidas,
      xpBaseTotal,
      xpBonusTotal,
    };
  }, [pendentes, concluidas, questsCard]);

  const handleBack = () => {
    setView('dashboard');
    setActiveNavTab('home');
  };

  const handleConcluirQuest = (questId: string) => {
    if (questLoading) return;
    void concluirQuest(questId);
  };

  const handleNavHome = () => {
    setActiveNavTab('home');
    setView('dashboard');
  };

  const handleNavPerfil = () => {
    setActiveNavTab('perfil');
    setView('dashEmocoes');
  };

  const handleNavQuests = () => {
    setActiveNavTab('quests');
  };

  const handleNavConfig = () => {
    setActiveNavTab('ajustes');
  };

  const loadingState = questLoading || questsCardLoading;

  // Renderizar quest item
  const renderQuestItem = (quest: QuestPersonalizadaResumo, isConcluida = false) => {
    const meta = Math.max(quest.progresso_meta ?? 1, 1);
    const atual = Math.min(quest.progresso_atual ?? 0, meta);
    const percentual = Math.round((atual / meta) * 100);
    const isRecorrente = quest.recorrencia && quest.recorrencia !== 'unica';
    const xpRecompensa = quest.xp_recompensa ?? questsCard?.recompensas?.xp_base ?? 30;
    const questId = quest.instancia_id || quest.meta_codigo;

    return (
      <Card key={questId} className="!p-4" hover={false}>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold text-[#1C2541]">{quest.titulo}</h3>
              {quest.descricao && (
                <p className="text-xs text-[#64748B] line-clamp-2">{quest.descricao}</p>
              )}
            </div>
            {isConcluida && quest.concluido_em && (
              <span className="text-[10px] font-semibold text-[#059669]">
                {format(parseISO(quest.concluido_em), 'dd/MM', { locale: ptBR })}
              </span>
            )}
          </div>

          {isRecorrente && !isConcluida && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#475569]">
                <span>Progresso</span>
                <span className="text-[#1C2541]">{atual} de {meta}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669]"
                  style={{ width: `${Math.min(100, Math.max(0, percentual))}%` }}
                />
              </div>
            </div>
          )}

          {!isConcluida && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {quest.prioridade && (
                  <span className="rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#B91C1C]">
                    {quest.prioridade}
                  </span>
                )}
                {quest.recorrencia && (
                  <span className="rounded-full bg-[#ECFCCB] px-2 py-0.5 text-[10px] font-semibold text-[#4D7C0F]">
                    {quest.recorrencia}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => questId && handleConcluirQuest(questId)}
                disabled={questLoading || !questId}
                className="flex items-center gap-1.5 rounded-full bg-[#0EA5E9] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90"
              >
                <CheckCircle2 size={14} className={questLoading ? 'animate-spin' : undefined} />
                {questLoading ? 'Concluindo...' : 'Concluir'}
              </button>
            </div>
          )}

          {isConcluida && (
            <div className="rounded-lg bg-[#ECFDF5] px-3 py-2">
              <p className="text-[11px] font-semibold text-[#065F46]">
                +{xpRecompensa} pontos
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="mq-app-v1_2 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1 self-start rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541] shadow"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        {/* Resumo consolidado */}
        <Card className="!p-5 bg-white/90" hover={false}>
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-[#EDE9FE] p-3">
              <Sparkles className="text-[#7C3AED]" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                Resumo da semana
              </p>
              <h2 className="text-lg font-semibold text-[#1C2541]">
                {format(semanaAtual.inicioSemana, 'dd MMM', { locale: ptBR })} - {format(semanaAtual.fimSemana, 'dd MMM', { locale: ptBR })}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] px-3 py-2.5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                Pendentes
              </p>
              <p className="text-xl font-bold text-[#1E3A8A]">{resumo.totalPendentes}</p>
            </div>
            <div className="rounded-xl border border-[#C7D2FE] bg-[#E0E7FF] px-3 py-2.5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4338CA]">
                Concluídas
              </p>
              <p className="text-xl font-bold text-[#3730A3]">{resumo.totalConcluidas}</p>
            </div>
            <div className="rounded-xl border border-[#BBF7D0] bg-[#DCFCE7] px-3 py-2.5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#15803D]">
                Pontos
              </p>
              <p className="text-xl font-bold text-[#166534]">{resumo.pontosSemana}</p>
            </div>
            <div className="rounded-xl border border-[#FDE68A] bg-[#FEF9C3] px-3 py-2.5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A16207]">
                Total
              </p>
              <p className="text-xl font-bold text-[#92400E]">{resumo.totalQuests}</p>
            </div>
          </div>
        </Card>

        {/* Abas */}
        <div className="flex gap-2 rounded-2xl bg-white/80 p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('pendentes')}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'pendentes'
                ? 'bg-[#0EA5E9] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#1C2541]'
            }`}
          >
            Pendentes ({pendentes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('concluidas')}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'concluidas'
                ? 'bg-[#0EA5E9] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#1C2541]'
            }`}
          >
            Concluídas ({concluidas.length})
          </button>
        </div>

        {/* Conteúdo das abas */}
        {loadingState && (
          <Card className="!p-6 text-center" hover={false}>
            <p className="text-sm text-[#64748B]">Carregando quests...</p>
          </Card>
        )}

        {!loadingState && activeTab === 'pendentes' && (
          <div className="space-y-3">
            {pendentes.length > 0 ? (
              pendentes.map((quest) => renderQuestItem(quest, false))
            ) : (
              <Card className="!p-6 text-center" hover={false}>
                <div className="space-y-2">
                  <TrendingUp className="mx-auto text-[#94A3B8]" size={32} />
                  <p className="text-sm font-semibold text-[#475569]">
                    Nenhuma quest pendente
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    Suas quests concluídas aparecerão na aba "Concluídas"
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {!loadingState && activeTab === 'concluidas' && (
          <div className="space-y-3">
            {concluidas.length > 0 ? (
              concluidas.map((quest) => renderQuestItem(quest, true))
            ) : (
              <Card className="!p-6 text-center" hover={false}>
                <div className="space-y-2">
                  <CheckCircle2 className="mx-auto text-[#94A3B8]" size={32} />
                  <p className="text-sm font-semibold text-[#475569]">
                    Nenhuma quest concluída esta semana
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    Complete suas quests pendentes para ver suas conquistas aqui
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Erros */}
        {questError && (
          <Card className="!p-4 bg-red-50 border-red-200" hover={false}>
            <p className="text-center text-xs font-semibold text-red-600">{questError}</p>
          </Card>
        )}
        {questsCardError && (
          <Card className="!p-4 bg-red-50 border-red-200" hover={false}>
            <p className="text-center text-xs font-semibold text-red-600">{questsCardError}</p>
          </Card>
        )}
      </main>

      <BottomNavV1_3
        active={activeNavTab}
        onHome={handleNavHome}
        onPerfil={handleNavPerfil}
        onQuests={handleNavQuests}
        onConfig={handleNavConfig}
      />
    </div>
  );
};

export default PainelQuestsPageV13;
