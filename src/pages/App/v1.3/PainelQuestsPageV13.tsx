import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, TrendingUp, RefreshCw } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, isSameDay, isFuture, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
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
    questsCard,
    questsCardLoading,
    questsCardError,
    weeklyProgressCard,
    weeklyProgressCardLoading,
    weeklyProgressCardError,
    loadQuestSnapshot,
    loadQuestsCard,
    loadWeeklyProgressCard,
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const hasRequestedData = useRef(false);

  // Carregar dados
  useEffect(() => {
    if (!usuarioId) {
      hasRequestedData.current = false;
      return;
    }
    if (questLoading || questsCardLoading || weeklyProgressCardLoading) return;
    if (hasRequestedData.current) return;

    hasRequestedData.current = true;
    
    // Carrega tudo que precisa
    void loadQuestSnapshot(usuarioId);
    void loadQuestsCard(usuarioId);
    void loadWeeklyProgressCard(usuarioId);
  }, [usuarioId, questLoading, questsCardLoading, weeklyProgressCardLoading, loadQuestSnapshot, loadQuestsCard, loadWeeklyProgressCard]);

  useEffect(() => {
    hasRequestedData.current = false;
  }, [usuarioId]);

  // Dados da semana e progresso
  const weeklyData = weeklyProgressCard ?? mockWeeklyXpSummary;
  
  const diasSemana = useMemo(() => {
    // Se tiver dados do backend, usa. Se não, gera dias da semana atual
    if (weeklyData.dias && weeklyData.dias.length > 0) {
      return weeklyData.dias.map(d => ({
        ...d,
        dateObj: d.data ? parseISO(d.data) : null
      }));
    }
    
    const hoje = new Date();
    const inicio = startOfWeek(hoje, { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => {
      const data = addDays(inicio, i);
      return {
        data: format(data, 'yyyy-MM-dd'),
        label: format(data, 'EEE', { locale: ptBR }).slice(0, 3),
        metaDia: 0,
        totalXp: 0,
        xpConversa: 0,
        xpQuests: 0,
        dateObj: data
      };
    });
  }, [weeklyData]);

  // Quests filtradas pelo dia selecionado
  const questsDoDia = useMemo(() => {
    const todasQuests = questSnapshot?.quests_personalizadas ?? [];
    const selectedDayStart = startOfDay(selectedDate);
    const hojeStart = startOfDay(new Date());
    
    return todasQuests.filter((quest) => {
      // Se concluída, só mostra no dia da conclusão
      if (quest.concluido_em) {
        try {
          const dataConclusao = parseISO(quest.concluido_em);
          return isSameDay(dataConclusao, selectedDate);
        } catch {
          return false;
        }
      }
      
      // Se pendente ou ativa:
      // - Mostra em qualquer dia passado ou presente (como atrasadas/disponíveis)
      // - Não mostra em dias futuros (exceto hoje se for futuro)
      const isSelectedPastOrToday = selectedDayStart <= hojeStart;
      
      if (!isSelectedPastOrToday) {
        return false;
      }
      
      // Quest pendente/ativa aparece em dias passados e hoje
      return quest.status === 'pendente' || quest.status === 'ativa' || !quest.status;
    });
  }, [questSnapshot, selectedDate]);

  const pendentes = useMemo(
    () => questsDoDia.filter(q => !q.concluido_em && q.status !== 'concluida'),
    [questsDoDia]
  );

  const concluidas = useMemo(
    () => questsDoDia.filter(q => q.concluido_em || q.status === 'concluida'),
    [questsDoDia]
  );

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
  
  const handleSelectDay = (data: Date | null) => {
    if (data) {
      setSelectedDate(data);
      // Recarrega dados ao mudar de dia para garantir que as quests estejam atualizadas
      if (usuarioId) {
        hasRequestedData.current = false;
        void loadQuestSnapshot(usuarioId);
      }
    }
  };

  const handleRefresh = () => {
    if (usuarioId) {
      hasRequestedData.current = false;
      void loadQuestSnapshot(usuarioId);
      void loadQuestsCard(usuarioId);
      void loadWeeklyProgressCard(usuarioId);
    }
  };

  const isFutureDate = isFuture(selectedDate) && !isSameDay(selectedDate, new Date());

  // Renderizar quest item
  const renderQuestItem = (quest: QuestPersonalizadaResumo, isConcluida = false) => {
    const questId = quest.instancia_id || quest.meta_codigo;
    const xpRecompensa = quest.xp_recompensa ?? 30;

    return (
      <Card key={questId} className="!p-4" hover={false}>
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
      </Card>
    );
  };

  // Barra de dias da semana
  const renderWeeklyBar = () => {
    return (
      <div className="mb-6 flex h-24 items-end justify-between gap-1 rounded-2xl bg-white px-3 pb-3 pt-4 shadow-sm">
        {diasSemana.map((dia, index) => {
            const isSelected = dia.dateObj && isSameDay(dia.dateObj, selectedDate);
            const isHoje = dia.dateObj && isSameDay(dia.dateObj, new Date());
            
            // Altura da barra baseada no progresso
            const meta = dia.metaDia || 1;
            const realizado = dia.totalXp || 0;
            const ratio = Math.min(1, realizado / meta);
            const barHeight = Math.max(4, ratio * 48); // max 48px altura
            
            // Cor da barra
            let barColor = '#CBD5E1'; // Cinza default
            if (realizado >= meta && meta > 0) barColor = '#22C55E'; // Verde full
            else if (realizado > 0) barColor = '#86EFAC'; // Verde claro
            
            return (
                <button
                    key={index}
                    onClick={() => handleSelectDay(dia.dateObj)}
                    className={`group flex flex-1 flex-col items-center justify-end gap-2 transition-all ${isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
                >
                    {/* Barra */}
                    <div className="relative h-14 w-full flex items-end justify-center">
                         <div 
                            className={`w-2.5 rounded-full transition-all duration-500 ${isSelected ? 'ring-2 ring-[#0EA5E9] ring-offset-2' : ''}`}
                            style={{ 
                                height: `${barHeight}px`, 
                                backgroundColor: barColor 
                            }} 
                         />
                    </div>
                    
                    {/* Label Dia */}
                    <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-[#0EA5E9]' : 'text-[#64748B]'}`}>
                            {dia.label}
                        </span>
                        {isHoje && <div className="mt-0.5 h-1 w-1 rounded-full bg-[#0EA5E9]" />}
                    </div>
                </button>
            );
        })}
      </div>
    );
  };

  return (
    <div className="mq-app-v1_2 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar e refresh */}
        <div className="mb-4 flex items-center justify-between">
            <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541] shadow"
            >
            <ArrowLeft size={16} />
            Voltar
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#1C2541]">
                  {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={questLoading || questsCardLoading || weeklyProgressCardLoading}
                className="inline-flex items-center justify-center rounded-full bg-white p-1.5 text-[#1C2541] shadow transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Recarregar"
              >
                <RefreshCw 
                  size={16} 
                  className={questLoading || questsCardLoading || weeklyProgressCardLoading ? 'animate-spin' : ''} 
                />
              </button>
            </div>
        </div>

        {/* Barra Semanal Interativa */}
        {renderWeeklyBar()}

        {/* Abas */}
        <div className="mb-4 flex gap-2 rounded-2xl bg-white/80 p-1.5 shadow-sm">
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

        {/* Lista de Quests */}
        <div className="space-y-3">
            {activeTab === 'pendentes' && (
                <>
                    {pendentes.length > 0 ? (
                        pendentes.map(quest => renderQuestItem(quest, false))
                    ) : (
                        <Card className="!p-8 text-center" hover={false}>
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
                        <Card className="!p-8 text-center" hover={false}>
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
        {(questError || questsCardError || weeklyProgressCardError) && (
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
