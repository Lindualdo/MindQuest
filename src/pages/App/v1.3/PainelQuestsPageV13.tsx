import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, TrendingUp, ArrowUpRight, Settings2, Target, Star, Trophy } from 'lucide-react';
import { format, startOfWeek, parseISO, isSameDay, isFuture, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
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
    view,
    painelQuestsReturnView,
  } = useDashboard();

  const usuarioId = dashboardData?.usuario?.id;
  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<QuestTab>('a_fazer');
  const [activeNavTab, setActiveNavTab] = useState<TabId>('agir');
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [recorrenciaSelecionada, setRecorrenciaSelecionada] = useState<number | null>(null);
  const [tipoRecorrencia, setTipoRecorrencia] = useState<'diaria' | 'semanal'>('diaria');
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

  // Sempre recarregar snapshot ao entrar no painel de quests para garantir dados atualizados
  const lastViewRef = useRef<string | null>(null);
  useEffect(() => {
    if (view === 'painelQuests' && usuarioId && !questLoading) {
      // Só recarregar se a view mudou para painelQuests (não a cada render)
      if (lastViewRef.current !== 'painelQuests') {
        lastViewRef.current = 'painelQuests';
        void loadQuestSnapshot(usuarioId);
        void loadWeeklyProgressCard(usuarioId);
      }
    } else if (view !== 'painelQuests') {
      lastViewRef.current = view;
    }
  }, [view, usuarioId, questLoading]);

  const weeklyData = weeklyProgressCard ?? mockWeeklyXpSummary;
  
  const diasSemana = useMemo(() => {
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });
    
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
    
    return temConcluidaHoje || false;
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
      
      // Quest ativa sem recorrências ou sem recorrências pendentes/concluídas = "a_fazer"
      // (usuário pode planejar novas recorrências)
      return 'a_fazer';
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


  // Função auxiliar para obter estágio da quest considerando o dia selecionado
  const getQuestEstagioParaDia = (quest: QuestPersonalizadaResumo, dataSelecionada: Date): QuestEstagio => {
    const dataStr = format(dataSelecionada, 'yyyy-MM-dd');
    
    // Se quest está disponível, sempre é "a fazer"
    if (quest.status === 'disponivel') {
      return 'a_fazer';
    }
    
    // Se quest está inativa, verificar se tem recorrência concluída no dia
    if (quest.status === 'inativa') {
      const temRecorrenciaConcluidaNoDia = quest.recorrencias?.dias?.some((dia: any) => {
        const dataDia = normalizeDateStr(dia.data);
        return dataDia === dataStr && (dia.status === 'concluida' || dia.status === 'perdida');
      });
      return temRecorrenciaConcluidaNoDia ? 'feito' : 'a_fazer';
    }
    
    // Se quest está ativa, verificar recorrências
    if (quest.status === 'ativa') {
      // Buscar recorrência específica do dia selecionado
      const recorrenciaDoDia = quest.recorrencias?.dias?.find((dia: any) => {
        const dataDia = normalizeDateStr(dia.data);
        return dataDia === dataStr;
      });
      
      // Se encontrou recorrência do dia, usar o status dela
      if (recorrenciaDoDia) {
        if (recorrenciaDoDia.status === 'concluida' || recorrenciaDoDia.status === 'perdida') {
          return 'feito';
        }
        if (recorrenciaDoDia.status === 'pendente') {
          return 'fazendo';
        }
      }
      
      // Quest ativa sem recorrência no dia específico: verificar se tem pendentes no geral
      const temPendentes = quest.recorrencias?.dias?.some((dia: any) => {
        const dataDia = normalizeDateStr(dia.data);
        return dataDia && dia.status === 'pendente';
      });
      
      if (temPendentes) {
        return 'fazendo';
      }
      
      // Quest ativa sem recorrências pendentes = "a fazer" (pode planejar novas)
      return 'a_fazer';
    }
    
    // Fallback: usar função geral
    return getQuestEstagio(quest);
  };

  // Filtrar quests por dia selecionado
  const questsDoDiaSelecionado = useMemo(() => {
    const dataStr = format(selectedDate, 'yyyy-MM-dd');
    const todasQuests = questSnapshot?.quests_personalizadas ?? [];
    
    // Filtrar quests: mostrar todas disponíveis e ativas, ou as que têm recorrência no dia
    const questsDoDia = todasQuests.filter(quest => {
      // Excluir conversas
      const isConversa = 
        quest.catalogo_codigo === 'reflexao_diaria' ||
        quest.tipo === 'reflexao_diaria' ||
        quest.titulo === 'Reflexão Diária';
      if (isConversa) return false;
      
      // Se quest está disponível, mostrar sempre (em "A Fazer")
      if (quest.status === 'disponivel') {
        return true;
      }
      
      // Se quest está ativa, mostrar sempre (pode estar em "A Fazer" ou "Fazendo")
      if (quest.status === 'ativa') {
        return true;
      }
      
      // Se quest está inativa, mostrar apenas se tem recorrência concluída no dia (em "Feito")
      if (quest.status === 'inativa') {
        const temRecorrenciaConcluidaNoDia = quest.recorrencias?.dias?.some((dia: any) => {
          const dataDia = normalizeDateStr(dia.data);
          return dataDia === dataStr && dia.status === 'concluida';
        });
        return temRecorrenciaConcluidaNoDia;
      }
      
      // Verificar se tem recorrência na data selecionada
      const temRecorrenciaNoDia = quest.recorrencias?.dias?.some((dia: any) => {
        const dataDia = normalizeDateStr(dia.data);
        return dataDia === dataStr;
      });
      
      return temRecorrenciaNoDia;
    });
    
    // Ordenar por mais recentes (ativado_em DESC)
    const ordenarPorRecente = (quests: QuestPersonalizadaResumo[]) => {
      return [...quests].sort((a, b) => {
        const dataA = a.ativado_em ? new Date(a.ativado_em).getTime() : 0;
        const dataB = b.ativado_em ? new Date(b.ativado_em).getTime() : 0;
        return dataB - dataA; // Mais recente primeiro
      });
    };

    // Usar função específica que considera o dia selecionado
    return {
      a_fazer: ordenarPorRecente(questsDoDia.filter(q => getQuestEstagioParaDia(q, selectedDate) === 'a_fazer')),
      fazendo: ordenarPorRecente(questsDoDia.filter(q => getQuestEstagioParaDia(q, selectedDate) === 'fazendo')),
      feito: ordenarPorRecente(questsDoDia.filter(q => getQuestEstagioParaDia(q, selectedDate) === 'feito')),
    };
  }, [questSnapshot, selectedDate, hojeTemConversaConcluida, hoje]);


  const handleBack = () => {
    // Voltar para a página que chamou (salva em painelQuestsReturnView)
    const returnView = painelQuestsReturnView ?? 'conversar';
    setView(returnView);
    // Ajustar activeTab baseado na view de retorno
    if (returnView === 'evoluir') {
      setActiveNavTab('evoluir');
    } else if (returnView === 'conversar' || returnView === 'dashboard') {
      setActiveNavTab('conversar');
    } else {
      setActiveNavTab('conversar');
    }
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

  const handleNavConversar = () => {
    setActiveNavTab('conversar');
    setView('conversar');
  };

  const handleNavEntender = () => {
    setActiveNavTab('entender');
    setView('dashEmocoes');
  };

  const handleNavAgir = () => {
    setActiveNavTab('agir');
  };

  const handleNavEvoluir = () => {
    setActiveNavTab('evoluir');
    setView('evoluir');
  };
  
  const handleSelectDay = (data: Date | null) => {
    if (data) {
      setSelectedDate(data);
    }
  };

  const handlePlanejarQuest = (questId: string) => {
    setSelectedQuestId(questId);
    setRecorrenciaSelecionada(null);
    setTipoRecorrencia('diaria');
  };

  const isFutureDate = isFuture(selectedDate) && !isSameDay(selectedDate, new Date());

  // Renderizar quest item simplificado para "a fazer"
  const renderQuestItemSimples = (quest: QuestPersonalizadaResumo) => {
    const questId = quest.instancia_id || quest.meta_codigo;
    const xpRecompensa = quest.xp_recompensa ?? 10;
    
    return (
      <div 
        key={questId} 
        className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-4 shadow-md hover:shadow-lg transition-all"
        style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[var(--mq-text)]">{quest.titulo}</h3>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[var(--mq-warning-light)] px-2 py-0.5 text-[0.65rem] font-bold text-[var(--mq-warning)]">
                  <Star size={10} fill="currentColor" />
                  {xpRecompensa}
                </span>
              </div>
              {quest.descricao && (
                <p className="text-xs text-[var(--mq-text-muted)] mt-1 line-clamp-1">{quest.descricao}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-3">
              {/* Botão Concluir */}
              <button
                type="button"
                onClick={() => questId && handleConcluirQuest(questId)}
                disabled={questLoading || isFutureDate}
                className={`
                  flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all
                  ${isFutureDate 
                    ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300' 
                    : 'border-[var(--mq-primary)] bg-white text-[var(--mq-primary)] hover:bg-[var(--mq-primary)] hover:text-white hover:shadow-md active:scale-95'
                  }
                `}
                aria-label="Concluir quest"
              >
                {questLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#0EA5E9]" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
              </button>
              {/* Botão Planejar */}
              <button
                type="button"
                onClick={() => questId && handlePlanejarQuest(questId)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mq-primary)] text-white shadow-sm hover:bg-[var(--mq-primary-hover)] active:scale-95 transition-all"
                aria-label="Planejar quest"
              >
                <Settings2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Ações */}
          {questId && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-[10px] text-[var(--mq-text-subtle)] font-medium">
                {quest.ativado_em ? format(parseISO(quest.ativado_em), "dd/MM/yy") : ""}
              </span>
              <button
                type="button"
                onClick={() => {
                  console.log('[PainelQuests] Abrindo detalhe da quest:', { questId, selectedDate: format(selectedDate, 'yyyy-MM-dd') });
                  openQuestDetail(questId, format(selectedDate, 'yyyy-MM-dd')).catch((error: unknown) => {
                    console.error('[PainelQuests] Erro ao abrir detalhe:', error);
                  });
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--mq-primary)] hover:text-[var(--mq-primary-hover)] transition-colors"
              >
                Ver detalhes
                <ArrowUpRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar quest item completo para "fazendo" e "feito"
  const renderQuestItem = (quest: QuestPersonalizadaResumo, isConcluida = false) => {
    // instancia_id é o ID da tabela usuarios_quest (uq.id), que é o que a API espera
    const questId = quest.instancia_id || quest.meta_codigo;
    const xpRecompensa = quest.xp_recompensa ?? 10;
    
    if (!questId) {
      console.warn('[PainelQuests] Quest sem ID válido:', quest);
    }
    
    const isConversaQuest = 
      quest.catalogo_codigo === 'reflexao_diaria' ||
      quest.tipo === 'reflexao_diaria' ||
      quest.titulo === 'Reflexão Diária';

    const progresso = quest.progresso_atual || 0;
    const meta = quest.progresso_meta || 0;
    const percentual = meta > 0 ? Math.round((progresso / meta) * 100) : 0;

    return (
      <div 
        key={questId} 
        className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-5 shadow-md hover:shadow-lg transition-all"
        style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-base font-bold ${isConcluida ? 'text-gray-400 line-through' : 'text-[var(--mq-text)]'}`}>
                  {quest.titulo}
                </h3>
                <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                  isConcluida 
                    ? 'bg-[var(--mq-success-light)] text-[var(--mq-success)]' 
                    : 'bg-[var(--mq-warning-light)] text-[var(--mq-warning)]'
                }`}>
                  <Star size={10} fill="currentColor" />
                  {isConcluida ? `+${xpRecompensa}` : xpRecompensa}
                </span>
              </div>
              {quest.descricao && (
                <p className="text-sm text-[var(--mq-text-muted)] mt-1.5 line-clamp-2">{quest.descricao}</p>
              )}
            </div>
            
            {isConcluida ? (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--mq-success-light)] px-3 py-1.5 text-xs font-bold text-[var(--mq-success)]">
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
                    : 'border-[var(--mq-primary)] bg-white text-[var(--mq-primary)] hover:bg-[var(--mq-primary)] hover:text-white hover:shadow-md active:scale-95'
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
                <span className="font-semibold text-[var(--mq-text-muted)]">Progresso</span>
                <span className="font-bold text-[var(--mq-primary)]">{progresso}/{meta}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--mq-bar)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--mq-primary)] transition-all duration-500"
                  style={{ width: `${percentual}%` }}
                />
              </div>
            </div>
          )}

          {/* Ações */}
          {questId && (
            <div className="flex items-center justify-between pt-2 border-t border-[var(--mq-border-subtle)]">
              <span className="text-[10px] text-[var(--mq-text-subtle)] font-medium">
                {quest.ativado_em ? format(parseISO(quest.ativado_em), "dd/MM/yy") : ""}
              </span>
              <button
                type="button"
                onClick={() => {
                  console.log('[PainelQuests] Abrindo detalhe da quest:', { questId, selectedDate: format(selectedDate, 'yyyy-MM-dd') });
                  openQuestDetail(questId, format(selectedDate, 'yyyy-MM-dd')).catch((error: unknown) => {
                    console.error('[PainelQuests] Erro ao abrir detalhe:', error);
                  });
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--mq-primary)] hover:text-[var(--mq-primary-hover)] transition-colors"
              >
                Ver detalhes
                <ArrowUpRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calcular progresso semanal total
  const metaQuestsSemanal = weeklyData.qtdQuestsPrevistasSemana ?? 7;
  const questsConcluidasSemanal = weeklyData.qtdQuestsConcluidasSemana ?? 
    diasSemana.reduce((sum, dia) => sum + (dia.qtdQuestsConcluidas ?? 0), 0);
  const progressoQuestsSemanal = metaQuestsSemanal > 0 
    ? Math.min(100, Math.round((questsConcluidasSemanal / metaQuestsSemanal) * 100))
    : 0;
  
  // Pontos ganhos na semana (apenas quests, excluindo conversas)
  const pontosGanhosSemana = weeklyData.dias?.reduce(
    (sum, dia) => sum + ((dia as any).xpQuests ?? 0), 0
  ) ?? 0;

  // Navegador semanal com barra de progresso
  const renderWeeklyProgressBar = () => {
    return (
      <section
        className="mb-6 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] px-5 py-5 shadow-md"
        style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
      >
        {/* Banner de conquistas da semana */}
        <div className={`mb-4 flex items-center justify-center gap-4 rounded-xl px-4 py-3 ${
          questsConcluidasSemanal > 0 
            ? 'bg-gradient-to-r from-[var(--mq-success-light)] to-[var(--mq-primary-light)]' 
            : 'bg-[var(--mq-card)] border border-dashed border-[var(--mq-border)]'
        }`}>
          {questsConcluidasSemanal > 0 ? (
            <>
              <div className="flex items-center gap-1.5">
                <Trophy size={16} className="text-[var(--mq-success)]" />
                <span className="text-sm font-bold text-[var(--mq-success)]">
                  {questsConcluidasSemanal} {questsConcluidasSemanal === 1 ? 'ação' : 'ações'}
                </span>
              </div>
              <span className="text-[var(--mq-text-subtle)]">·</span>
              <div className="flex items-center gap-1.5">
                <Star size={14} fill="var(--mq-warning)" className="text-[var(--mq-warning)]" />
                <span className="text-sm font-bold text-[var(--mq-warning)]">
                  +{pontosGanhosSemana} Pontos
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[var(--mq-text-muted)]" />
              <span className="text-sm font-medium text-[var(--mq-text-muted)]">
                Comece sua primeira ação da semana!
              </span>
            </div>
          )}
        </div>

        {/* Barra de progresso semanal */}
        <div className="mb-5">
          <p className="text-[0.7rem] font-semibold text-[var(--mq-text)] mb-2">Progresso da Semana</p>
          <div className="flex items-center gap-3">
            <span className="text-[0.65rem] font-bold text-[var(--mq-text)] min-w-[16px]">
              {questsConcluidasSemanal}
            </span>
            <div className="relative h-2.5 flex-1 rounded-full bg-[var(--mq-bar)] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--mq-primary)] transition-all duration-500"
                style={{ width: `${progressoQuestsSemanal}%` }}
              />
            </div>
            <span className="text-[0.65rem] font-bold text-[var(--mq-text-muted)] min-w-[16px]">
              {metaQuestsSemanal}
            </span>
          </div>
          <p className="text-[0.6rem] text-[var(--mq-text-subtle)] text-center mt-1.5">
            {progressoQuestsSemanal}% concluído
          </p>
        </div>

        {/* Divisor */}
        <div className="h-px bg-[var(--mq-border)] mb-4" />

        {/* Barras verticais dos dias (navegação principal) */}
        <div className="flex h-20 items-end justify-between gap-1.5">
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
                <span className="text-[0.65rem] font-semibold text-[var(--mq-text-subtle)] mb-1.5 whitespace-nowrap">
                  {qtdPrevistas > 0 ? qtdPrevistas : (qtdConcluidas > 0 ? qtdConcluidas : 0)}
                </span>
                
                <div
                  className="relative overflow-hidden rounded-full bg-[var(--mq-bar)]"
                  style={{ height: `${trackHeight}px`, width: '10px' }}
                >
                  {fillHeight > 0 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full bg-[var(--mq-primary)]"
                      style={{ height: `${fillHeight}px` }}
                    />
                  )}
                </div>
                
                <span className="text-[0.56rem] font-semibold uppercase tracking-wide text-[var(--mq-text)]">
                  {labelDia}
                </span>
                
                <span className={`text-[0.56rem] font-medium ${isHoje ? 'text-[var(--mq-primary)] font-semibold' : 'text-[var(--mq-text-muted)]'}`}>
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
      await apiService.ativarQuest(usuarioId, selectedQuestId, recorrenciaSelecionada, tipoRecorrencia);
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
    setTipoRecorrencia('diaria');
    setSalvando(false);
    if (usuarioId) {
      void loadQuestSnapshot(usuarioId);
    }
  };

  // Modal de planejamento com opções diária/semanal
  const renderPlanejamentoModal = () => {
    if (!selectedQuestId) return null;
    
    const quest = questSnapshot?.quests_personalizadas?.find(
      q => (q.instancia_id || q.meta_codigo) === selectedQuestId
    );
    
    if (!quest) return null;

    const opcoesDiaria = [3, 5, 7, 10, 15];
    const opcoesSemanal = [1, 2, 3, 4];

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-t-3xl bg-[var(--mq-surface)] shadow-2xl animate-slide-up">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--mq-text)]">Planejar Quest</h2>
              <button
                type="button"
                onClick={handleFecharPlanejamento}
                className="text-[var(--mq-text-subtle)] hover:text-[var(--mq-text)] transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            
            {/* Tabs de tipo de recorrência */}
            <div className="flex gap-2 mb-5">
              <button
                type="button"
                onClick={() => {
                  setTipoRecorrencia('diaria');
                  setRecorrenciaSelecionada(null);
                }}
                className={`
                  flex-1 rounded-xl py-3 text-sm font-semibold transition-all
                  ${tipoRecorrencia === 'diaria'
                    ? 'bg-[var(--mq-primary)] text-white shadow-md'
                    : 'bg-[var(--mq-card)] text-[var(--mq-text-muted)] hover:bg-[var(--mq-primary-light)]'
                  }
                `}
              >
              <div className="flex items-center gap-1">
                <Calendar size={12} /> Diária
              </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipoRecorrencia('semanal');
                  setRecorrenciaSelecionada(null);
                }}
                className={`
                  flex-1 rounded-xl py-3 text-sm font-semibold transition-all
                  ${tipoRecorrencia === 'semanal'
                    ? 'bg-[var(--mq-primary)] text-white shadow-md'
                    : 'bg-[var(--mq-card)] text-[var(--mq-text-muted)] hover:bg-[var(--mq-primary-light)]'
                  }
                `}
              >
                🗓️ Semanal
              </button>
            </div>

            <div className="mb-5">
              <p className="text-sm text-[var(--mq-text-muted)]">
                {tipoRecorrencia === 'diaria' 
                  ? 'Defina quantos dias consecutivos você quer praticar:'
                  : 'Defina quantas semanas você quer praticar (1x por semana):'
                }
              </p>
            </div>

            {/* Opções de recorrência */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(tipoRecorrencia === 'diaria' ? opcoesDiaria : opcoesSemanal).map((valor) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setRecorrenciaSelecionada(valor)}
                  className={`
                    rounded-xl border-2 p-4 text-center font-bold transition-all
                    ${recorrenciaSelecionada === valor
                      ? 'border-[var(--mq-primary)] bg-[var(--mq-primary)] text-white shadow-lg scale-105'
                      : 'border-[var(--mq-border)] bg-[var(--mq-card)] text-[var(--mq-text)] hover:border-[var(--mq-primary)] hover:bg-[var(--mq-primary-light)]'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{valor}</div>
                  <div className="text-xs">
                    {tipoRecorrencia === 'diaria' ? 'dias' : (valor === 1 ? 'semana' : 'semanas')}
                  </div>
                </button>
              ))}
            </div>

            {/* Resumo da seleção */}
            {recorrenciaSelecionada && (
              <div className="mb-5 rounded-xl bg-[var(--mq-primary-light)] px-4 py-3 text-center">
                <p className="text-sm font-medium text-[var(--mq-primary)]">
                  {tipoRecorrencia === 'diaria'
                    ? `${recorrenciaSelecionada} recorrências diárias`
                    : `${recorrenciaSelecionada} recorrência${recorrenciaSelecionada > 1 ? 's' : ''} semanal (1x por semana)`
                  }
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSalvarRecorrencia}
              disabled={!recorrenciaSelecionada || salvando}
              className={`
                w-full rounded-xl py-4 text-center font-bold text-white transition-all
                ${recorrenciaSelecionada && !salvando
                  ? 'bg-[var(--mq-primary)] hover:opacity-90 shadow-lg active:scale-98'
                  : 'bg-[var(--mq-text-subtle)] cursor-not-allowed'
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
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3
        nomeUsuario={nomeUsuario}
        onBack={painelQuestsReturnView ? handleBack : undefined}
      />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">

        {/* Título da página */}
        <div className="mb-8 text-center">
          <h1 className="mq-page-title">
            Agir
          </h1>
          <p className="mq-page-subtitle">
            Micro-ações para evoluir
          </p>
        </div>

        {/* Barra de Progresso Semanal */}
        {renderWeeklyProgressBar()}

        {/* Abas melhoradas */}
        <div className="mb-6">
          <div 
            className="flex gap-2 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-1.5 shadow-md"
            style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
          >
            {(['a_fazer', 'fazendo', 'feito'] as QuestTab[]).map((tab) => {
              const isActive = activeTab === tab;
              // Usar quests do dia selecionado ao invés de todas
              const count = questsDoDiaSelecionado[tab].length;
              const labels = {
                a_fazer: 'Disponível',
                fazendo: 'Ativa',
                feito: 'Concluído'
              };
              
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`
                    relative flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--mq-primary)] text-white shadow-md scale-105'
                      : 'text-[var(--mq-text-muted)] hover:text-[var(--mq-text)] hover:bg-gray-50'
                    }
                  `}
                >
                  {labels[tab]}
                  {count > 0 && (
                    <span className={`
                      ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold
                      ${isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-[var(--mq-text-muted)]'
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
                  <p className="text-xs text-[var(--mq-text-subtle)] text-center mb-3 flex items-center justify-center gap-2">
                    <span>Recorrências:</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--mq-primary)]">
                      <Settings2 size={12} className="text-white" />
                    </span>
                    <span className="text-[var(--mq-border)]">|</span>
                    <span>Concluir:</span>
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border-2 border-[var(--mq-primary)] bg-white">
                      <CheckCircle2 size={12} className="text-[var(--mq-primary)]" />
                    </span>
                  </p>
                  <div className="space-y-3">
                    {questsDoDiaSelecionado.a_fazer.map(quest => renderQuestItemSimples(quest))}
                  </div>
                </>
              ) : (
                <div 
                  className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-12 text-center shadow-md"
                  style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
                >
                  <div className="flex flex-col items-center gap-4 text-[var(--mq-text-subtle)]">
                    <div className="rounded-full bg-[var(--mq-primary-light)] p-6">
                      <Target size={48} className="text-[var(--mq-primary)]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[var(--mq-text)] mb-1">
                        Nenhuma quest a fazer
                      </p>
                      <p className="text-sm">
                        Novas quests aparecerão aqui após a próxima conversa.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'fazendo' && (
            <>
              {questsDoDiaSelecionado.fazendo.length > 0 ? (
                <>
                  <p className="text-xs text-[var(--mq-text-subtle)] text-center mb-3 flex items-center justify-center gap-2 flex-wrap">
                    <span>Toque no ícone</span>
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full border-2 border-[var(--mq-primary)] bg-white">
                      <CheckCircle2 size={20} className="text-[var(--mq-primary)]" />
                    </span>
                    <span>para concluir uma ação</span>
                  </p>
                  <div className="space-y-4">
                    {questsDoDiaSelecionado.fazendo.map(quest => renderQuestItem(quest, false))}
                  </div>
                </>
              ) : (
                <div 
                  className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-12 text-center shadow-md"
                  style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
                >
                  <div className="flex flex-col items-center gap-4 text-[var(--mq-text-subtle)]">
                    <div className="rounded-full bg-[var(--mq-warning-light)] p-6">
                      <TrendingUp size={48} className="text-[var(--mq-warning)]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[var(--mq-text)] mb-1">
                        Nenhuma quest em andamento
                      </p>
                      <p className="text-sm">
                        Planeje uma quest para começar
                      </p>
                    </div>
                  </div>
                </div>
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
                <div 
                  className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-12 text-center shadow-md"
                  style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
                >
                  <div className="flex flex-col items-center gap-4 text-[var(--mq-text-subtle)]">
                    <div className="rounded-full bg-[var(--mq-success-light)] p-6">
                      <Sparkles size={48} className="text-[var(--mq-success)]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[var(--mq-text)] mb-1">
                        Nenhuma conclusão ainda
                      </p>
                      <p className="text-sm">
                        Complete suas quests para ver aqui
                      </p>
                    </div>
                  </div>
                </div>
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
        onConversar={handleNavConversar}
        onEntender={handleNavEntender}
        onAgir={handleNavAgir}
        onEvoluir={handleNavEvoluir}
      />
    </div>
  );
};

export default PainelQuestsPageV13;
