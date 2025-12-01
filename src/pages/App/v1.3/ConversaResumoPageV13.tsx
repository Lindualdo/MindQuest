import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageSquare, ArrowUpRight } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { format } from 'date-fns';

const ConversaResumoPageV13 = () => {
  const {
    dashboardData,
    conversaResumo,
    conversaResumoLoading,
    conversaResumoError,
    selectedConversationId,
    loadConversaResumo,
    closeConversaResumo,
    setView,
    resumoConversas,
    resumoConversasLoading,
    resumoConversasError,
    openConversaResumo,
    closeResumoConversas,
    resumoConversasReturnView,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<TabId>('conversar');

  const conversaIdAtual = useMemo(() => {
    if (!conversaResumo) return null;
    const rawId =
      (conversaResumo.conversa_id as string | number | undefined) ??
      (conversaResumo.id as string | number | undefined) ??
      (conversaResumo.chat_id as string | number | undefined);
    if (typeof rawId === 'number') return String(rawId);
    if (typeof rawId === 'string') return rawId;
    return null;
  }, [conversaResumo]);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    if (!conversaResumo || conversaIdAtual !== String(selectedConversationId)) {
      void loadConversaResumo(selectedConversationId);
    }
  }, [selectedConversationId, conversaResumo, conversaIdAtual, loadConversaResumo]);

  const paragraphs = useMemo(() => {
    const texto = conversaResumo?.resumo_conversa?.trim();
    if (!texto) return [];
    return texto.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  }, [conversaResumo]);

  const detalhesExtras = useMemo(() => {
    if (!conversaResumo) return [];
    const ignorar = new Set([
      'resumo_conversa',
      'data_conversa',
      'conversa_id',
      'id',
      'chat_id',
    ]);
    return Object.entries(conversaResumo)
      .filter(([key, value]) => !ignorar.has(key) && value !== undefined && value !== null)
      .map(([key, value]) => ({ key, value }));
  }, [conversaResumo]);

  const handleBack = () => {
    if (selectedConversationId) {
      closeConversaResumo();
    } else {
      // Voltar para a página que chamou (salva em resumoConversasReturnView)
      closeResumoConversas();
      // Ajustar activeTab baseado na view de retorno
      const returnView = resumoConversasReturnView ?? 'dashboard';
      if (returnView === 'evoluir') {
        setActiveTab('evoluir');
      } else if (returnView === 'dashboard') {
        setActiveTab('conversar');
      }
    }
  };

  const handleOpenConversa = (conversaId: string | number) => {
    if (conversaId) {
      openConversaResumo(String(conversaId)).catch(() => null);
    }
  };

  const handleNavConversar = () => {
    setActiveTab('conversar');
    setView('conversar');
  };

  const handleNavEntender = () => {
    setActiveTab('entender');
    setView('dashEmocoes');
  };

  const handleNavAgir = () => {
    setActiveTab('agir');
    setView('painelQuests');
  };

  const handleNavEvoluir = () => {
    setActiveTab('evoluir');
    setView('evoluir');
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="mq-btn-back"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <div className="flex-1 text-right text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--mq-text)]">
            {selectedConversationId ? 'Resumo da conversa' : 'Histórico de conversas'}
          </div>
        </div>

        {selectedConversationId ? (
          <Card className="!p-5 mq-card" hover={false}>
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-2xl bg-[var(--mq-primary-light)] p-3">
                <MessageSquare className="text-[var(--mq-primary)]" size={18} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--mq-text)]">Resumo da conversa</h2>
              </div>
            </div>

            <div className="space-y-4">
              {conversaResumoLoading && (
                <p className="text-center text-sm text-[var(--mq-text-muted)]">Carregando resumo…</p>
              )}

              {conversaResumoError && (
                <p className="text-center text-sm text-[var(--mq-error)]">{conversaResumoError}</p>
              )}

              {!conversaResumoLoading && !conversaResumoError && !conversaResumo && (
                <p className="text-center text-sm text-[var(--mq-text-muted)]">
                  Nenhum resumo disponível para esta conversa.
                </p>
              )}

              {conversaResumo && (
                <div className="space-y-4">
                  {conversaResumo.data_conversa && (
                    <div className="flex items-center justify-between rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-card)] px-3 py-2 text-xs font-semibold text-[var(--mq-text-muted)]">
                      <span>Conversa</span>
                      <span className="rounded-full bg-[var(--mq-primary-light)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--mq-primary)]">
                        {format(new Date(conversaResumo.data_conversa), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  )}

                  {paragraphs.length > 0 && (
                    <div className="space-y-3 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-card)] px-4 py-3 text-sm leading-relaxed text-[var(--mq-text)]">
                      {paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}

                  {detalhesExtras.length > 0 && (
                    <div className="space-y-2 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-card)] px-4 py-3 text-xs text-[var(--mq-text-muted)]">
                      {detalhesExtras.map(({ key, value }) => (
                        <div key={key}>
                          <p className="font-semibold uppercase tracking-wide text-[var(--mq-text-subtle)]">{key}</p>
                          <p className="text-sm text-[var(--mq-text)]">
                            {typeof value === 'string' || typeof value === 'number'
                              ? value
                              : JSON.stringify(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="!p-5 mq-card" hover={false}>
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-2xl bg-[var(--mq-primary-light)] p-3">
                <MessageSquare className="text-[var(--mq-primary)]" size={18} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--mq-text)]">Histórico de conversas</h2>
              </div>
            </div>

            <div className="space-y-4">
              {resumoConversasLoading && (
                <p className="text-center text-sm text-[var(--mq-text-muted)]">Carregando histórico…</p>
              )}

              {resumoConversasError && (
                <p className="text-center text-sm text-[var(--mq-error)]">{resumoConversasError}</p>
              )}

              {!resumoConversasLoading && !resumoConversasError && (!resumoConversas?.conversas || resumoConversas.conversas.length === 0) && (
                <p className="text-center text-sm text-[var(--mq-text-muted)]">
                  Nenhuma conversa encontrada.
                </p>
              )}

              {resumoConversas?.conversas && resumoConversas.conversas.length > 0 && (
                <div className="space-y-3">
                  {resumoConversas.conversas.map((conversa, index) => {
                    const conversaId = conversa.conversa_id ?? conversa.id ?? conversa.chat_id;
                    const dataConversa = conversa.data_conversa ? new Date(conversa.data_conversa) : null;
                    const titulo = (conversa as any).titulo || (dataConversa ? `Conversa de ${format(dataConversa, 'dd/MM/yyyy')}` : `Conversa ${index + 1}`);
                    
                    return (
                      <button
                        key={conversaId ?? `conversa-${index}`}
                        type="button"
                        onClick={() => conversaId && handleOpenConversa(conversaId)}
                        className="w-full rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-3 text-left shadow-md transition-all hover:bg-[var(--mq-surface)] hover:shadow-lg active:scale-[0.98]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-[var(--mq-text)]">
                              {titulo}
                            </h3>
                            {dataConversa && (
                              <p className="mt-1 text-xs text-[var(--mq-text-muted)]">
                                {format(dataConversa, 'dd/MM/yyyy')}
                              </p>
                            )}
                            {conversa.resumo_conversa && (
                              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--mq-text-muted)]">
                                {conversa.resumo_conversa.substring(0, 100)}...
                              </p>
                            )}
                          </div>
                          <ArrowUpRight className="ml-2 flex-shrink-0 text-[var(--mq-primary)]" size={16} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        )}
      </main>

      <BottomNavV1_3
        active={activeTab}
        onConversar={handleNavConversar}
        onEntender={handleNavEntender}
        onAgir={handleNavAgir}
        onEvoluir={handleNavEvoluir}
      />
    </div>
  );
};

export default ConversaResumoPageV13;
