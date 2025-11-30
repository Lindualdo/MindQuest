import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Zap, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

interface Quest {
  id: string;
  titulo: string;
  tipo_impacto: 'direto' | 'indireto';
  concluidas: number;
  total: number;
  percentual: number;
}

interface Objetivo {
  id: string;
  titulo: string;
  is_padrao: boolean;
  area: {
    nome: string;
    icone: string;
  };
  quests: Quest[];
}

const QUESTS_POR_PAGINA = 3;

const ConexaoAcoesObjetivosPageV13: React.FC = () => {
  const { dashboardData, setView } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Usuário';

  const userId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  
  // Estado de UI
  const [expandedObjetivos, setExpandedObjetivos] = useState<Set<string>>(new Set());
  const [questsVisiveis, setQuestsVisiveis] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const loadData = async () => {
      if (!userId) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/conexao-objetivos?user_id=${userId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || 'Erro ao carregar dados');
          setLoading(false);
          return;
        }

        const objetivosData = data.objetivos || [];
        setObjetivos(objetivosData);
        
        // Inicializar estados: primeiro objetivo expandido, outros colapsados
        const initialExpanded = new Set<string>();
        const initialVisiveis: Record<string, number> = {};
        
        objetivosData.forEach((obj: Objetivo, index: number) => {
          if (index === 0) {
            initialExpanded.add(obj.id);
          }
          initialVisiveis[obj.id] = QUESTS_POR_PAGINA;
        });
        
        setExpandedObjetivos(initialExpanded);
        setQuestsVisiveis(initialVisiveis);
        setError(null);
      } catch (err) {
        console.error('[ConexaoObjetivos] Erro:', err);
        setError('Erro ao conectar ao serviço');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleBack = () => {
    setView('evoluir');
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
    setView('evoluir');
  };

  const toggleExpanded = (objetivoId: string) => {
    setExpandedObjetivos(prev => {
      const next = new Set(prev);
      if (next.has(objetivoId)) {
        next.delete(objetivoId);
      } else {
        next.add(objetivoId);
      }
      return next;
    });
  };

  const verMaisQuests = (objetivoId: string, totalQuests: number) => {
    setQuestsVisiveis(prev => ({
      ...prev,
      [objetivoId]: Math.min((prev[objetivoId] || QUESTS_POR_PAGINA) + QUESTS_POR_PAGINA, totalQuests)
    }));
  };

  // Ordenar quests: completas primeiro, depois por percentual decrescente
  const ordenarQuests = (quests: Quest[]): Quest[] => {
    return [...quests].sort((a, b) => {
      // Completas (100%) primeiro
      if (a.percentual === 100 && b.percentual !== 100) return -1;
      if (b.percentual === 100 && a.percentual !== 100) return 1;
      // Depois por percentual decrescente
      return b.percentual - a.percentual;
    });
  };

  // Calcular resumo do objetivo
  const calcularResumo = (quests: Quest[]) => {
    if (quests.length === 0) return { total: 0, concluidas: 0, mediaProgresso: 0 };
    
    const concluidas = quests.filter(q => q.percentual === 100).length;
    const mediaProgresso = Math.round(
      quests.reduce((sum, q) => sum + q.percentual, 0) / quests.length
    );
    
    return { total: quests.length, concluidas, mediaProgresso };
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button type="button" onClick={handleBack} className="mq-btn-back">
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Ações por Objetivo</h1>
          <p className="mq-page-subtitle">Acompanhe o progresso de cada meta</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--mq-primary)] border-t-transparent" />
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="mq-card p-6 text-center border border-red-500/30 bg-red-500/10 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Conteúdo */}
        {!loading && !error && (
          <div className="space-y-4">
            {objetivos.length === 0 ? (
              <div className="mq-card p-8 text-center">
                <Target size={48} className="mx-auto mb-4 text-[var(--mq-text-subtle)]" />
                <p className="text-sm text-[var(--mq-text-muted)]">
                  Você ainda não tem objetivos ativos.
                </p>
                <p className="text-xs text-[var(--mq-text-subtle)] mt-2">
                  Defina objetivos para ver como suas ações contribuem para alcançá-los.
                </p>
              </div>
            ) : (
              objetivos.map((objetivo, index) => {
                const isExpanded = expandedObjetivos.has(objetivo.id);
                const questsOrdenadas = ordenarQuests(objetivo.quests);
                const resumo = calcularResumo(objetivo.quests);
                const questsAMostrar = questsOrdenadas.slice(0, questsVisiveis[objetivo.id] || QUESTS_POR_PAGINA);
                const temMaisQuests = questsOrdenadas.length > (questsVisiveis[objetivo.id] || QUESTS_POR_PAGINA);
                const questsRestantes = questsOrdenadas.length - (questsVisiveis[objetivo.id] || QUESTS_POR_PAGINA);

                return (
                  <motion.div
                    key={objetivo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mq-card overflow-hidden"
                  >
                    {/* Header do objetivo - clicável para expandir/colapsar */}
                    <button
                      type="button"
                      onClick={() => toggleExpanded(objetivo.id)}
                      className="w-full p-4 text-left flex items-start gap-3 hover:bg-[var(--mq-surface)] transition-colors"
                    >
                      <div className="p-2 rounded-xl bg-[var(--mq-primary-light)] flex-shrink-0">
                        <Target size={20} className="text-[var(--mq-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-[var(--mq-text)] mb-1">
                          {objetivo.titulo}
                        </h3>
                        <p className="text-xs text-[var(--mq-text-muted)] mb-2">
                          {objetivo.area.nome}
                        </p>
                        
                        {/* Resumo */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-[var(--mq-text-muted)]">
                            {resumo.total} {resumo.total === 1 ? 'ação' : 'ações'}
                          </span>
                          {resumo.total > 0 && (
                            <>
                              <span className="text-[var(--mq-text-subtle)]">•</span>
                              <span className="text-[var(--mq-success)]">
                                {resumo.concluidas} {resumo.concluidas === 1 ? 'concluída' : 'concluídas'}
                              </span>
                              <span className="text-[var(--mq-text-subtle)]">•</span>
                              <span className="text-[var(--mq-primary)] font-medium">
                                {resumo.mediaProgresso}% média
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Indicador de expand/collapse */}
                      <div className="flex-shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp size={20} className="text-[var(--mq-text-muted)]" />
                        ) : (
                          <ChevronDown size={20} className="text-[var(--mq-text-muted)]" />
                        )}
                      </div>
                    </button>

                    {/* Conteúdo expandido - Ações */}
                    <AnimatePresence>
                      {isExpanded && objetivo.quests.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-[var(--mq-border)]">
                            <p className="text-xs font-semibold text-[var(--mq-text-muted)] uppercase tracking-wide py-3">
                              Ações relacionadas
                            </p>
                            
                            <div className="space-y-4">
                              {questsAMostrar.map((quest) => {
                                const isConcluida = quest.percentual === 100;
                                
                                return (
                                  <div key={quest.id} className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {isConcluida ? (
                                          <CheckCircle2 size={14} className="text-[var(--mq-success)] flex-shrink-0" />
                                        ) : (
                                          <Zap size={14} className="text-[var(--mq-primary)] flex-shrink-0" />
                                        )}
                                        <span className={`text-sm truncate ${isConcluida ? 'text-[var(--mq-text-muted)]' : 'text-[var(--mq-text)]'}`}>
                                          {quest.titulo}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-[var(--mq-text-muted)] flex-shrink-0">
                                        <span>{quest.concluidas}/{quest.total}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="w-full h-1.5 bg-[var(--mq-bar)] rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${quest.percentual}%` }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className={`h-full rounded-full ${isConcluida ? 'bg-[var(--mq-success)]' : 'bg-[var(--mq-primary)]'}`}
                                      />
                                    </div>
                                    
                                    <p className={`text-xs text-right ${isConcluida ? 'text-[var(--mq-success)]' : 'text-[var(--mq-text-muted)]'}`}>
                                      {quest.percentual}% {isConcluida ? '✓' : 'concluído'}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Botão Ver mais */}
                            {temMaisQuests && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  verMaisQuests(objetivo.id, questsOrdenadas.length);
                                }}
                                className="w-full mt-4 py-2 text-sm text-[var(--mq-primary)] font-medium hover:bg-[var(--mq-primary-light)] rounded-lg transition-colors"
                              >
                                Ver mais {questsRestantes} {questsRestantes === 1 ? 'ação' : 'ações'}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mensagem quando não há quests */}
                    {isExpanded && objetivo.quests.length === 0 && (
                      <div className="px-4 pb-4 pt-0 border-t border-[var(--mq-border)]">
                        <p className="text-xs text-[var(--mq-text-subtle)] italic py-3">
                          Nenhuma ação vinculada ainda
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}
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

export default ConexaoAcoesObjetivosPageV13;
