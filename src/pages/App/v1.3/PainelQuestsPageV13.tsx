import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, TrendingUp, Calendar, ArrowUpRight, Settings2, Target } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, isSameDay, isFuture, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import type { QuestPersonalizadaResumo, QuestEstagio } from '@/types/emotions';
import { mockWeeklyXpSummary } from '@/data/mockHomeV1_3';
import { apiService } from '@/services/apiService';

type QuestTab = 'a_fazer' | 'fazendo' | 'feito';

// Função auxiliar para normalizar data (fora do componente para evitar problemas com hooks)
const normalizeDateStr = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const date = parseISO(dateStr);
    return format(date, 'yyyy-MM-dd');
  } catch {
    return null;
  }
};

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

  const [activeTab, setActiveTab] = useState<QuestTab>('a_fazer');
  const [activeNavTab, setActiveNavTab] = useState<TabId>('quests');
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [recorrenciaSelecionada, setRecorrenciaSelecionada] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const hoje = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(hoje);
  const hasRequestedData = useRef(false);

  // Carregar dados apenas se não existirem no estado global
  useEffect(() => {
    if (!usuarioId) return;
    
    if (questSnapshot && weeklyProgressCard) return;
    if (questLoading || weeklyProgressCardLoading) return;
    
    if (!questSnapshot) {
      void loadQuestSnapshot(usuarioId);
    }
    if (!weeklyProgressCard) {
      void loadWeeklyProgressCard(usuarioId);
    }
  }, [usuarioId]);

  const weeklyData = weeklyProgressCard ?? mockWeeklyXpSummary;
  
  const diasSemana = useMemo(() => {
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 0 });
    
    return Array.from({ length: 7 }).map((_, i) => {
      const data = addDays(inicioSemana, i);
      const dataStr = format(data, 'yyyy-MM-dd');
      const diaBackend = weeklyData.dias?.find(d => d.data === dataStr);
      
      return {
        data: dataStr,
        label: format(data, 'EEE', { locale: ptBR }).slice(0, 3).toUpperCase(),
        qtdQuestsPrevistas: diaBackend?.qtdQuestsPrevistas || 0,
        qtdQuestsConcluidas: diaBackend?.qtdQuestsConcluidas || 0,
        dateObj: data
      };
    });
  }, [weeklyData, hoje]);

  // Função para verificar se hoje teve conversa concluída
  const hojeTemConversaConcluida = useMemo(() => {
    const hojeStr = format(hoje, 'yyyy-MM-dd');
    const questReflexao = questSnapshot?.quests_personalizadas?.find(
      q => q.catalogo_codigo === 'reflexao_diaria' || q.tipo === 'reflexao_diaria'
    );
    
    if (!questReflexao) return false;
    
    // Verificar se há recorrência concluída para hoje
    const temConcluidaHoje = questReflexao.recorrencias?.dias?.some((dia: any) => {
      const dataDia = normalizeDateStr(dia.data);
      return dataDia === hojeStr && dia.status === 'concluida';
    });
    
    // Verificar datas_concluidas
    const datasConcluidas = questReflexao.datas_concluidas || [];
    const temDataConcluidaHoje = Array.isArray(datasConcluidas) && datasConcluidas.includes(hojeStr);
    
    return temConcluidaHoje || temDataConcluidaHoje;
  }, [questSnapshot, hoje]);

  // Função para obter estágio da quest (CORRIGIDA)
  const getQuestEstagio = (quest: QuestPersonalizadaResumo): QuestEstagio => {
    // PRIORIDADE 1: Se tem quest_estagio explícito do backend, usar
    if (quest.quest_estagio && ['a_fazer', 'fazendo', 'feito'].includes(quest.quest_estagio)) {
      // CORREÇÃO: Se é reflexão diária e hoje teve conversa concluída, forçar "feito"
      if ((quest.catalogo_codigo === 'reflexao_diaria' || quest.tipo === 'reflexao_diaria') && hojeTemConversaConcluida) {
        return 'feito';
      }
      return quest.quest_estagio as QuestEstagio;
    }
    
    // PRIORIDADE 2: Se está inativa, é "feito"
    if (quest.status === 'inativa') {
      return 'feito';
    }
    
    // PRIORIDADE 3: Se está ativa, verificar recorrências
    if (quest.status === 'ativa') {
      const hojeStr = format(hoje, 'yyyy-MM-dd');
      
      // CORREÇÃO: Quest de conversa - verificar se hoje foi concluída
      if (quest.catalogo_codigo === 'reflexao_diaria' || quest.tipo === 'reflexao_diaria') {
        // Se hoje teve conversa concluída, está em "feito"
        if (hojeTemConversaConcluida) {
          return 'feito';
        }
        // Caso contrário, está em "fazendo" (sempre ativa)
        return 'fazendo';
      }
      
      // Outras quests: verificar recorrências
      const temPendentes = quest.recorrencias?.dias?.some((dia: any) => {
        const dataDia = normalizeDateStr(dia.data);
        return dataDia && dia.status === 'pendente';
      });
      
      if (temPendentes) {
        return 'fazendo';
      }
      
      // Se tem recorrências concluídas mas não pendentes, é "feito"
      const temConcluidas = quest.recorrencias?.dias?.some((dia: any) => dia.status === 'concluida');
      if (temConcluidas) {
        return 'feito';
      }
    }
    
    // PRIORIDADE 4: Se está disponível, é "a fazer"
    if (quest.status === 'disponivel') {
      return 'a_fazer';
    }
    
    // Fallback
    if (quest.concluido_em || quest.status === 'concluida') {
      return 'feito';
    }
    
    return 'a_fazer';
  };

  // Quests filtradas pelo estágio (EXCLUINDO reflexões diárias/conversas)
  const questsPorEstagio = useMemo(() => {
    const todasQuests = questSnapshot?.quests_personalizadas ?? [];
    
    // Filtrar quests de reflexão diária (conversas) - não devem aparecer nas abas
    const questsSemConversas = todasQuests.filter(q => {
      const isConversa = 
        q.catalogo_codigo === 'reflexao_diaria' ||
        q.tipo === 'reflexao_diaria' ||
        q.titulo === 'Reflexão Diária';
      return !isConversa;
    });
    
    return {
      a_fazer: questsSemConversas.filter(q => getQuestEstagio(q) === 'a_fazer'),
      fazendo: questsSemConversas.filter(q => getQuestEstagio(q) === 'fazendo'),
      feito: questsSemConversas.filter(q => getQuestEstagio(q) === 'feito'),
    };
  }, [questSnapshot, hojeTemConversaConcluida]);

  // Filtrar quests por dia selecionado
  const questsDoDiaSelecionado = useMemo(() => {
    const dataStr = format(selectedDate, 'yyyy-MM-dd');
    const todasQuests = questSnapshot?.quests_personalizadas ?? [];
    const isHojeSelecionado = isSameDay(selectedDate, hoje);
    
    // Filtrar quests que têm recorrência na data selecionada
    const questsDoDia = todasQuests.filter(quest => {
      // Excluir conversas
      const isConversa = 
        quest.catalogo_codigo === 'reflexao_diaria' ||
        quest.tipo === 'reflexao_diaria' ||
        quest.titulo === 'Reflexão Diária';
      if (isConversa) return false;
      
      // Se quest está disponível, mostrar apenas se for hoje (para planejar)
      if (quest.status === 'disponivel') {
        return isHojeSelecionado;
      }
      
      // Verificar se tem recorrência na data selecionada
      const temRecorrenciaNoDia = quest.recorrencias?.dias?.some((dia: any) => {
        const dataDia = normalizeDateStr(dia.data);
        return dataDia === dataStr;
      });
      
      return temRecorrenciaNoDia;
    });
    
    return {
      a_fazer: questsDoDia.filter(q => getQuestEstagio(q) === 'a_fazer'),
      fazendo: questsDoDia.filter(q => getQuestEstagio(q) === 'fazendo'),
      feito: questsDoDia.filter(q => getQuestEstagio(q) === 'feito'),
    };
  }, [questSnapshot, selectedDate, hojeTemConversaConcluida, hoje]);

  // Resumo do dia selecionado
  const resumoDiaSelecionado = useMemo(() => {
    const total = questsDoDiaSelecionado.a_fazer.length + 
                  questsDoDiaSelecionado.fazendo.length + 
                  questsDoDiaSelecionado.feito.length;
    const concluidas = questsDoDiaSelecionado.feito.length;
    return { total, concluidas };
  }, [questsDoDiaSelecionado]);

  const handleBack = () => {
    setView('dashboard');
    setActiveNavTab('home');
  };

  const handleConcluirQuest = async (questId: string) => {
    if (questLoading) return;
    
    try {
      await concluirQuest(questId, format(selectedDate, 'yyyy-MM-dd'));
      if (usuarioId) {
        hasRequestedData.current = false;
        // Recarregar dados para atualizar status Fazendo → Feito
        await Promise.all([
          loadQuestSnapshot(usuarioId),
          loadWeeklyProgressCard(usuarioId),
        ]);
        // Feedback visual: quest será removida de "Fazendo" e aparecerá em "Feito" automaticamente
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
    }
  };

  const handlePlanejarQuest = (questId: string) => {
    setSelectedQuestId(questId);
    setRecorrenciaSelecionada(null);
  };

  const isFutureDate = isFuture(selectedDate) && !isSameDay(selectedDate, new Date());

  // Renderizar quest item simplificado para "a fazer"
  const renderQuestItemSimples = (quest: QuestPersonalizadaResumo) => {
    const questId = quest.instancia_id || quest.meta_codigo;
    
    return (
      <Card key={questId} className="!p-4 !bg-white hover:shadow-md transition-shadow" hover={true}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#1C2541]">{quest.titulo}</h3>
            {quest.descricao && (
              <p className="text-xs text-[#64748B] mt-1 line-clamp-1">{quest.descricao}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => questId && handlePlanejarQuest(questId)}
            className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#0EA5E9] text-white shadow-sm hover:bg-[#0C8BD6] active:scale-95 transition-all"
            aria-label="Planejar quest"
          >
            <Settings2 size={16} />
          </button>
        </div>
      </Card>
    );
  };

  // Renderizar quest item completo para "fazendo" e "feito"
  const renderQuestItem = (quest: QuestPersonalizadaResumo, isConcluida = false) => {
    const questId = quest.instancia_id || quest.meta_codigo;
    const xpRecompensa = quest.xp_recompensa ?? 30;
    
    const isConversaQuest = 
      quest.catalogo_codigo === 'reflexao_diaria' ||
      quest.tipo === 'reflexao_diaria' ||
      quest.titulo === 'Reflexão Diária';

    const progresso = quest.progresso_atual || 0;
    const meta = quest.progresso_meta || 0;
    const percentual = meta > 0 ? Math.round((progresso / meta) * 100) : 0;

    return (
      <Card key={questId} className="!p-5 !bg-white hover:shadow-lg transition-all" hover={true}>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className={`text-base font-bold ${isConcluida ? 'text-gray-400 line-through' : 'text-[#1C2541]'}`}>
                {quest.titulo}
              </h3>
              {quest.descricao && (
                <p className="text-sm text-[#64748B] mt-1.5 line-clamp-2">{quest.descricao}</p>
              )}
            </div>
            
            {isConcluida ? (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-bold text-[#059669]">
                  <CheckCircle2 size={14} />
                  Concluída
                </span>
              </div>
            ) : !isConversaQuest ? (
              <button
                type="button"
                onClick={() => questId && handleConcluirQuest(questId)}
                disabled={questLoading || isFutureDate}
                className={`
                  flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all
                  ${isFutureDate 
                    ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300' 
                    : 'border-[#0EA5E9] bg-white text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white hover:shadow-md active:scale-95'
                  }
                `}
                aria-label="Concluir quest"
              >
                {questLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#0EA5E9]" />
                ) : (
                  <CheckCircle2 size={20} />
                )}
              </button>
            ) : null}
          </div>

          {/* Barra de progresso */}
          {!isConcluida && meta > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#64748B]">Progresso</span>
                <span className="font-bold text-[#0EA5E9]">{progresso}/{meta}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#14B8A6] transition-all duration-500"
                  style={{ width: `${percentual}%` }}
                />
              </div>
            </div>
          )}

          {/* XP e ações */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-[#0EA5E9]" />
              <span className="text-xs font-semibold text-[#64748B]">
                {xpRecompensa} XP
              </span>
            </div>
            {questId && (
              <button
                type="button"
                onClick={() => openQuestDetail(questId, format(selectedDate, 'yyyy-MM-dd'))}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0EA5E9] hover:text-[#0C8BD6] transition-colors"
              >
                Ver detalhes
                <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  // Navegador semanal (apenas barras verticais, sem barra horizontal)
  const renderWeeklyProgressBar = () => {
    return (
      <section
        className="mb-6 rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-3 shadow-md"
        style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
      >
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#2F76D1]">
          Quests da Semana
        </p>

        {/* Barras verticais dos dias (navegação principal) */}
        <div className="mt-4 flex h-14 items-end justify-between gap-1">
          {diasSemana.map((dia, index) => {
            const isSelected = dia.dateObj && isSameDay(dia.dateObj, selectedDate);
            const isHoje = dia.dateObj && isSameDay(dia.dateObj, hoje);
            const isFuturoDay = dia.dateObj && isFuture(dia.dateObj) && !isHoje;
            
            const qtdPrevistas = dia.qtdQuestsPrevistas ?? 0;
            const qtdConcluidas = dia.qtdQuestsConcluidas ?? 0;
            
            // Calcular altura da barra baseado em quantidade de quests
            const trackHeight = 40;
            let ratio = 0;
            if (qtdPrevistas > 0) {
              ratio = Math.min(1, qtdConcluidas / qtdPrevistas);
            } else if (qtdConcluidas > 0) {
              ratio = 1;
            }
            const fillHeight = ratio > 0 ? Math.max(4, ratio * trackHeight) : 0;
            const barColor = '#22C55E';
            
            const dataFormatada = dia.dateObj 
              ? format(dia.dateObj, 'dd/MM')
              : '--';
            const labelDia = dia.label;

            return (
              <button
                key={index}
                onClick={() => dia.dateObj && !isFuturoDay && handleSelectDay(dia.dateObj)}
                disabled={isFuturoDay}
                className={`flex flex-1 flex-col items-center justify-end gap-0.5 transition-all ${
                  isFuturoDay ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'
                } ${isSelected ? 'scale-110' : ''}`}
                style={{
                  ...(isSelected ? {
                    boxShadow: '0 0 0 2px rgba(14,165,233,0.5)',
                    borderRadius: '8px',
                    padding: '4px 2px',
                  } : {})
                }}
              >
                <span className="text-[0.65rem] font-semibold text-[#94A3B8] mb-1.5">
                  {qtdPrevistas > 0 ? qtdPrevistas : (qtdConcluidas > 0 ? qtdConcluidas : 0)}
                </span>
                
                <div
                  className="relative overflow-hidden rounded-full bg-slate-200"
                  style={{ height: `${trackHeight}px`, width: '10px' }}
                >
                  {fillHeight > 0 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full"
                      style={{
                        height: `${fillHeight}px`,
                        backgroundColor: barColor,
                      }}
                    />
                  )}
                </div>
                
                <span className="text-[0.56rem] font-semibold uppercase tracking-wide text-[#1C2541]">
                  {labelDia}
                </span>
                
                <span className={`text-[0.56rem] font-medium ${isHoje ? 'text-[#0EA5E9] font-semibold' : 'text-[#7E8CA0]'}`}>
                  {dataFormatada}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  const handleSalvarRecorrencia = async () => {
    if (!recorrenciaSelecionada || !usuarioId || !selectedQuestId) return;
    
    setSalvando(true);
    try {
      await apiService.ativarQuest(usuarioId, selectedQuestId, recorrenciaSelecionada);
      // Recarregar dados após ativar
      if (usuarioId) {
        await Promise.all([
          loadQuestSnapshot(usuarioId),
          loadWeeklyProgressCard(usuarioId),
        ]);
      }
      handleFecharPlanejamento();
    } catch (error) {
      console.error('Erro ao salvar recorrência:', error);
      alert('Erro ao ativar quest. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const handleFecharPlanejamento = () => {
    setSelectedQuestId(null);
    setRecorrenciaSelecionada(null);
    setSalvando(false);
    if (usuarioId) {
      void loadQuestSnapshot(usuarioId);
    }
  };

  // Modal de planejamento simplificado (apenas recorrência)
  const renderPlanejamentoModal = () => {
    if (!selectedQuestId) return null;
    
    const quest = questSnapshot?.quests_personalizadas?.find(
      q => (q.instancia_id || q.meta_codigo) === selectedQuestId
    );
    
    if (!quest) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-t-3xl bg-white shadow-2xl animate-slide-up">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C2541]">Planejar Quest</h2>
              <button
                type="button"
                onClick={handleFecharPlanejamento}
                className="text-[#94A3B8] hover:text-[#1C2541] transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#1C2541] mb-2">{quest.titulo}</h3>
              <p className="text-sm text-[#64748B]">Defina quantos dias você quer praticar esta quest:</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[3, 5, 7, 10, 15].map((dias) => (
                <button
                  key={dias}
                  type="button"
                  onClick={() => setRecorrenciaSelecionada(dias)}
                  className={`
                    rounded-xl border-2 p-4 text-center font-bold transition-all
                    ${recorrenciaSelecionada === dias
                      ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white shadow-lg scale-105'
                      : 'border-gray-200 bg-white text-[#1C2541] hover:border-[#0EA5E9] hover:bg-[#E0F2FE]'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{dias}</div>
                  <div className="text-xs">dias</div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSalvarRecorrencia}
              disabled={!recorrenciaSelecionada || salvando}
              className={`
                w-full rounded-xl py-4 text-center font-bold text-white transition-all
                ${recorrenciaSelecionada && !salvando
                  ? 'bg-[#0EA5E9] hover:bg-[#0C8BD6] shadow-lg active:scale-98'
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              {salvando ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col bg-gradient-to-b from-[#F5EBF3] to-[#FFFFFF]">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1C2541] shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#1C2541] mb-2">
            Minhas Missões
          </h1>
          <p className="text-sm text-[#64748B]">
            Organize e acompanhe seu progresso semanal
          </p>
        </div>

        {/* Barra de Progresso Semanal */}
        {renderWeeklyProgressBar()}

        {/* Indicador do dia selecionado */}
        <div className="mb-4 rounded-xl bg-gradient-to-r from-[#E0F2FE] to-[#F0F9FF] border-2 border-[#BAE6FD] px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1C2541]">
                Quests de {format(selectedDate, "dd/MM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-xs text-[#64748B] mt-0.5">
                {resumoDiaSelecionado.concluidas} de {resumoDiaSelecionado.total} concluídas
              </p>
            </div>
            {isSameDay(selectedDate, hoje) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0EA5E9] px-3 py-1 text-xs font-bold text-white">
                Hoje
              </span>
            )}
          </div>
        </div>

        {/* Abas melhoradas */}
        <div className="mb-6">
          <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-md">
            {(['a_fazer', 'fazendo', 'feito'] as QuestTab[]).map((tab) => {
              const isActive = activeTab === tab;
              // Usar quests do dia selecionado ao invés de todas
              const count = questsDoDiaSelecionado[tab].length;
              const labels = {
                a_fazer: 'A Fazer',
                fazendo: 'Fazendo',
                feito: 'Feito'
              };
              
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`
                    relative flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold transition-all duration-200
                    ${isActive
                      ? 'bg-[#0EA5E9] text-white shadow-md scale-105'
                      : 'text-[#64748B] hover:text-[#1C2541] hover:bg-gray-50'
                    }
                  `}
                >
                  {labels[tab]}
                  {count > 0 && (
                    <span className={`
                      ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold
                      ${isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-[#64748B]'
                      }
                    `}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de Quests (filtradas por dia selecionado) */}
        <div className="space-y-4 flex-1">
          {activeTab === 'a_fazer' && (
            <>
              {questsDoDiaSelecionado.a_fazer.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {questsDoDiaSelecionado.a_fazer.map(quest => renderQuestItemSimples(quest))}
                  </div>
                  <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#E0F2FE] to-[#F0F9FF] p-4 border-2 border-[#BAE6FD]">
                    <p className="text-sm text-[#64748B] text-center">
                      <Settings2 size={16} className="inline mr-2 text-[#0EA5E9]" />
                      Toque no ícone ao lado de cada quest para definir a recorrência
                    </p>
                  </div>
                </>
              ) : (
                <Card className="!p-12 !bg-white text-center shadow-lg" hover={false}>
                  <div className="flex flex-col items-center gap-4 text-[#94A3B8]">
                    <div className="rounded-full bg-[#E0F2FE] p-6">
                      <Target size={48} className="text-[#0EA5E9]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#1C2541] mb-1">
                        Nenhuma quest a fazer
                      </p>
                      <p className="text-sm">
                        Novas quests aparecerão aqui quando disponíveis
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}

          {activeTab === 'fazendo' && (
            <>
              {questsDoDiaSelecionado.fazendo.length > 0 ? (
                <div className="space-y-4">
                  {questsDoDiaSelecionado.fazendo.map(quest => renderQuestItem(quest, false))}
                </div>
              ) : (
                <Card className="!p-12 !bg-white text-center shadow-lg" hover={false}>
                  <div className="flex flex-col items-center gap-4 text-[#94A3B8]">
                    <div className="rounded-full bg-[#FEF3C7] p-6">
                      <TrendingUp size={48} className="text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#1C2541] mb-1">
                        Nenhuma quest em andamento
                      </p>
                      <p className="text-sm">
                        Planeje uma quest para começar
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}

          {activeTab === 'feito' && (
            <>
              {questsDoDiaSelecionado.feito.length > 0 ? (
                <div className="space-y-4">
                  {questsDoDiaSelecionado.feito.map(quest => renderQuestItem(quest, true))}
                </div>
              ) : (
                <Card className="!p-12 !bg-white text-center shadow-lg" hover={false}>
                  <div className="flex flex-col items-center gap-4 text-[#94A3B8]">
                    <div className="rounded-full bg-[#ECFDF5] p-6">
                      <Sparkles size={48} className="text-[#059669]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#1C2541] mb-1">
                        Nenhuma conclusão ainda
                      </p>
                      <p className="text-sm">
                        Complete suas quests para ver aqui
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Erros */}
        {(questError || weeklyProgressCardError) && (
          <div className="mt-4 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-center text-sm text-red-600 shadow-md">
            Alguns dados não puderam ser carregados no momento.
          </div>
        )}
      </main>

      {/* Modal de planejamento */}
      {renderPlanejamentoModal()}

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
