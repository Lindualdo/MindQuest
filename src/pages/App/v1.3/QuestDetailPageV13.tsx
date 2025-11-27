import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Target,
  BookOpen,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';
import { format } from 'date-fns';

const QuestDetailPageV13 = () => {
  const {
    dashboardData,
    questDetail,
    questDetailLoading,
    questDetailError,
    closeQuestDetail,
    setView,
    concluirQuest,
    openQuestDetail,
    questSnapshot,
    questDetailSelectedDate,
    loadQuestSnapshot,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const detail = questDetail;

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isConcluindo, setIsConcluindo] = useState(false);

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
    if (!detail?.id || isConcluindo) return;
    
    setIsConcluindo(true);
    
    // REGRA: data_conclusao deve sempre ser do dia planejado
    // data_registro deve ser do dia que foi feito a mudança de status (hoje)
    
    const hoje = new Date();
    let dataReferencia: string;
    
    // Para quests recorrentes, usar a data do dia específico selecionado ou a mais recente não concluída
    if (detail.recorrencias && typeof detail.recorrencias === 'object' && 'dias' in detail.recorrencias) {
      const dias = (detail.recorrencias as any).dias;
      if (Array.isArray(dias) && dias.length > 0) {
        // Se há data selecionada no painel, usar ela (é a data planejada)
        if (questDetailSelectedDate) {
          dataReferencia = questDetailSelectedDate;
        } else {
          // Caso contrário, encontrar a data mais recente não concluída que seja <= hoje
          const diasNaoConcluidos = dias
            .filter((dia: any) => {
              if (dia.status === 'concluida') return false;
              if (!dia.data) return false;
              try {
                const dataDia = new Date(dia.data);
                return dataDia <= hoje;
              } catch {
                return false;
              }
            })
            .sort((a: any, b: any) => {
              try {
                const dataA = new Date(a.data);
                const dataB = new Date(b.data);
                return dataB.getTime() - dataA.getTime();
              } catch {
                return 0;
              }
            });
          
          if (diasNaoConcluidos.length > 0 && diasNaoConcluidos[0].data) {
            dataReferencia = diasNaoConcluidos[0].data;
          } else {
            // Se não há dias não concluídos <= hoje, usar a data mais recente (pode ser futura)
            const ultimoDia = dias[dias.length - 1];
            if (ultimoDia && ultimoDia.data) {
              dataReferencia = ultimoDia.data;
            } else {
              dataReferencia = format(hoje, 'yyyy-MM-dd');
            }
          }
        }
      } else {
        dataReferencia = questDetailSelectedDate || format(hoje, 'yyyy-MM-dd');
      }
    } else {
      // Para quests não recorrentes, usar a data selecionada no painel (data planejada)
      // Se não houver data selecionada, usar a data atual como fallback
      dataReferencia = questDetailSelectedDate || format(hoje, 'yyyy-MM-dd');
    }
    
    console.log('[QuestDetail] Concluindo quest:', {
      questId: detail.id,
      dataReferencia,
      dataSelecionada: questDetailSelectedDate,
      status: detail.status,
      temRecorrencias: !!detail.recorrencias
    });
    
    try {
      await concluirQuest(detail.id, dataReferencia);
      
      // Aguardar um pouco para o backend processar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Recarregar snapshot de quests para atualizar o status
      if (dashboardData?.usuario?.id) {
        await loadQuestSnapshot(dashboardData.usuario.id);
      }
      
      // Voltar para o painel de quests
      closeQuestDetail();
      setView('painelQuests');
      setActiveTab('quests');
    } catch (error) {
      console.error('[QuestDetail] Erro ao concluir quest:', error);
      setIsConcluindo(false);
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

    // Verificar se é quest do tipo conversa (concluída automaticamente)
    // Quest de reflexão diária não pode ser concluída manualmente pelo usuário
    const isConversaQuest = 
      detail.catalogo?.codigo === 'reflexao_diaria' ||
      detail.tipo === 'reflexao_diaria' ||
      detail.titulo === 'Reflexão Diária';

    // Verificar se é quest custom (criada manualmente pelo usuário)
    const isQuestCustom = detail.catalogo?.codigo === 'quest_custom';

    // Para quests recorrentes, verificar se há algum dia não concluído
    // Isso permite concluir quests de datas passadas mesmo que o status geral seja 'concluida'
    let temDiaNaoConcluido = false;
    if (detail.recorrencias && typeof detail.recorrencias === 'object' && 'dias' in detail.recorrencias) {
      const dias = (detail.recorrencias as any).dias;
      if (Array.isArray(dias)) {
        temDiaNaoConcluido = dias.some((dia: any) => dia.status !== 'concluida');
      }
    }

    // Permitir concluir quests que não estejam já concluídas e não sejam de conversa
    // - Quests em status "disponivel" (a fazer) podem ser concluídas diretamente sem planejamento prévio
    // - O sistema cria automaticamente o registro em quests_recorrencias quando a quest é concluída
    // - Isso é especialmente útil para quests de execução única (sem recorrência)
    // - Para quests recorrentes, também permitir se houver algum dia não concluído
    // - Permite concluir quests de datas passadas que o usuário esqueceu de marcar
    // - Inclui quests vencidas ou canceladas (usuário pode marcar como concluída retroativamente)
    const podeConcluir = !isConversaQuest && 
      detail.status && 
      (detail.status !== 'concluida' || temDiaNaoConcluido);
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
          {detail.area_vida && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[0.7rem] font-semibold text-blue-700">
              {detail.area_vida.nome}
            </span>
          )}
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
        </div>

        {/* Benefícios - Ocultar para quests custom */}
        {!isQuestCustom && baseCientifica?.objetivo && (
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

        {/* Referências Científicas - Ocultar para quests custom */}
        {!isQuestCustom && baseCientifica?.fundamentos && (
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

        {/* Como Aplicar - Ocultar para quests custom */}
        {!isQuestCustom && baseCientifica?.como_aplicar && (
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

        {/* Links de Referências - Ocultar para quests custom */}
        {!isQuestCustom && baseCientifica?.links_referencias && baseCientifica.links_referencias.length > 0 && (
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

        {/* Informações Adicionais - Ocultar para quests custom */}
        {!isQuestCustom && (detail.catalogo?.tempo_estimado_min || detail.catalogo?.dificuldade) && (
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
            disabled={isConcluindo}
            className="w-full rounded-2xl bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:shadow-blue-500/30"
          >
            <div className="flex items-center justify-center gap-2">
              {isConcluindo ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Concluindo...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Concluir Quest
                </>
              )}
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
