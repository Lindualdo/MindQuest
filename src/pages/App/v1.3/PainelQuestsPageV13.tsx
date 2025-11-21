import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, TrendingUp, RefreshCw, ArrowUpRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, isSameDay, isFuture, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import CardConversasV13 from '@/components/app/v1.3/CardConversasV13';
import { useDashboard } from '@/store/useStore';
import type { QuestPersonalizadaResumo } from '@/types/emotions';
import { mockWeeklyXpSummary } from '@/data/mockHomeV1_3';

type QuestTab = 'pendentes' | 'concluidas';

const PainelQuestsPageV13: React.FC = () => {
  const {
    dashboardData,
    questSnapshot,
    questLoading,
    questError,
    weeklyProgressCard,
    weeklyProgressCardLoading,
    weeklyProgressCardError,
    loadQuestSnapshot,
    loadWeeklyProgressCard,
    concluirQuest,
    setView,
    openQuestDetail,
  } = useDashboard();

  const usuarioId = dashboardData?.usuario?.id;
  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<QuestTab>('pendentes');
  const [activeNavTab, setActiveNavTab] = useState<TabId>('quests');
  const hoje = useMemo(() => new Date(), []); // Fixar hoje no mount
  const [selectedDate, setSelectedDate] = useState<Date>(hoje);
  // Carregar dados apenas se não existirem no estado global (evita chamadas duplicadas)
  useEffect(() => {
    if (!usuarioId) return;
    
    // Se já tem dados carregados, não precisa recarregar (vem da home ou já foi carregado)
    if (questSnapshot && weeklyProgressCard) return;
    
    // Se já está carregando, aguardar
    if (questLoading || weeklyProgressCardLoading) return;
    
    // Carrega apenas o que falta
    if (!questSnapshot) {
      void loadQuestSnapshot(usuarioId);
    }
    if (!weeklyProgressCard) {
      void loadWeeklyProgressCard(usuarioId);
    }
  }, [usuarioId]); // Dependências mínimas: só usuarioId

  // Dados da semana e progresso (somente quests)
  const weeklyData = weeklyProgressCard ?? mockWeeklyXpSummary;
  
  const diasSemana = useMemo(() => {
    // SEMPRE gera DOM-SAB da semana corrente
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 0 }); // 0 = domingo
    
    return Array.from({ length: 7 }).map((_, i) => {
      const data = addDays(inicioSemana, i);
      const dataStr = format(data, 'yyyy-MM-dd');
      
      // Buscar dados do backend para este dia específico
      const diaBackend = weeklyData.dias?.find(d => d.data === dataStr);
      
      return {
        data: dataStr,
        label: format(data, 'EEE', { locale: ptBR }).slice(0, 3).toUpperCase(),
        metaDia: diaBackend?.metaDia || 0,
        metaConversa: diaBackend?.metaConversa || 0,
        metaQuests: diaBackend?.metaQuests || 0,
        totalXp: diaBackend?.totalXp || 0,
        xpConversa: diaBackend?.xpConversa || 0,
        xpQuests: diaBackend?.xpQuests || 0, // SOMENTE quests
        qtdQuestsPrevistas: diaBackend?.qtdQuestsPrevistas || 0, // Quantidade de quests planejadas
        dateObj: data
      };
    });
  }, [weeklyData, hoje]);

  // Função auxiliar para normalizar data (extrai apenas YYYY-MM-DD de timestamp ou data)
  const normalizeDateStr = (dateStr: string | null | undefined): string | null => {
    if (!dateStr) return null;
    // Se já está no formato YYYY-MM-DD, retorna direto
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // Se é timestamp, extrai apenas a data
    try {
      const date = parseISO(dateStr);
      return format(date, 'yyyy-MM-dd');
    } catch {
      return null;
    }
  };

  // Quests filtradas pelo dia selecionado (TODAS as quests do dia, independente do status)
  const questsDoDia = useMemo(() => {
    const todasQuests = questSnapshot?.quests_personalizadas ?? [];
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    return todasQuests.filter((quest) => {
      // Se a quest é recorrente e tem o campo 'recorrencias'
      if (quest.recorrencias && Array.isArray(quest.recorrencias.dias)) {
        const diaQuest = quest.recorrencias.dias.find((d: any) => {
          if (!d.data) return false;
          const diaNormalizado = normalizeDateStr(d.data);
          return diaNormalizado === selectedDateStr;
        });
        // Se encontrou o dia na recorrencia, inclui a quest (independente do status)
        return diaQuest !== undefined;
      }
      
      // Lógica para quests não recorrentes ou sem 'recorrencias'
      // Se concluída, só mostra no dia da conclusão
      if (quest.concluido_em) {
        try {
          const dataConclusao = parseISO(quest.concluido_em);
          return isSameDay(dataConclusao, selectedDate);
        } catch {
          return false;
        }
      }
      
      // Se pendente ou ativa: mostra em todos os dias da semana (são quests diárias)
      return quest.status === 'pendente' || quest.status === 'ativa' || !quest.status;
    });
  }, [questSnapshot, selectedDate]);

  // SIMPLIFICADO: usar apenas o status que já vem do webhook em recorrencias.dias[].status
  const pendentes = useMemo(() => {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return questsDoDia.filter((q) => {
      if (q.recorrencias && Array.isArray(q.recorrencias.dias)) {
        const diaQuest = q.recorrencias.dias.find((d: any) => {
          const diaNormalizado = normalizeDateStr(d.data);
          return diaNormalizado === selectedDateStr;
        });
        return diaQuest && diaQuest.status !== 'concluida';
      }
      return !q.concluido_em && q.status !== 'concluida';
    });
  }, [questsDoDia, selectedDate]);

  const concluidas = useMemo(() => {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return questsDoDia.filter((q) => {
      if (q.recorrencias && Array.isArray(q.recorrencias.dias)) {
        const diaQuest = q.recorrencias.dias.find((d: any) => {
          const diaNormalizado = normalizeDateStr(d.data);
          return diaNormalizado === selectedDateStr;
        });
        return diaQuest && diaQuest.status === 'concluida';
      }
      return q.concluido_em || q.status === 'concluida';
    });
  }, [questsDoDia, selectedDate]);

  const handleBack = () => {
    setView('dashboard');
    setActiveNavTab('home');
  };

  const handleConcluirQuest = async (questId: string) => {
    if (questLoading) return;
    
    try {
      await concluirQuest(questId, format(selectedDate, 'yyyy-MM-dd'));
      // Recarregar dados após conclusão para garantir que o estado esteja atualizado
      // Especialmente importante para quests recorrentes que atualizam o campo 'recorrencias'
      if (usuarioId) {
        hasRequestedData.current = false;
        await Promise.all([
          loadQuestSnapshot(usuarioId),
          loadWeeklyProgressCard(usuarioId),
        ]);
      }
    } catch (error) {
      console.error('[handleConcluirQuest] Erro ao concluir quest:', error);
    }
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
  
  const handleSelectDay = (data: Date | null) => {
    if (data) {
      setSelectedDate(data);
      // NÃO recarrega: os dados já vêm todos do webhook
    }
  };

  const handleRefresh = () => {
    if (usuarioId) {
      // Força recarregar ao clicar em refresh
      void loadQuestSnapshot(usuarioId);
      void loadWeeklyProgressCard(usuarioId);
    }
  };

  const isFutureDate = isFuture(selectedDate) && !isSameDay(selectedDate, new Date());

  // Renderizar quest item
  const renderQuestItem = (quest: QuestPersonalizadaResumo, isConcluida = false) => {
    const questId = quest.instancia_id || quest.meta_codigo;
    const xpRecompensa = quest.xp_recompensa ?? 30;

    return (
      <Card key={questId} className="!p-4 !bg-[#E8F3F5]" hover={false}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <h3 className={`text-sm font-semibold ${isConcluida ? 'text-gray-500 line-through' : 'text-[#1C2541]'}`}>
              {quest.titulo}
            </h3>
            {quest.descricao && (
              <p className="text-xs text-[#64748B] line-clamp-2">{quest.descricao}</p>
            )}
          </div>
          
          {isConcluida ? (
             <div className="flex flex-col items-end">
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-full">
                  <CheckCircle2 size={12} />
                  Concluída
                </span>
                <span className="text-[10px] text-[#059669] mt-1">+{xpRecompensa} pts</span>
             </div>
          ) : (
            <button
              type="button"
              onClick={() => questId && handleConcluirQuest(questId)}
              disabled={questLoading || isFutureDate}
              className={`
                flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all
                ${isFutureDate 
                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300' 
                  : 'border-[#E2E8F0] bg-white text-[#CBD5E1] hover:border-[#0EA5E9] hover:text-[#0EA5E9] hover:shadow-md active:scale-95'
                }
              `}
              aria-label="Concluir quest"
            >
              {questLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#0EA5E9]" />
              ) : (
                <CheckCircle2 size={20} />
              )}
            </button>
          )}
        </div>
        {questId && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => openQuestDetail(questId)}
              className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#2563EB] underline-offset-2 hover:underline"
            >
              Saber mais
              <ArrowUpRight size={12} />
            </button>
          </div>
        )}
      </Card>
    );
  };

  // Barra de progresso semanal (somente quests)
  const renderWeeklyProgressBar = () => {
    // Calcular totais da semana (somente quests)
    const metaSemanal = (weeklyData.dias ?? []).reduce((sum, dia) => sum + (dia.metaQuests ?? 0), 0);
    const xpSemanal = (weeklyData.dias ?? []).reduce((sum, dia) => sum + (dia.xpQuests ?? 0), 0);
    const percentualMeta = metaSemanal > 0 ? Math.min(100, Math.round((xpSemanal / metaSemanal) * 100)) : 0;

    return (
      <section
        className="mb-6 rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-3 shadow-md"
        style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
      >
        {/* Título */}
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#2F76D1]">
          Quests da semana
        </p>

        {/* Barra de progresso horizontal */}
        <div className="mt-4">
          <div className="relative h-2 w-full rounded-full bg-slate-200">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#22C55E] to-[#14B8A6]"
              style={{ width: `${percentualMeta}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[0.7rem] font-semibold text-[#475569]">
            <span className="text-[#1C2541]">
              {xpSemanal} pontos. {percentualMeta}% da meta
            </span>
            <span>
              {metaSemanal} pts
            </span>
          </div>
        </div>

        {/* Barras verticais dos dias */}
        <div className="mt-5 h-20 w-full">
          <div className="flex h-full items-end justify-between gap-1">
            {diasSemana.map((dia, index) => {
              const isSelected = dia.dateObj && isSameDay(dia.dateObj, selectedDate);
              const isHoje = dia.dateObj && isSameDay(dia.dateObj, hoje);
              const isFuturoDay = dia.dateObj && isFuture(dia.dateObj) && !isHoje;
              
              const metaDia = dia.metaQuests ?? 0;
              const progressoQuests = metaDia > 0 ? Math.min(dia.xpQuests ?? 0, metaDia) : dia.xpQuests ?? 0;
              const ratio = metaDia > 0 ? progressoQuests / metaDia : 0;
              
              // Cor da barra
              const questsOk = metaDia === 0 || (dia.xpQuests ?? 0) >= metaDia;
              const barColor = questsOk ? '#22C55E' : (dia.xpQuests ?? 0) > 0 ? '#86EFAC' : '#CBD5E1';
              
              const trackHeight = 56;
              const fillHeight = ratio > 0 ? Math.max(4, ratio * trackHeight) : 0;

              // Formatar data como DD/MM
              const dataFormatada = dia.dateObj 
                ? dia.dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                : '--';

              return (
                <button
                  key={index}
                  onClick={() => dia.dateObj && !isFuturoDay && handleSelectDay(dia.dateObj)}
                  disabled={isFuturoDay}
                  className={`flex flex-1 flex-col items-center justify-end gap-0.5 transition-all ${
                    isFuturoDay ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  } ${isSelected ? 'scale-105' : ''}`}
                >
                  <div
                    className="relative overflow-visible rounded-full bg-slate-200"
                    style={{ height: `${trackHeight}px`, width: '10px' }}
                  >
                    {/* Número discreto no topo - apenas quando há quests previstas */}
                    {metaDia > 0 && (dia.qtdQuestsPrevistas ?? 0) > 0 && (
                      <span
                        className="absolute -top-2 left-1/2 -translate-x-1/2 text-[0.6rem] font-semibold text-slate-400 leading-none"
                        title={`${dia.qtdQuestsPrevistas} quests planejadas · ${metaDia} pts`}
                      >
                        {dia.qtdQuestsPrevistas}
                      </span>
                    )}
                    {fillHeight > 0 && (
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500"
                        style={{
                          height: `${fillHeight}px`,
                          backgroundColor: barColor,
                        }}
                      />
                    )}
                  </div>
                  <span className={`text-[0.6rem] font-semibold ${
                    isSelected ? 'text-[#1C2541]' : 'text-[#64748B]'
                  }`}>
                    {dia.label ?? '--'}
                  </span>
                  <span className={`text-[0.6rem] font-bold ${
                    isHoje ? 'text-[#0EA5E9]' : isSelected ? 'text-[#1C2541]' : 'text-[#64748B]'
                  }`}>
                    {dataFormatada}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 h-px w-full bg-slate-200" />
        </div>
      </section>
    );
  };

  return (
    <div className="mq-app-v1_2 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4 flex items-center justify-between">
            <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541] shadow"
            >
            <ArrowLeft size={16} />
            Voltar
            </button>
        </div>

        {/* Título da página */}
        <h1 className="mb-6 text-2xl font-bold text-[#1C2541]">
          Minhas missões da semana
        </h1>

        {/* Card de Conversas */}
        <div className="mb-6">
          <CardConversasV13
            xpPrevisto={diasSemana.reduce((sum, dia) => sum + (dia.metaConversa ?? 0), 0)} // Soma das metas de conversa da semana
            xpRealizado={diasSemana.reduce((sum, dia) => sum + (dia.xpConversa ?? 0), 0)} // Soma dos XP de conversas realizados
            diasSemana={diasSemana.map((dia) => ({
              label: dia.label,
              dataLabel: format(dia.dateObj, 'dd/MM'),
              status: ((dia.xpConversa ?? 0) > 0
                ? 'respondido' 
                : isSameDay(dia.dateObj, hoje) 
                  ? 'pendente' 
                  : isFuture(dia.dateObj) 
                    ? 'default' 
                    : 'perdido') as 'respondido' | 'perdido' | 'pendente' | 'default',
              isHoje: isSameDay(dia.dateObj, hoje),
            }))}
          />
        </div>

        {/* Barra de Progresso Semanal */}
        {renderWeeklyProgressBar()}

        {/* Abas */}
        <div className="mb-4 border-b border-slate-200">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('pendentes')}
              className={`relative flex-1 border-b-2 px-4 pb-3 pt-2 text-center text-sm font-semibold transition-all duration-200 ease-out ${
                activeTab === 'pendentes'
                  ? 'border-[#0EA5E9] text-[#0EA5E9]'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 active:scale-[0.98]'
              }`}
            >
              Pendentes
              <span className={`ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold transition-colors ${
                activeTab === 'pendentes'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {pendentes.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('concluidas')}
              className={`relative flex-1 border-b-2 px-4 pb-3 pt-2 text-center text-sm font-semibold transition-all duration-200 ease-out ${
                activeTab === 'concluidas'
                  ? 'border-[#0EA5E9] text-[#0EA5E9]'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 active:scale-[0.98]'
              }`}
            >
              Concluídas
              <span className={`ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold transition-colors ${
                activeTab === 'concluidas'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {concluidas.length}
              </span>
            </button>
          </div>
        </div>

        {/* Lista de Quests */}
        <div className="space-y-3">
            {activeTab === 'pendentes' && (
                <>
                    {pendentes.length > 0 ? (
                        pendentes.map(quest => renderQuestItem(quest, false))
                    ) : (
                        <Card className="!p-8 !bg-[#E8F3F5] text-center" hover={false}>
                            <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
                                <TrendingUp size={32} />
                                <p className="text-sm font-medium">Tudo feito por aqui!</p>
                            </div>
                        </Card>
                    )}
                </>
            )}

            {activeTab === 'concluidas' && (
                <>
                    {concluidas.length > 0 ? (
                        concluidas.map(quest => renderQuestItem(quest, true))
                    ) : (
                        <Card className="!p-8 !bg-[#E8F3F5] text-center" hover={false}>
                            <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
                                <Sparkles size={32} />
                                <p className="text-sm font-medium">Nenhuma conclusão ainda.</p>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>

        
        {/* Erros */}
        {(questError || weeklyProgressCardError) && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs text-red-600">
            Alguns dados não puderam ser carregados no momento.
          </div>
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
